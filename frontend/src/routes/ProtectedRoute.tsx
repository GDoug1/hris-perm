import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
};

const ProtectedRoute = ({
  children,
  allowedRoles,
  requiredPermission,
}: Props) => {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch(
      "http://localhost/hris/backend/control_panel/get_user.php",
      { credentials: "include" }
    )
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {

        const role = data.user.role_name;
        const permissions = data.user.permissions || [];

        // Check role restriction
        if (allowedRoles && !allowedRoles.includes(role)) {
          setAuthorized(false);
          return;
        }

        // Check permission restriction
        if (requiredPermission && !permissions.includes(requiredPermission)) {
          setAuthorized(false);
          return;
        }

        setAuthorized(true);
      })
      .catch(() => {
        setAuthorized(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [allowedRoles, requiredPermission]);

  if (loading) return null;

  if (!authorized) {
    return <Navigate to="/MainDashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;