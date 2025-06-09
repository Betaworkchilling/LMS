import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { FileText, LogOut } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface LeaveApplication {
  id: number;
  username: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);

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

  const handleApprove = async (id: number) => {
    try {
      await fetchWithAuth(`/api/leave/${id}/approve/`, { method: 'POST' });
      toast({
        title: 'Success',
        description: 'Leave application approved',
      });
      fetchLeaveApplications();
    } catch (error) {
      console.error('Error approving leave:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve leave application',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetchWithAuth(`/api/leave/${id}/reject/`, { method: 'POST' });
      toast({
        title: 'Success',
        description: 'Leave application rejected',
      });
      fetchLeaveApplications();
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject leave application',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const sidebarItems = [
    { title: 'All Applications', icon: FileText, href: '#applications' },
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
              <CardTitle>Leave Applications</CardTitle>
              <CardDescription>
                Review and manage employee leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>{application.username}</TableCell>
                      <TableCell>{application.leave_type}</TableCell>
                      <TableCell>{application.start_date}</TableCell>
                      <TableCell>{application.end_date}</TableCell>
                      <TableCell>{application.reason}</TableCell>
                      <TableCell>
                        <Badge variant={application.status === 'approved' ? 'success' : application.status === 'rejected' ? 'destructive' : 'default'}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(application.id)}
                            disabled={application.status !== 'pending'}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(application.id)}
                            disabled={application.status !== 'pending'}
                          >
                            Reject
                          </Button>
                        </div>
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

export default AdminDashboard;
