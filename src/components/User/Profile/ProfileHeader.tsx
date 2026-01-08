'use client'


import { useState } from "react";
import { Camera, Mail, Phone, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Profile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

interface ProfileHeaderProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
}

export const ProfileHeader = ({ profile, onProfileUpdate }: ProfileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    setIsOpen(false);
    toast.success("Profile updated successfully!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {getInitials(profile.fullName)}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">{profile.fullName}</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </span>
            <span className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4" />
              {profile.phone}
            </span>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={editedProfile.avatarUrl}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, avatarUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editedProfile.fullName}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, phone: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};