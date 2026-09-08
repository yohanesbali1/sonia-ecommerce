"use client";

import React, { useEffect, useState } from "react";
import { Save, UsersRound, KeyRound } from "lucide-react";
import { UpdateProfileAdmin } from "@/types";
import { useToast } from "@/context/ToastContext";
import { getAdminProfile, UpdateAdminProfile } from "@/services/auth.service";

export default function AdminSettingsPage() {
  const [forms, setForms] = useState<UpdateProfileAdmin>({
    email: "",
    name: "",
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getAdminProfile();
        setForms({
          email: data.admin.email,
          name: data.admin.name,
          currentPassword: "",
          newPassword: "",
        });
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForms((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await UpdateAdminProfile(forms);

      setForms({
        email: res.admin.email,
        name: res.admin.name,
        currentPassword: "",
        newPassword: "",
      });

      showToast("Pengaturan akun admin berhasil disimpan 💕", "pink");
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Gagal menyimpan pengaturan akun",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#9A8585] space-y-2">
        <div className="w-8 h-8 mx-auto border-3 border-[#FEBCBD] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs">Memuat pengaturan toko...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
          Pengaturan Akun 💕
        </h1>
        <p className="text-xs text-[#9A8585]">Kelola akun Anda di sini</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#FFF1F1]">
            <UsersRound className="w-5 h-5 text-[#F49A9D]" />
            <h2 className="font-display font-semibold text-base text-[#4A3A3A]">
              informasi Umum Akun
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold block mb-1 text-[#4A3A3A]">
                Nama Akun<span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="Cherie"
                name="name"
                value={`${forms?.name}`}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs  text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold block mb-1 text-[#4A3A3A]">
                Email <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@cherie.com"
                value={`${forms?.email}`}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#FFF1F1]">
            <KeyRound className="w-5 h-5 text-[#F49A9D]" />
            <h2 className="font-display font-semibold text-base text-[#4A3A3A]">
              Pengaturan Password
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold block mb-1 text-[#4A3A3A]">
                Password Lama<span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={`${forms?.currentPassword}`}
                placeholder="Masukan password lama"
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold block mb-1 text-[#4A3A3A]">
                Email <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={`${forms?.newPassword}`}
                placeholder="Masukan password baru"
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#FEBCBD]/40 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Pengaturan 💕"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
