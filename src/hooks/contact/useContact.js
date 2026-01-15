/**
 * useContact Hook
 * React Query hooks for contact functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contactService from '../../services/contactService';

// Query keys
export const contactKeys = {
  all: ['contacts'],
  lists: () => [...contactKeys.all, 'list'],
  list: (filters) => [...contactKeys.lists(), filters],
  details: () => [...contactKeys.all, 'detail'],
  detail: (id) => [...contactKeys.details(), id],
};

/**
 * Hook to submit contact form
 */
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: contactService.submitContactForm,
  });
};

/**
 * Hook to fetch all contacts (admin)
 */
export const useContacts = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: contactKeys.list(filters),
    queryFn: () => contactService.fetchAllContacts(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch single contact (admin)
 */
export const useContactById = (id, options = {}) => {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactService.fetchContactById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

/**
 * Hook to update contact status (admin)
 */
export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => contactService.updateContactStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
};

/**
 * Hook to reply to contact (admin)
 */
export const useReplyToContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }) => contactService.replyToContact(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
};

/**
 * Hook to delete contact (admin)
 */
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactService.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
};
