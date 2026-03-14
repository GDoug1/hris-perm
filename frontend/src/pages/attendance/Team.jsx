import { Link } from 'react-router-dom';
import Sidebar from '../../components/Navbar/Sidebar';

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

        <div className="attendance-table" style={{ display: 'grid', gap: '0.75rem' }}>
          {links.map((item) => (
            <Link key={item.to} to={item.to} className="view-btn" style={{ width: 'fit-content' }}>
              {item.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
