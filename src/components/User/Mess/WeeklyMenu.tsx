"use client"

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WeeklyBhajiDTO {
  weeklyBhajiId: string;
  shopId: string;
  dayOfWeek: string;   // "MONDAY", "TUESDAY" ...
  mealTime: string;    // "LUNCH", "DINNER"
  bhajiName: string;
}

// Structured chart from GET /bhaji/chart
interface BhajiChartDTO {
  chart: {
    [day: string]: {
      LUNCH: string;
      DINNER: string;
    };
  };
}

interface WeeklyMenuProps {
  bhajiChart: BhajiChartDTO;
}

const DAY_ORDER = [
  { full: "Monday",    short: "Mon", key: "MONDAY"    },
  { full: "Tuesday",   short: "Tue", key: "TUESDAY"   },
  { full: "Wednesday", short: "Wed", key: "WEDNESDAY" },
  { full: "Thursday",  short: "Thu", key: "THURSDAY"  },
  { full: "Friday",    short: "Fri", key: "FRIDAY"    },
  { full: "Saturday",  short: "Sat", key: "SATURDAY"  },
  { full: "Sunday",    short: "Sun", key: "SUNDAY"    },
];

const getTodayKey = () => {
  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  return days[new Date().getDay()];
};

const WeeklyMenu = ({ bhajiChart }: WeeklyMenuProps) => {
  const todayKey = getTodayKey();
  const [activeDay, setActiveDay] = useState(todayKey);

  const BhajiCard = ({ mealTime, bhajiName }: { mealTime: string; bhajiName: string }) => (
    <div className="bg-card rounded-xl p-4 shadow-soft">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full" />
        {mealTime === "LUNCH" ? "Lunch" : "Dinner"}
      </h4>

      {bhajiName ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          {/* Veg indicator */}
          <div className="w-4 h-4 border border-green-600 rounded flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
          </div>
          <span>{bhajiName}</span>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm italic">Not set by owner yet</p>
      )}

      {/* Info note */}
      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
        Served with your Thali
      </p>
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Weekly Bhaji Chart
            </h2>
            <p className="text-muted-foreground">
              See what bhaji comes with your Thali each day
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="w-full flex overflow-x-auto bg-card shadow-soft rounded-xl p-1 mb-6">
            {DAY_ORDER.map((day) => (
              <TabsTrigger
                key={day.key}
                value={day.key}
                className="flex-1 min-w-[60px] py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                {/* Today badge */}
                {day.key === todayKey ? (
                  <div className="flex flex-col items-center">
                    <span className="hidden md:inline">{day.full}</span>
                    <span className="md:hidden">{day.short}</span>
                    <span className="text-[10px] leading-none mt-0.5 opacity-70">today</span>
                  </div>
                ) : (
                  <>
                    <span className="hidden md:inline">{day.full}</span>
                    <span className="md:hidden">{day.short}</span>
                  </>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAY_ORDER.map((day) => {
            const dayData = bhajiChart?.chart[day.key];
            return (
              <TabsContent key={day.key} value={day.key} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BhajiCard
                    mealTime="LUNCH"
                    bhajiName={dayData?.LUNCH ?? ""}
                  />
                  <BhajiCard
                    mealTime="DINNER"
                    bhajiName={dayData?.DINNER ?? ""}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

      </div>
    </section>
  );
};

export default WeeklyMenu;