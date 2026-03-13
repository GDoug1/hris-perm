import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/sidebar.css';

export type SidebarNavChild = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export type SidebarNavItem = {
  label: string;
  active?: boolean;
  expanded?: boolean;
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

  const employeeRoutes = ['/schedule', '/employee-list'];
  const managementRoutes = ['/employee-list', '/ControlPanel'];

  const isEmployeeRoute = employeeRoutes.includes(location.pathname);
  const isManagementRoute = managementRoutes.includes(location.pathname);

  const [employeeOpen, setEmployeeOpen] = useState(isEmployeeRoute);
  const [managementOpen, setManagementOpen] = useState(isManagementRoute);

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
                {item.onClick ? (
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
        {hasPermission('View Dashboard') && (
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
        )}

        {hasPermission('View Team') && (
          <NavLink to="/team" className={({ isActive }) => (isActive ? 'active' : '')}>
            Team
          </NavLink>
        )}

        {hasPermission('View Attendance') && (
          <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'active' : '')}>
            Attendance
          </NavLink>
        )}

        {(hasPermission('View Employee List') || hasPermission('Set Attendance')) && (
          <div className="dropdown">
            <div
              className={`dropdown-header ${isEmployeeRoute ? 'active' : ''}`}
              onClick={() => setEmployeeOpen(!employeeOpen)}
            >
              Employee
              <span className={`arrow ${employeeOpen ? 'open' : ''}`}>▼</span>
            </div>

            {employeeOpen && (
              <div className="dropdown-content">
                {hasPermission('Set Attendance') && (
                  <NavLink to="/schedule" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Time In / Time Out
                  </NavLink>
                )}

                {hasPermission('View Employee List') && (
                  <NavLink to="/employee-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Employee List
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {(hasPermission('View Employee List') || hasPermission('Access Control Panel')) && (
          <div className="dropdown">
            <div
              className={`dropdown-header ${isManagementRoute ? 'active' : ''}`}
              onClick={() => setManagementOpen(!managementOpen)}
            >
              Employee Management
              <span className={`arrow ${managementOpen ? 'open' : ''}`}>▼</span>
            </div>

            {managementOpen && (
              <div className="dropdown-content">
                {hasPermission('View Employee List') && (
                  <NavLink to="/employee-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Add / Edit Employee
                  </NavLink>
                )}

                {hasPermission('Access Control Panel') && (
                  <NavLink to="/ControlPanel" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Edit Permissions
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );

  return <aside className="sidebar">{isCustomSidebar ? renderCustomNav() : renderMainSidebar()}</aside>;
};

export default Sidebar;
