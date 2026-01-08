"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Address {
  title: string;
  fullAddress: string;
  areaLandmark: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: Omit<Address, "id">) => void;
  initialData?: Address;
  title: string;
}

export default function AddressFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: AddressFormModalProps) {
  const [form, setForm] = useState<Omit<Address, "id">>({
    title: initialData?.title || "Home",
    fullAddress: initialData?.fullAddress || "",
    areaLandmark: initialData?.areaLandmark || "",
    city: initialData?.city || "",
    pincode: initialData?.pincode || "",
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4 mt-4">
          {/* Address Type */}
          <div className="space-y-2">
            <Label>Address Type</Label>
            <Input
              placeholder="Home"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Full Address */}
          <div className="space-y-2">
            <Label>Full Address</Label>
            <Input
              placeholder="House/Flat No., Building Name, Street"
              value={form.fullAddress}
              onChange={(e) => handleChange("fullAddress", e.target.value)}
            />
          </div>

          {/* Area / Landmark */}
          <div className="space-y-2">
            <Label>Area / Landmark</Label>
            <Input
              placeholder="Near Main Gate, Opposite Park"
              value={form.areaLandmark}
              onChange={(e) => handleChange("areaLandmark", e.target.value)}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              placeholder="Mumbai"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          {/* Pincode */}
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input
              placeholder="400001"
              value={form.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>

          {/* Default Address */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              checked={form.isDefault}
              onCheckedChange={(checked) =>
                handleChange("isDefault", Boolean(checked))
              }
            />
            <Label>Set as default address</Label>
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
