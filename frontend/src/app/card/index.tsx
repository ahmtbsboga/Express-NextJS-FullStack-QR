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
      <div className="grid grid-cols-6 max-sm:grid-cols-2 max-md:grid-cols-3 max-lg:grid-cols-4 gap-6 p-10 mt-10">
        {Array.from({ length: 50 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-white shadow-md p-4 rounded-bl-4xl"
          >
            <div className="w-full h-30 bg-gray-300 rounded-lg mb-4" />
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-10 bg-gray-300 rounded-xl w-full mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-red-500 font-bold text-3xl p-10 flex flex-col items-center mx-auto mt-30 shadow-2xl shadow-gray-500 rounded-xl ">
        <span>
          {category === "all"
            ? "Ürünler yüklenmeye çalışırken bir hata meydana geldi :("
            : `"${category}" kategorisinde ürün bulunamadı!`}
        </span>
        <br />
        <span>404 NOT FOUND</span>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg transition-all text-lg shadow-md hover:bg-green-500 hover:scale-105 duration-700"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6 mt-10 ">
        {products.map((product) => (
          <li
            key={product._id}
            onClick={() => setSelectedProduct(product)}
            className="cursor-pointer text-black shadow-2xl bg-gradient-to-t from-sky-300 via-gray-300 shadow-gray-400 font-bold p-5 flex flex-col items-start gap-5 rounded-bl-4xl hover:-translate-y-3 duration-700 hover:shadow-zinc-500 "
          >
            <img
              src={`http://localhost:8172${product.imageUrl}`}
              alt={product.name}
              className="rounded-xl w-full h-30"
              width={100}
              height={100}
            />
            <strong className="whitespace-nowrap bg-white text-xs text-black p-1 rounded-lg">
              {product.name}
            </strong>
            <p className="bg-white text-black p-1 text-xs rounded-lg">
              {product.price}₺
            </p>

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
