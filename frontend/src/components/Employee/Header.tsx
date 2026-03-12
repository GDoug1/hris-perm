interface Props {
  title?: string;
  total?: number;
  permissions: string[];
  onAddEmployee?: () => void;
}

const Header = ({ title, total = 0, permissions, onAddEmployee }: Props) => {

  const canAddEmployee = permissions.includes("Add Employee");

  return (
    <div className="employee-header">
      <div>
        <h1>{title || 'EMPLOYEE SCHEDULE'}</h1>
        <span className="count">
          <span className="six-two">{total}</span>{' '}
          {total === 1 ? 'Employee' : 'Employees'}
        </span>
      </div>

      <div className="employee-actions">

        {canAddEmployee && (
          <button
            className="add-employee-btn"
            onClick={onAddEmployee}
          >
            + Add Employee
          </button>
        )}

        <button className="export-btn">Export</button>

      </div>
    </div>
  );
};

export default Header;