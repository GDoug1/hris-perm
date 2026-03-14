import { Link } from 'react-router-dom';
import Sidebar from '../../components/Navbar/Sidebar';
import '../../styles/attendance.css';

const links = [
  { to: '/attendance/my', label: 'My Attendance' },
  { to: '/attendance/all', label: 'All Attendance' },
  { to: '/attendance/my-request', label: 'My Request' },
  { to: '/attendance/my-filing-center', label: 'My Filing Center' },
  { to: '/attendance/employee-request', label: 'Employee Request (Team Request)' },
];

export default function Team() {
  return (
    <div className="attendance-page">
      <Sidebar />
      <main className="attendance-main">
        <div className="attendance-header">
          <h1>ATTENDANCE</h1>
        </div>

        <p className="attendance-subtitle">Choose an attendance module.</p>

        <div className="attendance-nav-grid">
          {links.map((item) => (
            <Link key={item.to} to={item.to} className="attendance-nav-link">
              {item.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
