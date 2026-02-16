"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/src/components/User/Profile/ProfileHeader";
import { ProfileInfo } from "@/src/components/User/Profile/ProfileInfo";
import { AddressesSection } from "@/src/components/User/Profile/AddressesSection";
import { SecuritySection } from "@/src/components/User/Profile/SecuritySection";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  type ProfileState = {
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string;
  };

  type Address = {
    addressId: string;
    userId: string;
    type: string;
    area: string;
    city: string;
    pincode: string;
    fullAddress: string;
  };

  type UserProfileResponse = {
    userId: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    userProfilePicture: string | null;
    role: string | null;
    active: boolean | null;
    addresses?: Address[];
    createdDate: string | null;
  };

  const parseJwtPayload = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      const json = atob(padded);
      return JSON.parse(json) as { sub?: string };
    } catch {
      return null;
    }
  };

  const getUserIdFromAuth = () => {
    if (typeof window === "undefined") return null;
    const storedUserId = sessionStorage.getItem("user_id");
    if (storedUserId) return storedUserId;

    const token = sessionStorage.getItem("access_token");
    if (!token) return null;
    const payload = parseJwtPayload(token);
    const userId = typeof payload?.sub === "string" ? payload.sub : null;
    if (userId) {
      sessionStorage.setItem("user_id", userId);
    }
    return userId;
  };

  const updateSchema = z.object({
    fullName: z.string().trim().min(2, "Full name is required").max(100),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || /^[\d\s()+-]{7,15}$/.test(value),
        "Please enter a valid phone number"
      ),
    avatarUrl: z.string().trim().url("Please enter a valid URL").or(z.literal("")),
  });

  const addressSchema = z.object({
    type: z.enum(["HOME", "WORK", "OTHER"]),
    area: z.string().trim().min(2, "Area is required"),
    city: z.string().trim().min(2, "City is required"),
    pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    fullAddress: z.string().trim().min(5, "Full address is required"),
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      const userId = getUserIdFromAuth();
      if (!userId) {
        setError("Please sign in to view your profile.");
        setLoading(false);
        return;
      }
      try {
        const [profileResult, addressResult] = await Promise.allSettled([
          api.get<UserProfileResponse>(`/user/${userId}`),
          api.get<Address[]>(`/user/address/userid/${userId}`),
        ]);

        if (!isMounted) return;

        if (profileResult.status === "fulfilled") {
          const data = profileResult.value.data;
          setProfile({
            fullName: data?.fullName ?? "",
            email: data?.email ?? "",
            phone: data?.phone ?? "",
            avatarUrl: data?.userProfilePicture ?? "",
          });
          setError("");
        } else {
          setError("Failed to fetch user data.");
          toast.error("Failed to load profile. Please try again.");
        }

        if (addressResult.status === "fulfilled") {
          setAddresses(Array.isArray(addressResult.value.data) ? addressResult.value.data : []);
        } else {
          toast.error("Failed to load addresses.");
        }
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to fetch user data.");
        toast.error("Failed to load profile. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleProfileUpdate = async (updatedProfile: ProfileState) => {
    const userId = getUserIdFromAuth();
    if (!userId) {
      setError("Please sign in to update your profile.");
      toast.error("Please sign in to update your profile.");
      return false;
    }

    const parsed = updateSchema.safeParse(updatedProfile);
    if (!parsed.success) {
      const message = parsed.error.issues?.[0]?.message ?? "Invalid profile data.";
      toast.error(message);
      return false;
    }

    try {
      await api.put("/user/update", {
        userId,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone || null,
        userProfilePicture: parsed.data.avatarUrl || null,
      });

      setProfile((prev) => ({
        ...prev,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        avatarUrl: parsed.data.avatarUrl,
      }));
      toast.success("Profile updated successfully!");
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update profile.";
        toast.error(message);
        return false;
      }
      toast.error("An unexpected error occurred.");
      return false;
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    const userId = getUserIdFromAuth();
    if (!userId) {
      setError("Please sign in to update your profile.");
      toast.error("Please sign in to update your profile.");
      return false;
    }

    const fullName = profile.fullName.trim();
    if (!fullName) {
      toast.error("Please add your full name before updating the photo.");
      return false;
    }

    try {
      await api.put("/user/update", {
        userId,
        fullName,
        phone: profile.phone || null,
        userProfilePicture: avatarUrl,
      });
      setProfile((prev) => ({ ...prev, avatarUrl }));
      toast.success("Profile picture updated!");
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update profile picture.";
        toast.error(message);
        return false;
      }
      toast.error("An unexpected error occurred.");
      return false;
    }
  };

  const handleAddAddress = async (address: Omit<Address, "addressId">) => {
    const userId = getUserIdFromAuth();
    if (!userId) {
      toast.error("Please sign in to add an address.");
      return false;
    }
    const parsed = addressSchema.safeParse(address);
    if (!parsed.success) {
      toast.error(parsed.error.errors?.[0]?.message ?? "Invalid address data.");
      return false;
    }

    try {
      const response = await api.post<Address>("/user/address", {
        userId,
        ...parsed.data,
      });
      setAddresses((prev) => [...prev, response.data]);
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to save address.";
        toast.error(message);
        return false;
      }
      toast.error("An unexpected error occurred.");
      return false;
    }
  };

  const handleUpdateAddress = async (
    addressId: string,
    address: Omit<Address, "addressId">
  ) => {
    const userId = getUserIdFromAuth();
    if (!userId) {
      toast.error("Please sign in to update an address.");
      return false;
    }
    const parsed = addressSchema.safeParse(address);
    if (!parsed.success) {
      toast.error(parsed.error.errors?.[0]?.message ?? "Invalid address data.");
      return false;
    }

    try {
      const response = await api.put<Address>(`/user/address/${addressId}`, {
        userId,
        ...parsed.data,
      });
      setAddresses((prev) =>
        prev.map((addr) => (addr.addressId === addressId ? response.data : addr))
      );
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update address.";
        toast.error(message);
        return false;
      }
      toast.error("An unexpected error occurred.");
      return false;
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const userId = getUserIdFromAuth();
    if (!userId) {
      toast.error("Please sign in to delete an address.");
      return false;
    }
    if (!addresses.some((addr) => addr.addressId === addressId)) {
      toast.error("Address not found.");
      return false;
    }
    try {
      await api.delete(`/user/address/${addressId}`);
      setAddresses((prev) => prev.filter((addr) => addr.addressId !== addressId));
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to delete address.";
        toast.error(message);
        return false;
      }
      toast.error("An unexpected error occurred.");
      return false;
    }
  };

  const handleFetchAddressById = async (addressId: string) => {
    try {
      const response = await api.get<Address>(`/user/address/${addressId}`);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to load address details.";
        toast.error(message);
        return null;
      }
      toast.error("An unexpected error occurred.");
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && (
          <ProfileHeader
            profile={profile}
            onAvatarUpdate={handleAvatarUpdate}
          />
        )}

        <Tabs defaultValue="profile" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Profile Info
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Addresses
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            {!loading && (
              <ProfileInfo
                profile={profile}
                onUpdate={handleProfileUpdate}
              />
            )}
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <AddressesSection
              addresses={addresses}
              onAdd={handleAddAddress}
              onUpdate={handleUpdateAddress}
              onDelete={handleDeleteAddress}
              onFetchAddress={handleFetchAddressById}
            />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecuritySection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
