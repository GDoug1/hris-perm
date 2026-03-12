import type { Employee } from '../../types/employee';
import StatusBadge from './StatusBadge';

type Props = {
  employees: Employee[];
};

const EmployeeCards = ({ employees }: Props) => {
  return (
    <div className="employee-card-grid">
      {employees.map(emp => (
        <div key={emp.employee_id} className="employee-card">
          <div className="employee-avatar">
            {emp.first_name?.charAt(0)}
          </div>

          <div className="employee-card-info">
            <h4>
              {emp.first_name} {emp.middle_name ?? ''} {emp.last_name}
            </h4>

            <p>{emp.position}</p>
            <p>{emp.account}</p>
            <p>{emp.cluster}</p>
            <p>{emp.employee_type}</p>

            <StatusBadge status={emp.employment_status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeCards;
