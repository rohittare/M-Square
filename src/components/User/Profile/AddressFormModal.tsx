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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Address {
  type: string;
  area: string;
  city: string;
  pincode: string;
  fullAddress: string;
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: Omit<Address, "addressId">) => Promise<boolean> | boolean;
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
  const createInitialForm = (data?: Address): Omit<Address, "addressId"> => ({
    type: data?.type || "HOME",
    area: data?.area || "",
    city: data?.city || "",
    pincode: data?.pincode || "",
    fullAddress: data?.fullAddress || "",
  });

  const [form, setForm] = useState<Omit<Address, "addressId">>(() =>
    createInitialForm(initialData)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const resetAndClose = () => {
    setForm(createInitialForm(initialData));
    setErrors({});
    onClose();
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetAndClose();
    }
  };

  const handleCancel = () => {
    if (!saving) {
      resetAndClose();
    }
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.type) nextErrors.type = "Please select a type.";
    if (!form.area.trim()) nextErrors.area = "Area is required.";
    if (!form.city.trim()) nextErrors.city = "City is required.";
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      nextErrors.pincode = "Pincode must be 6 digits.";
    }
    if (!form.fullAddress.trim()) nextErrors.fullAddress = "Full address is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    const ok = await Promise.resolve(onSubmit(form));
    setSaving(false);
    if (ok !== false) {
      resetAndClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Address Type</Label>
            <Select
              value={form.type}
              onValueChange={(value) => handleChange("type", value)}
              disabled={saving}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOME">Home</SelectItem>
                <SelectItem value="WORK">Work</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Area</Label>
            <Input
              placeholder="Kothrud"
              value={form.area}
              onChange={(e) => handleChange("area", e.target.value)}
              disabled={saving}
            />
            {errors.area && (
              <p className="text-xs text-destructive">{errors.area}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <Input
              placeholder="Pune"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              disabled={saving}
            />
            {errors.city && (
              <p className="text-xs text-destructive">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input
              placeholder="411038"
              value={form.pincode}
              onChange={(e) =>
                handleChange("pincode", e.target.value.replace(/\D/g, ""))
              }
              disabled={saving}
            />
            {errors.pincode && (
              <p className="text-xs text-destructive">{errors.pincode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Full Address</Label>
            <Input
              placeholder="Flat 302, Shree Residency, Paud Road, Kothrud"
              value={form.fullAddress}
              onChange={(e) => handleChange("fullAddress", e.target.value)}
              disabled={saving}
            />
            {errors.fullAddress && (
              <p className="text-xs text-destructive">{errors.fullAddress}</p>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={saving}>
            {saving ? "Saving..." : "Save Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
