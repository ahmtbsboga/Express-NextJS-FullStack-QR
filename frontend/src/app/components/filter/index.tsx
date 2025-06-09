"use client";
import React, { FC } from "react";
import { FaFish } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdOutlineOutdoorGrill } from "react-icons/md";
import { RiDrinks2Fill } from "react-icons/ri";
import { GiCakeSlice } from "react-icons/gi";
import { TbSoup } from "react-icons/tb";

interface FilterProps {
  selected: string;
  onSelect: (category: string) => void;
}
const categories = [
  { key: "all", icon: <FiMenu size={30} />, label: "Tümü" }, // tüm ürünler için
  { key: "Balık", icon: <FaFish size={30} />, label: "Balık" },
  { key: "Çorba", icon: <TbSoup size={30} />, label: "Çorba" },
  {
    key: "Ana Yemek",
    icon: <MdOutlineOutdoorGrill size={30} />,
    label: "Izgara",
  },
  { key: "İçecek", icon: <RiDrinks2Fill size={30} />, label: "İçecek" },
  { key: "Tatlı", icon: <GiCakeSlice size={30} />, label: "Tatlı" },
];

const Filter: FC<FilterProps> = ({ selected, onSelect }) => {
  return (
    <div className="mt-12">
      <div className="w-full px-8 py-2 shadow-2xl shadow-gray-500 bg-gradient-to-b from-sky-500 via-white text-black flex items-center rounded justify-between">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`filter-icons p-2 rounded-md transition ${
              selected === cat.key
                ? "bg-sky-600 text-white"
                : "bg-white text-black hover:bg-sky-100"
            }`}
          >
            {cat.icon}
            <div className="text-xs mt-1">{cat.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
