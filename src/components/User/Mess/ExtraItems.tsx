"use client";

import { Minus, Plus, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtraItem {
  itemId: string;
  name: string;
  price: number;
  image?: string;
  veg: boolean;
}

interface ExtraItemsProps {
  items: ExtraItem[];
  cart: Record<string, { quantity: number }>;
  onAdd: (item: ExtraItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export default function ExtraItems({
  items,
  cart,
  onAdd,
  onUpdateQuantity,
}: ExtraItemsProps) {
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
          {items.map((item) => {
            const quantity = cart[item.itemId]?.quantity ?? 0;

            return (
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground">
                      ₹{item.price}
                    </span>
                    {quantity === 0 ? (
                      <Button
                        onClick={() => onAdd(item)}
                        size="sm"
                        variant="outline"
                        className="h-11 px-4 rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-background px-1 py-1 shadow-sm">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.itemId, -1)}
                          className="h-11 w-11 rounded-full border border-border bg-background text-primary shadow-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="mx-auto h-4 w-4" />
                        </button>
                        <span className="min-w-[22px] text-center text-sm font-semibold text-primary">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.itemId, 1)}
                          className="h-11 w-11 rounded-full border border-border bg-background text-primary shadow-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="mx-auto h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
