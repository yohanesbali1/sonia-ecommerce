'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

interface SplashScreenProps {
  isLoading: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF9F9] via-[#FFF1F1] to-[#FEBCBD]/40 backdrop-blur-md overflow-hidden"
        >
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#FEBCBD]/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#F49A9D]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Center Brand Animation */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Animated Logo Emblem */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="relative mb-5"
            >
              {/* Outer Pulsing Ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#FEBCBD] to-[#F49A9D] blur-md opacity-60"
              />

              <div className="relative">
                <BrandLogo size="lg" showText={false} />
              </div>
            </motion.div>

            {/* Brand Title with Fade In */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="space-y-1"
            >
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#4A3A3A] tracking-wider uppercase">
                SONIABALISHOP<span className="text-[#F49A9D]">.</span>
              </h1>
              <p className="text-[11px] sm:text-xs tracking-widest uppercase font-semibold text-[#9A8585]">
                Fashion, Beauty & Chic Boutique 💕
              </p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 flex flex-col items-center gap-3 w-48 sm:w-56"
            >
              <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden shadow-inner border border-[#FEBCBD]/40">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: 'easeInOut',
                  }}
                  className="w-1/2 h-full bg-gradient-to-r from-[#FEBCBD] via-[#F49A9D] to-[#FEBCBD] rounded-full"
                />
              </div>
              <span className="text-[11px] font-medium text-[#9A8585] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#F49A9D] animate-spin" />
                Memuat Koleksi Cantik...
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
