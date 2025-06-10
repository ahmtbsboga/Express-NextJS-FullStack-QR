"use client";
import React, { FC, useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { FaHome, FaInstagram } from "react-icons/fa";

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
        <div className="mt-2 rounded-md absolute top-full right-0 max-sm:right-[-120] max-sm:top-17 bg-gray-50 shadow-lg  shadow-gray-400 p-12 whitespace-nowrap flex flex-col gap-5 z-100">
          <Link
            href={"/"}
            className="text-4xl bg-gradient-to-br from-white via-blue-500 rounded-full p-1 grid place-items-center"
          >
            <FaHome size={27} />
          </Link>
          <Link
            href="https://www.instagram.com/kocareisetbaliksorgun/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram
              className="text-4xl bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full p-1"
              color="white"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DropDown;
