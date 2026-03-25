'use client'


import { Minus, Plus, Leaf, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  veg: boolean;
  available: boolean;
  image?: string;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MenuCard = ({
  name,
  description,
  price,
  veg,
  available,
  image,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
}: MenuCardProps) => {
  const hasQuantity = quantity > 0;

  return (
    <div className={`bg-card rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${!available ? 'opacity-60' : ''}`}>
      <div className="flex">
        {/* Content */}
        <div className="flex-1 p-4">
          {/* Veg/Non-veg indicator */}
          <div className="flex items-center gap-2 mb-2">
            {veg ? (
              <div className="w-5 h-5 border-2 border-veg rounded flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-veg rounded-full" />
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-nonveg rounded flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-nonveg rounded-full" />
              </div>
            )}
            {!available && (
              <Badge variant="outline" className="text-xs border-muted-foreground/30">
                Not Available
              </Badge>
            )}
          </div>

          {/* Name & Description */}
          <h3 className="font-semibold text-foreground text-lg mb-1">{name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>

          {/* Price */}
          <p className="font-bold text-foreground text-lg">₹{price}</p>
        </div>

        {/* Image & Add Button */}
        <div className="relative w-32 md:w-36">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              {veg ? (
                <Leaf className="w-8 h-8 text-veg/50" />
              ) : (
                <Flame className="w-8 h-8 text-nonveg/50" />
              )}
            </div>
          )}
          
          {/* Add Button */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            {hasQuantity ? (
              <div className="flex items-center gap-1 rounded-xl border border-primary/30 bg-white/95 px-2 py-1 shadow-md">
                <button
                  type="button"
                  onClick={onDecrease}
                  className="h-11 w-11 rounded-lg border border-border bg-background text-primary shadow-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  aria-label={`Decrease ${name} quantity`}
                >
                  <Minus className="mx-auto h-4 w-4" />
                </button>
                <span className="min-w-[24px] text-center text-sm font-semibold text-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={onIncrease}
                  disabled={!available}
                  className="h-11 w-11 rounded-lg border border-border bg-background text-primary shadow-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                  aria-label={`Increase ${name} quantity`}
                >
                  <Plus className="mx-auto h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                onClick={onAdd}
                disabled={!available}
                size="sm"
                className="h-11 px-5 rounded-xl bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white font-semibold shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
