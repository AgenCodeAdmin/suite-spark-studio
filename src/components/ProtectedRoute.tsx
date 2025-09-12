import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '@/hooks/use-user-role';
import { Enums } from '@/integrations/supabase/types';

type RequiredRole = Enums<'user_roles'>;

interface ProtectedRouteProps {
  requiredRoles?: RequiredRole[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
  const { role, loading } = useUserRole();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  if (!role || (requiredRoles && !requiredRoles.includes(role))) {
    // User is not authenticated or does not have the required role
    // Redirect to login page or a forbidden page
    return <Navigate to="/admin/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
