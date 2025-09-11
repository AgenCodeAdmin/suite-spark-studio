import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

interface AccordionItem {
  id: string;
  heading: string;
  description: string;
  image_url: string;
  order_index: number;
}

const formSchema = z.object({
  heading: z.string().min(1, { message: 'Heading is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  image_url: z.string().url({ message: 'Must be a valid URL.' }),
  order_index: z.number().int().min(0, { message: 'Order index must be a non-negative integer.' }),
});

type AccordionFormValues = z.infer<typeof formSchema>;

const AccordionCrud = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<AccordionItem | null>(null);

  const { data: accordionItems, isLoading, error } = useQuery<AccordionItem[]>(
    { queryKey: ['accordionContent'], queryFn: async () => {
      const { data, error } = await supabase.from('accordion_content').select('*').order('order_index');
      if (error) throw new Error(error.message);
      return data || [];
    }}
  );

  const form = useForm<AccordionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heading: '',
      description: '',
      image_url: '',
      order_index: 0,
    },
  });

  useEffect(() => {
    if (editingItem) {
      form.reset({
        heading: editingItem.heading,
        description: editingItem.description,
        image_url: editingItem.image_url,
        order_index: editingItem.order_index,
      });
    } else {
      form.reset({
        heading: '',
        description: '',
        image_url: '',
        order_index: accordionItems ? accordionItems.length : 0,
      });
    }
  }, [editingItem, accordionItems, form]);

  const createMutation = useMutation({
    mutationFn: async (newItem: AccordionFormValues) => {
      const { data, error } = await supabase.from('accordion_content').insert(newItem).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accordionContent'] });
      toast({ title: 'Success', description: 'Accordion item created.' });
      form.reset();
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedItem: AccordionItem) => {
      const { data, error } = await supabase.from('accordion_content').update(updatedItem).eq('id', updatedItem.id).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accordionContent'] });
      toast({ title: 'Success', description: 'Accordion item updated.' });
      setEditingItem(null);
      form.reset();
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('accordion_content').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accordionContent'] });
      toast({ title: 'Success', description: 'Accordion item deleted.' });
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const onSubmit = (values: AccordionFormValues) => {
    if (editingItem) {
      updateMutation.mutate({ ...editingItem, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">

      <h2 className="text-2xl font-bold mb-4">Existing Accordion Content</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Heading</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accordionItems?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.heading}</TableCell>
              <TableCell>{item.description.substring(0, 50)}...</TableCell>
              <TableCell><img src={item.image_url} alt="" className="w-16 h-16 object-cover" loading="lazy" decoding="async" /></TableCell>
              <TableCell>{item.order_index}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(item.id)} className="ml-2">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      <h2 className="text-2xl font-bold mb-4">Manage Accordion Content</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    description={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Index</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
          {editingItem && (
            <Button type="button" variant="outline" onClick={() => setEditingItem(null)} className="ml-2">
              Cancel
            </Button>
          )}
        </form>
      </Form>

      
    </div>
  );
};

export default AccordionCrud;
