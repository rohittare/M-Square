import { Star, MapPin, Heart } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  picture: string;
  tags: string[];
  address: {fullAddress: string};
  rating: number;
  reviews: string;
  discount: string;
  priceForTwo: string;
  distance: string;

}

const RestaurantCard = ({
  name,
  picture,
  tags,
  address,
  rating,
  reviews,
  discount,
  priceForTwo,
  distance,

}: RestaurantCardProps) => {
  const isSaved = (name);


  return (
    <div className="bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img 
          src={picture} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Discount Badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3">
          <span className="text-primary-foreground font-bold text-sm sm:text-lg">{discount}</span>
        </div>
        {/* Pro Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <span className="bg-gradient-to-r from-[#8a584b] to-[#d4a574] text-primary-foreground text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            PRO EXTRA
          </span>
        </div>
        {/* Save Button */}
        <button
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all ${
            isSaved 
              ? "bg-swiggy-orange text-primary-foreground" 
              : "bg-white/90 text-muted-foreground hover:text-swiggy-orange"
          }`}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-foreground text-base sm:text-lg leading-tight line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 bg-swiggy-green text-primary-foreground px-1.5 py-0.5 rounded text-xs sm:text-sm font-semibold shrink-0">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Cuisines */}
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1 mb-1">
          {tags}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="line-clamp-1">{address?.fullAddress}</span>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-xs sm:text-sm pt-2 sm:pt-3 border-t border-border">
          <span className="text-muted-foreground">200$</span>
          <span className="text-muted-foreground">10km</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

