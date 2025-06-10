"use client";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
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

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data?.user?.isAdmin) {
          setIsAdmin(true);
        } else {
          router.push("/login"); // Veya login sayfasına yönlendirin
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const [products, setProducts] = useState<Product[] | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Veri alınamadı");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        toast.error("Ürünler yüklenirken hata oluştu.");
      }
    };
    fetchProducts();
  }, [endpoint]);

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
      const response = await fetch(`${endpoint}/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, price: editPrice }),
      });

      if (!response.ok) throw new Error("Güncelleme hatası");

      const updatedProducts = products.map((item) =>
        item._id === editingProduct._id
          ? { ...item, name: editName, price: editPrice }
          : item
      );

      setProducts(updatedProducts);
      setEditingProduct(null);
      toast.success("Güncelleme başarılı!");
    } catch (error) {
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
    } catch (error) {
      toast.error("Sunucu hatası: Silinemedi.");
    }
  };

  const addProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) {
      toast.error("İsim boş olamaz!");
      return;
    }
    if (newPrice <= 0) {
      toast.error("Geçerli bir fiyat giriniz!");
      return;
    }
    if (!newImageFile) {
      toast.error("Lütfen bir resim seçin!");
      return;
    }
    if (!newImageFile.type.startsWith("image/")) {
      toast.error("Sadece resim dosyaları yüklenebilir");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("price", newPrice.toString());
      formData.append("image", newImageFile);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ürün eklenemedi");
      }

      setProducts((prev) => (prev ? [data.product, ...prev] : [data.product]));
      setShowAddModal(false);
      setNewName("");
      setNewPrice(0);
      setNewImageFile(null);
      toast.success("Ürün başarıyla eklendi!");
    } catch (error: any) {
      console.error("Ürün ekleme hatası:", error);
      toast.error(error.message || "Sunucu hatası: Ürün eklenemedi");
    }
  };

  return (
    <>
      {isAdmin && (
        <div>
          <h1 className="text-center text-4xl md:text-5xl font-extrabold mt-16 mb-16 text-black">
            Dashboard
          </h1>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Yeni Ürün Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-10">
            {products
              ? products.map((item) => (
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
                    <img
                      src={`http://localhost:8172${item.imageUrl}`}
                      alt={item.name}
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
                      <button
                        onClick={() => deleteProduct(item._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded min-w-[120px]"
                      >
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
              className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40 z-50"
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
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <label className="block mb-4 font-semibold text-gray-700">
                  Fiyat:
                  <input
                    type="number"
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value) || 0)}
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

          {/* Yeni Ürün Ekle Modal */}
          {showAddModal && (
            <div
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40 z-50"
            >
              <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={addProduct}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg"
              >
                <h2 className="text-2xl font-bold text-black mb-4">
                  Yeni Ürün Ekle
                </h2>

                <label className="block mb-2 font-semibold text-gray-700">
                  İsim:
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </label>

                <label className="block mb-2 font-semibold text-gray-700">
                  Fiyat:
                  <input
                    type="number"
                    min={0}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </label>

                <label className="block mb-4 font-semibold text-gray-700">
                  Resim:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewImageFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="w-full"
                  />
                </label>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
