"use client";
import React, { FC, useState, useEffect } from "react";
import Card from "@/app/card";
import Filter from "@/app/components/filter";
import { useSearchParams, useRouter } from "next/navigation";

const Home: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL'den category al, yoksa "all" yap
  const categoryFromUrl = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryFromUrl);

  // URL'den kategori değiştiğinde state'i güncelle
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    // URL'i güncelle (replace ile sayfa yenilenmeden)
    router.replace(`?category=${encodeURIComponent(category)}`);
  };

  return (
    <div>
      <Filter selected={selectedCategory} onSelect={handleSelectCategory} />
      <Card category={selectedCategory} />
    </div>
  );
};

export default Home;
