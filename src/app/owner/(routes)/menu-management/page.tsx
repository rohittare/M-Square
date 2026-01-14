"use client";

import { useState, useMemo } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItemCard, MenuItem } from "@/src/components/Owner/MenuManagement/MenuItemCard";
import { MenuFormModal } from "@/src/components/Owner/MenuManagement/MenuFormModal";
import { MenuFilters } from "@/src/components/Owner/MenuManagement/MenuFilters";
import { DailySpecials } from "@/src/components/Owner/MenuManagement/DailySpecials";
import { toast } from "sonner";

// Demo menu data
const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Masala Dosa",
    category: "Breakfast",
    price: 60,
    isVeg: true,
    isAvailable: true,
    isSpecial: false,
    description: "Crispy rice crepe with spiced potato filling",
  },
  {
    id: "2",
    name: "Idli Sambar",
    category: "Breakfast",
    price: 40,
    isVeg: true,
    isAvailable: true,
    isSpecial: false,
    description: "Soft steamed rice cakes with lentil soup",
  },
  {
    id: "3",
    name: "Paneer Butter Masala",
    category: "Lunch",
    price: 120,
    isVeg: true,
    isAvailable: true,
    isSpecial: true,
    specialPrice: 99,
    description: "Cottage cheese in rich tomato-butter gravy",
  },
  {
    id: "4",
    name: "Chicken Biryani",
    category: "Lunch",
    price: 180,
    isVeg: false,
    isAvailable: true,
    isSpecial: true,
    specialPrice: 149,
    description: "Fragrant basmati rice with tender chicken pieces",
  },
  {
    id: "5",
    name: "Dal Tadka",
    category: "Lunch",
    price: 80,
    isVeg: true,
    isAvailable: true,
    isSpecial: false,
    description: "Yellow lentils tempered with cumin and garlic",
  },
  {
    id: "6",
    name: "Roti (2 pcs)",
    category: "Lunch",
    price: 20,
    isVeg: true,
    isAvailable: false,
    isSpecial: false,
  },
  {
    id: "7",
    name: "Butter Naan",
    category: "Dinner",
    price: 35,
    isVeg: true,
    isAvailable: true,
    isSpecial: false,
  },
  {
    id: "8",
    name: "Mutton Curry",
    category: "Dinner",
    price: 220,
    isVeg: false,
    isAvailable: true,
    isSpecial: false,
    description: "Slow-cooked mutton in aromatic spices",
  },
  {
    id: "9",
    name: "Jeera Rice",
    category: "Dinner",
    price: 60,
    isVeg: true,
    isAvailable: true,
    isSpecial: false,
  },
  {
    id: "10",
    name: "Samosa (2 pcs)",
    category: "Snacks",
    price: 30,
    isVeg: true,
    isAvailable: true,
    isSpecial: false,
    description: "Crispy pastry with spiced potato filling",
  },
  {
    id: "11",
    name: "Vada Pav",
    category: "Snacks",
    price: 25,
    isVeg: true,
    isAvailable: true,
    isSpecial: false,
  },
];

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  // Get daily specials
  const dailySpecials = useMemo(
    () => menuItems.filter((item) => item.isSpecial),
    [menuItems]
  );

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search filter
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      // Availability filter
      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "Available" && item.isAvailable) ||
        (availabilityFilter === "Sold Out" && !item.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [menuItems, searchQuery, categoryFilter, availabilityFilter]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: [],
    };

    filteredItems.forEach((item) => {
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Menu item deleted successfully.");
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: available } : item
      )
    );
    toast.success(`Menu item is now ${
      available ? "available" : "sold out"
    }.`);
  };

  const handleFormSubmit = (data: MenuItem) => {
    if (editingItem) {
      // Update existing item
      setMenuItems((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
      toast.success(`${data.name} updated successfully.`);
    } else {
      // Add new item
      setMenuItems((prev) => [...prev, data]);
      toast.success(`${data.name} added to the menu.`);
    }
    setEditingItem(null);
  };

  const handleOpenForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-swiggy-orange" />
            Menu Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your daily menu items and specials
          </p>
        </div>
        <Button
          onClick={handleOpenForm}
          className="bg-swiggy-orange hover:bg-swiggy-orange/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Daily Specials */}
      <DailySpecials specials={dailySpecials} />

      {/* Filters */}
      <MenuFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
      />

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No menu items found
          </h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters or add a new item
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(
            ([category, items]) =>
              items.length > 0 && (
                <div key={category}>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    {category}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({items.length} items)
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleAvailability={handleToggleAvailability}
                      />
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {/* Form Modal */}
      <MenuFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editItem={editingItem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
