import React, { FC } from "react";
import DropDown from "./dropdown";
import Link from "next/link";

const WaveHeader: FC = () => {
  return (
    <svg
      viewBox="0 0 1440 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 w-full"
      style={{ zIndex: 0 }}
    >
      <path
        fill="#0EA5E9" // Dalgaların rengi, gökyüzü renginin koyusu
        d="M0 50 C360 150 1080 0 1440 100 L1440 150 L0 150 Z"
      />
    </svg>
  );
};

const Header: FC = () => {
  return (
    <header className="relative bg-sky-100 overflow-block">
      <div
        className="flex items-center justify-around py-10 px-12 max-sm:py-5 text-white max-sm:text-black text-xl font-bold capitalize max-w-[1240px] mx-auto relative"
        style={{ zIndex: 1 }}
      >
        <div>
          <img src="/logo.jpg" alt="logo" width={80} className="rounded-full" />
        </div>
        <nav className="flex items-center gap-8 max-lg:hidden text-black">
          <Link href="/login">Giriş</Link>
          <Link href="/">Menüler</Link>
          <Link href="/">İçecekler</Link>
          <Link href="/">Mezeler</Link>
        </nav>
        <DropDown />
      </div>
      <WaveHeader />
    </header>
  );
};

export default Header;
