import { Search } from "lucide-react";

const DineoutHero = () => {
  return (
    <div className="bg-gradient-to-r from-[#171a29] to-[#2d1f3d] text-primary-foreground py-6 sm:py-8 px-4">
      <div className="container mx-auto">
        {/* Dineout Logo and Tagline */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-swiggy-orange rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold">D</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold">dineout</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xs sm:max-w-none">Flat deals, assured savings & more at the best restaurants</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search for restaurant, cuisine or a dish"
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-background text-foreground placeholder:text-muted-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-swiggy-orange"
            />
          </div>
        </div>

        {/* Quick Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <CategoryPill label="Offers Near You" emoji="🏷️" />
          <CategoryPill label="Flat 50% OFF" emoji="🔥" isHighlighted />
          <CategoryPill label="Top Rated" emoji="⭐" />
          <CategoryPill label="New Arrivals" emoji="✨" />
          <CategoryPill label="Premium" emoji="👑" />
        </div>
      </div>
    </div>
  );
};

const CategoryPill = ({ 
  label, 
  emoji, 
  isHighlighted 
}: { 
  label: string; 
  emoji: string;
  isHighlighted?: boolean;
}) => (
  <button className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
    isHighlighted 
      ? 'bg-swiggy-orange text-primary-foreground' 
      : 'bg-white/10 text-primary-foreground hover:bg-white/20'
  }`}>
    <span>{emoji}</span>
    <span>{label}</span>
  </button>
);

export default DineoutHero;
