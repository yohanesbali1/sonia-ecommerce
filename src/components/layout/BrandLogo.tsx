'use client';

import React from 'react';
import logoImage from '@/assets/images/soniabalishop_logo_1787836174108.jpg';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textClassName = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
    xl: 'w-24 h-24 rounded-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative overflow-hidden shadow-xs border border-pink-200 bg-white ${sizeClasses[size]} shrink-0`}>
        <img
          src={typeof logoImage === 'string' ? logoImage : logoImage.src}
          alt="SONIABALISHOP Logo"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-display font-black tracking-tight text-[#4A3A3A] leading-none ${textClassName || 'text-lg sm:text-xl'}`}>
            SONIABALISHOP<span className="text-[#F49A9D]">.</span>
          </span>
          <span className="text-[10px] tracking-wider uppercase font-bold text-[#F49A9D] mt-0.5">
            Boutique & Fashion
          </span>
        </div>
      )}
    </div>
  );
};
