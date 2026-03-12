import { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import type { Employee } from "../../types/employee";

type Props = {
  employees: Employee[];
  permissions: string[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: number) => void;
  onViewSchedule?: (employee: Employee) => void;
  onViewEmployee?: (employee: Employee) => void;
};

type SortField =
  | "employee_id"
  | "full_name"
  | "position"
  | "account"
  | "employee_type"
  | "employment_status"
  | "date_hired";

const EmployeeTable = ({
  employees,
  permissions,
  onEdit,
  onDelete,
  onViewSchedule,
  onViewEmployee,
}: Props) => {
  const canEdit = permissions.includes("Edit Employee");
  const canDelete = permissions.includes("Delete Employee");

  const [sortField, setSortField] = useState<SortField>("employee_id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEmployees = useMemo(() => {
    const sorted = [...employees];

    sorted.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (sortField === "full_name") {
        valueA = `${a.first_name} ${a.middle_name ?? ""} ${a.last_name}`;
        valueB = `${b.first_name} ${b.middle_name ?? ""} ${b.last_name}`;
      } else {
        valueA = a[sortField as keyof Employee];
        valueB = b[sortField as keyof Employee];
      }

      if (!valueA) valueA = "";
      if (!valueB) valueB = "";

      if (sortField === "employee_id") {
        return sortDirection === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      if (sortField === "date_hired") {
        return sortDirection === "asc"
          ? new Date(valueA).getTime() - new Date(valueB).getTime()
          : new Date(valueB).getTime() - new Date(valueA).getTime();
      }

      return sortDirection === "asc"
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    });

    return sorted;
  }, [employees, sortField, sortDirection]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="employee-table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th 
              className="employee-sticky-id"
              onClick={() => handleSort("employee_id")}>
              ID {renderSortIcon("employee_id")}
            </th>

            <th 
              className="employee-sticky-name"
              onClick={() => handleSort("full_name")}>
              NAME {renderSortIcon("full_name")}
            </th>

            <th onClick={() => handleSort("position")}>
              POSITION {renderSortIcon("position")}
            </th>

            <th onClick={() => handleSort("account")}>
              ACCOUNT {renderSortIcon("account")}
            </th>

            <th onClick={() => handleSort("employee_type")}>
              TYPE {renderSortIcon("employee_type")}
            </th>

            <th onClick={() => handleSort("employment_status")}>
              STATUS {renderSortIcon("employment_status")}
            </th>

            <th onClick={() => handleSort("date_hired")}>
              HIRED {renderSortIcon("date_hired")}
            </th>

            <th>INFO</th>
            <th>SCHEDULE</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {sortedEmployees.map((emp) => (
            <tr key={emp.employee_id}>
              <td className="employee-sticky-id">
                {emp.employee_id}
              </td>

              <td className="employee-sticky-name">
                {emp.first_name} {emp.middle_name ?? ""} {emp.last_name}
              </td>

              <td>{emp.position}</td>
              <td>{emp.account}</td>
              <td>{emp.employee_type}</td>

              <td>
                <StatusBadge status={emp.employment_status} />
              </td>

              <td>{formatDate(emp.date_hired)}</td>

              {/* Employee Info Button */}
              <td>
                <button
                  className="employee-btn-view"
                  onClick={() => onViewEmployee?.(emp)}
                >
                  Info
                </button>
              </td>

              {/* Schedule Button */}
              <td>
                <button
                  className="employee-btn-view"
                  onClick={() => onViewSchedule?.(emp)}
                >
                  View
                </button>
              </td>

              {/* Actions */}
              <td className="employee-action-cell employee-sticky-action">
                {canEdit && (
                  <button
                    className="employee-btn-edit"
                    onClick={() => onEdit?.(emp)}
                  >
                    Edit
                  </button>
                )}

                {canDelete && (
                  <button
                    className="employee-btn-delete"
                    onClick={() => onDelete?.(emp.employee_id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;