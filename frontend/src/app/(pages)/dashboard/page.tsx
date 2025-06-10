"use client";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
}

const Dashboard: FC = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.isAdmin) {
          setIsAdmin(true);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`;

  const [products, setProducts] = useState<Product[] | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = ["Çorba", "Izgara", "Balık", "İçecek", "Tatlı"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Veri alınamadı");
        const data = await res.json();
        setProducts(data);
      } catch {
        toast.error("Ürünler yüklenirken hata oluştu.");
      }
    };
    fetchProducts();
  }, [endpoint]);

  const filteredProducts = selectedCategory
    ? products?.filter((p) => p.category === selectedCategory)
    : products;

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

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const saveChanges = async () => {
    if (!editName.trim()) {
      toast.error("İsim boş olamaz!");
      return;
    }
    if (editPrice <= 0) {
      toast.error("Geçerli bir fiyat giriniz!");
      return;
    }
    if (!products || !editingProduct) {
      toast.error("Güncelleme başarısız!");
      return;
    }

    try {
      const res = await fetch(`${endpoint}/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, price: editPrice }),
      });
      if (!res.ok) throw new Error("Güncelleme hatası");

      const updatedProducts = products.map((item) =>
        item._id === editingProduct._id
          ? { ...item, name: editName, price: editPrice }
          : item
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      toast.success("Güncelleme başarılı!");
    } catch {
      toast.error("Sunucu hatası: Güncelleme yapılamadı");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;

    try {
      const res = await fetch(`${endpoint}/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silme başarısız");

      setProducts(
        (prev) => prev?.filter((item) => item._id !== productId) || null
      );
      toast.success("Ürün başarıyla silindi!");
    } catch {
      toast.error("Sunucu hatası: Silinemedi.");
    }
  };

  return (
    <>
      {isAdmin && (
        <div>
          <h1 className="text-center text-4xl md:text-5xl font-extrabold mt-16 mb-16 text-black">
            Yönetim Paneli
          </h1>

          <div className="flex justify-center mb-8 gap-4 flex-wrap text-black">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-10">
            {filteredProducts
              ? filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    className="shadow-2xl shadow-gray-500 rounded-lg p-6 md:p-10 min-h-[250px] bg-gray-100 text-black font-bold text-lg flex flex-col items-start gap-4 md:gap-5 hover:bg-gradient-to-tr hover:from-zinc-200 hover:via-gray-200 duration-700 hover:-translate-y-3"
                  >
                    <div className="max-sm:flex-col max-sm:gap-10 max-sm:flex">
                      <h3 className="whitespace-nowrap text-sm max-sm:text-4xl md:text-base font-bold">
                        <span className="text-red-500">İsim:</span> {item.name}
                      </h3>
                      <p className="text-sm md:text-base font-bold max-sm:text-4xl">
                        <span className="text-red-500">Fiyat:</span>{" "}
                        {item.price} TL
                      </p>
                    </div>

                    <p className="text-sm md:text-base font-bold">
                      <span className="text-red-500">Kategori:</span>{" "}
                      {item.category}
                    </p>

                    <img
                      src={`http://localhost:8172${item.imageUrl}`}
                      alt={item.name}
                      className="rounded-lg w-36 h-36 md:w-24 md:h-24 object-cover"
                    />

                    <div className="flex justify-between w-full mt-auto gap-4">
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-md text-white bg-green-600 py-2 px-3 hover:bg-green-700 duration-300 flex-1"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteProduct(item._id)}
                        className="rounded-md text-white bg-red-600 py-2 px-3 hover:bg-red-700 duration-300 flex-1"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))
              : skeletons}
          </div>

          {/* Edit Modal */}
          {editingProduct && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full text-black">
                <h2 className="text-2xl font-bold mb-4">Ürün Düzenle</h2>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ürün ismi"
                  className="border border-gray-300 rounded p-2 w-full mb-4"
                />
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  placeholder="Fiyat"
                  className="border border-gray-300 rounded p-2 w-full mb-4"
                  min={0}
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                  >
                    İptal
                  </button>
                  <button
                    onClick={saveChanges}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
