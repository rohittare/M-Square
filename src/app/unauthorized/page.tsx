"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
