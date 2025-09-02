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

const painPointSchema = z.object({
  icon: z.string().min(1, { message: "Icon name is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type PainPoint = z.infer<typeof painPointSchema> & { id: number; order_index: number; };

const PainPointsCrud: React.FC = () => {
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPainPoint, setEditingPainPoint] = useState<PainPoint | null>(null);
  const { toast } = useToast();

  const form = useForm<PainPoint>({
    resolver: zodResolver(painPointSchema),
    defaultValues: {
      icon: '',
      title: '',
      description: '',
    },
  });

  const fetchPainPoints = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pain_points').select('*').order('order_index', { ascending: true });
    if (error) {
      toast({
        title: 'Error fetching pain points',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setPainPoints(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPainPoints();
  }, []);

  const saveOrder = async (updatedPainPoints: PainPoint[]) => {
    const updates = updatedPainPoints.map((pp, index) => ({
      id: pp.id,
      icon: pp.icon,
      title: pp.title,
      description: pp.description,
      order_index: index, // Assign new order based on array index
    }));

    const { error } = await supabase
      .from('pain_points')
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
        description: 'The pain points order has been updated.',
      });
      return true;
    }
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = painPoints.findIndex(pp => pp.id === id);
    if (currentIndex === -1) return;

    const newPainPoints = [...painPoints];
    const painPointToMove = newPainPoints[currentIndex];

    if (direction === 'up' && currentIndex > 0) {
      const prevPainPoint = newPainPoints[currentIndex - 1];
      newPainPoints[currentIndex] = { ...prevPainPoint, order_index: painPointToMove.order_index };
      newPainPoints[currentIndex - 1] = { ...painPointToMove, order_index: prevPainPoint.order_index };
    } else if (direction === 'down' && currentIndex < newPainPoints.length - 1) {
      const nextPainPoint = newPainPoints[currentIndex + 1];
      newPainPoints[currentIndex] = { ...nextPainPoint, order_index: painPointToMove.order_index };
      newPainPoints[currentIndex + 1] = { ...painPointToMove, order_index: nextPainPoint.order_index };
    } else {
      return; // Cannot move further
    }

    newPainPoints.sort((a, b) => a.order_index - b.order_index);
    setPainPoints(newPainPoints);

    await saveOrder(newPainPoints);
  };

  const onSubmit = async (values: PainPoint) => {
    if (editingPainPoint) {
      const { data, error } = await supabase
        .from('pain_points')
        .update({ icon: values.icon, title: values.title, description: values.description })
        .eq('id', editingPainPoint.id)
        .select();

      if (error) {
        toast({
          title: 'Error updating pain point',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Pain point updated successfully',
          description: 'The pain point has been updated.',
        });
        setIsDialogOpen(false);
        setEditingPainPoint(null);
        fetchPainPoints();
      }
    } else {
      const newOrderIndex = painPoints.length > 0 ? Math.max(...painPoints.map(pp => pp.order_index)) + 1 : 0;
      const { data, error } = await supabase
        .from('pain_points')
        .insert({ ...values, order_index: newOrderIndex })
        .select();

      if (error) {
        toast({
          title: 'Error adding pain point',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Pain point added successfully',
          description: 'A new pain point has been added.',
        });
        setIsDialogOpen(false);
        form.reset();
        fetchPainPoints();
      }
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('pain_points').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error deleting pain point',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Pain point deleted successfully',
        description: 'The pain point has been removed.',
      });
      fetchPainPoints();
    }
  };

  const openEditDialog = (painPoint: PainPoint) => {
    setEditingPainPoint(painPoint);
    form.reset(painPoint);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading pain points...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Business Problems</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPainPoint(null);
            form.reset();
          } else {
            setEditingPainPoint(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add New Problem</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPainPoint ? 'Edit Problem' : 'Add New Problem'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Name (e.g., 'Briefcase')</FormLabel>
                      <FormControl>
                        <Input placeholder="Briefcase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Cash Flow Management" {...field} />
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
                        <Input placeholder="Struggling to maintain healthy cash flow?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{editingPainPoint ? 'Update Problem' : 'Add Problem'}</Button>
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
            <TableCell>Icon</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {painPoints.map((pp, index) => (
            <TableRow key={pp.id}>
              <TableCell>{pp.id}</TableCell>
              <TableCell>{pp.order_index}</TableCell>
              <TableCell>{pp.icon}</TableCell>
              <TableCell>{pp.title}</TableCell>
              <TableCell>{pp.description}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(pp.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(pp.id, 'down')}
                  disabled={index === painPoints.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(pp)}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the pain point.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(pp.id)}>Delete</AlertDialogAction>
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

export default PainPointsCrud;
