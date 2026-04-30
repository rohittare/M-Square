'use client'

import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Profile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

interface ProfileInfoProps {
  profile: Profile;
  onUpdate: (profile: Profile) => Promise<boolean> | boolean;
}

export const ProfileInfo = ({ profile, onUpdate }: ProfileInfoProps) => {
  type ProfileFormState = Pick<Profile, "fullName" | "phone">;
  const [draft, setDraft] = useState<ProfileFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const formData: ProfileFormState = draft ?? {
    fullName: profile.fullName,
    phone: profile.phone,
  };

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setDraft((prev) => ({
      ...(prev ?? { fullName: profile.fullName, phone: profile.phone }),
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await Promise.resolve(onUpdate({ ...profile, ...formData }));
    setSaving(false);
    if (ok !== false) {
      setDraft(null);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="pl-10 bg-background border-input focus:border-primary"
              placeholder="Enter your full name"
              disabled={saving}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              value={profile.email}
              readOnly
              className="pl-10 bg-muted border-input cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="pl-10 bg-background border-input focus:border-primary"
              placeholder="+91 98765 43210"
              disabled={saving}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};
