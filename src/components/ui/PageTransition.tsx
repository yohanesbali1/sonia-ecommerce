'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface PageTransitionProps {
  isNavigating: boolean;
  children: React.ReactNode;
  pageKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  isNavigating,
  children,
  pageKey,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col">
      {/* Top Loading Progress Bar during navigation */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="h-1 w-full bg-pink-100 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
                className="h-full w-1/2 bg-gradient-to-r from-[#FEBCBD] via-[#F49A9D] to-[#FEBCBD]"
              />
            </div>
            {/* Sweet Floating Mini Toast Loader */}
            <div className="absolute top-3 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#FEBCBD]/60 shadow-md flex items-center gap-1.5 text-[11px] font-bold text-[#F49A9D]">
              <Sparkles className="w-3 h-3 animate-spin text-[#F49A9D]" />
              <span>Memuat Halaman...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Entrance Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
