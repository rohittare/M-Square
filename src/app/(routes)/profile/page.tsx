"use client";

import { useState  , useEffect} from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/src/components/User/Profile/ProfileHeader";
import { ProfileInfo } from "@/src/components/User/Profile/ProfileInfo";
import { AddressesSection } from "@/src/components/User/Profile/AddressesSection";
import { SecuritySection } from "@/src/components/User/Profile/SecuritySection";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { set } from "zod";

export default function Page() {
  const router = useRouter();
  const [userData , setUserData] = useState(null);
  const [error , setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user/106e909a-ccae-43e5-a9db-243b79036bbe");
        setUserData(response.data);
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };
    fetchData();
  }, []);

  const [profile, setProfile] = useState({
    fullName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  });

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      title: "Hostel",
      fullAddress: "Room 204, Boys Hostel Block A",
      areaLandmark: "Near Main Gate",
      city: "Pune",
      pincode: "411007",
      isDefault: true,
    },
    {
      id: "2",
      title: "Home",
      fullAddress: "42, Green Valley Apartments",
      areaLandmark: "Opposite City Mall",
      city: "Mumbai",
      pincode: "400001",
      isDefault: false,
    },
  ]);

  const handleProfileUpdate = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
  };

  const handleAddAddress = (address: Omit<typeof addresses[number], "id">) => {
    setAddresses([...addresses, { ...address, id: Date.now().toString() }]);
  };

  const handleUpdateAddress = (
    id: string,
    address: Omit<typeof addresses[number], "id">
  ) => {
    setAddresses(addresses.map((a) => (a.id === id ? { ...address, id } : a)));
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
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

        <ProfileHeader
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />

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
            <ProfileInfo
              profile={profile}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <AddressesSection
              addresses={addresses}
              onAdd={handleAddAddress}
              onUpdate={handleUpdateAddress}
              onDelete={handleDeleteAddress}
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
