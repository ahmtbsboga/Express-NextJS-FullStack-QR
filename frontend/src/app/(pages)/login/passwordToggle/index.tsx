"use client";
import React, { FC, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Password: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="relative">
      <input
        type={isOpen ? "text" : "password"}
        className="p-2 bg-zinc-200 text-black text-lg rounded-xl outline-none"
        placeholder="Şifre"
      />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-4 top-5.5"
      >
        {isOpen ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
      </button>
    </div>
  );
};

export default Password;
