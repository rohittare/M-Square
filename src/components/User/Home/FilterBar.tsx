import { ChevronDown, SlidersHorizontal } from "lucide-react";

const FilterBar = () => {
  return (
    <div className="sticky top-14 sm:top-16 z-40 bg-background border-b border-border py-2 sm:py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          <FilterButton label="Filters" icon={<SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} />
          <FilterButton label="Sort By" hasDropdown />
          <FilterButton label="Great Offers" isActive />
          <FilterButton label="Rating 4.0+" />
          <FilterButton label="Pure Veg" />
          <FilterButton label="Outdoor Seating" />
          <FilterButton label="Cuisines" hasDropdown />
          <FilterButton label="Pet Friendly" />
          <FilterButton label="Serves Alcohol" />
          <FilterButton label="Open Now" />
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ 
  label, 
  icon, 
  hasDropdown, 
  isActive 
}: { 
  label: string; 
  icon?: React.ReactNode;
  hasDropdown?: boolean;
  isActive?: boolean;
}) => (
  <button className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
    isActive 
      ? 'border-foreground bg-foreground text-background' 
      : 'border-border bg-background text-foreground hover:border-muted-foreground'
  }`}>
    {icon}
    <span>{label}</span>
    {hasDropdown && <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
  </button>
);

export default FilterBar;
