"use client"


import { useState } from "react";
import { Calendar, Leaf, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MealItem {
  name: string;
  isVeg: boolean;
}

interface DayMenu {
  day: string;
  shortDay: string;
  lunch: MealItem[];
  dinner: MealItem[];
}

interface WeeklyMenuProps {
  weeklyMenu: DayMenu[];
}

const WeeklyMenu = ({ weeklyMenu }: WeeklyMenuProps) => {
  const [activeDay, setActiveDay] = useState(weeklyMenu[0]?.shortDay || "Mon");

  const MealList = ({ meals, title }: { meals: MealItem[]; title: string }) => (
    <div className="bg-card rounded-xl p-4 shadow-soft">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full" />
        {title}
      </h4>
      <ul className="space-y-2">
        {meals.map((meal, index) => (
          <li key={index} className="flex items-center gap-2 text-muted-foreground">
            {meal.isVeg ? (
              <div className="w-4 h-4 border border-veg rounded flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-veg rounded-full" />
              </div>
            ) : (
              <div className="w-4 h-4 border border-nonveg rounded flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-nonveg rounded-full" />
              </div>
            )}
            <span>{meal.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-secondary p-2 rounded-xl">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Weekly Menu</h2>
            <p className="text-muted-foreground">Plan your meals for the week</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="w-full flex overflow-x-auto bg-card shadow-soft rounded-xl p-1 mb-6">
            {weeklyMenu.map((day) => (
              <TabsTrigger
                key={day.shortDay}
                value={day.shortDay}
                className="flex-1 min-w-[60px] py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                <span className="hidden md:inline">{day.day}</span>
                <span className="md:hidden">{day.shortDay}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {weeklyMenu.map((day) => (
            <TabsContent key={day.shortDay} value={day.shortDay} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MealList meals={day.lunch} title="Lunch" />
                <MealList meals={day.dinner} title="Dinner" />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default WeeklyMenu;
