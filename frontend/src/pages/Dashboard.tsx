import { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import DashboardSidebar from '../components/DashboardSidebar';

type AttendanceToday = {
  attendance_id: number;
  time_in: string | null;
  time_out: string | null;
};

type Announcement = {
  title: string;
  content: string;
  date_posted: string;
};

type Schedule = {
  start_time: string;
  end_time: string;
  shift_type: string;
  work_setup: string;
};

const Dashboard = () => {
  // ======================
  // STATES
  // ======================
  const [now, setNow] = useState(new Date());
  const [attendance, setAttendance] = useState<AttendanceToday | null>(null);
  const [loading, setLoading] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [workedSeconds, setWorkedSeconds] = useState<number>(0);


  // ======================
  // LIVE CLOCK
  // ======================
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ======================
  // LOAD ATTENDANCE TODAY
  // ======================
  const fetchAttendance = async () => {
    const res = await fetch(
      'http://localhost/hris/backend/employees/attendance_today.php',
      { credentials: 'include' }
    );

    if (res.ok) {
      const data = await res.json();
      setAttendance(data);
    } else {
      setAttendance(null);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ======================
  // LOAD ANNOUNCEMENTS
  // ======================
  useEffect(() => {
    fetch(
      'http://localhost/hris/backend/employees/announcements_today.php',
      { credentials: 'include' }
    )
      .then(res => res.json())
      .then(setAnnouncements);
  }, []);

  // ======================
  // LOAD SCHEDULE
  // ======================
  useEffect(() => {
    fetch(
      'http://localhost/hris/backend/employees/today_schedule.php',
      { credentials: 'include' }
    )
      .then(res => res.json())
      .then(setSchedule);
  }, []);

  // ======================
  // LOAD ATTENDANCE LIST
  // ======================
  useEffect(() => {
    fetch(
      'http://localhost/hris/backend/employees/attendance_today_list.php',
      { credentials: 'include' }
    )
      .then(res => res.json())
      .then(setAttendanceList);
  }, []);

  // ======================
  // ACTIONS
  // ======================
  const handleTimeIn = async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch(
      'http://localhost/hris/backend/employees/time_in.php',
      { method: 'POST', credentials: 'include' }
    );

    setLoading(false);
    if (res.ok) fetchAttendance();
  };

  const handleTimeOut = async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch(
      'http://localhost/hris/backend/employees/time_out.php',
      { method: 'POST', credentials: 'include' }
    );

    setLoading(false);
    if (res.ok) fetchAttendance();
  };

  const handleBreakStart = async () => {
    await fetch(
      'http://localhost/hris/backend/employees/break_start.php',
      { method: 'POST', credentials: 'include' }
    );
  };

  // ======================
  // HOLDAYS
  // ======================

  useEffect(() => {
  fetch(
    'http://localhost/hris/backend/employees/holidays_today.php',
    { credentials: 'include' }
  )
    .then(res => res.json())
    .then(setHolidays);
}, []);


  // ======================
  // HELPERS
  // ======================

//   const formatMinutes = (mins: number) => {
//   const h = Math.floor(mins / 60);
//   const m = mins % 60;
//   return `${h}h ${m}m`;
// };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
      weekday: 'short',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });

  const isTimedIn = attendance?.time_in && !attendance?.time_out;
  const isCompleted = attendance?.time_out;

  
  // ======================
  // TIMER FOR WORKED HOURS
  // ======================

  useEffect(() => {
  if (!attendance?.time_in || attendance.time_out) {
    setWorkedSeconds(0);
    return;
  }

  const timeInDate = new Date(attendance.time_in);

  const interval = setInterval(() => {
    const now = new Date();
    const diffMs = now.getTime() - timeInDate.getTime();
    setWorkedSeconds(Math.floor(diffMs / 1000));
  }, 1000);

  return () => clearInterval(interval);
}, [attendance]);

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
};


  // ======================
  // RENDER
  // ======================
  return (
    <div className="dashboard">
      <DashboardSidebar />

      <main className="main">
        <div className="header">
          <h1>DASHBOARD</h1>
          <span>
            {formatTime(now)} &nbsp; {formatDate(now)}
          </span>
        </div>

        <div className="grid">
          {/* TIME IN / OUT */}
          <div className="card time-in">
            <div
              className="time-circle"
              role="button"
              onClick={
                !attendance ? handleTimeIn :
                isTimedIn ? handleTimeOut :
                undefined
              }
              style={{
                opacity: isCompleted ? 0.5 : 1,
                cursor: isCompleted ? 'not-allowed' : 'pointer',
              }}
            >
              {!attendance && 'Time In'}

              {isTimedIn && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>Working Time</div>
                  <div style={{ fontSize: '22px', fontWeight: 600 }}>
                    {formatDuration(workedSeconds)}
                  </div>
                  <div style={{ marginTop: '6px' }}>Time Out</div>
                </div>
              )}

              {isCompleted && 'Completed'}

            </div>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="card announcement">
            <div className="card-header">
              <h3>Announcement</h3>
            </div>

            {announcements.length === 0 && (
              <p className="muted">No announcements</p>
            )}

            {announcements.map((a, i) => (
              <p key={i} className="muted">
                <strong>{a.title}</strong><br />
                {a.content}
              </p>
            ))}
          </div>

          {/* BREAK */}
          <div className="card break">
            <div className="row">
              <h3>Break</h3>
            </div>
            <button
              className="dark-btn"
              disabled={!isTimedIn}
              onClick={handleBreakStart}
            >
              Start
            </button>
          </div>

          {/* ===== Holiday ===== */}
            <div className="card holiday">
              <div className="card-header">
                <h3>Holidays / Birthday</h3>
              </div>

              {holidays.length === 0 && (
                <p className="muted">No upcoming holidays</p>
              )}

              {holidays.map((h, i) => (
                <p key={i} className="muted">
                  <strong>{h.holiday_name}</strong><br />
                  {new Date(h.holiday_date).toLocaleDateString()}
                </p>
              ))}
            </div>

          {/* ===== Calendar ===== */}
          <div className="card calendar">
            <h3>Calendar</h3>
            <p className="muted">
              {now.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* SHIFT */}
          <div className="card shift">
            {schedule ? (
              <>
                <h3>Today's Shift</h3>
                <div>
                  <p>Shift Start Time</p>
                  <strong>{schedule.start_time}</strong>
                </div>
                <div>
                  <p>Shift End Time</p>
                  <strong>{schedule.end_time}</strong>
                </div>
                
                <div className="shift-footer">
                  {schedule.shift_type} • {schedule.work_setup}
                </div>
              </>
            ) : (
              <p className="muted">No schedule today</p>
            )}
          </div>

          {/* ===== Employee Table ===== */}
          <div className="card table">
            <div className="table-header">
              <span>Employee Name</span>
              <span>Date</span>
              <span>Time In</span>
              <span>Time Out</span>
              <span>Status</span>
            </div>

            {attendanceList.length === 0 && (
              <div className="table-row">
                <span>No records</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
              </div>
            )}

            {attendanceList.map((row, i) => (
              <div className="table-row" key={i}>
                <span>
                  {row.first_name} {row.last_name}
                </span>

                <span>
                  {new Date(row.attendance_date).toLocaleDateString()}
                </span>

                <span>
                  {row.time_in
                    ? new Date(row.time_in).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--'}
                </span>

                <span>
                  {row.time_out
                    ? new Date(row.time_out).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--'}
                </span>

                <span>
                  {row.time_out ? 'Completed' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
