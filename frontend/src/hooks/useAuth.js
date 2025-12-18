import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, loading } = useSelector((state) => state.auth);

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isCustomer: user?.role === 'CUSTOMER',
    isWorker: user?.role === 'WORKER',
    isAdmin: user?.role === 'ADMIN',
  };
};
