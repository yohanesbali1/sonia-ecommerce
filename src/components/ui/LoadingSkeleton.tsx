import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-[#FEBCBD]/30 shadow-sm animate-pulse flex flex-col gap-3">
      <div className="w-full aspect-[4/5] bg-[#FFF1F1] rounded-2xl" />
      <div className="h-3 bg-[#FFF1F1] rounded-full w-1/3" />
      <div className="h-5 bg-[#FFF1F1] rounded-full w-4/5" />
      <div className="h-4 bg-[#FFF1F1] rounded-full w-1/2 mt-1" />
      <div className="h-10 bg-[#FFF1F1] rounded-full w-full mt-2" />
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
