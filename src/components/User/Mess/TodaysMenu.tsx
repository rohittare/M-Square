'use client'

import { Sparkles } from "lucide-react";
import MenuCard from "./MenuCard";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
}

interface TodaysMenuProps {
  items: MenuItem[];
}

const TodaysMenu = ({ items }: TodaysMenuProps) => {
  const handleAdd = (item: MenuItem) => {
    toast.success(`${item.name} has been added to your order.`);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Today's Special Menu</h2>
            <p className="text-muted-foreground">Fresh meals prepared just for you</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <MenuCard
              key={item.id}
              {...item}
              onAdd={() => handleAdd(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TodaysMenu;
