

"use client";

import { useState } from "react";
import Header from "@/src/components/User/Home/Header";
import DineoutHero from "@/src/components/User/Home/DineoutHero";
import FilterBar from "@/src/components/User/Home/FilterBar";
import CollectionsSection from "@/src/components/User/Home/CollectionsSection";
import RestaurantGrid from "@/src/components/User/Home/RestaurantGrid";
import Footer from "@/src/components/User/Home/Footer";
export default function HomePage() {


  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <DineoutHero />
      <FilterBar />
      <CollectionsSection />

      <RestaurantGrid  />

      <Footer />
    </div>
  );
}
