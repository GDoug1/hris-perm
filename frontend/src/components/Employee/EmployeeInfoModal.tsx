import type { Employee } from "../../types/employee";
import "../../styles/Employee/employeeinfomodal.css";

type Props = {
  employee: Employee;
  onClose: () => void;
};

const EmployeeInfoModal = ({ employee, onClose }: Props) => {
  return (
    <div
      className="employee-info-modal-overlay"
      onClick={onClose}
    >
      <div
        className="employee-info-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="employee-info-modal-title">
          Employee Information
        </h2>

        <div className="employee-info-modal-grid">

          <div className="employee-info-modal-field">
            <strong>Full Name</strong>
            <p>
              {employee.first_name} {employee.middle_name ?? ""} {employee.last_name}
            </p>
          </div>

          <div className="employee-info-modal-field">
            <strong>Work Email</strong>
            <p>{employee.email}</p>
          </div>

          <div className="employee-info-modal-field">
            <strong>Personal Email</strong>
            <p>{employee.personal_email ?? "-"}</p>
          </div>

          <div className="employee-info-modal-field">
            <strong>Position</strong>
            <p>{employee.position}</p>
          </div>

          <div className="employee-info-modal-field">
            <strong>Account</strong>
            <p>{employee.account}</p>
          </div>

          <div className="employee-info-modal-field">
            <strong>Employee Type</strong>
            <p>{employee.employee_type}</p>
          </div>

        </div>

        <div className="employee-info-modal-actions">
          <button
            className="employee-info-modal-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeInfoModal;