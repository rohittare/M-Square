"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  Shield,
  Store,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { useAddress, UserAddress } from "@/src/context/AddressContext";
import { getAuthSnapshot, type UserRole } from "@/lib/auth";

type UserProfileResponse = {
  userId: string;
  fullName: string | null;
  email: string | null;
  userProfilePicture: string | null;
  addresses?: UserAddress[];
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

const Header = () => {
  const { data: session } = useSession();
  const { selectedAddress, setSelectedAddress } = useAddress();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAddressMenu, setShowAddressMenu] = useState(false);

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authRole, setAuthRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(
    null
  );
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionUserId = (session?.user as { id?: string } | undefined)?.id;
    if (sessionUserId) {
      sessionStorage.setItem("user_id", sessionUserId);
      setAuthUserId(sessionUserId);
      return;
    }

    const storedUserId = sessionStorage.getItem("user_id");
    if (storedUserId) {
      setAuthUserId(storedUserId);
      return;
    }

    const token = sessionStorage.getItem("access_token");
    if (!token) return;
    const payload = parseJwtPayload(token);
    const userId = typeof payload?.sub === "string" ? payload.sub : null;
    if (userId) {
      sessionStorage.setItem("user_id", userId);
      setAuthUserId(userId);
    }
  }, [session?.user]);

  useEffect(() => {
    const snapshot = getAuthSnapshot();
    const sessionAuth = Boolean(session?.user?.email || session?.user?.name);
    setAuthRole(snapshot.role);
    setIsAuthenticated(snapshot.isAuthenticated || sessionAuth);
    if (!snapshot.isAuthenticated && !sessionAuth) {
      setAuthUserId(null);
    }
  }, [session?.user, authUserId]);

  const loadUserProfile = useCallback(async () => {
    if (!authUserId || isLoadingUser || hasFetchedUser) return;
    setIsLoadingUser(true);
    setUserError(null);

    try {
      const response = await api.get<UserProfileResponse>(`/user/${authUserId}`);
      const data = response.data;
      setUserProfile(data ?? null);
      setAddresses(Array.isArray(data?.addresses) ? data.addresses : []);
      setHasFetchedUser(true);
    } catch {
      setUserError("Unable to load your saved addresses.");
    } finally {
      setIsLoadingUser(false);
    }
  }, [authUserId, hasFetchedUser, isLoadingUser]);

  useEffect(() => {
    if (authUserId && !hasFetchedUser) {
      void loadUserProfile();
    }
  }, [authUserId, hasFetchedUser, loadUserProfile]);

  useEffect(() => {
    if (showAddressMenu && !hasFetchedUser) {
      void loadUserProfile();
    }
  }, [showAddressMenu, hasFetchedUser, loadUserProfile]);

  const displayName = useMemo(() => {
    if (userProfile?.fullName) return userProfile.fullName;
    if (session?.user?.name) return session.user.name;
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("user_email");
      if (storedEmail) return storedEmail;
    }
    return "Profile";
  }, [session?.user?.name, userProfile?.fullName]);

  const displayEmail = useMemo(() => {
    if (userProfile?.email) return userProfile.email;
    if (session?.user?.email) return session.user.email;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("user_email") ?? "";
    }
    return "";
  }, [session?.user?.email, userProfile?.email]);

  const avatarUrl =
    userProfile?.userProfilePicture ?? session?.user?.image ?? "";

  const selectedPrimaryLabel = useMemo(() => {
    if (!selectedAddress) return "Select address";
    const parts = [selectedAddress.area, selectedAddress.city].filter(Boolean);
    const base = parts.length > 0 ? parts.join(", ") : selectedAddress.fullAddress;
    const suffix = selectedAddress?.pincode ? ` - ${selectedAddress.pincode}` : "";
    return `${base ?? "Saved address"}${suffix}`;
  }, [selectedAddress]);

  const selectedSecondaryLabel =
    selectedAddress?.fullAddress ?? "Choose a delivery address";

  const handleSelectAddress = (address: UserAddress) => {
    setSelectedAddress(address);
    setShowAddressMenu(false);
  };

  const showUserNavigation = !authRole || authRole === "USER";

  const AddressMenu = ({
    align = "left",
    compact = false,
  }: {
    align?: "left" | "right";
    compact?: boolean;
  }) => (
    <div className="relative">
      <button
        onClick={() => setShowAddressMenu((prev) => !prev)}
        className={`flex items-center gap-2 text-left ${
          compact ? "w-full" : ""
        }`}
        aria-expanded={showAddressMenu}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <MapPin className="w-4 h-4 text-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Deliver to
            </p>
            <p className="text-sm font-semibold text-foreground truncate max-w-[220px]">
              {selectedPrimaryLabel}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[240px]">
              {selectedSecondaryLabel}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-foreground" />
      </button>

      {showAddressMenu && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-2 w-[320px] max-w-[90vw] rounded-xl border border-border bg-background shadow-lg z-20`}
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Saved Addresses
            </p>
            <p className="text-sm font-semibold text-foreground">
              {selectedPrimaryLabel}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {selectedSecondaryLabel}
            </p>
          </div>

          <div className="max-h-72 overflow-auto">
            {!authUserId && (
              <div className="px-4 py-4 text-sm text-muted-foreground">
                Sign in to view your saved addresses.
              </div>
            )}

            {authUserId && isLoadingUser && (
              <div className="px-4 py-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading addresses...
              </div>
            )}

            {authUserId && userError && !isLoadingUser && (
              <div className="px-4 py-4 text-sm text-muted-foreground">
                {userError}
              </div>
            )}

            {authUserId &&
              !isLoadingUser &&
              !userError &&
              addresses.length === 0 && (
                <div className="px-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    No saved addresses
                  </p>
                  <Link
                    href="/profile"
                    className="mt-3 inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowAddressMenu(false)}
                  >
                    Add Address
                  </Link>
                </div>
              )}

            {authUserId &&
              !isLoadingUser &&
              !userError &&
              addresses.map((address) => {
                const isSelected =
                  selectedAddress?.addressId === address.addressId;
                const headingParts = [address.area, address.city].filter(Boolean);
                const heading =
                  headingParts.length > 0
                    ? headingParts.join(", ")
                    : "Saved address";
                const pincode = address.pincode ? ` - ${address.pincode}` : "";

                return (
                  <button
                    key={address.addressId}
                    onClick={() => handleSelectAddress(address)}
                    className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 transition-colors ${
                      isSelected
                        ? "bg-primary/5 ring-1 ring-primary/30"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span>{address.type ?? "ADDRESS"}</span>
                      {isSelected && (
                        <span className="text-primary">Selected</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {heading}
                      {pincode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {address.fullAddress ?? "No address details provided"}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <svg
                viewBox="0 0 48 48"
                className="w-7 h-7 sm:w-8 sm:h-8"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="m-square-logo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="40" height="40" rx="8" fill="url(#m-square-logo)" />
                <rect
                  x="6.5"
                  y="6.5"
                  width="35"
                  height="35"
                  rx="6.5"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M14 32V16l10 10 10-10v16"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                M Square
              </span>
            </Link>

            {showUserNavigation && (
              <div className="hidden md:flex items-center gap-1">
                <AddressMenu />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <div
              className={
                showUserNavigation
                  ? "flex items-center gap-6 xl:gap-8"
                  : "hidden"
              }
            >
            <NavItem icon="🔍" label="Search" />
            <NavItem icon="💼" label="Swiggy Corporate" />
            <NavItem
              label="Dineout"
              isActive
              customIcon={
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">
                    D
                  </span>
                </div>
              }
            />

            <NavItem icon="🛒" label="Cart" />

            </div>
            {!showUserNavigation && authRole === "ADMIN" ? (
              <NavItem
                label="Admin Panel"
                href="/admin/AdminDashboard"
                customIcon={<Shield className="w-5 h-5" />}
              />
            ) : !showUserNavigation && authRole === "SHOP" ? (
              <NavItem
                label="Owner Dashboard"
                href="/owner/dashboard"
                customIcon={<Store className="w-5 h-5" />}
              />
            ) : null}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 cursor-pointer text-foreground"
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                >
                  <div className="w-9 h-9 rounded-full border border-border bg-muted overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-background rounded-lg shadow-lg border border-border py-2">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">
                        {displayName}
                      </p>
                      {displayEmail && (
                        <p className="text-xs text-muted-foreground truncate">
                          {displayEmail}
                        </p>
                      )}
                    </div>
                    {showUserNavigation && (
                      <Link
                        href="/profile"
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 cursor-pointer text-foreground group"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Sign In
                </span>
              </Link>
            )}
          </nav>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden border-t border-border py-4 space-y-4">
            {showUserNavigation && (
              <div className="md:hidden">
                <AddressMenu align="left" compact />
              </div>
            )}

            <div
              className={
                showUserNavigation ? "flex flex-wrap gap-4" : "hidden"
              }
            >
              <NavItem icon="ðŸ”" label="Search" />
              <NavItem icon="ðŸ’¼" label="Corporate" />
              <NavItem
                label="Dineout"
                isActive
                customIcon={
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">
                      D
                    </span>
                  </div>
                }
              />
              <NavItem icon="ðŸ›’" label="Cart" />
            </div>
            {!showUserNavigation && authRole === "ADMIN" ? (
              <div className="flex flex-wrap gap-4">
                <NavItem
                  label="Admin Panel"
                  href="/admin/AdminDashboard"
                  customIcon={<Shield className="w-5 h-5" />}
                />
              </div>
            ) : !showUserNavigation && authRole === "SHOP" ? (
              <div className="flex flex-wrap gap-4">
                <NavItem
                  label="Owner Dashboard"
                  href="/owner/dashboard"
                  customIcon={<Store className="w-5 h-5" />}
                />
              </div>
            ) : null}

            <div className="pt-2 border-t border-border">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-border bg-muted overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {displayName}
                      </p>
                      {displayEmail && (
                        <p className="text-xs text-muted-foreground truncate">
                          {displayEmail}
                        </p>
                      )}
                    </div>
                  </div>
                  {showUserNavigation && (
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 text-foreground"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavItem = ({
  icon,
  label,
  isActive,
  customIcon,
  href,
}: {
  icon?: string;
  label: string;
  isActive?: boolean;
  customIcon?: ReactNode;
  href?: string;
}) => {
  const content = (
    <div
      className={`flex items-center gap-2 cursor-pointer group ${
        isActive ? "text-primary font-semibold" : "text-foreground"
      }`}
    >
      {customIcon || <span className="text-lg">{icon}</span>}
      <span className="text-sm font-medium group-hover:text-primary transition-colors">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
};

export default Header;
