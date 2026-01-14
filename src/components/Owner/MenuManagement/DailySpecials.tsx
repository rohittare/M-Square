"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "./MenuItemCard";
import { cn } from "@/lib/utils";

interface DailySpecialsProps {
  specials: MenuItem[];
}

export function DailySpecials({ specials }: DailySpecialsProps) {
  if (specials.length === 0) {
    return null;
  }

  return (
    <Card className="border-[#FACC15]/30 bg-gradient-to-r from-[#FACC15]/5 to-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="w-5 h-5 text-swiggy-gold fill-[#FACC15]" />
          Today's Specials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {specials.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-swiggy-gold/20",
                !item.isAvailable && "opacity-60"
              )}
            >
              {/* Veg/Non-Veg Indicator */}
              <div
                className={cn(
                  "w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0",
                  item.isVeg ? "border-swiggy-green" : "border-destructive"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    item.isVeg ? "bg-swiggy-green" : "bg-destructive"
                  )}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <Badge className="bg-swiggy-gold text-white text-xs px-1.5 py-0">
                    <Star className="w-2.5 h-2.5 mr-0.5" />
                    Special
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.specialPrice ? (
                    <>
                      <span className="text-sm font-bold text-swiggy-orange">
                        ₹{item.specialPrice}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-swiggy-orange">
                      ₹{item.price}
                    </span>
                  )}
                  {!item.isAvailable && (
                    <Badge variant="outline" className="text-xs text-destructive border-destructive">
                      Sold Out
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
