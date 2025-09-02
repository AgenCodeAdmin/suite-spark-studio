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
import { Textarea } from '../../components/ui/textarea'; // Import Textarea for description
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

const progressStageSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type ProgressStage = z.infer<typeof progressStageSchema> & { id: number; order_index: number; };

const ProgressStagesCrud: React.FC = () => {
  const [progressStages, setProgressStages] = useState<ProgressStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<ProgressStage | null>(null);
  const { toast } = useToast();

  const form = useForm<ProgressStage>({
    resolver: zodResolver(progressStageSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const fetchProgressStages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('progress_stages').select('*').order('order_index', { ascending: true });
    if (error) {
      toast({
        title: 'Error fetching progress stages',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setProgressStages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProgressStages();
  }, []);

  const saveOrder = async (updatedStages: ProgressStage[]) => {
    const updates = updatedStages.map((stage, index) => ({
      id: stage.id,
      title: stage.title,
      description: stage.description,
      order_index: index, // Assign new order based on array index
    }));

    const { error } = await supabase
      .from('progress_stages')
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
        description: 'The progress stages order has been updated.',
      });
      return true;
    }
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = progressStages.findIndex(stage => stage.id === id);
    if (currentIndex === -1) return;

    const newStages = [...progressStages];
    const stageToMove = newStages[currentIndex];

    if (direction === 'up' && currentIndex > 0) {
      const prevStage = newStages[currentIndex - 1];
      newStages[currentIndex] = { ...prevStage, order_index: stageToMove.order_index };
      newStages[currentIndex - 1] = { ...stageToMove, order_index: prevStage.order_index };
    } else if (direction === 'down' && currentIndex < newStages.length - 1) {
      const nextStage = newStages[currentIndex + 1];
      newStages[currentIndex] = { ...nextStage, order_index: stageToMove.order_index };
      newStages[currentIndex + 1] = { ...stageToMove, order_index: nextStage.order_index };
    } else {
      return; // Cannot move further
    }

    newStages.sort((a, b) => a.order_index - b.order_index);
    setProgressStages(newStages);

    await saveOrder(newStages);
  };

  const onSubmit = async (values: ProgressStage) => {
    if (editingStage) {
      const { data, error } = await supabase
        .from('progress_stages')
        .update({ title: values.title, description: values.description })
        .eq('id', editingStage.id)
        .select();

      if (error) {
        toast({
          title: 'Error updating progress stage',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Progress stage updated successfully',
          description: 'The progress stage has been updated.',
        });
        setIsDialogOpen(false);
        setEditingStage(null);
        fetchProgressStages();
      }
    } else {
      const newOrderIndex = progressStages.length > 0 ? Math.max(...progressStages.map(stage => stage.order_index)) + 1 : 0;
      const { data, error } = await supabase
        .from('progress_stages')
        .insert({ ...values, order_index: newOrderIndex })
        .select();

      if (error) {
        toast({
          title: 'Error adding progress stage',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Progress stage added successfully',
          description: 'A new progress stage has been added.',
        });
        setIsDialogOpen(false);
        form.reset();
        fetchProgressStages();
      }
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('progress_stages').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error deleting progress stage',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Progress stage deleted successfully',
        description: 'The progress stage has been removed.',
      });
      fetchProgressStages();
    }
  };

  const openEditDialog = (stage: ProgressStage) => {
    setEditingStage(stage);
    form.reset(stage);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Loading progress stages...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Progress Stages</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingStage(null);
            form.reset();
          } else {
            setEditingStage(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button>Add New Stage</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStage ? 'Edit Stage' : 'Add New Stage'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Research" {...field} />
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
                      <FormLabel>Description (one item per line)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Stakeholder Interviews
Competitive Benchmarking" {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{editingStage ? 'Update Stage' : 'Add Stage'}</Button>
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
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {progressStages.map((stage, index) => (
            <TableRow key={stage.id}>
              <TableCell>{stage.id}</TableCell>
              <TableCell>{stage.order_index}</TableCell>
              <TableCell>{stage.title}</TableCell>
              <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{stage.description}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(stage.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(stage.id, 'down')}
                  disabled={index === progressStages.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(stage)}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the progress stage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(stage.id)}>Delete</AlertDialogAction>
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

export default ProgressStagesCrud;
