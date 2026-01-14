"use client";


import { Plus, ClipboardList, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DashboardHeaderProps {
  shopName: string;
  isShopOpen: boolean;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DashboardHeader({
  shopName,
  isShopOpen,
  selectedDate,
  onDateChange,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">{shopName}</span>
            <Badge
              variant={isShopOpen ? "default" : "secondary"}
              className={
                isShopOpen
                  ? "bg-swiggy-green/10 text-swiggy-green hover:bg-swiggy-green/20"
                  : "bg-muted text-muted-foreground"
              }
            >
              {isShopOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
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

          <Button className="gap-2 bg-swiggy-orange hover:bg-swiggy-orange/90">
            <Plus className="w-4 h-4" />
            Add Menu
          </Button>
          <Button variant="outline" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            View Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
