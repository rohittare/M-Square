"use client";

import ShopBanner from "@/src/components/User/Mess/ShopBanner";
import TodaysMenu from "@/src/components/User/Mess/TodaysMenu";
import WeeklyMenu from "@/src/components/User/Mess/WeeklyMenu";
import ExtraItems from "@/src/components/User/Mess/ExtraItems";
import ReviewsSection from "@/src/components/User/Mess/ReviewsSection";
import { useEffect  , useState} from "react";
import api from "@/lib/api";

interface shopInterface {
  name: string;
  picture: string ;
  rating: number;
  reviewCount: number;
  address: {fullAddress: string};
  deliveryTime: string;
  tags: string;
  isVeg: boolean;
}


interface todaysSpecialInterface {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: boolean;
  available: boolean;
  image?: string;
}

const page = () => {
  const [extraItems , setExtraItems] = useState([]);
  const [shopDetails , setShopDetails] = useState({});
  const [todaysSpecial , setTodaysSpecial] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/shop/items/79779fcc-a484-4829-bc25-5b7a4b9149a9");
        setExtraItems(response.data);
        const shopResponse = await api.get("/shops/79779fcc-a484-4829-bc25-5b7a4b9149a9");
        setShopDetails(shopResponse.data);
        const todaysSpecialResponse = await api.get("/shop/79779fcc-a484-4829-bc25-5b7a4b9149a9/today-special");
        setTodaysSpecial(todaysSpecialResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Weekly Menu Data
  const weeklyMenu = [
    {
      day: "Monday",
      shortDay: "Mon",
      lunch: [
        { name: "Dal Tadka", isVeg: true },
        { name: "Aloo Gobi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
      dinner: [
        { name: "Paneer Do Pyaza", isVeg: true },
        { name: "Mix Veg", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Raita", isVeg: true },
      ],
    },
    {
      day: "Tuesday",
      shortDay: "Tue",
      lunch: [
        { name: "Rajma", isVeg: true },
        { name: "Bhindi Fry", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Pickle", isVeg: true },
      ],
      dinner: [
        { name: "Shahi Paneer", isVeg: true },
        { name: "Jeera Aloo", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
    },
    {
      day: "Wednesday",
      shortDay: "Wed",
      lunch: [
        { name: "Chole", isVeg: true },
        { name: "Baingan Bharta", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Onion", isVeg: true },
      ],
      dinner: [
        { name: "Kadai Paneer", isVeg: true },
        { name: "Lauki Sabzi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Papad", isVeg: true },
      ],
    },
    {
      day: "Thursday",
      shortDay: "Thu",
      lunch: [
        { name: "Kadhi Pakora", isVeg: true },
        { name: "Aloo Matar", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
      dinner: [
        { name: "Palak Paneer", isVeg: true },
        { name: "Dum Aloo", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Raita", isVeg: true },
      ],
    },
    {
      day: "Friday",
      shortDay: "Fri",
      lunch: [
        { name: "Dal Makhani", isVeg: true },
        { name: "Cabbage Sabzi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Sweet", isVeg: true },
      ],
      dinner: [
        { name: "Matar Paneer", isVeg: true },
        { name: "Tinda Masala", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
    },
    {
      day: "Saturday",
      shortDay: "Sat",
      lunch: [
        { name: "Puri Sabzi", isVeg: true },
        { name: "Chana Masala", isVeg: true },
        { name: "Rice", isVeg: true },
        { name: "Pickle", isVeg: true },
      ],
      dinner: [
        { name: "Paneer Tikka Masala", isVeg: true },
        { name: "Seasonal Sabzi", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Raita", isVeg: true },
      ],
    },
    {
      day: "Sunday",
      shortDay: "Sun",
      lunch: [
        { name: "Special Thali", isVeg: true },
        { name: "Kheer", isVeg: true },
        { name: "Rice & Roti", isVeg: true },
        { name: "Papad", isVeg: true },
      ],
      dinner: [
        { name: "Malai Kofta", isVeg: true },
        { name: "Mix Veg", isVeg: true },
        { name: "Rice & Naan", isVeg: true },
        { name: "Gulab Jamun", isVeg: true },
      ],
    },
  ];

  // Extra Items Data
  // const extraItems = [
  //   { id: "e1", name: "Buttermilk", price: 20, isVeg: true },
  //   { id: "e2", name: "Sweet Lassi", price: 35, isVeg: true },
  //   { id: "e3", name: "Extra Roti (4 pcs)", price: 30, isVeg: true },
  //   { id: "e4", name: "Extra Rice", price: 25, isVeg: true },
  //   { id: "e5", name: "Papad (2 pcs)", price: 15, isVeg: true },
  //   { id: "e6", name: "Raita", price: 25, isVeg: true },
  //   { id: "e7", name: "Green Salad", price: 20, isVeg: true },
  //   { id: "e8", name: "Gulab Jamun (2 pcs)", price: 40, isVeg: true },
  // ];

  // Reviews Data
  const reviews = [
    {
      id: "r1",
      userName: "Priya Sharma",
      rating: 5,
      comment: "Amazing home-style food! The paneer dishes are just like my mom makes. Highly recommended for anyone missing ghar ka khana.",
      date: "2 days ago",
    },
    {
      id: "r2",
      userName: "Rahul Verma",
      rating: 4,
      comment: "Good quantity and taste. Delivery is always on time. The thali is value for money!",
      date: "1 week ago",
    },
    {
      id: "r3",
      userName: "Sneha Gupta",
      rating: 5,
      comment: "Best tiffin service in the area. Fresh ingredients and consistent quality every day.",
      date: "2 weeks ago",
    },
    {
      id: "r4",
      userName: "Amit Kumar",
      rating: 4,
      comment: "Tasty food with good variety. Would love to see more South Indian options.",
      date: "3 weeks ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Banner */}
      <ShopBanner {...shopDetails as shopInterface} />

      {/* Today's Menu */}
      <TodaysMenu items={todaysSpecial} />

      {/* Weekly Menu */}
      <WeeklyMenu weeklyMenu={weeklyMenu} />

      {/* Extra Items */}
      <ExtraItems items={extraItems} />

      {/* Reviews Section */}
      <ReviewsSection
        averageRating={4.5}
        totalReviews={234}
        reviews={reviews}
      />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 FoodConnect - Connecting you with home-style meals
          </p>
        </div>
      </footer>
    </div>
  );
};

export default page;
