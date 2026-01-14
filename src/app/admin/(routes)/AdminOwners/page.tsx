"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  UserCog,
  Store,
  MoreVertical,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Owner {
  id: number;
  name: string;
  email: string;
  shopName: string;
  status: "pending" | "approved" | "disabled";
  permissions: {
    menuEditing: boolean;
    orderManagement: boolean;
    profileUpdates: boolean;
  };
}

const initialOwners: Owner[] = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", shopName: "Mama's Kitchen", status: "approved", permissions: { menuEditing: true, orderManagement: true, profileUpdates: true } },
  { id: 2, name: "Sunita Sharma", email: "sunita@example.com", shopName: "Desi Tadka", status: "pending", permissions: { menuEditing: false, orderManagement: false, profileUpdates: false } },
  { id: 3, name: "Amit Patel", email: "amit@example.com", shopName: "Fresh Bites", status: "approved", permissions: { menuEditing: true, orderManagement: true, profileUpdates: false } },
  { id: 4, name: "Meera Reddy", email: "meera@example.com", shopName: "Spice Junction", status: "disabled", permissions: { menuEditing: false, orderManagement: false, profileUpdates: false } },
  { id: 5, name: "Vikram Singh", email: "vikram@example.com", shopName: "Home Flavors", status: "approved", permissions: { menuEditing: true, orderManagement: false, profileUpdates: true } },
];

const AdminOwners = () => {
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);

  const filteredOwners = owners.filter((owner) => {
    const matchesSearch =
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || owner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (ownerId: number, newStatus: Owner["status"]) => {
    setOwners(owners.map((o) => (o.id === ownerId ? { ...o, status: newStatus } : o)));
    toast.success("Owner status updated successfully");
  };

  const handlePermissionChange = (owner: Owner) => {
    setOwners(owners.map((o) => (o.id === owner.id ? owner : o)));
    setEditingOwner(null);
    toast.success("Owner permissions updated successfully");
  };

  const getStatusBadge = (status: Owner["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>;
      case "disabled":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Disabled</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage Owners</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Owners</h1>
        <p className="text-muted-foreground">Administer shop owner accounts and permissions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search owners or shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Owners List */}
      <div className="grid gap-4">
        {filteredOwners.map((owner) => (
          <Card key={owner.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{owner.name}</h3>
                      {getStatusBadge(owner.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <Store className="w-3 h-3" /> {owner.shopName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {owner.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(owner.id, "approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingOwner(owner)}
                  >
                    <Settings className="w-4 h-4 mr-1" /> Permissions
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {owner.status !== "disabled" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(owner.id, "disabled")}
                          className="text-destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Disable Account
                        </DropdownMenuItem>
                      )}
                      {owner.status === "disabled" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(owner.id, "approved")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Enable Account
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Modal */}
      <Dialog open={!!editingOwner} onOpenChange={() => setEditingOwner(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Permissions - {editingOwner?.name}</DialogTitle>
          </DialogHeader>
          {editingOwner && (
            <PermissionsForm owner={editingOwner} onSave={handlePermissionChange} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PermissionsFormProps {
  owner: Owner;
  onSave: (owner: Owner) => void;
}

const PermissionsForm = ({ owner, onSave }: PermissionsFormProps) => {
  const [permissions, setPermissions] = useState(owner.permissions);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Checkbox
            id="menuEditing"
            checked={permissions.menuEditing}
            onCheckedChange={(checked) =>
              setPermissions({ ...permissions, menuEditing: checked as boolean })
            }
          />
          <div>
            <Label htmlFor="menuEditing" className="font-medium">
              Menu Editing
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow owner to add, edit, and delete menu items
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Checkbox
            id="orderManagement"
            checked={permissions.orderManagement}
            onCheckedChange={(checked) =>
              setPermissions({ ...permissions, orderManagement: checked as boolean })
            }
          />
          <div>
            <Label htmlFor="orderManagement" className="font-medium">
              Order Management
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow owner to view and manage orders
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Checkbox
            id="profileUpdates"
            checked={permissions.profileUpdates}
            onCheckedChange={(checked) =>
              setPermissions({ ...permissions, profileUpdates: checked as boolean })
            }
          />
          <div>
            <Label htmlFor="profileUpdates" className="font-medium">
              Profile Updates
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow owner to update shop profile and settings
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => onSave({ ...owner, permissions })}>
          Save Permissions
        </Button>
      </div>
    </div>
  );
};

export default AdminOwners;
