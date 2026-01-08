'use client'


import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Home, Building, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import  AddressFormModal  from "./AddressFormModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Address {
  id: string;
  title: string;
  fullAddress: string;
  areaLandmark: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressesSectionProps {
  addresses: Address[];
  onAdd: (address: Omit<Address, "id">) => void;
  onUpdate: (id: string, address: Omit<Address, "id">) => void;
  onDelete: (id: string) => void;
}

const getAddressIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("home")) return Home;
  if (lowerTitle.includes("office") || lowerTitle.includes("work")) return Briefcase;
  return Building;
};

export const AddressesSection = ({
  addresses,
  onAdd,
  onUpdate,
  onDelete,
}: AddressesSectionProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = (address: Omit<Address, "id">) => {
    onAdd(address);
    setIsAddModalOpen(false);
    toast.success("Address added successfully!");
  };

  const handleUpdate = (address: Omit<Address, "id">) => {
    if (editingAddress) {
      onUpdate(editingAddress.id, address);
      setEditingAddress(null);
      toast.success("Address updated successfully!");
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
      toast.success("Address deleted successfully!");
    }
  };

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Saved Addresses
          </CardTitle>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No saved addresses yet</p>
              <p className="text-sm">Add your first delivery address</p>
            </div>
          ) : (
            addresses.map((address) => {
              const Icon = getAddressIcon(address.title);
              return (
                <div
                  key={address.id}
                  className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{address.title}</h3>
                      {address.isDefault && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.fullAddress}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.areaLandmark}, {address.city} - {address.pincode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => setEditingAddress(address)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeletingId(address.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <AddressFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
        title="Add New Address"
      />

      <AddressFormModal
        isOpen={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        onSubmit={handleUpdate}
        initialData={editingAddress || undefined}
        title="Edit Address"
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
