"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItemCard, MenuItem } from "@/src/components/Owner/MenuManagement/MenuItemCard";
import { MenuFormModal } from "@/src/components/Owner/MenuManagement/MenuFormModal";
import { MenuFilters } from "@/src/components/Owner/MenuManagement/MenuFilters";
import { DailySpecials } from "@/src/components/Owner/MenuManagement/DailySpecials";
import { toast } from "sonner";
import api from "@/lib/api";
import axios from "axios";
import { getShopIdFromStorage } from "@/lib/owner";

type ApiMenuItem = {
  itemId?: string;
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  veg?: boolean;
  available?: boolean;
  special?: boolean;
};

const normalizeCategory = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "Uncategorized";
};

const normalizeDescription = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
};

const mapApiItemToMenuItem = (item: ApiMenuItem): MenuItem => {
  const resolvedName = (item.name ?? "").trim();
  const resolvedPrice = Number(item.price ?? 0);
  return {
    id: String(item.itemId ?? item.id ?? crypto.randomUUID()),
    name: resolvedName.length > 0 ? resolvedName : "Menu Item",
    description: item.description ?? undefined,
    price: Number.isNaN(resolvedPrice) ? 0 : resolvedPrice,
    category: normalizeCategory(item.category),
    isVeg: item.veg ?? true,
    isAvailable: item.available ?? true,
    isSpecial: item.special ?? false,
    specialPrice: undefined,
  };
};

const groupItemsByCategory = (items: MenuItem[]) => {
  const grouped: Record<string, MenuItem[]> = {};
  items.forEach((item) => {
    const category = normalizeCategory(item.category);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({ ...item, category });
  });
  return grouped;
};

const buildItemPayload = (item: MenuItem) => ({
  name: item.name,
  description: normalizeDescription(item.description),
  price: item.price,
  category: item.category,
  veg: item.isVeg,
  available: item.isAvailable,
  special: item.isSpecial,
});

const buildUpdatePayload = (item: MenuItem, previous: MenuItem) => {
  const currentDescription = normalizeDescription(item.description);
  const previousDescription = normalizeDescription(previous.description);

  return {
    name: item.name !== previous.name ? item.name : null,
    description:
      currentDescription !== previousDescription ? currentDescription : null,
    price: item.price !== previous.price ? item.price : null,
    category: item.category !== previous.category ? item.category : null,
    veg: item.isVeg !== previous.isVeg ? item.isVeg : null,
    available:
      item.isAvailable !== previous.isAvailable ? item.isAvailable : null,
    special: item.isSpecial !== previous.isSpecial ? item.isSpecial : null,
  };
};

const mergeSpecialPrices = (items: MenuItem[], source: MenuItem[]) => {
  const priceById = new Map(
    source.map((item) => [item.id, item.specialPrice] as const)
  );
  return items.map((item) => {
    const specialPrice = priceById.get(item.id);
    return specialPrice !== undefined ? { ...item, specialPrice } : item;
  });
};

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const resolvedShopId = getShopIdFromStorage();
      setShopId(resolvedShopId);

      if (!resolvedShopId) {
        if (isMounted) {
          setMenuItems([]);
          setError("Please sign in as a shop owner to manage your menu.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.get(`/shop/items/${resolvedShopId}`);
        const rawItems = Array.isArray(response.data) ? response.data : [];
        const mappedItems = rawItems.map((item) =>
          mapApiItemToMenuItem(item as ApiMenuItem)
        );
        if (isMounted) {
          setMenuItems(mappedItems);
        }
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { message?: string } | undefined)?.message ??
            "Failed to load menu items."
          : "Failed to load menu items.";
        if (isMounted) {
          setMenuItems([]);
          setError(message);
        }
        toast.error(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: string[] = [];
    menuItems.forEach((item) => {
      const category = normalizeCategory(item.category);
      if (!seen.has(category)) {
        seen.add(category);
        options.push(category);
      }
    });
    return options;
  }, [menuItems]);

  const categoryFilters = useMemo(
    () => ["All", ...categoryOptions],
    [categoryOptions]
  );

  useEffect(() => {
    if (categoryFilter !== "All" && !categoryOptions.includes(categoryFilter)) {
      setCategoryFilter("All");
    }
  }, [categoryFilter, categoryOptions]);

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
        categoryFilter === "All" ||
        normalizeCategory(item.category) === categoryFilter;

      // Availability filter
      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "Available" && item.isAvailable) ||
        (availabilityFilter === "Sold Out" && !item.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [menuItems, searchQuery, categoryFilter, availabilityFilter]);

  // Group items by category
  const groupedItems = useMemo(
    () => groupItemsByCategory(filteredItems),
    [filteredItems]
  );

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Menu item deleted successfully.");
  };

  const handleToggleAvailability = async (id: string, available: boolean) => {
    const previousItems = menuItems;
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: available } : item
      )
    );

    try {
      await api.patch(`/items/${id}/available`, { available });
      toast.success(`Menu item is now ${available ? "available" : "sold out"}.`);
    } catch (err) {
      setMenuItems(previousItems);
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update availability."
        : "Failed to update availability.";
      toast.error(message);
    }
  };

  const handleFormSubmit = async (data: MenuItem) => {
    const normalizedDescription = normalizeDescription(data.description);
    const normalizedItem = {
      ...data,
      category: normalizeCategory(data.category),
      description: normalizedDescription ?? undefined,
    };

    if (editingItem) {
      const previousItems = menuItems;
      setMenuItems((prev) =>
        prev.map((item) => (item.id === normalizedItem.id ? normalizedItem : item))
      );

      try {
        const response = await api.put(
          `/items/${normalizedItem.id}`,
          buildUpdatePayload(normalizedItem, editingItem)
        );
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          const mapped = responseData.map((item) =>
            mapApiItemToMenuItem(item as ApiMenuItem)
          );
          setMenuItems(mergeSpecialPrices(mapped, previousItems));
        } else if (responseData && typeof responseData === "object") {
          const mapped = mapApiItemToMenuItem(responseData as ApiMenuItem);
          setMenuItems((prev) =>
            prev.map((item) =>
              item.id === normalizedItem.id
                ? { ...mapped, specialPrice: normalizedItem.specialPrice }
                : item
            )
          );
        }

        toast.success(`${normalizedItem.name} updated successfully.`);
      } catch (err) {
        setMenuItems(previousItems);
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { message?: string } | undefined)?.message ??
            "Failed to update menu item."
          : "Failed to update menu item.";
        toast.error(message);
      }
      setEditingItem(null);
      return;
    }

    if (!shopId) {
      toast.error("Please sign in as a shop owner to add menu items.");
      return;
    }

    try {
      const response = await api.post(
        `/shop/items/${shopId}`,
        buildItemPayload(normalizedItem)
      );
      const responseData = response.data;

      if (Array.isArray(responseData)) {
        const mapped = responseData.map((item) =>
          mapApiItemToMenuItem(item as ApiMenuItem)
        );
        setMenuItems(mergeSpecialPrices(mapped, menuItems));
      } else if (responseData && typeof responseData === "object") {
        const mapped = mapApiItemToMenuItem(responseData as ApiMenuItem);
        setMenuItems((prev) => [
          ...prev,
          { ...mapped, specialPrice: normalizedItem.specialPrice },
        ]);
      } else {
        setMenuItems((prev) => [...prev, normalizedItem]);
      }

      toast.success(`${normalizedItem.name} added to the menu.`);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to add menu item."
        : "Failed to add menu item.";
      toast.error(message);
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

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading menu items...
        </div>
      )}

      {/* Daily Specials */}
      <DailySpecials specials={dailySpecials} />

      {/* Filters */}
      <MenuFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categoryFilters}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
      />

      {/* Menu Items Grid */}
      {loading ? null : filteredItems.length === 0 ? (
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
          {(categoryOptions.length > 0
            ? categoryOptions
            : Object.keys(groupedItems)
          ).map((category) => {
            const items = groupedItems[category] ?? [];
            if (items.length === 0) return null;
            return (
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
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <MenuFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categories={categoryOptions}
        editItem={editingItem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
