import RestaurantCard from "./RestaurantCard";

const restaurants = [
  {
    name: "The Biryani House",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=350&fit=crop",
    cuisines: ["Biryani", "North Indian", "Mughlai"],
    location: "Koramangala",
    rating: 4.3,
    reviews: "2.1K",
    discount: "FLAT 50% OFF",
    priceForTwo: "₹600 for two",
    distance: "2.5 km",
  },
  {
    name: "Toit Brewpub",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&h=350&fit=crop",
    cuisines: ["Continental", "North Indian", "Italian"],
    location: "Indiranagar",
    rating: 4.5,
    reviews: "15K",
    discount: "FLAT 20% OFF",
    priceForTwo: "₹1,800 for two",
    distance: "4.2 km",
  },
  {
    name: "Truffles",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=350&fit=crop",
    cuisines: ["American", "Continental", "Burgers"],
    location: "Koramangala",
    rating: 4.4,
    reviews: "8.5K",
    discount: "FLAT 30% OFF",
    priceForTwo: "₹700 for two",
    distance: "1.8 km",
  },
  {
    name: "Meghana Foods",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop",
    cuisines: ["Andhra", "Biryani", "South Indian"],
    location: "Residency Road",
    rating: 4.2,
    reviews: "12K",
    discount: "FLAT 40% OFF",
    priceForTwo: "₹500 for two",
    distance: "3.1 km",
  },
  {
    name: "The Black Pearl",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=350&fit=crop",
    cuisines: ["Seafood", "Continental", "Asian"],
    location: "MG Road",
    rating: 4.6,
    reviews: "5.2K",
    discount: "FLAT 25% OFF",
    priceForTwo: "₹2,200 for two",
    distance: "5.0 km",
  },
  {
    name: "Byg Brewski",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=350&fit=crop",
    cuisines: ["North Indian", "Chinese", "Continental"],
    location: "Sarjapur Road",
    rating: 4.1,
    reviews: "9.8K",
    discount: "FLAT 35% OFF",
    priceForTwo: "₹1,500 for two",
    distance: "7.5 km",
  },
  {
    name: "Empire Restaurant",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&h=350&fit=crop",
    cuisines: ["Biryani", "North Indian", "Kebabs"],
    location: "Brigade Road",
    rating: 4.0,
    reviews: "20K",
    discount: "FLAT 15% OFF",
    priceForTwo: "₹450 for two",
    distance: "2.8 km",
  },
  {
    name: "The Fatty Bao",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=350&fit=crop",
    cuisines: ["Asian", "Japanese", "Thai"],
    location: "Indiranagar",
    rating: 4.4,
    reviews: "6.3K",
    discount: "FLAT 45% OFF",
    priceForTwo: "₹1,400 for two",
    distance: "4.0 km",
  },
];

interface RestaurantGridProps {
  onAuthRequired?: () => void;
}

const RestaurantGrid = ({ onAuthRequired }: RestaurantGridProps) => {
  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Best Restaurants Near You</h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">Discover the finest dining experiences</p>
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">{restaurants.length * 10}+ restaurants</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard 
              key={index} 
              {...restaurant} 
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantGrid;
