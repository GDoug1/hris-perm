import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Navbar/Sidebar";
import SearchBar from "../components/Employee/SearchBar";
import EmployeeScheduleTable from "../components/EmployeeScheduleTable";
import AddEmployeeModal from "../components/Employee/AddEmployeeModal"; // ✅ correct modal
import ViewScheduleModal from "../components/ViewScheduleModal";
import FilterModal from "../components/Employee/FilterModal";

import type { Employee } from "../types/employee";
import "../styles/schedule.css";

const Schedule = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [userRole] = useState<string>("Teamcoach");

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [viewEmployee, setViewEmployee] =
    useState<Employee | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    account: "",
    status: "",
    position: "",
    sort: "asc" as "asc" | "desc",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async () => {
    try {
      const res = await fetch(
        "http://localhost/hris/backend/employees/get_schedule_employees.php",
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: "Failed to load employees",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const fullName = `${emp.first_name ?? ""} ${
          emp.middle_name ?? ""
        } ${emp.last_name ?? ""}`.toLowerCase();

        const searchTerm = search.toLowerCase();

        return fullName.includes(searchTerm);
      })
      .filter(
        (emp) =>
          (!filters.account || emp.account === filters.account) &&
          (!filters.status ||
            emp.employment_status === filters.status) &&
          (!filters.position ||
            emp.position === filters.position)
      )
      .sort((a, b) =>
        filters.sort === "asc"
          ? new Date(a.date_hired).getTime() -
            new Date(b.date_hired).getTime()
          : new Date(b.date_hired).getTime() -
            new Date(a.date_hired).getTime()
      );
  }, [employees, search, filters]);

  /* ================= HANDLERS ================= */

  const handleSetSchedule = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditOpen(true);
  };

  const handleViewSchedule = (employee: Employee) => {
    setViewEmployee(employee);
    setIsViewOpen(true);
  };

  return (
    <div className="layout">
      <Sidebar />

      <main className="content">

        <h1>SCHEDULE MANAGEMENT</h1>

        <div className="toolbar">
          <SearchBar search={search} setSearch={setSearch} />

          <button
            className="filter-btn"
            onClick={() => setIsFilterOpen(true)}
          >
            Filter
          </button>
        </div>

        {loading ? (
          <p>Loading schedules...</p>
        ) : (
          <EmployeeScheduleTable
            employees={filteredEmployees}
            userRole={userRole}
            onSetSchedule={handleSetSchedule}
            onViewSchedule={handleViewSchedule}
          />
        )}
      </main>

      {/* ================= SET SCHEDULE MODAL ================= */}
      {isEditOpen && selectedEmployee && (
        <AddEmployeeModal
          employee={selectedEmployee}
          onClose={() => setIsEditOpen(false)}
          onSaved={() => {                // ✅ FIXED HERE
            fetchEmployees();              // refresh table
            setToast({
              message: "Schedule saved successfully",
              type: "success",
            });
            setIsEditOpen(false);
          }}
        />
      )}

      {/* ================= VIEW MODAL ================= */}
      {isViewOpen && viewEmployee && (
        <ViewScheduleModal
          employee={viewEmployee}
          onClose={() => setIsViewOpen(false)}
        />
      )}

      {/* ================= FILTER MODAL ================= */}
      {isFilterOpen && (
        <FilterModal
          filters={filters}
          accounts={[...new Set(employees.map((e) => e.account))]}
          positions={[...new Set(employees.map((e) => e.position))]}
          onApply={setFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {/* ================= TOAST ================= */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Schedule;
