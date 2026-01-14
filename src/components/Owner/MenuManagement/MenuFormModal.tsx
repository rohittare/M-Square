"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "./MenuItemCard";

const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(100),
  category: z.enum(["Breakfast", "Lunch", "Dinner", "Snacks"]),
  price: z.coerce.number().min(1, "Price must be at least ₹1"),
  description: z.string().max(200).optional(),
  isVeg: z.boolean(),
  isAvailable: z.boolean(),
  isSpecial: z.boolean(),
  specialPrice: z.coerce.number().optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: MenuItem | null;
  onSubmit: (data: MenuItem) => void;
}

export function MenuFormModal({
  open,
  onOpenChange,
  editItem,
  onSubmit,
}: MenuFormModalProps) {
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      category: "Lunch",
      price: 0,
      description: "",
      isVeg: true,
      isAvailable: true,
      isSpecial: false,
      specialPrice: undefined,
    },
  });

  const isSpecial = form.watch("isSpecial");

  useEffect(() => {
    if (editItem) {
      form.reset({
        name: editItem.name,
        category: editItem.category,
        price: editItem.price,
        description: editItem.description || "",
        isVeg: editItem.isVeg,
        isAvailable: editItem.isAvailable,
        isSpecial: editItem.isSpecial,
        specialPrice: editItem.specialPrice,
      });
    } else {
      form.reset({
        name: "",
        category: "Lunch",
        price: 0,
        description: "",
        isVeg: true,
        isAvailable: true,
        isSpecial: false,
        specialPrice: undefined,
      });
    }
  }, [editItem, form, open]);

  const handleSubmit = (data: MenuItemFormData) => {
    const menuItem: MenuItem = {
      id: editItem?.id || crypto.randomUUID(),
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
      isVeg: data.isVeg,
      isAvailable: data.isAvailable,
      isSpecial: data.isSpecial,
      specialPrice: data.isSpecial ? data.specialPrice : undefined,
    };
    onSubmit(menuItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Item Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSpecial && (
                <FormField
                  control={form.control}
                  name="specialPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the item"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggle Row */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="isVeg"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-2 rounded-lg border p-3">
                    <FormLabel className="text-center text-sm">Veg</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-swiggy-green"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-2 rounded-lg border p-3">
                    <FormLabel className="text-center text-sm">Available</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-swiggy-green"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSpecial"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-2 rounded-lg border p-3">
                    <FormLabel className="text-center text-sm">Special</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-swiggy-gold"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-swiggy-orange hover:bg-swiggy-orange/90"
              >
                {editItem ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
