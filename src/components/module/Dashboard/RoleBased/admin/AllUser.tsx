"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, UserCog, Search, X } from "lucide-react";
import { getAllUser, updateUserStatus } from "@/services/Auth";

// Define user type based on the data structure
type User = {
  id: string;
  email: string;
  role: string;
  status: string;
  needPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
  admin?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
    profilePhoto?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  doctor?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
    profilePhoto?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  patient?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
    profilePhoto?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

const AllUser = ({ initialUsers = [] }: { initialUsers?: User[] }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  // Fetch users if not provided as props
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUser();
        setUsers(data);
        setFilteredUsers(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        setIsLoading(false);
      }
    };

    if (initialUsers.length === 0) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [initialUsers]);

  // Apply filters when search term or filters change
  useEffect(() => {
    let result = users;

    // Apply search filter with improved logic
    if (searchTerm) {
      result = result.filter((user) => {
        const searchLower = searchTerm.trim().toLowerCase();

        // Get all possible text fields to search
        const searchableFields = [
          user.email,
          getUserName(user),
          user.admin?.email,
          user.doctor?.email,
          user.patient?.email,
          user.admin?.contactNumber,
          user.doctor?.contactNumber,
          user.patient?.contactNumber,
        ].filter(Boolean); // Remove null/undefined values

        return searchableFields.some((field) =>
          field?.toString().toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply role filter
    if (roleFilter !== "ALL") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Helper function to get user name from any role
  const getUserName = (user: User): string => {
    if (user.admin) return user.admin.name;
    if (user.doctor) return user.doctor.name;
    if (user.patient) return user.patient.name;
    return "Unknown";
  };

  // Helper function to get user profile photo from any role
  const getUserPhoto = (user: User): string | undefined => {
    if (user.admin) return user.admin.profilePhoto;
    if (user.doctor) return user.doctor.profilePhoto;
    if (user.patient) return user.patient.profilePhoto;
    return undefined;
  };

  // Helper function to get primary email
  const getPrimaryEmail = (user: User): string => {
    if (user.email) return user.email;
    if (user.admin?.email) return user.admin.email;
    if (user.doctor?.email) return user.doctor.email;
    if (user.patient?.email) return user.patient.email;
    return "No email";
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedUser || !newStatus) return;

    try {
      await updateUserStatus(selectedUser.id, newStatus);

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, status: newStatus } : user
        )
      );

      toast.success("User status updated successfully");
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "BLOCKED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      case "DOCTOR":
        return "bg-green-100 text-green-800";
      case "PATIENT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by email, name, or contact number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="PATIENT">Patient</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {(searchTerm || roleFilter !== "ALL" || statusFilter !== "ALL") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="sm:w-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={getUserPhoto(user) || ""}
                            alt={getUserName(user)}
                          />
                          <AvatarFallback className="bg-green-100 text-green-800">
                            {getUserName(user).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getUserName(user)}</div>
                          <div className="text-sm text-gray-500 md:hidden">
                            {getPrimaryEmail(user)}
                          </div>
                          <div className="sm:hidden">
                            <Badge
                              className={`${getRoleColor(user.role)} mt-1`}
                            >
                              {user.role}
                            </Badge>
                            <Badge
                              className={`${getStatusColor(
                                user.status
                              )} ml-1 mt-1`}
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getPrimaryEmail(user)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setNewStatus(user.status);
                              setIsStatusDialogOpen(true);
                            }}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update User Status</DialogTitle>
              <DialogDescription>
                Change the status for user{" "}
                {selectedUser?.email ||
                  getPrimaryEmail(selectedUser || ({} as User))}
              </DialogDescription>
            </DialogHeader>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="DELETED">DELETED</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>Update Status</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AllUser;
