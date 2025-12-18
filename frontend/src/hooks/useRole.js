import { useAuth } from './useAuth';

export const useRole = (allowedRoles = []) => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.some((role) => hasRole(role));
  };

  const isAllowed = allowedRoles.length === 0 || hasAnyRole(allowedRoles);

  return {
    hasRole,
    hasAnyRole,
    isAllowed,
    currentRole: user?.role,
  };
};
