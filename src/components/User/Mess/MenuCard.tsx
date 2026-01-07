'use client'


import { Plus, Leaf, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
  onAdd: () => void;
}

const MenuCard = ({
  name,
  description,
  price,
  isVeg,
  isAvailable,
  image,
  onAdd,
}: MenuCardProps) => {
  return (
    <div className={`bg-card rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${!isAvailable ? 'opacity-60' : ''}`}>
      <div className="flex">
        {/* Content */}
        <div className="flex-1 p-4">
          {/* Veg/Non-veg indicator */}
          <div className="flex items-center gap-2 mb-2">
            {isVeg ? (
              <div className="w-5 h-5 border-2 border-veg rounded flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-veg rounded-full" />
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-nonveg rounded flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-nonveg rounded-full" />
              </div>
            )}
            {!isAvailable && (
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
              {isVeg ? (
                <Leaf className="w-8 h-8 text-veg/50" />
              ) : (
                <Flame className="w-8 h-8 text-nonveg/50" />
              )}
            </div>
          )}
          
          {/* Add Button */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <Button
              onClick={onAdd}
              disabled={!isAvailable}
              size="sm"
              className="bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white font-semibold px-6 rounded-lg shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              ADD
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
