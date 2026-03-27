"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Loader2, Save } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getShopIdFromStorage } from "@/lib/owner";
import {
  createEmptyWeeklyMenu,
  fetchWeeklyMenu,
  transformChartToState,
  transformStateToPayload,
  updateWeeklyMenu,
  type DayOfWeek,
  type MealTime,
  type WeeklyMenuState,
} from "@/lib/bhajiService";
import { WeeklyMenuTable } from "./WeeklyMenuTable";

export default function WeeklyMenuPage() {
  const [menu, setMenu] = useState<WeeklyMenuState>(() =>
    createEmptyWeeklyMenu()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMenu = async () => {
      setIsLoading(true);
      setError(null);

      const resolvedShopId = getShopIdFromStorage();
      setShopId(resolvedShopId);

      if (!resolvedShopId) {
        if (isMounted) {
          setMenu(createEmptyWeeklyMenu());
          setError("Please sign in as a shop owner to manage the weekly menu.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetchWeeklyMenu(resolvedShopId);
        if (!isMounted) return;
        setMenu(transformChartToState(response?.chart));
      } catch (err) {
        if (!isMounted) return;
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { message?: string } | undefined)?.message ??
            "Failed to load weekly menu."
          : "Failed to load weekly menu.";
        setMenu(createEmptyWeeklyMenu());
        setError(message);
        toast.error(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (day: DayOfWeek, mealTime: MealTime, value: string) => {
    setMenu((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealTime]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!shopId) {
      toast.error("Please sign in as a shop owner to update the weekly menu.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = transformStateToPayload(menu);
      await updateWeeklyMenu(shopId, payload);
      toast.success("Weekly bhaji menu updated successfully.");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update weekly menu."
        : "Failed to update weekly menu.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputsDisabled = isLoading || isSaving;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-swiggy-orange" />
            Weekly Bhaji Menu
          </h1>
          <p className="text-muted-foreground mt-1">
            Set lunch and dinner bhaji for each day of the week.
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-swiggy-orange hover:bg-swiggy-orange/90"
          disabled={isSaving || isLoading || !shopId}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Weekly Menu
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading weekly menu...
        </div>
      )}

      <WeeklyMenuTable
        menu={menu}
        onChange={handleChange}
        disabled={inputsDisabled}
      />

      <p className="text-sm text-muted-foreground">
        Leave a field empty to clear the bhaji for that day and meal.
      </p>
    </div>
  );
}
