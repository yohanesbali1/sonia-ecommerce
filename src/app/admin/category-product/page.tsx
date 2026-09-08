"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Category } from "@/types";
import { getAdminCategories } from "@/services/category-product.service";
import ModalData from "./modal";
import ModalDelete from "./modal_delete";
import ListItem from "./list_item";

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
      
      <ListItem
        categories={categories}
        loading={loading}
        handleOpenEdit={handleOpenEdit}
        setCategoryToDelete={setCategoryToDelete}
        setDeleteModalOpen={setDeleteModalOpen}
      />

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
