"use client";

import React, { FC, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Filter from "@/app/components/filter";
import Card from "@/app/card";

const HomeContent: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFromUrl = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    router.replace(`?category=${encodeURIComponent(category)}`);
  };

  return (
    <div>
      <Filter selected={selectedCategory} onSelect={handleSelectCategory} />
      <Card category={selectedCategory} />
    </div>
  );
};

export default HomeContent;
