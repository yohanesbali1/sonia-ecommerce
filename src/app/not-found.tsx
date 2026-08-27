'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F9]">
      <div className="text-center space-y-4">
        <h1 className="font-display text-6xl font-bold text-[#4A3A3A]">404</h1>
        <p className="text-[#9A8585]">Halaman tidak ditemukan</p>
        <Link href="/" className="inline-block px-6 py-3 bg-[#FEBCBD] rounded-2xl text-[#4A3A3A] font-bold text-sm hover:bg-[#F49A9D] transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
