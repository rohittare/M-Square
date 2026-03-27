"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronUp, Loader2, ShoppingBag, X } from "lucide-react";
import api from "@/lib/api";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface CartItem {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
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
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number | null>(null);

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

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const totalAmount = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    if (!isSheetOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isSheetOpen]);

  useEffect(() => {
    if (!isSheetOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSheetOpen]);

  useEffect(() => {
    if (isSheetOpen) return;
    setDragOffset(0);
    setIsDragging(false);
    dragStartY.current = null;
  }, [isSheetOpen]);

  useEffect(() => {
    if (itemCount === 0) {
      setIsSheetOpen(false);
    }
  }, [itemCount]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

  const addToCart = (itemId: string, itemName: string, price: number) => {
    const wasInCart = Boolean(cart[itemId]);
    setCart((prev) => {
      const existing = prev[itemId];
      const nextQuantity = existing ? existing.quantity + 1 : 1;
      return {
        ...prev,
        [itemId]: {
          itemId,
          itemName,
          price,
          quantity: nextQuantity,
        },
      };
    });
    if (!wasInCart) {
      toast.success(`${itemName} added to your order.`);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      const nextQuantity = existing.quantity + delta;
      if (nextQuantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: nextQuantity,
        },
      };
    });
  };

  const handleAddTodaysSpecial = (item: TodaysSpecialItem) => {
    addToCart(item.id, item.name, item.price);
  };

  const handleAddExtraItem = (item: ExtraItem) => {
    addToCart(item.itemId, item.name, item.price);
  };

  const handlePlaceOrder = async () => {
    if (!shopId || cartItems.length === 0) return;
    setIsPlacingOrder(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER ?? "";
      const endpoint = baseUrl ? `${baseUrl}/orders` : "/orders";
      const response = await api.post(endpoint , {
        shopId,
        items: cartItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      })

      const data = await response.data;

      if (!response.status || response.status < 200 || response.status >= 300) {
        const message =
          (data as { message?: string } | null)?.message ??
          "Failed to place order.";
        throw new Error(message);
      }

      toast.success("Order placed successfully!");
      setCart({});
      setIsSheetOpen(false);

      const orderId =
        (data as { orderId?: string; id?: string } | null)?.orderId ??
        (data as { orderId?: string; id?: string } | null)?.id;

    } catch (err) {
      const rawMessage =
        err instanceof Error ? err.message : "Connection error, please retry.";
      const normalized = rawMessage.toLowerCase();
      const message =
        normalized.includes("failed to fetch") || normalized.includes("network")
          ? "Connection error, please retry."
          : rawMessage;
      toast.error(message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (!isSheetOpen) return;
    dragStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isSheetOpen || dragStartY.current === null) return;
    const delta = event.clientY - dragStartY.current;
    setDragOffset(delta > 0 ? delta : 0);
  };

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!isSheetOpen || dragStartY.current === null) return;
    const delta = event.clientY - dragStartY.current;
    if (delta > 120) {
      setIsSheetOpen(false);
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartY.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

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
  const sheetTransform = isSheetOpen
    ? `translateY(${dragOffset}px)`
    : "translateY(100%)";
  const isFabVisible = itemCount > 0 && !isSheetOpen;

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
          <TodaysMenu
            items={todaysSpecial}
            cart={cart}
            onAdd={handleAddTodaysSpecial}
            onUpdateQuantity={updateQuantity}
          />
          <WeeklyMenu bhajiChart={bhajiChart} />
          <ExtraItems
            items={extraItems}
            cart={cart}
            onAdd={handleAddExtraItem}
            onUpdateQuantity={updateQuantity}
          />
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

      {/* Floating Cart Button */}
      <button
        type="button"
        onClick={() => setIsSheetOpen(true)}
        className={`fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between gap-4 rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-lg transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 ${
          isFabVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-24 opacity-0"
        } md:left-auto md:right-6 md:w-[360px]`}
        aria-label="Open cart"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div className="text-left">
            <p className="text-sm text-primary-foreground/80">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
            <p className="text-base font-semibold">
              ₹{formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          View Cart
          <ChevronUp className="h-4 w-4" />
        </div>
      </button>

      {/* Bottom Sheet Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isSheetOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSheetOpen(false)}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-sheet-title"
        className={`fixed bottom-0 left-0 right-0 z-50 mx-auto flex w-full max-w-lg max-h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl md:rounded-2xl ${
          isDragging
            ? "transition-none"
            : "transition-transform duration-300 ease-out"
        } ${isSheetOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ transform: sheetTransform }}
      >
        <div
          className="flex items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="cart-sheet-title" className="text-lg font-semibold">
              Your Order
            </h2>
            <p className="text-sm text-muted-foreground">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSheetOpen(false)}
            className="h-11 w-11 rounded-full border border-border text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="Close cart"
          >
            <X className="mx-auto h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Add items to get started.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {cartItems.map((item) => (
                <div key={item.itemId} className="py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {item.itemName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-foreground">
                      ₹{formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-secondary/30 px-5 py-4">
          <div className="flex items-center justify-between text-base font-semibold mb-4">
            <span>Total</span>
            <span className="text-lg text-primary">
              ₹{formatCurrency(totalAmount)}
            </span>
          </div>
          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || cartItems.length === 0}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            {isPlacingOrder ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
