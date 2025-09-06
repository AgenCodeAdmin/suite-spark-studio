import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';

const ClientsCrud = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('order_index');
      if (error) throw error;
      if (data) setClients(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch clients.', variant: 'destructive' });
      console.error('Error fetching clients:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = () => {
    setClients([...clients, { name: '', logo_url: '', description: '', order_index: clients.length }]);
  };

  const updateClient = (index: number, field: string, value: string) => {
    const updated = [...clients];
    updated[index] = { ...updated[index], [field]: value };
    setClients(updated);
  };

  const removeClient = (index: number) => {
    setClients(clients.filter((_, i) => i !== index));
  };

  const saveClients = async () => {
    setLoading(true);
    try {
      // This is a destructive and full replacement strategy.
      const { error: deleteError } = await supabase.from('clients').delete().not('id', 'is', null);
      if (deleteError) throw deleteError;

      const clientsToSave = clients
        .filter(client => client.name?.trim() !== '' && client.logo_url?.trim() !== '')
        .map((client, index) => ({
            name: client.name,
            logo_url: client.logo_url,
            description: client.description || '',
            order_index: index
        }));

      if (clientsToSave.length > 0) {
        const { error: insertError } = await supabase.from('clients').insert(clientsToSave);
        if (insertError) throw insertError;
      }

      toast({ title: 'Success', description: 'Clients updated successfully' });
      fetchClients();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update clients', variant: 'destructive' });
      console.error('Error saving clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div></div>;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Clients Section</CardTitle>
        <CardDescription>Manage your client logos and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {clients.map((client, index) => (
          <div key={client.id || index} className="glass-card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Client {index + 1}</h4>
              <Button onClick={() => removeClient(index)} variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <Input placeholder="Client Name" value={client.name} onChange={(e) => updateClient(index, 'name', e.target.value)} className="glass-card" />
            <Input placeholder="Logo URL" value={client.logo_url} onChange={(e) => updateClient(index, 'logo_url', e.target.value)} className="glass-card" />
            <Textarea placeholder="Client Description" value={client.description} onChange={(e) => updateClient(index, 'description', e.target.value)} className="glass-card" />
          </div>
        ))}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button onClick={addClient} variant="outline" className="glass-card"><Plus className="w-4 h-4 mr-2" />Add Client</Button>
          <Button onClick={saveClients} disabled={loading} className="btn-primary-glass"><Save className="w-4 h-4 mr-2" />Save Clients</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsCrud;
