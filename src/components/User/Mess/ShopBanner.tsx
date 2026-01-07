"use client"

import { Star, MapPin, Clock, Leaf, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StaticImageData } from "next/image";

interface ShopBannerProps {
  name: string;
  image: string | StaticImageData;
  rating: number;
  reviewCount: number;
  location: string;
  deliveryTime: string;
  tags: string[];
  isVeg: boolean;
}

const ShopBanner = ({
  name,
  image,
  rating,
  reviewCount,
  location,
  deliveryTime,
  tags,
  isVeg,
}: ShopBannerProps) => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <img
          src={typeof image === "string" ? image : image.src}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Shop Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="text-white">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {isVeg ? (
                  <Badge className="bg-veg text-white border-0">
                    <Leaf className="w-3 h-3 mr-1" />
                    Pure Veg
                  </Badge>
                ) : (
                  <Badge className="bg-nonveg text-white border-0">
                    <Flame className="w-3 h-3 mr-1" />
                    Non-Veg Available
                  </Badge>
                )}
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Shop Name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                {name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 bg-veg px-2 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="font-semibold text-white">{rating}</span>
                </div>
                <span className="text-white/80">({reviewCount}+ ratings)</span>
              </div>

              {/* Location & Delivery */}
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Order Button */}
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopBanner;
