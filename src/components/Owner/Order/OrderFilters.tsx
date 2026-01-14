"use client";

import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  mealFilter: string;
  onMealFilterChange: (value: string) => void;
  paymentFilter: string;
  onPaymentFilterChange: (value: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  mealFilter,
  onMealFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  selectedDate,
  onDateChange,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by Order ID or Customer..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start min-w-[140px]">
            <Calendar className="w-4 h-4 mr-2" />
            {format(selectedDate, "MMM dd, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Meal Type Filter */}
      <Select value={mealFilter} onValueChange={onMealFilterChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Meal Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Meals</SelectItem>
          <SelectItem value="Breakfast">Breakfast</SelectItem>
          <SelectItem value="Lunch">Lunch</SelectItem>
          <SelectItem value="Dinner">Dinner</SelectItem>
        </SelectContent>
      </Select>

      {/* Payment Filter */}
      <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Payment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Payments</SelectItem>
          <SelectItem value="Cash">Cash</SelectItem>
          <SelectItem value="UPI">UPI</SelectItem>
          <SelectItem value="Card">Card</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
