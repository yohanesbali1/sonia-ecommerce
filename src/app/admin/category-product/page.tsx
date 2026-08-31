"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Category } from "@/types";
import {
  getAdminCategories,
} from "@/services/category-product.service";
import ModalData from "./modal";
import ModalDelete from "./modal_delete";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const cats = await getAdminCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

 

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
            Kategori Produk Butik 💕
          </h1>
          <p className="text-xs text-[#9A8585]">
            Kelola pengelompokan produk untuk mempermudah customer menelusuri
            koleksi
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs flex items-center gap-2 shadow-md shadow-[#FEBCBD]/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <></>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-5 border border-[#FEBCBD]/40 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
                  }
                  alt={cat.name}
                  className="w-14 h-14 rounded-2xl object-cover bg-[#FFF1F1] border border-[#FEBCBD]/30 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-semibold text-sm text-[#4A3A3A]">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#9A8585] block font-mono">
                    slug: {cat.slug}
                  </span>
                  <span className={"inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full " + (cat.status ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600")}>
                    {cat.status ? "Aktif" : "Tidak Aktif"} 
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-xl bg-[#FFF1F1] text-[#4A3A3A] hover:bg-[#FEBCBD] transition-colors"
                  title="Edit Kategori"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryToDelete(cat);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ModalData
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        editingCategory={editingCategory}
        loadData={loadData}
      />

      <ModalDelete
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        categoryToDelete={categoryToDelete}
        loadData={loadData}
      />
    
    </div>
  );
}
