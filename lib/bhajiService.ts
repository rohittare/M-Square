import api from "@/lib/api";

export const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const MEAL_TIMES = ["LUNCH", "DINNER"] as const;

export type DayOfWeek = (typeof DAY_ORDER)[number];
export type MealTime = (typeof MEAL_TIMES)[number];

export type WeeklyMenuState = Record<DayOfWeek, Record<MealTime, string>>;

export interface BhajiChartResponse {
  chart?: Partial<Record<DayOfWeek, Partial<Record<MealTime, string | null>>>>;
}

export interface WeeklyMenuEntry {
  dayOfWeek: DayOfWeek;
  mealTime: MealTime;
  bhajiName: string;
}

export type WeeklyMenuPayload = WeeklyMenuEntry[];

export const createEmptyWeeklyMenu = (): WeeklyMenuState =>
  DAY_ORDER.reduce((acc, day) => {
    acc[day] = { LUNCH: "", DINNER: "" };
    return acc;
  }, {} as WeeklyMenuState);

const normalizeBhajiName = (value: unknown) =>
  typeof value === "string" ? value : "";

export const transformChartToState = (
  chart?: BhajiChartResponse["chart"]
): WeeklyMenuState => {
  const base = createEmptyWeeklyMenu();
  if (!chart) return base;

  DAY_ORDER.forEach((day) => {
    const dayData = chart[day];
    if (!dayData) return;

    base[day] = {
      LUNCH: normalizeBhajiName(dayData.LUNCH),
      DINNER: normalizeBhajiName(dayData.DINNER),
    };
  });

  return base;
};

export const transformStateToPayload = (
  state: WeeklyMenuState
): WeeklyMenuPayload =>
  DAY_ORDER.flatMap((day) =>
    MEAL_TIMES.map((mealTime) => ({
      dayOfWeek: day,
      mealTime,
      bhajiName:
        typeof state[day]?.[mealTime] === "string"
          ? state[day][mealTime].trim()
          : "",
    }))
  );

export const fetchWeeklyMenu = async (shopId: string) => {
  const response = await api.get(`/api/shops/${shopId}/bhaji/chart`);
  return response.data as BhajiChartResponse;
};

export const updateWeeklyMenu = async (
  shopId: string,
  payload: WeeklyMenuPayload
) => {
  const response = await api.put(`/api/shops/${shopId}/bhaji/all`, payload);
  return response.data;
};
