import type { Employee } from '../types/employee';
import '../styles/viewScheduleModal.css';

type Props = {
  employee: Employee | null;
  onClose: () => void;
};

const daysOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ViewScheduleModal = ({ employee, onClose }: Props) => {
  if (!employee) return null;

  const orderedSchedules = daysOrder.map(day =>
    employee.schedules.find((s: any) => s.day === day)
  );

  return (
    <div className="modal-overlay">
      <div className="modal-card view-schedule-modal">
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h3>Weekly Schedule</h3>
            <p className="employee-name">
              {employee.first_name}{" "}
              {employee.middle_name ? employee.middle_name + " " : ""}
              {employee.last_name} — {employee.position}

            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="schedule-list">
          {orderedSchedules.map((s, index) => (
            <div key={index} className="schedule-item">
              <span className="day">{daysOrder[index]}</span>

              {!s || s.shift_type === 'Off' ? (
                <span className="status off">Off</span>
              ) : (
                <span className="status">
                  {s.shift_type} • {s.start} – {s.end} • {s.work_setup}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewScheduleModal;
