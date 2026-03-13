import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/MainDashboard.css";
import Sidebar from "../components/Navbar/Sidebar";

function DashboardHeader({ headerTime, headerDate }) {
  return (
    <section className="md-header">
      <div className="md-datetime">
        {headerTime}&nbsp;&nbsp;&nbsp;{headerDate}
      </div>
    </section>
  );
}

function TimeCard({
  counterDisplay,
  hasActiveTimeIn,
  onToggleTimeIn,
  canToggleTimeIn,
  hasCompletedShift = false,
}) {
  return (
    <div className="md-card md-time-card">
      <div className="md-time-panel">
        <div className="md-time-counter">{counterDisplay}</div>

        {hasCompletedShift ? (
          <p className="md-time-complete-message">
            Thank you for your hard work.
          </p>
        ) : (
          <button
            type="button"
            className="md-time-in-btn"
            onClick={onToggleTimeIn}
            disabled={!canToggleTimeIn}
          >
            {hasActiveTimeIn ? "Time Out" : "Time In"}
          </button>
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({ canEdit = true }) {
  return (
    <div className="md-card md-announcement-card">
      <div className="md-card-top">
        <span>Announcement</span>
        {canEdit && (
          <button type="button" className="md-pill-btn">
            + Announcement
          </button>
        )}
      </div>

      <ul
        className="md-list-items md-announcement-list"
        aria-label="No announcements yet"
      />

      <div className="md-mini-actions">
        {canEdit ? "✎  " : null}◷
      </div>
    </div>
  );
}

function formatShiftTime(time, period) {
  if (!time) return "--";
  return `${time} ${period ?? ""}`.trim();
}

function getTodayShiftSchedule(schedule) {
  if (!schedule || typeof schedule !== "object" || Array.isArray(schedule)) {
    return null;
  }

  const todayKey = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date().getDay()
  ];

  const assignedDays = Array.isArray(schedule.days) ? schedule.days : [];

  if (!assignedDays.includes(todayKey)) return null;

  const daySchedule = schedule.daySchedules?.[todayKey];

  if (daySchedule && typeof daySchedule === "object") return daySchedule;

  return schedule;
}

function ShiftCard({ schedule = null, dashboardMeta = null }) {
  const shiftSchedule = getTodayShiftSchedule(schedule);

  const startTime = formatShiftTime(
    shiftSchedule?.startTime,
    shiftSchedule?.startPeriod
  );

  const endTime = formatShiftTime(
    shiftSchedule?.endTime,
    shiftSchedule?.endPeriod
  );

  const shiftDayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="md-card md-shift-card">
      <div className="md-card-top">
        <span>Current Shift</span>
        <span className="md-shift-day-name">{shiftDayName}</span>
      </div>

      <div className="md-shift-columns">
        <div className="md-shift-stat">
          <div className="md-label">Shift Start Time</div>
          <div className="md-value">{startTime}</div>
        </div>

        <div className="md-shift-stat">
          <div className="md-label">Shift End Time</div>
          <div className="md-value">{endTime}</div>
        </div>
      </div>

      <div className="md-shift-meta">
        <span className="md-shift-meta-pill">
          {dashboardMeta?.scheduleTag ?? "Not scheduled"}
        </span>

        <span className="md-shift-meta-break">
          Break: {dashboardMeta?.breakTime ?? "—"}
        </span>
      </div>
    </div>
  );
}

function CalendarCard({ calendarData }) {
  return (
    <div className="md-card md-calendar-card">
      <div className="md-card-top">
        <span>Calendar</span>
        <span className="md-calendar-month">{calendarData.monthLabel}</span>
      </div>

      <div className="md-calendar-grid weekdays">
        {calendarData.weekDays.map((weekday) => (
          <div key={weekday} className="md-calendar-cell header">
            {weekday}
          </div>
        ))}
      </div>

      <div className="md-calendar-grid dates">
        {calendarData.cells.map((cell, index) => (
          <div
            key={`${cell.day}-${index}`}
            className={`md-calendar-cell ${cell.muted ? "muted" : ""} ${
              cell.isToday ? "today" : ""
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}

function HolidayCard({ canEdit = true }) {
  return (
    <div className="md-card md-holiday-card">
      <div className="md-card-top">
        <span>Holidays/Birthday</span>
        {canEdit && <span className="md-plus">+</span>}
      </div>

      <ul
        className="md-list-items md-holiday-list"
        aria-label="No holidays or birthdays yet"
      />

      <div className="md-mini-actions">
        {canEdit ? "✎  " : null}◷
      </div>
    </div>
  );
}

function SummaryCard({ timeInStart, totalHours, dashboardMeta = null }) {
  return (
    <div className="md-card md-summary-card">
      <div className="md-summary-section">
        <div className="md-label">Today Status</div>

        <div className="md-summary-list">
          <div className="md-summary-row">
            <span>Time In</span>
            <strong>
              {timeInStart
                ? timeInStart.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "--:--"}
            </strong>
          </div>

          <div className="md-summary-row">
            <span>Break</span>
            <strong>{dashboardMeta?.breakTag ?? "Inactive"}</strong>
          </div>

          <div className="md-summary-row">
            <span>Status</span>
            <strong>{dashboardMeta?.availabilityLabel ?? "Not available"}</strong>
          </div>
        </div>
      </div>

      <div className="md-summary-section">
        <div className="md-label">Total Hours</div>
        <div className="md-big-value">{totalHours}h</div>
      </div>

      <div className="md-summary-section">
        <div className="md-label">Attendance</div>
        <div className="md-big-value">
          {timeInStart ? "Present" : "Absent"}
        </div>

        <div className="md-summary-tag">
          {dashboardMeta?.attendanceTag ?? "Pending"}
        </div>
      </div>
    </div>
  );
}

function MemberStatusCard() {
  return (
    <div className="md-card md-member-card">
      <div className="md-member-title">Member Status</div>

      <div className="md-request-list">
        <div className="md-request-row">
          <span>Kim Santos</span>
          <span className="md-requesting">Requesting OT</span>
          <button className="md-view-btn">View</button>
        </div>
      </div>
    </div>
  );
}

export default function MainDashboard({
  attendanceControls = null,
  showMemberStatusCard = false,
  schedule = null,
  canEditCards = true,
  dashboardMeta = null,
}) {
  const [timeInStart, setTimeInStart] = useState(null);
  const [now, setNow] = useState(new Date());
  const [isTimeOutConfirmOpen, setIsTimeOutConfirmOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeTimeIn = attendanceControls?.timeInAt ?? timeInStart;
  const activeTimeOut = attendanceControls?.timeOutAt ?? null;

  const hasCompletedShift = Boolean(attendanceControls?.hasCompletedShift);

  const hasActiveTimeIn = Boolean(activeTimeIn && !activeTimeOut);

  const canToggleTimeIn = attendanceControls
    ? Boolean(
        attendanceControls.canClickTimeIn ||
          attendanceControls.canClickTimeOut
      )
    : true;

  const counterDisplay = useMemo(() => {
    if (!activeTimeIn) return "00:00:00";

    const counterEndTime = activeTimeOut ?? now;

    const diffInSeconds = Math.max(
      0,
      Math.floor(
        (counterEndTime.getTime() - activeTimeIn.getTime()) / 1000
      )
    );

    const hours = String(Math.floor(diffInSeconds / 3600)).padStart(2, "0");
    const minutes = String(
      Math.floor((diffInSeconds % 3600) / 60)
    ).padStart(2, "0");

    const seconds = String(diffInSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }, [activeTimeIn, activeTimeOut, now]);

  const calendarData = useMemo(() => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const cells = [];

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      cells.push({ day: "", muted: true, isToday: false });
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const isToday =
        day === currentDate.getDate() &&
        month === currentDate.getMonth() &&
        year === currentDate.getFullYear();

      cells.push({ day, muted: false, isToday });
    }

    return {
      monthLabel: currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      weekDays,
      cells,
    };
  }, []);

  const totalHours = useMemo(() => {
    if (!activeTimeIn) return 0;

    const counterEndTime = activeTimeOut ?? now;

    const diffInSeconds = Math.max(
      0,
      Math.floor(
        (counterEndTime.getTime() - activeTimeIn.getTime()) / 1000
      )
    );

    return (diffInSeconds / 3600).toFixed(1);
  }, [activeTimeIn, activeTimeOut, now]);


  const sidebarNavItems = useMemo(() => {
    const isDashboard = location.pathname === "/dashboard";
    const isTeam = location.pathname === "/team";
    const isAttendance = location.pathname === "/attendance";
    const isSchedule = location.pathname === "/schedule";
    const isEmployees = location.pathname === "/employee-list";
    const isControlPanel = location.pathname === "/ControlPanel";

    return [
      { label: "Dashboard", active: isDashboard, to: "/dashboard" },
      { label: "Team", active: isTeam, to: "/team" },
      { label: "Attendance", active: isAttendance, to: "/attendance" },
      { label: "Schedule", active: isSchedule, to: "/schedule" },
      { label: "Employees", active: isEmployees, to: "/employee-list" },
      { label: "Control Panel", active: isControlPanel, to: "/ControlPanel" },
    ];
  }, [location.pathname]);

  const onToggleTimeIn = () => {
    if (hasActiveTimeIn) {
      setIsTimeOutConfirmOpen(true);
      return;
    }

    setTimeInStart(new Date());
  };

  return (
    <div className="md-layout">
      <Sidebar navItems={sidebarNavItems} roleLabel="Dashboard" userName="Main dashboard" />

      <div className="md-main">
        <DashboardHeader
          headerTime={now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
          headerDate={now.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        />

        <div
          className={`md-grid ${
            showMemberStatusCard ? "md-has-member" : "md-no-member"
          }`}
        >
          <TimeCard
            counterDisplay={counterDisplay}
            hasActiveTimeIn={hasActiveTimeIn}
            onToggleTimeIn={onToggleTimeIn}
            canToggleTimeIn={canToggleTimeIn}
            hasCompletedShift={hasCompletedShift}
          />

          <AnnouncementCard canEdit={canEditCards} />

          <ShiftCard schedule={schedule} dashboardMeta={dashboardMeta} />

          <CalendarCard calendarData={calendarData} />

          <HolidayCard canEdit={canEditCards} />

          <SummaryCard
            timeInStart={activeTimeIn}
            totalHours={totalHours}
            dashboardMeta={dashboardMeta}
          />

          {showMemberStatusCard && <MemberStatusCard />}
        </div>
      </div>
    </div>
  );
}