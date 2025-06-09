import React, { FC, useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface CardProps {
  category: string;
}

const Card: FC<CardProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url =
      category === "all"
        ? "http://localhost:8172/api/products"
        : `http://localhost:8172/api/products?category=${encodeURIComponent(
            category
          )}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ürünler yüklenirken hata:", err);
        setProducts([]);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mx-auto mt-40"></div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-red-500 font-bold text-3xl p-10 flex flex-col gap-5 items-center mx-auto mt-40 border-2">
        <span className="border-b-2 w-full">
          {category === "all"
            ? "Ürünler bulunamadı!"
            : `\"${category}\" kategorisinde ürün bulunamadı!`}
        </span>
        <br />
        <span>404 NOT FOUND</span>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6 mt-10">
      {products.map((product) => (
        <li
          key={product._id}
          className="text-black shadow-2xl bg-gradient-to-t from-sky-300 via-gray-300 shadow-gray-400 font-bold p-5 flex flex-col items-center gap-5 rounded-bl-4xl hover:-translate-y-3 duration-700 hover:shadow-zinc-500"
        >
          <strong className="whitespace-nowrap">{product.name}</strong>
          <img
            src={`http://localhost:8172${product.imageUrl}`}
            alt={product.name}
            className="rounded-xl"
            width={100}
            height={100}
          />
          <p> {product.price}₺ </p>
        </li>
      ))}
    </ul>
  );
};

export default Card;
