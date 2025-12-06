import { Navigate } from 'react-router-dom';
import { usePhysio } from '@/context/PhysioContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserType: 'doctor' | 'patient';
}

export const ProtectedRoute = ({ children, allowedUserType }: ProtectedRouteProps) => {
  const { isAuthenticated, userType, loading } = usePhysio();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not authenticated, redirect to landing page
    return <Navigate to="/" replace />;
  }

  if (userType !== allowedUserType) {
    // Authenticated but wrong user type, redirect to appropriate dashboard
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }

  // Authenticated and correct user type
  return <>{children}</>;
};

