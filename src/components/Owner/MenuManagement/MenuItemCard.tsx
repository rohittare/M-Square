"use client";

import { useState } from "react";
import { Edit2, Trash2, Star, Leaf, Drumstick } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface MenuItem {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  isSpecial: boolean;
  specialPrice?: number;
  description?: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, available: boolean) => void;
}

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(item.id);
  };

  const categoryColors: Record<string, string> = {
    Breakfast: "bg-amber-100 text-amber-800",
    Lunch: "bg-orange-100 text-orange-800",
    Dinner: "bg-purple-100 text-purple-800",
    Snacks: "bg-blue-100 text-blue-800",
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        !item.isAvailable && "opacity-60 bg-muted/50"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {/* Veg/Non-Veg Indicator */}
              <div
                className={cn(
                  "w-5 h-5 border-2 rounded flex items-center justify-center",
                  item.isVeg
                    ? "border-swiggy-green"
                    : "border-destructive"
                )}
              >
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    item.isVeg ? "bg-swiggy-green" : "bg-destructive"
                  )}
                />
              </div>

              {/* Food Name */}
              <h3 className="font-semibold text-foreground truncate">
                {item.name}
              </h3>

              {/* Special Badge */}
              {item.isSpecial && (
                <Badge className="bg-swiggy-gold text-white gap-1">
                  <Star className="w-3 h-3" />
                  Chef's Special
                </Badge>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Category & Price Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className={categoryColors[item.category]}>
                {item.category}
              </Badge>

              <div className="flex items-center gap-2">
                {item.isSpecial && item.specialPrice ? (
                  <>
                    <span className="font-bold text-swiggy-orange">
                      ₹{item.specialPrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{item.price}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-foreground">₹{item.price}</span>
                )}
              </div>

              {!item.isAvailable && (
                <Badge variant="outline" className="text-destructive border-destructive">
                  Sold Out
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-3">
            {/* Availability Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {item.isAvailable ? "Available" : "Sold Out"}
              </span>
              <Switch
                checked={item.isAvailable}
                onCheckedChange={(checked) =>
                  onToggleAvailability(item.id, checked)
                }
                className="data-[state=checked]:bg-swiggy-green"
              />
            </div>

            {/* Edit & Delete */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(item)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{item.name}"? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
