"use client";

import { Input } from "@/components/ui/input";
import {
  DAY_ORDER,
  type DayOfWeek,
  type MealTime,
  type WeeklyMenuState,
} from "@/lib/bhajiService";

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

interface WeeklyMenuTableProps {
  menu: WeeklyMenuState;
  onChange: (day: DayOfWeek, mealTime: MealTime, value: string) => void;
  disabled?: boolean;
}

export function WeeklyMenuTable({
  menu,
  onChange,
  disabled = false,
}: WeeklyMenuTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px] rounded-xl border border-border bg-card shadow-soft">
        <div className="grid grid-cols-[160px_repeat(2,minmax(0,1fr))] bg-muted/40 text-sm font-semibold text-muted-foreground">
          <div className="px-4 py-3">Day</div>
          <div className="px-4 py-3">Lunch</div>
          <div className="px-4 py-3">Dinner</div>
        </div>
        <div className="divide-y divide-border">
          {DAY_ORDER.map((day) => (
            <div
              key={day}
              className="grid grid-cols-[160px_repeat(2,minmax(0,1fr))] items-center bg-background"
            >
              <div className="px-4 py-3 font-medium text-foreground">
                {DAY_LABELS[day]}
              </div>
              <div className="px-4 py-2">
                <Input
                  value={menu[day]?.LUNCH ?? ""}
                  onChange={(event) =>
                    onChange(day, "LUNCH", event.target.value)
                  }
                  placeholder="Add lunch bhaji"
                  disabled={disabled}
                  aria-label={`${DAY_LABELS[day]} lunch`}
                />
              </div>
              <div className="px-4 py-2">
                <Input
                  value={menu[day]?.DINNER ?? ""}
                  onChange={(event) =>
                    onChange(day, "DINNER", event.target.value)
                  }
                  placeholder="Add dinner bhaji"
                  disabled={disabled}
                  aria-label={`${DAY_LABELS[day]} dinner`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
