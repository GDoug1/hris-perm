import StatusBadge from "./Employee/StatusBadge";
import type { Employee } from "../types/employee";

type Props = {
  employees: Employee[];
  userRole: string;
  onSetSchedule: (employee: Employee) => void;
  onViewSchedule: (employee: Employee) => void;
};

const EmployeeScheduleTable = ({
  employees,
  userRole,
  onSetSchedule,
  onViewSchedule,
}: Props) => {
  return (
    <div className="schedule-table-wrapper">
      <table className="schedule-employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FULL NAME</th>
            <th>WORK EMAIL</th>
            <th>CLUSTER</th>
            <th>STATUS</th>
            <th>SCHEDULE</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => {
            const fullName = `${emp.first_name ?? ""} ${
              emp.middle_name ?? ""
            } ${emp.last_name ?? ""}`;

            const hasSchedule =
              emp.schedules && emp.schedules.length > 0;

            return (
              <tr key={emp.employee_id}>
                <td>{emp.employee_id}</td>
                <td>{fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.cluster}</td>
                <td>
                  <StatusBadge status={emp.employment_status} />
                </td>
                <td>
                  {userRole === "Teamcoach" ? (
                    hasSchedule ? (
                      <button
                        className="btn-view"
                        onClick={() => onViewSchedule(emp)}
                      >
                        View
                      </button>
                    ) : (
                      <button
                        className="btn-set"
                        onClick={() => onSetSchedule(emp)}
                      >
                        Set Schedule
                      </button>
                    )
                  ) : (
                    <button
                      className="btn-view"
                      onClick={() => onViewSchedule(emp)}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeScheduleTable;
  