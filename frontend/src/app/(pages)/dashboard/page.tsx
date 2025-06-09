"use client";
import React, { FC, useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const Dashboard: FC = () => {
  const [data, setData] = useState<Product[] | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/products`;

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch(endpoint);
      const json = await res.json();
      setData(json);
    };
    getProducts();
  }, []);

  const skeletons = Array.from({ length: 5 }, (_, i) => (
    <div
      key={i}
      className="animate-pulse shadow-2xl shadow-gray-300 rounded-lg p-6 min-h-[250px] bg-gray-200 flex flex-col items-start gap-4"
    >
      <div className="bg-gray-400 h-6 w-32 rounded"></div>
      <div className="bg-gray-400 h-6 w-24 rounded"></div>
      <div className="bg-gray-400 h-[100px] w-[100px] rounded-2xl"></div>
    </div>
  ));

  // Düzenleme modalını açarken inputlara değer atama
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
  };

  // Güncelleme fonksiyonu (şimdilik sadece local state güncellemesi)
  const saveChanges = () => {
    if (!name.trim()) {
      alert("İsim boş olamaz!");
      return;
    }
    if (price === "" || price <= 0) {
      alert("Geçerli bir fiyat giriniz!");
      return;
    }
    if (!data) return;

    const updatedData = data.map((item) =>
      item._id === editingProduct?._id ? { ...item, name, price } : item
    );
    setData(updatedData);
    setEditingProduct(null);
  };

  return (
    <div>
      <h1 className="text-center text-4xl md:text-5xl font-extrabold mt-16 mb-16 text-black">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-10">
        {data
          ? data.map((item) => (
              <div
                key={item._id}
                className="shadow-2xl shadow-gray-500 rounded-lg p-6 md:p-10 min-h-[250px] bg-gray-100 text-black font-bold text-lg flex flex-col items-start gap-4 md:gap-5 hover:bg-gradient-to-tr hover:from-zinc-200 hover:via-gray-200 duration-700 hover:-translate-y-3"
              >
                <div className="max-sm:flex-col max-sm:gap-10 max-sm:flex ">
                  <h3 className="whitespace-nowrap text-sm max-sm:text-4xl md:text-base font-bold">
                    <span className="text-red-500">İsim:</span> {item.name}
                  </h3>
                  <p className="text-sm md:text-base font-bold max-sm:text-4xl">
                    <span className="text-red-500">Fiyat:</span> {item.price} TL
                  </p>
                </div>
                <img
                  src={`http://localhost:8172${item.imageUrl}`}
                  alt="resim"
                  width={100}
                  height={100}
                  className="rounded-2xl max-sm:w-full"
                />

                <div className="flex lg:flex-col sm:flex-row w-full gap-3 mt-auto">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded min-w-[120px]"
                  >
                    Düzenle
                  </button>
                  <button className="flex-1 bg-red-500 text-white py-2 rounded min-w-[120px]">
                    Sil
                  </button>
                </div>
              </div>
            ))
          : skeletons}
      </div>

      {/* Düzenleme Modal */}
      {editingProduct && (
        <div
          onClick={() => setEditingProduct(null)}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40  z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg"
          >
            <h2 className="text-2xl font-bold text-black mb-4">
              Ürünü Düzenle
            </h2>

            <label className="block mb-2 font-semibold text-gray-700">
              İsim:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="block mb-4 font-semibold text-gray-700">
              Fiyat:
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                İptal
              </button>
              <button
                onClick={saveChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
