import { useQuery } from '@tanstack/react-query';
import { fetchCustomers } from '../../services/admin/userService';

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['admin-customers', params],
    queryFn: () => fetchCustomers(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
