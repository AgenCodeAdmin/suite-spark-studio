'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ContactSubmission } from './ContactSubmissionsCrud';
import { DatePicker } from '@/components/ui/date-picker';
import { CreatableSelect } from '@/components/ui/creatable-select';

interface SubmissionPreviewDialogProps {
  submission: ContactSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedSubmission: ContactSubmission) => void;
}

// Define a type for only the fields that should be editable by an admin.
type EditableSubmissionData = Pick<
  ContactSubmission,
  'admin_notes' | 'checked' | 'status' | 'services_of_interest' | 'follow_up_date' | 'assigned_to_emails'
>;

export const SubmissionPreviewDialog: React.FC<SubmissionPreviewDialogProps> = ({ submission, isOpen, onClose, onUpdate }) => {
  const [editableData, setEditableData] = useState<Partial<EditableSubmissionData>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (submission) {
      setEditableData({
        admin_notes: submission.admin_notes,
        checked: submission.checked,
        status: submission.status,
        services_of_interest: submission.services_of_interest,
        follow_up_date: submission.follow_up_date,
        assigned_to_emails: submission.assigned_to_emails,
      });
    } else {
      setEditableData({});
    }
  }, [submission]);

  const handleSave = async () => {
    if (!submission) return;

    const { data, error } = await supabase
      .from('contact_submissions')
      .update(editableData)
      .eq('id', submission.id)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error updating submission', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Submission updated successfully' });
      onUpdate(data as ContactSubmission);
      onClose();
    }
  };

  const handleFieldChange = (field: keyof EditableSubmissionData, value: any) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  }

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>Viewing submission from {submission.full_name}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Responsive grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="md:text-right text-sm font-medium text-muted-foreground">Full Name</label>
            <div className="md:col-span-3 font-semibold">{submission.full_name}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="md:text-right text-sm font-medium text-muted-foreground">Email</label>
            <div className="md:col-span-3 font-semibold">{submission.email}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="md:text-right text-sm font-medium text-muted-foreground">Phone</label>
            <div className="md:col-span-3 font-semibold">{submission.phone_number}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label className="md:text-right text-sm font-medium text-muted-foreground">Business</label>
            <div className="md:col-span-3 font-semibold">{submission.business_name}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
            <label className="md:text-right text-sm font-medium text-muted-foreground pt-2">Message</label>
            <div className="md:col-span-3 text-sm p-2 bg-muted rounded-md min-h-[80px]">{submission.message}</div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
            <label htmlFor="admin_notes" className="md:text-right text-sm font-medium text-muted-foreground pt-2">Admin Notes</label>
            <Textarea id="admin_notes" value={editableData.admin_notes || ''} onChange={(e) => handleFieldChange('admin_notes', e.target.value)} className="md:col-span-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="md:text-right text-sm font-medium text-muted-foreground">Status</label>
            <CreatableSelect 
              tableName='submission_statuses'
              value={editableData.status || ''}
              onChange={(value) => handleFieldChange('status', value)}
              className="md:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label htmlFor="services_of_interest" className="md:text-right text-sm font-medium text-muted-foreground">Services</label>
            <CreatableSelect 
              tableName='submission_service_interests'
              isMulti
              value={editableData.services_of_interest || []}
              onChange={(value) => handleFieldChange('services_of_interest', value)}
              className="md:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label htmlFor="follow_up_date" className="md:text-right text-sm font-medium text-muted-foreground">Follow-up Date</label>
            <DatePicker date={editableData.follow_up_date ? new Date(editableData.follow_up_date) : undefined} onDateChange={(date) => handleFieldChange('follow_up_date', date)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label htmlFor="assigned_to_emails" className="md:text-right text-sm font-medium text-muted-foreground">Assigned To</label>
            <Input id="assigned_to_emails" placeholder="comma, separated, emails" value={(editableData.assigned_to_emails || []).join(', ')} onChange={(e) => handleFieldChange('assigned_to_emails', e.target.value.split(',').map(s => s.trim()))} className="md:col-span-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
            <label htmlFor="checked" className="md:text-right text-sm font-medium text-muted-foreground">Mark as Checked</label>
            <Checkbox id="checked" checked={editableData.checked} onCheckedChange={(checked) => handleFieldChange('checked', checked)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};