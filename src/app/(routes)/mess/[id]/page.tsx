"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";
import axios from "axios";
import { Button } from "@/components/ui/button";

import ShopBanner from "@/src/components/User/Mess/ShopBanner";
import TodaysMenu from "@/src/components/User/Mess/TodaysMenu";
import WeeklyMenu from "@/src/components/User/Mess/WeeklyMenu";
import ExtraItems from "@/src/components/User/Mess/ExtraItems";
import ReviewsSection from "@/src/components/User/Mess/ReviewsSection";

interface ShopBannerData {
  name: string;
  picture: string;
  rating: number;
  reviewCount: number;
  address: { fullAddress: string };
  deliveryTime: string;
  tags: string;
  isVeg: boolean;
}

interface TodaysSpecialItem {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: boolean;
  available: boolean;
  image?: string;
}

interface ExtraItem {
  itemId: string;
  name: string;
  price: number;
  image?: string;
  veg: boolean;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

interface ShopDetails {
  name?: string;
  picture?: string;
  rating?: number;
  reviewCount?: number;
  address?: { fullAddress?: string };
  deliveryTime?: string;
  tags?: string | string[];
  isVeg?: boolean;
}

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


const Page = () => {
  const router = useRouter();
  const params = useParams();

  const shopId = useMemo(() => {
    const rawId = params?.id;
    if (Array.isArray(rawId)) return rawId[0] ?? "";
    return typeof rawId === "string" ? rawId : "";
  }, [params]);

  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [todaysSpecial, setTodaysSpecial] = useState<TodaysSpecialItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bhajiChart, setBhajiChart] = useState<BhajiChartDTO>({ chart: {} });

  useEffect(() => {
    if (!shopId) {
      setError("Mess Not Found");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        api.get(`/shops/${shopId}`),
        api.get(`/shop/items/${shopId}`),
        api.get(`/shop/${shopId}/today-special`),
        api.get(`/shop/${shopId}/reviews`),
        api.get(`/shop/${shopId}/ratings`),
        api.get(`/api/shops/${shopId}/bhaji/chart`)
      ]);

      if (!isMounted) return;

      const [shopResult, itemsResult, todayResult, reviewsResult, ratingsResult, bhajiChartResult] =
        results;

      if (shopResult.status === "fulfilled") {
        setShopDetails(shopResult.value.data ?? null);
      } else if (
        axios.isAxiosError(shopResult.reason) &&
        shopResult.reason.response?.status === 404
      ) {
        setError("Mess Not Found");
      } else {
        setError("Unable to load mess details.");
      }

      if (itemsResult.status === "fulfilled") {
        setExtraItems(
          Array.isArray(itemsResult.value.data) ? itemsResult.value.data : []
        );
      } else {
        setExtraItems([]);
      }

      if (todayResult.status === "fulfilled") {
        setTodaysSpecial(
          Array.isArray(todayResult.value.data) ? todayResult.value.data : []
        );
      }
      if (bhajiChartResult.status === "fulfilled") {
        setBhajiChart(bhajiChartResult.value.data);
      }
      else {
        setTodaysSpecial([]);
      }

      if (reviewsResult.status === "fulfilled") {
        setReviews(
          Array.isArray(reviewsResult.value.data) ? reviewsResult.value.data : []
        );
      } else {
        setReviews([]);
      }

      if (ratingsResult.status === "fulfilled") {
        const ratingData = ratingsResult.value.data as
          | { averageRating?: number; totalReviews?: number }
          | null;
        setAverageRating(Number(ratingData?.averageRating ?? 0));
        setTotalReviews(Number(ratingData?.totalReviews ?? 0));
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }

      setIsLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [shopId]);

  const weeklyMenu = [
    {
      day: "Monday",
      shortDay: "Mon",
      lunch: [
        { name: "Dal Tadka", isVeg: true },
        { name: "Aloo Gobi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
      dinner: [
        { name: "Paneer Do Pyaza", isVeg: true },
        { name: "Mix Veg", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Raita", isVeg: true },
      ],
    },
    {
      day: "Tuesday",
      shortDay: "Tue",
      lunch: [
        { name: "Rajma", isVeg: true },
        { name: "Bhindi Fry", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Pickle", isVeg: true },
      ],
      dinner: [
        { name: "Shahi Paneer", isVeg: true },
        { name: "Jeera Aloo", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
    },
    {
      day: "Wednesday",
      shortDay: "Wed",
      lunch: [
        { name: "Chole", isVeg: true },
        { name: "Baingan Bharta", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Onion", isVeg: true },
      ],
      dinner: [
        { name: "Kadai Paneer", isVeg: true },
        { name: "Lauki Sabzi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Papad", isVeg: true },
      ],
    },
    {
      day: "Thursday",
      shortDay: "Thu",
      lunch: [
        { name: "Kadhi Pakora", isVeg: true },
        { name: "Aloo Matar", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
      dinner: [
        { name: "Palak Paneer", isVeg: true },
        { name: "Dum Aloo", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Raita", isVeg: true },
      ],
    },
    {
      day: "Friday",
      shortDay: "Fri",
      lunch: [
        { name: "Dal Makhani", isVeg: true },
        { name: "Cabbage Sabzi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Sweet", isVeg: true },
      ],
      dinner: [
        { name: "Matar Paneer", isVeg: true },
        { name: "Tinda Masala", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
    },
    {
      day: "Saturday",
      shortDay: "Sat",
      lunch: [
        { name: "Puri Sabzi", isVeg: true },
        { name: "Chana Masala", isVeg: true },
        { name: "Rice", isVeg: true },
        { name: "Pickle", isVeg: true },
      ],
      dinner: [
        { name: "Paneer Tikka Masala", isVeg: true },
        { name: "Seasonal Sabzi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Raita", isVeg: true },
      ],
    },
    {
      day: "Sunday",
      shortDay: "Sun",
      lunch: [
        { name: "Special Thali", isVeg: true },
        { name: "Kheer", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Papad", isVeg: true },
      ],
      dinner: [
        { name: "Malai Kofta", isVeg: true },
        { name: "Mix Veg", isVeg: true },
        { name: "Rice & Naan", isVeg: true },
        { name: "Gulab Jamun", isVeg: true },
      ],
    },
  ];

  const tagsValue = shopDetails?.tags;
  const normalizedTags = Array.isArray(tagsValue)
    ? tagsValue.join(", ")
    : tagsValue ?? "";
  const deliveryTimeLabel = shopDetails?.deliveryTime
    ? String(shopDetails.deliveryTime)
    : "N/A";
  const bannerProps: ShopBannerData | null = shopDetails
    ? {
      name: shopDetails.name ?? "Mess",
      picture: shopDetails.picture ?? "",
      rating: Number(shopDetails.rating ?? averageRating ?? 0),
      reviewCount: Number(
        shopDetails.reviewCount ?? totalReviews ?? reviews.length
      ),
      address: {
        fullAddress: shopDetails.address?.fullAddress ?? "",
      },
      deliveryTime: deliveryTimeLabel,
      tags: normalizedTags,
      isVeg: Boolean(shopDetails.isVeg ?? false),
    }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {isLoading && (
        <div className="container mx-auto px-4 py-10 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading mess details...
        </div>
      )}

      {!isLoading && error && (
        <div className="container mx-auto px-4 py-10">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {error}
            </h2>
            <p className="text-sm text-muted-foreground">
              Please check the link and try again.
            </p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Go Back
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && bannerProps && (
        <>
          <ShopBanner {...bannerProps} />
          <TodaysMenu items={todaysSpecial} />
          <WeeklyMenu bhajiChart={bhajiChart} />
          <ExtraItems items={extraItems} />
          <ReviewsSection
            averageRating={averageRating || Number(shopDetails?.rating ?? 0)}
            totalReviews={
              totalReviews || Number(shopDetails?.reviewCount ?? reviews.length)
            }
            reviews={reviews}
          />
          <footer className="bg-card border-t border-border py-6">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground text-sm">
                (c) 2024 FoodConnect - Connecting you with home-style meals
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Page;
