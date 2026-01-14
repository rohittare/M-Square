"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  UtensilsCrossed,
  AlertTriangle,
  Trash2,
  Ban,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  shopName: string;
  shopId: number;
  isVeg: boolean;
  isFlagged: boolean;
  isDisabled: boolean;
}

const initialMenuItems: MenuItem[] = [
  { id: 1, name: "Veg Thali", price: 120, category: "Thali", shopName: "Mama's Kitchen", shopId: 1, isVeg: true, isFlagged: false, isDisabled: false },
  { id: 2, name: "Chicken Biryani", price: 200, category: "Biryani", shopName: "Spice Junction", shopId: 4, isVeg: false, isFlagged: true, isDisabled: false },
  { id: 3, name: "Paneer Butter Masala", price: 180, category: "Main Course", shopName: "Desi Tadka", shopId: 2, isVeg: true, isFlagged: false, isDisabled: false },
  { id: 4, name: "Samosa", price: 30, category: "Snacks", shopName: "Fresh Bites", shopId: 3, isVeg: true, isFlagged: false, isDisabled: false },
  { id: 5, name: "Mutton Curry", price: 280, category: "Main Course", shopName: "Spice Junction", shopId: 4, isVeg: false, isFlagged: true, isDisabled: false },
  { id: 6, name: "Dal Tadka", price: 100, category: "Main Course", shopName: "Home Flavors", shopId: 5, isVeg: true, isFlagged: false, isDisabled: true },
  { id: 7, name: "Masala Dosa", price: 80, category: "Breakfast", shopName: "Urban Kitchen", shopId: 6, isVeg: true, isFlagged: false, isDisabled: false },
  { id: 8, name: "Egg Curry", price: 150, category: "Main Course", shopName: "Desi Tadka", shopId: 2, isVeg: false, isFlagged: false, isDisabled: false },
];

const shops = [
  { id: 0, name: "All Shops" },
  { id: 1, name: "Mama's Kitchen" },
  { id: 2, name: "Desi Tadka" },
  { id: 3, name: "Fresh Bites" },
  { id: 4, name: "Spice Junction" },
  { id: 5, name: "Home Flavors" },
  { id: 6, name: "Urban Kitchen" },
];

const categories = ["All", "Thali", "Biryani", "Main Course", "Snacks", "Breakfast"];

const AdminMenus = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState<string>("0");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShop = selectedShop === "0" || item.shopId === parseInt(selectedShop);
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesShop && matchesCategory;
  });

  const flaggedCount = menuItems.filter((i) => i.isFlagged).length;

  const handleToggleDisable = (itemId: number) => {
    setMenuItems(
      menuItems.map((i) =>
        i.id === itemId ? { ...i, isDisabled: !i.isDisabled } : i
      )
    );
    toast.success("Menu item status updated");
  };

  const handleDeleteItem = () => {
    if (deleteItemId) {
      setMenuItems(menuItems.filter((i) => i.id !== deleteItemId));
      setDeleteItemId(null);
        toast.success("Menu item removed successfully");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage Menus</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Menus</h1>
          <p className="text-muted-foreground">Review and moderate menu items across all shops</p>
        </div>
        {flaggedCount > 0 && (
          <Badge variant="destructive" className="w-fit">
            <AlertTriangle className="w-4 h-4 mr-1" /> {flaggedCount} Flagged Items
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedShop} onValueChange={setSelectedShop}>
              <SelectTrigger className="w-full md:w-48">
                <Store className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Shop" />
              </SelectTrigger>
              <SelectContent>
                {shops.map((shop) => (
                  <SelectItem key={shop.id} value={shop.id.toString()}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`overflow-hidden ${
              item.isFlagged ? "border-destructive/50 bg-destructive/5" : ""
            } ${item.isDisabled ? "opacity-60" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      item.isVeg ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}
                  >
                    <UtensilsCrossed
                      className={`w-6 h-6 ${
                        item.isVeg ? "text-emerald-600" : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          item.isVeg
                            ? "border-emerald-500 text-emerald-600"
                            : "border-red-500 text-red-600"
                        }
                      >
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                      {item.isFlagged && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Flagged
                        </Badge>
                      )}
                      {item.isDisabled && (
                        <Badge variant="secondary" className="text-xs">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.shopName} • {item.category}
                    </p>
                    <p className="text-lg font-bold text-primary mt-1">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant={item.isDisabled ? "default" : "outline"}
                    onClick={() => handleToggleDisable(item.id)}
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    {item.isDisabled ? "Enable" : "Disable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteItemId(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the menu item from the platform. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground">
              Remove Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMenus;
