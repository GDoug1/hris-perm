import { useEffect, useState } from 'react';
import Sidebar from '../components/Navbar/Sidebar';
import AttendanceDetailsModal from '../components/AttendanceDetailsModal';
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

const Attendance = () => {
  // ======================
  // STATE
  // ======================
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AttendanceRow | null>(null);

  // ======================
  // FETCH ATTENDANCE
  // ======================
  useEffect(() => {
    const params = new URLSearchParams({
      date: selectedDate,
      search,
    });

    fetch(
      `http://localhost/hris/backend/employees/attendance_list.php?${params}`,
      { credentials: 'include' }
    )
      .then(res => res.json())
      .then(setRows);
  }, [selectedDate, search]);

  // ======================
  // HELPERS
  // ======================
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

  // ======================
  // RENDER
  // ======================
  return (
    <div className="attendance-page">
      <Sidebar />

      <main className="attendance-main">
        {/* Header */}
        <div className="attendance-header">
          <h1>ATTENDANCE</h1>
          
          <span>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{''}
            &nbsp;
            {new Date().toLocaleDateString([], {
              weekday: 'short',
              month: 'long',
              day: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Attendance Table */}
        <div className="attendance-table">
          <div className="table-head">
            <span>Employee Name</span>
            <span>Date</span>
            <span>Time In</span>
            <span>Time Out</span>
            <span>Total Hours</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {rows.length === 0 && (
            <div className="table-row">
              <span>No records</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
            </div>
          )}

          {rows.map(row => (
            <div className="table-row" key={`${row.employee_id}-${row.attendance_date}`}>
              <span>{row.first_name} {row.last_name}</span>

              <span>
                {formatDateLong(row.attendance_date)}

              </span>

              <span>
                {row.time_in
                  ? new Date(row.time_in).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </span>

              <span>
                {row.time_out
                  ? new Date(row.time_out).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </span>

              <span>{formatMinutes(row.total_work_minutes)}</span>

              <span className={`badge ${row.attendance_status?.toLowerCase()}`}>
                {row.attendance_status}
              </span>

              <button
                className="view-btn"
                onClick={() => {
                  setSelectedRow(row);
                  setShowModal(true);
                }}
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedRow && (
          <AttendanceDetailsModal
            data={selectedRow}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Attendance;
