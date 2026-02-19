"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type UserAddress = {
  addressId: string;
  userId?: string | null;
  type?: string | null;
  area?: string | null;
  city?: string | null;
  pincode?: string | null;
  fullAddress?: string | null;
};

type AddressContextValue = {
  selectedAddress: UserAddress | null;
  setSelectedAddress: (address: UserAddress | null) => void;
};

const AddressContext = createContext<AddressContextValue | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);

  const value = useMemo(
    () => ({
      selectedAddress,
      setSelectedAddress,
    }),
    [selectedAddress]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
}
