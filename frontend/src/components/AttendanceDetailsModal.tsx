import '../styles/attendance.css';

type AttendanceRow = {
  employee_id: number;
  first_name: string;
  last_name: string;
  attendance_date: string;
  attendance_status: string;
  time_in: string | null;
  time_out: string | null;
  total_work_minutes: number | null;
};

type Props = {
  data: AttendanceRow;
  onClose: () => void;
};


const AttendanceDetailsModal = ({ data, onClose }: Props) => {
  const formatTime = (value: string | null) =>
    value
      ? new Date(value).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

  const formatMinutes = (mins: number | null) => {
    if (!mins) return '0h';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const formatDateLong = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Attendance Details</h2>

        {/* Employee Info */}
        <div className="modal-row">
          <span>
            <strong>Employee:</strong> {data.first_name} {data.last_name}
          </span>
          <span>
            <strong>Date:</strong>{' '}
            {formatDateLong(data.attendance_date)}

          </span>
        </div>

        {/* Time Details */}
        <div className="modal-grid">
          <div>
            <p>Time In</p>
            <strong>{formatTime(data.time_in)}</strong>
          </div>

          <div>
            <p>Time Out</p>
            <strong>{formatTime(data.time_out)}</strong>
          </div>

          <div>
            <p>Break Duration</p>
            <strong>—</strong>
          </div>

          <div>
            <p>Total Hours</p>
            <strong>{formatMinutes(data.total_work_minutes)}</strong>
          </div>
        </div>

        {/* Status */}
        <div className="modal-status">
          <span className={`badge ${data.attendance_status?.toLowerCase()}`}>
            {data.attendance_status}
          </span>
        </div>

        {/* Remarks */}
        <div className="modal-remarks">
          <p>Remarks</p>
          <span>—</span>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;
