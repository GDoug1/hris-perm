import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashboardSidebar(props = {}) {
  const { avatar, roleLabel, userName, navItems, onLogout } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionUser, setSessionUser] = useState(null);
  const [employeeOpen, setEmployeeOpen] = useState(true);

  const isConfigured = Array.isArray(navItems) && typeof onLogout === "function";

  useEffect(() => {
    if (isConfigured) return;

    fetch("http://localhost/hris/backend/control_panel/get_user.php", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(data => {
        setSessionUser(data.user ?? null);
      })
      .catch(() => {
        navigate("/", { replace: true });
      });
  }, [isConfigured, navigate]);

  useEffect(() => {
    if (location.pathname === "/schedule" || location.pathname === "/employee-list") {
      setEmployeeOpen(true);
    }
  }, [location.pathname]);

  const hasPermission = permission => sessionUser?.permissions?.includes(permission);

  const fallbackNavItems = useMemo(() => {
    if (!sessionUser) return [];

    const items = [];

    if (hasPermission("View Dashboard")) {
      items.push({
        label: "Dashboard",
        active: location.pathname === "/dashboard",
        onClick: () => navigate("/dashboard"),
      });
    }

    if (hasPermission("View Team")) {
      items.push({
        label: "Team",
        active: location.pathname === "/team",
        onClick: () => navigate("/team"),
      });
    }

    if (hasPermission("View Attendance")) {
      items.push({
        label: "Attendance",
        active: location.pathname === "/attendance",
        onClick: () => navigate("/attendance"),
      });
    }

    if (hasPermission("View Employee List") || hasPermission("Set Attendance")) {
      items.push({
        label: "Employee",
        active: location.pathname === "/schedule" || location.pathname === "/employee-list",
        expanded: employeeOpen,
        onClick: () => setEmployeeOpen(prev => !prev),
        children: [
          ...(hasPermission("Set Attendance")
            ? [
                {
                  label: "Schedule",
                  active: location.pathname === "/schedule",
                  onClick: () => navigate("/schedule"),
                },
              ]
            : []),
          ...(hasPermission("View Employee List")
            ? [
                {
                  label: "Lists",
                  active: location.pathname === "/employee-list",
                  onClick: () => navigate("/employee-list"),
                },
              ]
            : []),
        ],
      });
    }

    if (hasPermission("Access Control Panel")) {
      items.push({
        label: "Control Panel",
        active: location.pathname === "/ControlPanel",
        onClick: () => navigate("/ControlPanel"),
      });
    }

    return items;
  }, [employeeOpen, location.pathname, navigate, sessionUser]);

  const handleFallbackLogout = async () => {
    await fetch("http://localhost/hris/backend/auth/logout.php", {
      method: "POST",
      credentials: "include",
    });

    navigate("/", { replace: true });
  };

  const resolvedNavItems = isConfigured ? navItems : fallbackNavItems;
  const resolvedLogout = isConfigured ? onLogout : handleFallbackLogout;
  const resolvedRoleLabel = roleLabel ?? sessionUser?.role_name ?? "Loading...";
  const resolvedUserName = userName ?? sessionUser?.first_name ?? "Loading...";
  const resolvedAvatar = avatar ?? (sessionUser?.first_name?.[0] ?? "U").toUpperCase();

  const renderNavItem = item => {
    const className = `nav-item${item.active ? " active" : ""}`;
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    return (
      <div key={item.label} className="nav-group">
        {item.onClick ? (
          <button className={className} type="button" onClick={item.onClick}>
            <span>{item.label}</span>
            {hasChildren ? <span className="nav-caret">{item.expanded ? "▾" : "▸"}</span> : null}
          </button>
        ) : (
          <div className={className}>
            <span>{item.label}</span>
            {hasChildren ? <span className="nav-caret">{item.expanded ? "▾" : "▸"}</span> : null}
          </div>
        )}

        {hasChildren && item.expanded ? (
          <div className="nav-submenu" role="group" aria-label={`${item.label} submenu`}>
            {item.children.map(child => {
              const childClassName = `nav-subitem${child.active ? " active" : ""}`;
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
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="avatar">{resolvedAvatar}</div>
        <div>
          <div>{resolvedRoleLabel}</div>
          <div className="user-meta">{resolvedUserName ?? resolvedRoleLabel}</div>
        </div>
      </div>

      <nav className="nav">
        {resolvedNavItems.map(renderNavItem)}
      </nav>

      <button className="sidebar-footer" type="button" onClick={resolvedLogout}>
        Log Out
      </button>
    </aside>
  );
}
