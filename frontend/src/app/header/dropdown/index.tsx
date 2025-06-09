"use client";
import React, { FC, useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { FaFish } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdOutlineOutdoorGrill } from "react-icons/md";
import { RiDrinks2Fill } from "react-icons/ri";
import { GiCakeSlice } from "react-icons/gi";

const DropDown: FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center relative z-50">
      <button onClick={() => setOpen(!open)}>
        {open ? (
          <IoMdClose size={30} color="black" />
        ) : (
          <BiMenuAltRight size={30} color="black" />
        )}
      </button>

      {open && (
        <div className="mt-2 rounded-md absolute top-full right-0 max-sm:right-[-120] max-sm:top-17 bg-gradient-to-b from-sky-700 via-white text-black shadow-lg  shadow-gray-400 p-12 whitespace-nowrap flex flex-col gap-5 z-50">
          <p className="dropdown-menu ">
            <FiMenu />
          </p>
          <p className="dropdown-menu ">
            <FaFish />
          </p>
          <p className="dropdown-menu ">
            <MdOutlineOutdoorGrill />
          </p>
          <p className="dropdown-menu ">
            <RiDrinks2Fill />
          </p>
          <p className="dropdown-menu ">
            <GiCakeSlice />
          </p>
        </div>
      )}
    </div>
  );
};

export default DropDown;
