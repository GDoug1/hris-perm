type User = {
  first_name: string;
  role_name: string;
  permissions: string[];
};

import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/sidebar.css';



const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [employeeOpen, setEmployeeOpen] = useState(false); // 🔥 dropdown state

  useEffect(() => {
    fetch('http://localhost/hris/backend/control_panel/get_user.php', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(() => {
        navigate('/', { replace: true });
      });
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('http://localhost/hris/backend/auth/logout.php', {
      method: 'POST',
      credentials: 'include',
    });

    navigate('/', { replace: true });
  };

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission);
  };

  return (
    <aside className="sidebar">
      <img src="/src/assets/ireply.png" className="sidebar-logo" alt="" />

      <div className="profile">
        <div className="avatar">
          <img src="/src/assets/icon.webp" alt="User Avatar" />
        </div>

        <p className="name">{user?.first_name ?? 'Loading...'}</p>

        <button className="logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <nav className="menu">

        {hasPermission("View Dashboard") && (
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        )}

        {hasPermission("View Team") && (
          <NavLink to="/team" className={({ isActive }) => isActive ? 'active' : ''}>
            Team
          </NavLink>
        )}

        {hasPermission("View Attendance") && (
          <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
            Attendance
          </NavLink>
        )}

        {(hasPermission("View Employee List") || hasPermission("Set Attendance")) && (
          <div className="dropdown">
            <div
              className="dropdown-header"
              onClick={() => setEmployeeOpen(!employeeOpen)}
            >
              Employee
              <span className={`arrow ${employeeOpen ? 'open' : ''}`}>▼</span>
            </div>

            {employeeOpen && (
              <div className="dropdown-content">

                {hasPermission("Set Attendance") && (
                  <NavLink to="/schedule">
                    Schedule
                  </NavLink>
                )}

                {hasPermission("View Employee List") && (
                  <NavLink to="/employee-list">
                    Lists
                  </NavLink>
                )}

              </div>
            )}
          </div>
        )}

        {hasPermission("Access Control Panel") && (
          <NavLink to="/ControlPanel">
            Control Panel
          </NavLink>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;