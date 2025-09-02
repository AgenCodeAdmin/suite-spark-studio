import React, { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { format } from 'date-fns';

interface ContactSubmission {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  business_name: string;
  message: string | null; // New field
  admin_notes: string | null;
}

const ContactSubmissionsCrud: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesState, setNotesState] = useState<{ [id: number]: string }>({}); // New state to track notes changes
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({
        title: 'Error fetching submissions',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Initialize notesState when submissions are fetched
  useEffect(() => {
    const initialNotes: { [id: number]: string } = {};
    submissions.forEach(sub => {
      initialNotes[sub.id] = sub.admin_notes || '';
    });
    setNotesState(initialNotes);
  }, [submissions]); // Re-initialize if submissions change

  const handleNoteChange = (id: number, value: string) => {
    setNotesState(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveNotes = async (id: number) => { // No longer takes newNotes directly
    const newNotes = notesState[id]; // Get from local state
    const { error } = await supabase
      .from('contact_submissions')
      .update({ admin_notes: newNotes })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error saving notes',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Notes saved successfully',
        description: 'Admin notes have been updated.',
      });
      // Optimistically update UI or re-fetch
      // No need to setSubmissions here, as notesState is the source of truth for current edits
      // setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, admin_notes: newNotes } : sub));
    }
  };

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Contact Submissions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Submitted At</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Business Name</TableCell>
            <TableCell>Message</TableCell> {/* New column */}
            <TableCell>Admin Notes</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.id}</TableCell>
              <TableCell>{format(new Date(submission.created_at), 'PPP p')}</TableCell>
              <TableCell>{submission.full_name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.phone_number}</TableCell>
              <TableCell>{submission.business_name}</TableCell>
              <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {submission.message}
              </TableCell> {/* Display message */}
              <TableCell className="w-64">
                <Textarea
                  value={notesState[submission.id] || ''} // Controlled component
                  onChange={(e) => handleNoteChange(submission.id, e.target.value)}
                  className="min-h-[60px]"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveNotes(submission.id)} // Call with ID only
                >
                  Save Notes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactSubmissionsCrud;
