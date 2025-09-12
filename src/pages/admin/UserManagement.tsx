import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tables, Enums } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type UserRole = Enums<'user_roles'>;

const UserManagement = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('viewer');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      toast({
        title: 'Error fetching profiles',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setProfiles(data);
    }
    setLoading(false);
  };

  const handleInviteUser = async () => {
    if (!newEmail) {
      toast({
        title: 'Email is required',
        variant: 'destructive',
      });
      return;
    }

    // Supabase Auth admin.inviteUserByEmail does not directly set roles.
    // The role will be set in the profiles table after the user signs up.
    // For now, we'll just invite the user and they will get the default 'viewer' role.
    // An admin can then change their role from this UI.
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(newEmail);

    if (error) {
      toast({
        title: 'Error inviting user',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'User invited successfully',
        description: `An invitation email has been sent to ${newEmail}.`,
      });
      setNewEmail('');
      setIsInviteDialogOpen(false);
      fetchProfiles(); // Refresh the list to potentially see the new user once they sign up
    }
  };

  const handleRoleChange = async (profileId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profileId);

    if (error) {
      toast({
        title: 'Error updating role',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Role updated successfully',
        description: `User role updated to ${newRole}.`,
      });
      fetchProfiles();
    }
  };

  const handleDeleteUser = async (profileId: string) => {
    // First delete from auth.users, which will cascade delete from profiles due to FK constraint
    const { error: authError } = await supabase.auth.admin.deleteUser(profileId);

    if (authError) {
      toast({
        title: 'Error deleting user',
        description: authError.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'User deleted successfully',
        description: 'The user and their profile have been removed.',
      });
      fetchProfiles();
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="flex justify-end mb-4">
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>Invite New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Enter the email address of the user you want to invite. They will receive an email to set up their account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Initial Role
                </Label>
                <Select onValueChange={(value: UserRole) => setNewRole(value)} defaultValue={newRole}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleInviteUser}>Invite User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{profile.full_name || 'N/A'}</TableCell>
                <TableCell>
                  <Select
                    value={profile.role}
                    onValueChange={(value: UserRole) => handleRoleChange(profile.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteUser(profile.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
