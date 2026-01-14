"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Store,
  MapPin,
  Clock,
  MoreVertical,
  CheckCircle,
  XCircle,
  Edit,
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

interface Shop {
  id: number;
  name: string;
  owner: string;
  location: string;
  status: "pending" | "approved" | "suspended";
  foodType: string;
  operatingHours: string;
  description: string;
}

const initialShops: Shop[] = [
  { id: 1, name: "Mama's Kitchen", owner: "Rajesh Kumar", location: "Sector 15", status: "pending", foodType: "Veg", operatingHours: "8:00 AM - 9:00 PM", description: "Homestyle vegetarian food" },
  { id: 2, name: "Desi Tadka", owner: "Sunita Sharma", location: "MG Road", status: "approved", foodType: "Both", operatingHours: "7:00 AM - 10:00 PM", description: "Authentic Indian cuisine" },
  { id: 3, name: "Fresh Bites", owner: "Amit Patel", location: "Civil Lines", status: "pending", foodType: "Veg", operatingHours: "9:00 AM - 8:00 PM", description: "Fresh and healthy meals" },
  { id: 4, name: "Spice Junction", owner: "Meera Reddy", location: "Jubilee Hills", status: "approved", foodType: "Non-Veg", operatingHours: "11:00 AM - 11:00 PM", description: "Spicy non-veg delights" },
  { id: 5, name: "Home Flavors", owner: "Vikram Singh", location: "Banjara Hills", status: "suspended", foodType: "Veg", operatingHours: "8:00 AM - 9:00 PM", description: "Traditional home cooking" },
  { id: 6, name: "Urban Kitchen", owner: "Priya Mehta", location: "Hitech City", status: "approved", foodType: "Both", operatingHours: "7:30 AM - 10:30 PM", description: "Modern fusion meals" },
];

const AdminShops = () => {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  const locations = [...new Set(shops.map((s) => s.location))];

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || shop.status === statusFilter;
    const matchesLocation = locationFilter === "all" || shop.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleStatusChange = (shopId: number, newStatus: Shop["status"]) => {
    setShops(shops.map((s) => (s.id === shopId ? { ...s, status: newStatus } : s)));
    toast.success("Shop status updated successfully");
  };

  const handleSaveEdit = (updatedShop: Shop) => {
    setShops(shops.map((s) => (s.id === updatedShop.id ? updatedShop : s)));
    setEditingShop(null);
    toast.success("Shop details updated successfully");
  };

  const getStatusBadge = (status: Shop["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Suspended</Badge>;
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
            <BreadcrumbPage>Manage Shops</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Shops</h1>
        <p className="text-muted-foreground">Review and manage all registered shops</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search shops or owners..."
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
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shops List */}
      <div className="grid gap-4">
        {filteredShops.map((shop) => (
          <Card key={shop.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{shop.name}</h3>
                      {getStatusBadge(shop.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">Owner: {shop.owner}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {shop.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {shop.operatingHours}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {shop.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(shop.id, "approved")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(shop.id, "suspended")}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingShop(shop)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Shop
                      </DropdownMenuItem>
                      {shop.status === "approved" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(shop.id, "suspended")}
                          className="text-destructive"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Suspend Shop
                        </DropdownMenuItem>
                      )}
                      {shop.status === "suspended" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(shop.id, "approved")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Activate Shop
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

      {/* Edit Shop Modal */}
      <Dialog open={!!editingShop} onOpenChange={() => setEditingShop(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shop Details</DialogTitle>
          </DialogHeader>
          {editingShop && (
            <EditShopForm
              shop={editingShop}
              onSave={handleSaveEdit}
              onCancel={() => setEditingShop(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EditShopFormProps {
  shop: Shop;
  onSave: (shop: Shop) => void;
  onCancel: () => void;
}

const EditShopForm = ({ shop, onSave, onCancel }: EditShopFormProps) => {
  const [formData, setFormData] = useState(shop);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Shop Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Food Type</Label>
        <Select
          value={formData.foodType}
          onValueChange={(value) => setFormData({ ...formData, foodType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Veg">Veg</SelectItem>
            <SelectItem value="Non-Veg">Non-Veg</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Operating Hours</Label>
        <Input
          value={formData.operatingHours}
          onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>Save Changes</Button>
      </div>
    </div>
  );
};

export default AdminShops;
