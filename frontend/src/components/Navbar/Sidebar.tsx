import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/sidebar.css';

export type SidebarNavChild = {
  label: string;
  active?: boolean;
  to?: string;
  onClick?: () => void;
};

export type SidebarNavItem = {
  label: string;
  active?: boolean;
  expanded?: boolean;
  to?: string;
  onClick?: () => void;
  children?: SidebarNavChild[];
};

type User = {
  first_name: string;
  role_name: string;
  permissions: string[];
};

type SidebarProps = {
  avatar?: string;
  roleLabel?: string;
  userName?: string;
  navItems?: SidebarNavItem[];
  onLogout?: () => void;
};

const Sidebar = ({ avatar, roleLabel, userName, navItems, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const isAttendanceRoute = location.pathname === '/attendance';
  const [attendanceOpen, setAttendanceOpen] = useState(isAttendanceRoute);

  useEffect(() => {
    fetch('http://localhost/hris/backend/control_panel/get_user.php', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        navigate('/', { replace: true });
      });
  }, [navigate]);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }

    await fetch('http://localhost/hris/backend/auth/logout.php', {
      method: 'POST',
      credentials: 'include',
    });

    navigate('/', { replace: true });
  };

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission);
  };

  const isCustomSidebar = Array.isArray(navItems) && navItems.length > 0;

  const getInitials = () => {
    const base = user?.first_name?.trim() || userName?.trim() || 'AD';
    return base.slice(0, 2).toUpperCase();
  };

  const renderCustomNav = () => {
    if (!isCustomSidebar) return null;

    return (
      <>
        <div className="brand">
          <div className="avatar">{avatar}</div>
          <div>
            <div>{roleLabel}</div>
            <div className="user-meta">{userName ?? roleLabel}</div>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => {
            const className = `nav-item${item.active ? ' active' : ''}`;
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;

            return (
              <div key={item.label} className="nav-group">
                {item.to ? (
                  <NavLink className={className} to={item.to}>
                    <span>{item.label}</span>
                    {hasChildren ? (
                      <span className="nav-caret">{item.expanded ? '▾' : '▸'}</span>
                    ) : null}
                  </NavLink>
                ) : item.onClick ? (
                  <button className={className} type="button" onClick={item.onClick}>
                    <span>{item.label}</span>
                    {hasChildren ? (
                      <span className="nav-caret">{item.expanded ? '▾' : '▸'}</span>
                    ) : null}
                  </button>
                ) : (
                  <div className={className}>
                    <span>{item.label}</span>
                    {hasChildren ? (
                      <span className="nav-caret">{item.expanded ? '▾' : '▸'}</span>
                    ) : null}
                  </div>
                )}

                {hasChildren && item.expanded ? (
                  <div className="nav-submenu" role="group" aria-label={`${item.label} submenu`}>
                    {item.children?.map((child) => {
                      const childClassName = `nav-subitem${child.active ? ' active' : ''}`;

                      if (child.to) {
                        return (
                          <NavLink
                            key={`${item.label}-${child.label}`}
                            className={childClassName}
                            to={child.to}
                          >
                            {child.label}
                          </NavLink>
                        );
                      }

                      return (
                        <button
                          key={`${item.label}-${child.label}`}
                          className={childClassName}
                          type="button"
                          onClick={child.onClick}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <button className="sidebar-footer" type="button" onClick={handleLogout}>
          Log Out
        </button>
      </>
    );
  };

  const renderMainSidebar = () => (
    <>
      <div className="profile">
        <div className="profile-avatar">{getInitials()}</div>
        <div className="profile-meta">
          <p className="name">{user?.role_name ?? 'Loading...'}</p>
          <p className="username">{(user?.first_name ?? 'user').toLowerCase()}</p>
        </div>
      </div>

      <nav className="menu">
        {hasPermission('View Dashboard') && (
          <NavLink to="/main-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
        )}

        {hasPermission('View Team') && (
          <NavLink to="/team" className={({ isActive }) => (isActive ? 'active' : '')}>
            Team
          </NavLink>
        )}

        {hasPermission('View Attendance') && (
          <div className="dropdown">
            <div
              className={`dropdown-header ${isAttendanceRoute ? 'active' : ''}`}
              onClick={() => setAttendanceOpen(!attendanceOpen)}
            >
              Attendance
              <span className={`arrow ${attendanceOpen ? 'open' : ''}`}>▾</span>
            </div>

            {attendanceOpen && (
              <div className="dropdown-content">
                <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'active' : '')}>
                  My Attendance
                </NavLink>
                <NavLink to="/attendance">All Attendance</NavLink>
                <NavLink to="/attendance">My Requests</NavLink>
                <NavLink to="/attendance">My Filing Center</NavLink>
                <NavLink to="/attendance">Team Request</NavLink>
              </div>
            )}
          </div>
        )}

        {hasPermission('Set Attendance') && (
          <NavLink to="/schedule" className={({ isActive }) => (isActive ? 'active' : '')}>
            Schedule
          </NavLink>
        )}

        {hasPermission('View Employee List') && (
          <NavLink to="/employee-list" className={({ isActive }) => (isActive ? 'active' : '')}>
            Employees
          </NavLink>
        )}

        {hasPermission('Access Control Panel') && (
          <NavLink to="/ControlPanel" className={({ isActive }) => (isActive ? 'active' : '')}>
            Control Panel
          </NavLink>
        )}
      </nav>

      <button className="logout" onClick={handleLogout}>
        Log Out
      </button>
    </>
  );

  return <aside className="sidebar">{isCustomSidebar ? renderCustomNav() : renderMainSidebar()}</aside>;
};

export default Sidebar;
