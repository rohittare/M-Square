import { format } from "date-fns";

export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED"
  | "REJECTED";

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Other";
export type PaymentMethod = "Cash" | "UPI" | "Card" | "Other";

export interface OrderItem {
  itemId?: string;
  name: string;
  quantity: number;
  priceAtOrderTime: number;
  veg?: boolean;
}

export interface OwnerOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  mealType: MealType;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderTime: string;
  createdAt: Date | null;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
}

export interface ShopItem {
  itemId: string;
  name: string;
  description?: string;
  priceAtOrderTime: number;
  category?: string;
  veg?: boolean;
  available?: boolean;
  special?: boolean;
}

export const getShopIdFromStorage = () => {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem("user_id") ??
    sessionStorage.getItem("shopId") ??
    null
  );
};

const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

export const formatOrderTime = (date: Date | null) => {
  if (!date) return "N/A";
  const now = new Date();
  const today = now.toDateString();
  const target = date.toDateString();
  if (today === target) {
    return format(date, "h:mm a");
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === target) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, h:mm a");
};

export const formatRelativeTime = (date: Date | null) => {
  if (!date) return "N/A";
  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return format(date, "MMM d");
};

export const deriveMealType = (date: Date | null): MealType => {
  if (!date) return "Other";
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "Breakfast";
  if (hour >= 11 && hour < 16) return "Lunch";
  if (hour >= 16 && hour < 22) return "Dinner";
  return "Other";
};

export const normalizePaymentMethod = (value: unknown): PaymentMethod => {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (normalized.includes("upi")) return "UPI";
  if (normalized.includes("card")) return "Card";
  if (normalized.includes("cash") || normalized.includes("cod"))
    return "Cash";
  return "Other";
};

export const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();
  switch (normalized) {
    case "PLACED":
    case "NEW":
      return "PLACED";
    case "ACCEPTED":
    case "CONFIRMED":
      return "ACCEPTED";
    case "PREPARING":
    case "IN_PROGRESS":
      return "PREPARING";
    case "READY":
    case "READY_FOR_PICKUP":
      return "READY";
    case "DELIVERED":
    case "COMPLETED":
      return "DELIVERED";
    case "CANCELLED":
    case "CANCELED":
      return "CANCELLED";
    case "REJECTED":
    case "DECLINED":
      return "REJECTED";
    default:
      return "PLACED";
  }
};

export const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "PLACED":
      return "Placed";
    case "ACCEPTED":
      return "Accepted";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    case "REJECTED":
      return "Rejected";
    default:
      return "Placed";
  }
};

const parseItems = (rawItems: unknown): OrderItem[] => {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map((item) => {
    const record = item as Record<string, unknown>;
    const name =
      (record.name as string | undefined) ??
      (record.itemName as string | undefined) ??
      (record.title as string | undefined) ??
      (record.menuItem as { name?: string } | undefined)?.name ??
      "Item";
    const quantity = Number(
      (record.quantity as number | string | undefined) ??
        (record.qty as number | string | undefined) ??
        (record.count as number | string | undefined) ??
        1
    );
    const priceAtOrderTime = Number(
      (record.priceAtOrderTime as number | string | undefined) ??
        (record.unitPrice as number | string | undefined) ??
        (record.itemPrice as number | string | undefined) ??
        (record.menuItem as { priceAtOrderTime?: number } | undefined)?.priceAtOrderTime ??
        0
    );
    const rawItemId =
      (record.itemId as string | number | undefined) ??
      (record.menuItemId as string | number | undefined) ??
      (record.id as string | number | undefined) ??
      (record.menuItem as { id?: string | number; itemId?: string | number } | undefined)
        ?.id ??
      (record.menuItem as { itemId?: string | number } | undefined)?.itemId;
    const itemId = rawItemId ? String(rawItemId) : undefined;
    const veg =
      (record.veg as boolean | undefined) ??
      (record.isVeg as boolean | undefined) ??
      (record.vegetarian as boolean | undefined) ??
      (record.menuItem as { veg?: boolean; isVeg?: boolean } | undefined)?.veg ??
      (record.menuItem as { isVeg?: boolean } | undefined)?.isVeg;

    return {
      itemId,
      name,
      quantity: Number.isNaN(quantity) ? 1 : quantity,
      priceAtOrderTime: Number.isNaN(priceAtOrderTime) ? 0 : priceAtOrderTime,
      veg,
    };
  });
};

const parseAddress = (raw: Record<string, unknown>) => {
  const addressRaw =
    (raw.address as unknown) ??
    (raw.deliveryAddress as unknown) ??
    (raw.userAddress as unknown) ??
    (raw.addressInfo as unknown);

  if (typeof addressRaw === "string" && addressRaw.trim()) {
    return addressRaw;
  }

  if (addressRaw && typeof addressRaw === "object") {
    const addressObj = addressRaw as Record<string, unknown>;
    const full =
      (addressObj.fullAddress as string | undefined) ??
      (addressObj.addressLine as string | undefined) ??
      (addressObj.street as string | undefined);
    if (full && full.trim()) return full;

    const parts = [
      addressObj.area,
      addressObj.city,
      addressObj.state,
      addressObj.pincode,
    ]
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
    if (parts.length > 0) return parts.join(", ");
  }

  return "N/A";
};

export const mapOwnerOrder = (rawOrder: Record<string, unknown>): OwnerOrder => {
  const rawId =
    (rawOrder.orderId as string | number | undefined) ??
    (rawOrder.id as string | number | undefined) ??
    (rawOrder.order_id as string | number | undefined);
  const id = rawId ? String(rawId) : "UNKNOWN";

  const user =
    (rawOrder.user as Record<string, unknown> | undefined) ??
    (rawOrder.customer as Record<string, unknown> | undefined) ??
    (rawOrder.userInfo as Record<string, unknown> | undefined) ??
    (rawOrder.userDetails as Record<string, unknown> | undefined) ??
    {};

  const rawCustomer =
    typeof rawOrder.customer === "string" ? rawOrder.customer : undefined;

  const customerName =
    (user.fullName as string | undefined) ??
    (user.name as string | undefined) ??
    (user.username as string | undefined) ??
    (rawOrder.customerName as string | undefined) ??
    rawCustomer ??
    (user.email as string | undefined) ??
    "Customer";

  const phone =
    (user.phone as string | undefined) ??
    (rawOrder.customerPhone as string | undefined) ??
    (rawOrder.phone as string | undefined) ??
    (rawOrder.mobile as string | undefined) ??
    "N/A";

  const primaryItems = parseItems(rawOrder.items);
  const secondaryItems = parseItems(rawOrder.orderItems);
  const tertiaryItems = parseItems(rawOrder.order_items);
  const items =
    primaryItems.length > 0
      ? primaryItems
      : secondaryItems.length > 0
      ? secondaryItems
      : tertiaryItems;

  const computedTotal = items.reduce(
    (sum, item) => sum + item.priceAtOrderTime * item.quantity,
    0
  );

  const totalAmount = Number(
    (rawOrder.totalAmount as number | string | undefined) ??
      (rawOrder.total as number | string | undefined) ??
      (rawOrder.amount as number | string | undefined) ??
      (rawOrder.totalPrice as number | string | undefined) ??
      computedTotal
  );

  const createdAt =
    parseDate(rawOrder.createdAt) ??
    parseDate(rawOrder.created_at) ??
    parseDate(rawOrder.placedAt) ??
    parseDate(rawOrder.orderTime) ??
    parseDate(rawOrder.date) ??
    parseDate(rawOrder.timestamp) ??
    null;

  const status = normalizeOrderStatus(rawOrder.status);
  const paymentMethod = normalizePaymentMethod(
    (rawOrder.paymentMethod as unknown) ??
      (rawOrder.payment as unknown) ??
      (rawOrder.paymentMode as unknown) ??
      (rawOrder.payment_type as unknown)
  );

  const orderTime = formatOrderTime(createdAt);
  const mealType = deriveMealType(createdAt);

  const specialInstructions =
    (rawOrder.specialInstructions as string | undefined) ??
    (rawOrder.note as string | undefined) ??
    (rawOrder.instructions as string | undefined);

  return {
    id,
    customerName,
    phone,
    address: parseAddress(rawOrder),
    mealType,
    items,
    totalAmount: Number.isNaN(totalAmount) ? computedTotal : totalAmount,
    status,
    orderTime,
    createdAt,
    paymentMethod,
    specialInstructions,
  };
};
