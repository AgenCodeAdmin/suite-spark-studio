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

const logoSchema = z.object({
  image_url: z.string().url({ message: "Invalid URL format" }),
  alt_text: z.string().min(1, { message: "Alt text is required" }),
});

type Logo = z.infer<typeof logoSchema> & { id: number; order_index: number; };

const LogoCarouselCrud: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
  const { toast } = useToast();

  const form = useForm<Logo>({
    resolver: zodResolver(logoSchema),
    defaultValues: {
      image_url: '',
      alt_text: '',
    },
  });

  const fetchLogos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('logo_carousel').select('*').order('order_index', { ascending: true });
    if (error) {
      toast({
        title: 'Error fetching logos',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setLogos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const saveOrder = async (updatedLogos: Logo[]) => {
    const updates = updatedLogos.map((logo, index) => ({
      id: logo.id,
      image_url: logo.image_url, // Include existing image_url
      alt_text: logo.alt_text,   // Include existing alt_text
      order_index: index, // Assign new order based on array index
    }));

    const { error } = await supabase
      .from('logo_carousel')
      .upsert(updates, { onConflict: 'id' }); // Upsert to update existing rows

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
        description: 'The logo order has been updated.',
      });
      return true;
    }
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = logos.findIndex(logo => logo.id === id);
    if (currentIndex === -1) return;

    const newLogos = [...logos];
    const logoToMove = newLogos[currentIndex];

    if (direction === 'up' && currentIndex > 0) {
      const prevLogo = newLogos[currentIndex - 1];
      newLogos[currentIndex] = { ...prevLogo, order_index: logoToMove.order_index };
      newLogos[currentIndex - 1] = { ...logoToMove, order_index: prevLogo.order_index };
    } else if (direction === 'down' && currentIndex < newLogos.length - 1) {
      const nextLogo = newLogos[currentIndex + 1];
      newLogos[currentIndex] = { ...nextLogo, order_index: logoToMove.order_index };
      newLogos[currentIndex + 1] = { ...logoToMove, order_index: nextLogo.order_index };
    } else {
      return; // Cannot move further
    }

    // Sort by the new order_index values to reflect the visual change
    newLogos.sort((a, b) => a.order_index - b.order_index);
    setLogos(newLogos);

    // Persist changes to database
    await saveOrder(newLogos);
  };

  const onSubmit = async (values: Logo) => {
    if (editingLogo) {
      // Update existing logo
      const { data, error } = await supabase
        .from('logo_carousel')
        .update({ image_url: values.image_url, alt_text: values.alt_text }) // Only update image_url and alt_text
        .eq('id', editingLogo.id)
        .select();

      if (error) {
        toast({
          title: 'Error updating logo',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Logo updated successfully',
          description: 'The logo has been updated.',
        });
        setIsDialogOpen(false);
        setEditingLogo(null);
        fetchLogos();
      }
    } else {
      // Add new logo
      const newOrderIndex = logos.length > 0 ? Math.max(...logos.map(l => l.order_index)) + 1 : 0;
      const { data, error } = await supabase
        .from('logo_carousel')
        .insert({ ...values, order_index: newOrderIndex }) // Include order_index
        .select();

      if (error) {
        toast({
          title: 'Error adding logo',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Logo added successfully',
          description: 'A new logo has been added.',
        });
        setIsDialogOpen(false);
        form.reset();
        fetchLogos();
      }
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('logo_carousel').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error deleting logo',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Logo deleted successfully',
        description: 'The logo has been removed.',
      });
      fetchLogos();
    }
  };

  const openEditDialog = (logo: Logo) => {
    setEditingLogo(logo);
    form.reset(logo); // Populate form with existing data
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingLogo(null);
    form.reset(); // Clear form on close
  };

  if (loading) {
    return <div>Loading logos...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Logo Carousel</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { // If dialog is closing
            setEditingLogo(null);
            form.reset();
          } else { // If dialog is opening
            setEditingLogo(null); // Ensure no editing state
            form.reset(); // Clear form
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add New Logo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLogo ? 'Edit Logo' : 'Add New Logo'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alt_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Logo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{editingLogo ? 'Update Logo' : 'Add Logo'}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableCell>ID</TableCell> */}
            <TableCell>Order</TableCell> {/* New column for order */}
            <TableCell>Image</TableCell>
            <TableCell>Alt Text</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logos.map((logo, index) => (
            <TableRow key={logo.id}>
              {/* <TableCell>{logo.id}</TableCell> */}
              <TableCell>{logo.order_index}</TableCell> {/* Display order_index */}
              <TableCell>
                <img src={logo.image_url} alt={logo.alt_text} className="h-12 w-auto object-contain" />
              </TableCell>
              <TableCell>{logo.alt_text}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(logo.id, 'up')}
                  disabled={index === 0} // Disable if first item
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(logo.id, 'down')}
                  disabled={index === logos.length - 1} // Disable if last item
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(logo)}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the logo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(logo.id)}>Delete</AlertDialogAction>
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

export default LogoCarouselCrud;