/**
 * Admin Contact Messages Page
 * View and manage contact form submissions
 */

import { useState } from 'react';
import { Mail, Trash2, Eye, MessageSquare } from 'lucide-react';
import {
  useContacts,
  useUpdateContactStatus,
  useDeleteContact,
} from '../../hooks/contact/useContact';
import { PageHeader, DataTable, StatusBadge, ConfirmModal } from '../../components/admin/shared';
import { toast } from 'react-toastify';

export default function ContactMessages() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch contacts
  const { data: contactsData, isLoading } = useContacts({ status: statusFilter });
  const contacts = contactsData?.data || [];

  // Mutations
  const updateStatus = useUpdateContactStatus();
  const deleteContact = useDeleteContact();

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'From',
      render: (_, row) => (
        <div>
          <p className="font-medium text-dark">{row.name}</p>
          <p className="text-xs text-dark/50">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value) => (
        <span className="text-sm text-dark/70 line-clamp-1">
          {value}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (value) => (
        <span className="text-sm text-dark/60 line-clamp-2">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusMap = {
          new: { label: 'New', variant: 'info' },
          read: { label: 'Read', variant: 'warning' },
          replied: { label: 'Replied', variant: 'success' },
          archived: { label: 'Archived', variant: 'default' },
        };
        const config = statusMap[value] || statusMap.new;
        return <StatusBadge status={config.variant} label={config.label} />;
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <span className="text-sm text-dark/60">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleMarkAsRead(row)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Mark as Read"
          >
            <Eye size={16} className="text-blue-500" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  const handleMarkAsRead = async (contact) => {
    if (contact.status === 'new') {
      try {
        await updateStatus.mutateAsync({ id: contact._id, status: 'read' });
        toast.success('Marked as read');
      } catch (error) {
        toast.error('Failed to update status');
      }
    }
  };

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteContact.mutateAsync(selectedContact._id);
      toast.success('Contact message deleted successfully');
      setDeleteModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete contact message');
    }
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border border-dark/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">All Status</option>
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="replied">Replied</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        subtitle="View and manage customer inquiries"
        actions={headerActions}
      />

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={contacts}
          loading={isLoading}
          emptyMessage="No contact messages found"
          emptyIcon={<Mail size={48} className="text-dark/20" />}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Contact Message"
        message={`Are you sure you want to delete this message from "${selectedContact?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteContact.isPending}
      />
    </div>
  );
}
