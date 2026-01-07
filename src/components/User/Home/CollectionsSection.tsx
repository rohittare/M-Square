import { ChevronRight } from "lucide-react";

const collections = [
  {
    title: "Newly Opened",
    subtitle: "12 Places",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=500&fit=crop",
    gradient: "from-purple-900/80 to-purple-600/60",
  },
  {
    title: "Trending Now",
    subtitle: "25 Places",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop",
    gradient: "from-orange-900/80 to-orange-600/60",
  },
  {
    title: "Rooftop Vibes",
    subtitle: "18 Places",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=500&fit=crop",
    gradient: "from-blue-900/80 to-blue-600/60",
  },
  {
    title: "Best Buffets",
    subtitle: "30 Places",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop",
    gradient: "from-green-900/80 to-green-600/60",
  },
  {
    title: "Romantic Dining",
    subtitle: "22 Places",
    image: "https://images.unsplash.com/photo-1529543544277-750e220e5d59?w=400&h=500&fit=crop",
    gradient: "from-pink-900/80 to-pink-600/60",
  },
];

const CollectionsSection = () => {
  return (
    <section className="py-6 sm:py-8 bg-swiggy-light-gray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Collections</h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              Explore curated lists of top restaurants, cafes, pubs, and bars in Bangalore
            </p>
          </div>
          <button className="flex items-center gap-1 text-swiggy-orange font-medium text-xs sm:text-sm hover:underline self-start sm:self-auto">
            All Collections
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {collections.map((collection, index) => (
            <div 
              key={index}
              className="relative min-w-[140px] sm:min-w-[180px] h-[200px] sm:h-[240px] rounded-xl overflow-hidden cursor-pointer group shrink-0"
            >
              <img 
                src={collection.image} 
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient}`} />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-primary-foreground">
                <h3 className="font-bold text-base sm:text-lg">{collection.title}</h3>
                <p className="text-xs sm:text-sm text-gray-200 flex items-center gap-1">
                  {collection.subtitle}
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
