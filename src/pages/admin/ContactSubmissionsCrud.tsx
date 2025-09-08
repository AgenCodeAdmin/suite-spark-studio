import React, { useEffect, useState, useMemo } from 'react';
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
import { format, isWithinInterval } from 'date-fns';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { DateRangePicker } from '../../components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { SubmissionPreviewDialog } from './SubmissionPreviewDialog';
import { ArrowUpDown } from 'lucide-react';

export interface ContactSubmission {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  business_name: string;
  message: string | null;
  admin_notes: string | null;
  checked: boolean;
  status: string | null;
  services_of_interest: string[] | null;
  follow_up_date: string | null;
  assigned_to_emails: string[] | null;
}

type SortableKeys = 'checked' | 'created_at';

const ContactSubmissionsCrud: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesState, setNotesState] = useState<{ [id: number]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' }>({ key: 'created_at', direction: 'descending' });
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false }); // Initial fetch is always descending

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
  }, []); // Fetch only once on mount

  useEffect(() => {
    const initialNotes: { [id: number]: string } = {};
    submissions.forEach(sub => {
      initialNotes[sub.id] = sub.admin_notes || '';
    });
    setNotesState(initialNotes);
  }, [submissions]);

  const handleNoteChange = (id: number, value: string) => {
    setNotesState(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveNotes = async (id: number) => {
    const newNotes = notesState[id];
    const { error } = await supabase
      .from('contact_submissions')
      .update({ admin_notes: newNotes })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error saving notes', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Notes saved successfully', description: 'Admin notes have been updated.' });
    }
  };

  const handleCheckedChange = async (id: number, isChecked: boolean) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ checked: isChecked })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
    } else {
      setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, checked: isChecked } : sub));
      toast({ title: 'Status updated' });
    }
  };

  const handleUpdateSubmission = (updatedSubmission: ContactSubmission) => {
    setSubmissions(prev => prev.map(sub => sub.id === updatedSubmission.id ? updatedSubmission : sub));
  };

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const processedSubmissions = useMemo(() => {
    let processableItems = [...submissions];

    // Filtering logic
    processableItems = processableItems
      .filter(submission => {
        if (!dateRange?.from) return true;
        const submissionDate = new Date(submission.created_at);
        const to = dateRange.to ? new Date(dateRange.to) : new Date();
        to.setHours(23, 59, 59, 999);
        return isWithinInterval(submissionDate, { start: dateRange.from, end: to });
      })
      .filter(submission => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const checkField = (field: string | null | undefined) => field ? field.toLowerCase().includes(searchLower) : false;
        const checkArrayField = (field: string[] | null | undefined) => field ? field.some(item => item.toLowerCase().includes(searchLower)) : false;

        return (
          checkField(String(submission.id)) ||
          checkField(format(new Date(submission.created_at), 'PPP p')) ||
          checkField(submission.full_name) ||
          checkField(submission.email) ||
          checkField(submission.phone_number) ||
          checkField(submission.business_name) ||
          checkField(submission.message) ||
          checkField(submission.admin_notes) ||
          checkField(submission.status) ||
          checkArrayField(submission.services_of_interest) ||
          (submission.follow_up_date && checkField(format(new Date(submission.follow_up_date), 'PPP')))
        );
      });

    // Sorting logic
    if (sortConfig.key) {
      processableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processableItems;
  }, [submissions, searchTerm, dateRange, sortConfig]);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Contact Submissions</h2>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="w-12">
                <Button variant="ghost" onClick={() => requestSort('checked')}>
                    Checked
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell>
              <Button variant="ghost" onClick={() => requestSort('created_at')}>
                Submitted At
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Business Name</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Admin Notes</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <Checkbox
                  checked={submission.checked}
                  onCheckedChange={(isChecked) => handleCheckedChange(submission.id, !!isChecked)}
                />
              </TableCell>
              <TableCell>{submission.id}</TableCell>
              <TableCell>{format(new Date(submission.created_at), 'PPP p')}</TableCell>
              <TableCell>{submission.full_name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.phone_number}</TableCell>
              <TableCell>{submission.business_name}</TableCell>
              <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {submission.message}
              </TableCell>
              <TableCell className="w-64">
                <Textarea
                  value={notesState[submission.id] || ''}
                  onChange={(e) => handleNoteChange(submission.id, e.target.value)}
                  className="min-h-[60px]"
                />
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>View</Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveNotes(submission.id)}
                  className="ml-2"
                >
                  Save Notes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SubmissionPreviewDialog
        submission={selectedSubmission}
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onUpdate={handleUpdateSubmission}
      />
    </div>
  );
};

export default ContactSubmissionsCrud;
