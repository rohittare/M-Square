"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  availabilityFilter: string;
  onAvailabilityChange: (availability: string) => void;
}

export function MenuFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange,
}: MenuFiltersProps) {
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];
  const availabilities = ["All", "Available", "Sold Out"];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">
            Meal Type
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "transition-all",
                  categoryFilter === category &&
                    "bg-swiggy-orange text-white border-swiggy-orange hover:bg-swiggy-orange/90 hover:text-white"
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">
            Availability
          </span>
          <div className="flex flex-wrap gap-2">
            {availabilities.map((availability) => (
              <Button
                key={availability}
                variant="outline"
                size="sm"
                onClick={() => onAvailabilityChange(availability)}
                className={cn(
                  "transition-all",
                  availabilityFilter === availability &&
                    "bg-swiggy-orange text-white border-swiggy-orange hover:bg-swiggy-orange/90 hover:text-white"
                )}
              >
                {availability}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
