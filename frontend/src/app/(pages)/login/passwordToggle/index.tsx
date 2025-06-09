"use client";
import React, { FC, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const UsernamePassword: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8172/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Giriş başarısız: ${errorData.message || "Bilinmeyen hata"}`
        );
        return;
      }

      const data = await response.json();
      console.log("Giriş başarılı");

      localStorage.setItem("token", data.token);

      toast.success("Giriş başarılı! Yönetime yönlendiriliyorsunuz.");

      router.push("/dashboard");
    } catch (error) {
      toast.info("Sunucuya bağlanılamadı!");
      console.error(error);
    }
  };

  return (
    <div>
      <form
        className="relative flex flex-col gap-5 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="p-2 bg-zinc-200 text-black text-lg rounded-xl outline-none"
          placeholder="Kullanıcı adı"
        />

        <div className="relative w-full flex items-center">
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={isOpen ? "text" : "password"}
            className="p-2 bg-zinc-200 text-black text-lg rounded-xl outline-none w-full"
            placeholder="Şifre"
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-3"
          >
            {isOpen ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
          </button>
        </div>

        <button
          className="text-2xl py-2 px-8 rounded-xl shadow-2xl bg-green-300 text-white hover:scale-105 duration-700 hover:bg-green-400 w-full font-bold"
          type="submit"
        >
          Giriş yap
        </button>
      </form>
    </div>
  );
};

export default UsernamePassword;
