import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Interface for the service object
interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  page_content: string;
  order_index: number;
}

// Zod schema for form validation
const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Summary description is required'),
  image_url: z.string().url('Must be a valid URL'),
  page_content: z.string().min(1, 'Page content is required'),
  order_index: z.coerce.number(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

// Slug generation utility
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

const ServiceCrud = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Fetch services using React Query
  const { data: services, isLoading, error } = useQuery<Service[]>(
    { queryKey: ['services'], queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('order_index');
      if (error) throw new Error(error.message);
      return data || [];
    }}
  );

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      image_url: '',
      page_content: '',
      order_index: 0,
    },
  });

  // Effect to reset form when editing state changes
  useEffect(() => {
    if (editingService) {
      form.reset(editingService);
    } else {
      form.reset({
        title: '',
        slug: '',
        description: '',
        image_url: '',
        page_content: '',
        order_index: services ? services.length : 0,
      });
    }
  }, [editingService, services, form]);

  // Mutation for creating a service
  const createMutation = useMutation({
    mutationFn: async (newItem: ServiceFormValues) => {
      const { error } = await supabase.from('services').insert(newItem);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: 'Success', description: 'Service created.' });
      setEditingService(null);
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Mutation for updating a service
  const updateMutation = useMutation({
    mutationFn: async (updatedItem: ServiceFormValues) => {
      if (!editingService) return;
      const { error } = await supabase.from('services').update(updatedItem).eq('id', editingService.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: 'Success', description: 'Service updated.' });
      setEditingService(null);
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Mutation for deleting a service
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: 'Success', description: 'Service deleted.' });
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // CORRECTED: Mutation for reordering services
  const reorderMutation = useMutation({
    mutationFn: async (updatedServices: Service[]) => { // Expects full service objects
      const { error } = await supabase.from('services').upsert(updatedServices);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: 'Success', description: 'Service order updated.' });
    },
    onError: (err) => {
      toast({ title: 'Error', description: `Failed to update order: ${err.message}`, variant: 'destructive' });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    form.setValue('title', title);
    form.setValue('slug', slug);
  };

  // CORRECTED: Handler for moving items
  const handleMove = (currentIndex: number, direction: 'up' | 'down') => {
    if (!services) return;

    const newServices = [...services];
    const itemToMove = newServices[currentIndex];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= newServices.length) return;

    const itemToSwapWith = newServices[swapIndex];

    // Swap order_index values
    const tempOrder = itemToMove.order_index;
    itemToMove.order_index = itemToSwapWith.order_index;
    itemToSwapWith.order_index = tempOrder;

    // The payload now contains the FULL objects for the two affected rows
    const updatePayload = [itemToMove, itemToSwapWith];

    reorderMutation.mutate(updatePayload);
  };

  const onSubmit = (values: ServiceFormValues) => {
    if (editingService) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">

      <h3 className="text-xl font-bold mt-8 mb-4">Existing Services</h3>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((service, index) => (
              <TableRow key={service.id}>
                <TableCell>{service.order_index}</TableCell>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell>{service.slug}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="outline" size="icon" onClick={() => handleMove(index, 'up')} disabled={index === 0 || reorderMutation.isPending}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleMove(index, 'down')} disabled={index === services.length - 1 || reorderMutation.isPending}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingService(service)} className="ml-2">Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(service.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      <h2 className="text-2xl font-bold mb-4">{editingService ? 'Edit Service' : 'Create New Service'}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8 p-4 border rounded-lg">
          <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} onChange={handleTitleChange} placeholder="e.g., Web Development" /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} placeholder="e.g., web-development" /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="image_url" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} placeholder="https://example.com/image.png" /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Card Description (Summary)</FormLabel><FormControl><Textarea {...field} placeholder="A short summary for the service card." /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="page_content" render={({ field }) => (<FormItem><FormLabel>Full Page Content</FormLabel><FormControl><RichTextEditor description={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="order_index" render={({ field }) => (<FormItem><FormLabel>Order Index</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || reorderMutation.isPending}>
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
            {editingService && (
              <Button type="button" variant="outline" onClick={() => setEditingService(null)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>

      
    </div>
  );
};

export default ServiceCrud;