"use client";

import { Plus, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExtraItem {
  itemId: string;
  name: string;
  price: number;
  image?: string;
  veg: boolean;
}

interface ExtraItemsProps {
  items: ExtraItem[];
}

export default function ExtraItems({ items }: ExtraItemsProps) {
  const handleAdd = (item: ExtraItem) => {
    toast.success(`${item.name} added to your order.`);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-accent p-2 rounded-xl">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Extra Items
            </h2>
            <p className="text-muted-foreground">
              Add-ons, snacks & beverages
            </p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="bg-card rounded-xl shadow-soft overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-28 bg-muted">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Cookie className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}

                {/* Veg indicator */}
                <div className="absolute top-2 left-2">
                  <div className="w-2 h-2 bg-nonveg rounded-full" />
                  {item.veg ? (
                    <div className="w-4 h-4 bg-white border border-veg rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-veg rounded-full" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 bg-white border border-nonveg rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-nonveg rounded-full" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-medium text-foreground text-sm mb-1 truncate">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    ₹{item.price}
                  </span>
                  <Button
                    onClick={() => handleAdd(item)}
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
