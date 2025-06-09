"use client";
import React, { FC } from "react";

const FormButton: FC = () => {
  return (
    <button
      className="text-2xl  py-2 px-8 rounded-xl shadow-2xl bg-green-300 text-white hover:scale-105 duration-700 hover:bg-green-400 w-full font-bold"
      type="submit"
    >
      Giriş
    </button>
  );
};

export default FormButton;
