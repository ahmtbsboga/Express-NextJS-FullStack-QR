import React, { FC, useEffect, useState } from "react";
import { FaArrowAltCircleLeft as Left } from "react-icons/fa";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6 mt-10">
        {products.map((product) => (
          <li
            key={product._id}
            onClick={() => setSelectedProduct(product)}
            className="cursor-pointer text-black shadow-2xl bg-gradient-to-t from-sky-300 via-gray-300 shadow-gray-400 font-bold p-5 flex flex-col items-start gap-5 rounded-bl-4xl hover:-translate-y-3 duration-700 hover:shadow-zinc-500"
          >
            <strong className="whitespace-nowrap border-b w-full">
              {product.name}
            </strong>
            <p className="border-b w-full"> {product.price}₺ </p>
            <img
              src={`http://localhost:8172${product.imageUrl}`}
              alt={product.name}
              className="rounded-xl w-full"
              width={100}
              height={100}
            />
            <button className="shadow-2xl bg-sky-900 text-white rounded-xl py-2 px-2 w-full hover:bg-sky-600 duration-400 flex items-center justify-evenly">
              Detay
              <span className=" text-blue-300 hover:text-green-500 duration-400 ">
                <Left size={20} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-opacity-100 z-50 text-black"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 font-bold text-xl"
              aria-label="Kapat"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            <img
              src={`http://localhost:8172${selectedProduct.imageUrl}`}
              alt={selectedProduct.name}
              className="rounded-lg mb-4 mx-auto"
              width={200}
              height={200}
            />
            <p className="mb-2">
              <strong>Açıklama:</strong> {selectedProduct.description}
            </p>
            <p className="font-bold text-lg">Fiyat: {selectedProduct.price}₺</p>
            <p className="italic text-sm mt-2">
              Kategori: {selectedProduct.category}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
