import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';

interface LeaveType {
  id: number;
  name: string;
  description: string;
  maxDays: number;
}

const LeaveTypesManagement = () => {
  const { toast } = useToast();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxDays: ''
  });

  const fetchLeaveTypes = async () => {
    try {
      const data = await fetchWithAuth('/api/leave-types/');
      setLeaveTypes(data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leave types',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.maxDays) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        max_days: parseInt(formData.maxDays)
      };

      if (editingLeaveType) {
        await fetchWithAuth(`/api/leave-types/${editingLeaveType.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast({
          title: "Success",
          description: "Leave type updated successfully",
        });
      } else {
        await fetchWithAuth('/api/leave-types/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast({
          title: "Success",
          description: "Leave type added successfully",
        });
      }

      fetchLeaveTypes();
      resetForm();
    } catch (error) {
      console.error('Error saving leave type:', error);
      toast({
        title: 'Error',
        description: 'Failed to save leave type',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchWithAuth(`/api/leave-types/${id}/`, {
        method: 'DELETE',
      });
      toast({
        title: "Success",
        description: "Leave type deleted successfully",
      });
      fetchLeaveTypes();
    } catch (error) {
      console.error('Error deleting leave type:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete leave type',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', maxDays: '' });
    setEditingLeaveType(null);
    setIsAddModalOpen(false);
  };

  const handleEdit = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType);
    setFormData({
      name: leaveType.name,
      description: leaveType.description,
      maxDays: leaveType.maxDays.toString()
    });
    setIsAddModalOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leave Types Management</CardTitle>
            <CardDescription>
              Manage different types of leave available to employees
            </CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Leave Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLeaveType ? 'Edit Leave Type' : 'Add New Leave Type'}
                </DialogTitle>
                <DialogDescription>
                  {editingLeaveType 
                    ? 'Update the leave type details below.'
                    : 'Enter the details for the new leave type.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Casual, Sick, etc."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the leave type"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDays">Maximum Days</Label>
                    <Input
                      id="maxDays"
                      type="number"
                      placeholder="e.g. 12"
                      value={formData.maxDays}
                      onChange={(e) => setFormData({ ...formData, maxDays: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLeaveType ? 'Update' : 'Add'} Leave Type
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Max Days</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveTypes.map((leaveType) => (
              <TableRow key={leaveType.id}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{leaveType.name}</Badge>
                </TableCell>
                <TableCell>{leaveType.description}</TableCell>
                <TableCell>{leaveType.maxDays} days</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(leaveType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Leave Type</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{leaveType.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(leaveType.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaveTypesManagement;
