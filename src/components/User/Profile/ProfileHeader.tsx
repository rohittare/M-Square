'use client'


import { useEffect, useState } from "react";
import { Camera, Mail, Phone, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Profile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

interface ProfileHeaderProps {
  profile: Profile;
  onAvatarUpdate: (avatarUrl: string) => Promise<boolean> | boolean;
}

export const ProfileHeader = ({ profile, onAvatarUpdate }: ProfileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB.");
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const handleConfirm = async () => {
    if (!selectedFile) {
      setUploadError("Please choose an image to continue.");
      return;
    }
    setSaving(true);
    try {
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const ok = await Promise.resolve(onAvatarUpdate(dataUrl));
      if (ok !== false) {
        setIsOpen(false);
        resetSelection();
      }
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return "U";
    return trimmed
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetSelection();
          }}
        >
          <button
            type="button"
            className="relative group"
            onClick={() => setIsOpen(true)}
            aria-label="Update profile picture"
          >
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {getInitials(profile.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg group-hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </span>
          </button>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update profile picture</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-32 w-32 overflow-hidden rounded-full border border-border bg-muted/40">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName || "Profile picture"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No preview
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF up to 5MB.
                </p>
                {uploadError && (
                  <p className="text-xs text-destructive">{uploadError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={saving || !selectedFile}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">
            {profile.fullName || "User"}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {profile.email || "Not provided"}
            </span>
            <span className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4" />
              {profile.phone || "Not provided"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
