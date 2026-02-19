"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { ReactNode, useState } from "react";
import { AddressProvider } from "@/src/context/AddressContext";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AddressProvider>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          {children}
        </TooltipProvider>
      </AddressProvider>
    </QueryClientProvider>
  );
}
