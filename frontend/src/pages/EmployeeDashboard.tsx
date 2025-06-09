import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Calendar, FileText, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchWithAuth } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface LeaveApplication {
  id: number;
  username: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const fetchLeaveApplications = async () => {
    try {
      const data = await fetchWithAuth('/api/leave/');
      setLeaveApplications(data);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leave applications',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth('/api/leave/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      toast({
        title: 'Success',
        description: 'Leave application submitted successfully',
      });
      setFormData({ leave_type: '', start_date: '', end_date: '', reason: '' });
      fetchLeaveApplications();
    } catch (error) {
      console.error('Error submitting leave application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit leave application',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const sidebarItems = [
    { title: 'Apply Leave', icon: Calendar, href: '#apply' },
    { title: 'My Applications', icon: FileText, href: '#applications' },
    { title: 'Logout', icon: LogOut, href: '#logout', onClick: handleLogout },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton onClick={item.onClick}>
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-8">
          <Card>
            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
              <CardDescription>
                Submit a new leave application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leave_type">Leave Type</Label>
                  <Input
                    id="leave_type"
                    value={formData.leave_type}
                    onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Submit Application</Button>
              </form>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>My Leave Applications</CardTitle>
              <CardDescription>
                View the status of your leave applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>{application.leave_type}</TableCell>
                      <TableCell>{application.start_date}</TableCell>
                      <TableCell>{application.end_date}</TableCell>
                      <TableCell>{application.reason}</TableCell>
                      <TableCell>
                        <Badge variant={
                          application.status === 'approved'
                            ? 'secondary'
                            : application.status === 'rejected'
                            ? 'destructive'
                            : 'default'
                        }>
                          {application.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDashboard;
