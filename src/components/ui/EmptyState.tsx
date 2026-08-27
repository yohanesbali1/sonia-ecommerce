'use client';

import React from 'react';
import { Heart, ShoppingBag, Sparkles, PackageSearch } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'bag' | 'heart' | 'sparkle' | 'search';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Belum ada produk di sini 💕',
  description = 'Koleksi cantik lainnya sedang dipersiapkan khusus untukmu.',
  actionText,
  onAction,
  icon = 'bag',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/70 rounded-3xl border border-[#FEBCBD]/40 shadow-sm max-w-lg mx-auto my-8"
    >
      <div className="w-20 h-20 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D] mb-4 shadow-inner">
        {icon === 'bag' && <ShoppingBag className="w-10 h-10" />}
        {icon === 'heart' && <Heart className="w-10 h-10 fill-[#FEBCBD]" />}
        {icon === 'sparkle' && <Sparkles className="w-10 h-10" />}
        {icon === 'search' && <PackageSearch className="w-10 h-10" />}
      </div>
      <h3 className="text-xl font-semibold text-[#4A3A3A] mb-2">{title}</h3>
      <p className="text-sm text-[#9A8585] max-w-xs mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-6 py-2.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-medium text-sm transition-all duration-200 shadow-md shadow-[#FEBCBD]/30 hover:scale-105 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
