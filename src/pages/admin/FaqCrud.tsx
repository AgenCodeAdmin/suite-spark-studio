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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { ArrowUp, ArrowDown } from 'lucide-react'; // Import icons

const faqSchema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  answer: z.string().min(1, { message: "Answer is required" }),
});

type Faq = z.infer<typeof faqSchema> & { id: number; order_index: number; };

const FaqCrud: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const { toast } = useToast();

  const form = useForm<Faq>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
    if (error) {
      toast({
        title: 'Error fetching FAQs',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setFaqs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const saveOrder = async (updatedFaqs: Faq[]) => {
    const updates = updatedFaqs.map((faq, index) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      order_index: index, // Assign new order based on array index
    }));

    const { error } = await supabase
      .from('faqs')
      .upsert(updates, { onConflict: 'id' });

    if (error) {
      toast({
        title: 'Error saving order',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } else {
      toast({
        title: 'Order saved successfully',
        description: 'The FAQ order has been updated.',
      });
      return true;
    }
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(faq => faq.id === id);
    if (currentIndex === -1) return;

    const newFaqs = [...faqs];
    const faqToMove = newFaqs[currentIndex];

    if (direction === 'up' && currentIndex > 0) {
      const prevFaq = newFaqs[currentIndex - 1];
      newFaqs[currentIndex] = { ...prevFaq, order_index: faqToMove.order_index };
      newFaqs[currentIndex - 1] = { ...faqToMove, order_index: prevFaq.order_index };
    } else if (direction === 'down' && currentIndex < newFaqs.length - 1) {
      const nextFaq = newFaqs[currentIndex + 1];
      newFaqs[currentIndex] = { ...nextFaq, order_index: faqToMove.order_index };
      newFaqs[currentIndex + 1] = { ...faqToMove, order_index: nextFaq.order_index };
    } else {
      return; // Cannot move further
    }

    newFaqs.sort((a, b) => a.order_index - b.order_index);
    setFaqs(newFaqs);

    await saveOrder(newFaqs);
  };

  const onSubmit = async (values: Faq) => {
    if (editingFaq) {
      const { data, error } = await supabase
        .from('faqs')
        .update({ question: values.question, answer: values.answer })
        .eq('id', editingFaq.id)
        .select();

      if (error) {
        toast({
          title: 'Error updating FAQ',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'FAQ updated successfully',
          description: 'The FAQ has been updated.',
        });
        setIsDialogOpen(false);
        setEditingFaq(null);
        fetchFaqs();
      }
    } else {
      const newOrderIndex = faqs.length > 0 ? Math.max(...faqs.map(faq => faq.order_index)) + 1 : 0;
      const { data, error } = await supabase
        .from('faqs')
        .insert({ ...values, order_index: newOrderIndex })
        .select();

      if (error) {
        toast({
          title: 'Error adding FAQ',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'FAQ added successfully',
          description: 'A new FAQ has been added.',
        });
        setIsDialogOpen(false);
        form.reset();
        fetchFaqs();
      }
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error deleting FAQ',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'FAQ deleted successfully',
        description: 'The FAQ has been removed.',
      });
      fetchFaqs();
    }
  };

  const openEditDialog = (faq: Faq) => {
    setEditingFaq(faq);
    form.reset(faq);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading FAQs...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage FAQs</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingFaq(null);
            form.reset();
          } else {
            setEditingFaq(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add New FAQ</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input placeholder="What is your digital marketing process?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Our process involves several stages..." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{editingFaq ? 'Update FAQ' : 'Add FAQ'}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Question</TableCell>
            <TableCell>Answer</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq, index) => (
            <TableRow key={faq.id}>
              <TableCell>{faq.id}</TableCell>
              <TableCell>{faq.order_index}</TableCell>
              <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{faq.question}</TableCell>
              <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{faq.answer}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(faq.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(faq.id, 'down')}
                  disabled={index === faqs.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(faq)}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the FAQ.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(faq.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FaqCrud;
