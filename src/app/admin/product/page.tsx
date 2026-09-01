"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
} from "lucide-react";
import { Product, Category } from "@/types";
import { updateProduct, getAdminProducts } from "@/services/product.service";
import { getCategories } from "@/services/category-product.service";
import { useToast } from "@/context/ToastContext";
import DeleteProductModal from "./modal_delete";
import ModalData from "./modal";
import DataTable from "./datatable";
import Filter from "./filter";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        getAdminProducts(),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  const handleToggleActive = async (prod: Product) => {
    try {
      await updateProduct(prod.id, { status: !prod.status });
      showToast(
        `Status produk diubah ke ${!prod.status ? "Aktif" : "Nonaktif"}`,
        "pink",
      );
      loadData();
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Gagal memperbarui status",
        "error",
      );
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      p.category_slug === selectedCategory ||
      p.category_id === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
            Kelola Produk Butik 💕
          </h1>
          <p className="text-xs text-[#9A8585]">
            Tambah, edit katalog, kelola stok dan harga promo produkmu
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-2xl bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs flex items-center gap-2 shadow-md shadow-[#FEBCBD]/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <DataTable
        filteredProducts={filteredProducts}
        loading={loading}
        handleToggleActive={handleToggleActive}
        handleOpenEditModal={handleOpenEditModal}
        setProductToDelete={setProductToDelete}
        setDeleteModalOpen={setDeleteModalOpen}
      />

      <ModalData
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        editingProduct={editingProduct}
        categories={categories}
        loadData={loadData}
      />

      <DeleteProductModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        productToDelete={productToDelete}
        loadData={loadData}
      />
    </div>
  );
}
