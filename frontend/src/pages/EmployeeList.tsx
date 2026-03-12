import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Navbar/Sidebar';
import Header from '../components/Employee/Header';
import SearchBar from '../components/Employee/SearchBar';
import EmployeeTable from '../components/Employee/EmployeeTable';
import EmployeeCards from '../components/Employee/EmployeeCard';
import EditEmployee from '../components/Employee/EditEmployee';
import ViewScheduleModal from '../components/ViewScheduleModal';
import AddEmployee from './AddEmployee';
import FilterModal from '../components/Employee/FilterModal';

import type { Employee } from '../types/employee';
import '../styles/Employee/employeeList.css';
import EmployeeInfoModal from '../components/Employee/EmployeeInfoModal';

const EmployeeList = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'card'>('table');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // ✅ FIXED
  const [permissions, setPermissions] = useState<string[]>([]);
  
  const [infoEmployee, setInfoEmployee] = useState<Employee | null>(null);

  useEffect(() => {
  fetch("http://localhost/hris/backend/auth/get_session.php", {
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setPermissions(data.permissions);
      }
    });
}, []);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);
  const [viewEmployee, setViewEmployee] =
    useState<Employee | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    account: '',
    status: '',
    position: '',
    sort: 'asc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ================= FETCH =================
  const fetchEmployees = async () => {
    try {
      const res = await fetch(
        'http://localhost/hris/backend/employees/get_employees.php',
        { credentials: 'include' }
      );

      const data = await res.json();

      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load employees', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditOpen(true);
  };

  // ================= VIEW =================
  const handleViewSchedule = (employee: Employee) => {
    setViewEmployee(employee);
    setIsViewOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure to delete this account (ID: ${id})?`))
      return;

    try {
      const res = await fetch(
        'http://localhost/hris/backend/employees/delete_employee.php',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: id }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setEmployees(prev =>
          prev.filter(emp => emp.employee_id !== id)
        );
        setToast({ message: 'Employee deleted', type: 'success' });
      } else {
        setToast({ message: 'Delete failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'Server error', type: 'error' });
    }

    setTimeout(() => setToast(null), 3000);
  };

  // ================= SEARCH + FILTER + SORT =================
  const filteredEmployees = useMemo(() => {
    let result = employees.filter(emp => {
      const fullName =
        `${emp.first_name ?? ''} ${emp.middle_name ?? ''} ${emp.last_name ?? ''}`
          .toLowerCase();

      const email = emp.email?.toLowerCase() ?? '';
      const position = emp.position?.toLowerCase() ?? '';
      const account = emp.account?.toLowerCase() ?? '';

      const searchTerm = search.toLowerCase();

      const matchesSearch =
        fullName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        position.includes(searchTerm);

      const matchesAccount =
        !filters.account || account === filters.account.toLowerCase();

      const matchesStatus =
        !filters.status ||
        emp.employment_status?.toLowerCase() === filters.status.toLowerCase();

      const matchesPosition =
        !filters.position ||
        position === filters.position.toLowerCase();

      return (
        matchesSearch &&
        matchesAccount &&
        matchesStatus &&
        matchesPosition
      );
    });

    // SORT
    result.sort((a, b) => {
      const nameA = a.first_name?.toLowerCase() ?? '';
      const nameB = b.first_name?.toLowerCase() ?? '';

      if (filters.sort === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return result;
  }, [employees, search, filters]);

  return (
    <div className="employee-list-layout">
      <Sidebar />

      <main className="employee-list-content">
        <Header
          title="EMPLOYEE LIST"
          total={filteredEmployees.length}
          permissions={permissions}
          onAddEmployee={() => setIsAddOpen(true)}
        />

        <div className="employee-list-toolbar">
          <SearchBar search={search} setSearch={setSearch} />

          <button
            className="filter-btn"
            onClick={() => setIsFilterOpen(true)}
          >
            Filter
          </button>

          <div className="employee-view-toggle">
            <button
              className={view === 'table' ? 'active' : ''}
              onClick={() => setView('table')}
            >
              ☰
            </button>
            <button
              className={view === 'card' ? 'active' : ''}
              onClick={() => setView('card')}
            >
              ⬛
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading employees...</p>
        ) : view === 'table' ? (
          <EmployeeTable
            employees={filteredEmployees}
            permissions={permissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewSchedule={handleViewSchedule}
            onViewEmployee={(emp) => setInfoEmployee(emp)}
          />
        ) : (
          <EmployeeCards employees={filteredEmployees} />
        )}
        {infoEmployee && (
          <EmployeeInfoModal
            employee={infoEmployee}
            onClose={() => setInfoEmployee(null)}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </main>

      {/* FILTER MODAL */}
      {isFilterOpen && (
        <FilterModal
          filters={filters}
          accounts={[...new Set(employees.map(e => e.account))]}
          positions={[...new Set(employees.map(e => e.position))]}
          onApply={setFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {/* ADD MODAL */}
      {isAddOpen && (
        <AddEmployee
          onClose={() => {
            setIsAddOpen(false);
            fetchEmployees();
          }}
        />
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedEmployee && (
        <EditEmployee
          employee={selectedEmployee}
          onClose={() => setIsEditOpen(false)}
          onSave={(updated) => {
            setEmployees(prev =>
              prev.map(emp =>
                emp.employee_id === updated.employee_id
                  ? updated
                  : emp
              )
            );
          }}
        />
      )}

      {/* VIEW MODAL */}
      {isViewOpen && viewEmployee && (
        <ViewScheduleModal
          employee={viewEmployee}
          onClose={() => setIsViewOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeList;