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

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[4/5] bg-white rounded-3xl border border-[#FEBCBD]/40" />
        <div className="space-y-4">
          <div className="h-4 bg-[#FFF1F1] w-1/4 rounded-full" />
          <div className="h-8 bg-[#FFF1F1] w-3/4 rounded-full" />
          <div className="h-6 bg-[#FFF1F1] w-1/3 rounded-full" />
          <div className="h-32 bg-[#FFF1F1] rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-white rounded-2xl w-1/4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white rounded-3xl" />
        ))}
      </div>
      <div className="h-64 bg-white rounded-3xl" />
    </div>
  );
};

export const HomeHeroSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-5 sm:gap-6 animate-pulse">
      {/* Main Hero Tile */}
      <div className="col-span-12 lg:col-span-8 rounded-[2rem] bg-gradient-to-br from-[#FEBCBD]/60 via-[#F49A9D]/40 to-[#F49A9D]/30 p-6 sm:p-8 lg:p-10 min-h-[320px] flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-32 bg-white/40 rounded-full" />
              <div className="h-6 w-28 bg-white/40 rounded-full" />
            </div>
            <div className="space-y-2.5">
              <div className="h-8 bg-white/40 rounded-full w-4/5" />
              <div className="h-8 bg-white/40 rounded-full w-3/5" />
              <div className="h-4 bg-white/30 rounded-full w-full mt-2" />
              <div className="h-4 bg-white/30 rounded-full w-3/4" />
            </div>
            <div className="flex gap-3 pt-1">
              <div className="h-10 w-40 bg-white/50 rounded-full" />
              <div className="h-10 w-32 bg-white/30 rounded-full" />
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-[260px] sm:max-w-[280px]">
              <div className="bg-white/60 p-2.5 rounded-[1.75rem]">
                <div className="h-44 sm:h-52 w-full rounded-2xl bg-white/40" />
                <div className="pt-2 px-1 space-y-1.5">
                  <div className="h-3 bg-white/40 rounded-full w-1/3" />
                  <div className="h-4 bg-white/40 rounded-full w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-3 border-t border-white/20 flex gap-6">
          <div className="h-4 w-28 bg-white/30 rounded-full" />
          <div className="h-4 w-40 bg-white/30 rounded-full" />
          <div className="h-4 w-32 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Spotlight Tile */}
      <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] p-5 sm:p-6 border border-[#FEBCBD]/40 min-h-[320px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-5 w-28 bg-[#FFF1F1] rounded-full" />
            <div className="h-5 w-20 bg-[#FFF1F1] rounded-full" />
          </div>
          <div className="h-36 sm:h-40 w-full rounded-2xl bg-[#FFF1F1]" />
          <div className="space-y-1.5">
            <div className="h-3 bg-[#FFF1F1] rounded-full w-full" />
            <div className="h-3 bg-[#FFF1F1] rounded-full w-3/4" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-pink-50 flex justify-between items-center">
          <div className="h-5 w-24 bg-[#FFF1F1] rounded-full" />
          <div className="h-8 w-28 bg-[#FFF1F1] rounded-full" />
        </div>
      </div>

      {/* Sub-tile 1: Promo */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#FFF1F1] rounded-[2rem] p-6 min-h-[160px]">
        <div className="space-y-2">
          <div className="h-5 w-28 bg-white/60 rounded-full" />
          <div className="h-5 w-40 bg-white/60 rounded-full" />
          <div className="h-3 bg-white/40 rounded-full w-full" />
          <div className="h-3 bg-white/40 rounded-full w-3/4" />
        </div>
      </div>

      {/* Sub-tile 2: Delivery */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-[2rem] p-6 border border-[#FEBCBD]/40 min-h-[160px]">
        <div className="space-y-3">
          <div className="w-9 h-9 rounded-2xl bg-[#FFF1F1]" />
          <div className="space-y-1.5">
            <div className="h-5 w-48 bg-[#FFF1F1] rounded-full" />
            <div className="h-3 bg-[#FFF1F1] rounded-full w-full" />
            <div className="h-3 bg-[#FFF1F1] rounded-full w-4/5" />
          </div>
        </div>
      </div>

      {/* Sub-tile 3: Catalog */}
      <div className="col-span-12 lg:col-span-4 bg-gradient-to-tr from-[#FFF9F9] to-[#FFF1F1] rounded-[2rem] p-6 border border-[#FEBCBD]/40 min-h-[160px]">
        <div className="space-y-2">
          <div className="h-5 w-28 bg-white/60 rounded-full" />
          <div className="h-5 w-56 bg-white/60 rounded-full" />
          <div className="h-3 bg-white/40 rounded-full w-full" />
          <div className="h-3 bg-white/40 rounded-full w-3/5" />
        </div>
      </div>
    </div>
  );
};

export const CategoryGridSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-[1.75rem] p-3.5 sm:p-4 border border-[#FEBCBD]/40 flex flex-col items-center text-center"
        >
          <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-[#FFF1F1] mb-3" />
          <div className="h-4 bg-[#FFF1F1] rounded-full w-2/3" />
          <div className="h-3 bg-[#FFF1F1] rounded-full w-1/2 mt-1.5" />
        </div>
      ))}
    </div>
  );
};

export const CheckoutSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
      {/* Left: Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#FEBCBD]/40 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF1F1]" />
              <div className="h-5 w-56 bg-[#FFF1F1] rounded-full" />
            </div>
            <div className="h-5 w-24 bg-[#FFF1F1] rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <div className="h-3 w-36 bg-[#FFF1F1] rounded-full" />
              <div className="h-10 w-full bg-[#FFF1F1] rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-32 bg-[#FFF1F1] rounded-full" />
              <div className="h-10 w-full bg-[#FFF1F1] rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-[#FFF1F1] rounded-full" />
              <div className="h-10 w-full bg-[#FFF1F1] rounded-2xl" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <div className="h-3 w-40 bg-[#FFF1F1] rounded-full" />
              <div className="h-16 w-full bg-[#FFF1F1] rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-28 bg-[#FFF1F1] rounded-full" />
              <div className="h-10 w-full bg-[#FFF1F1] rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-[#FFF1F1] rounded-full" />
              <div className="h-10 w-full bg-[#FFF1F1] rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 via-[#FFF9F9] to-emerald-50/40 rounded-3xl p-5 border border-[#FEBCBD]/40 space-y-2">
          <div className="h-4 w-48 bg-[#FFF1F1] rounded-full" />
          <div className="h-3 bg-[#FFF1F1] rounded-full w-full" />
          <div className="h-3 bg-[#FFF1F1] rounded-full w-4/5" />
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#FEBCBD]/40 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#FFF1F1] rounded-full" />
              <div className="h-5 w-44 bg-[#FFF1F1] rounded-full" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFF1F1] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-[#FFF1F1] rounded-full w-3/4" />
                  <div className="h-3 bg-[#FFF1F1] rounded-full w-1/2" />
                </div>
                <div className="h-3 w-12 bg-[#FFF1F1] rounded-full shrink-0" />
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#FFF1F1] space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-28 bg-[#FFF1F1] rounded-full" />
              <div className="h-3 w-16 bg-[#FFF1F1] rounded-full" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-[#FFF1F1] rounded-full" />
              <div className="h-3 w-12 bg-[#FFF1F1] rounded-full" />
            </div>
            <div className="flex justify-between pt-2 border-t border-pink-100">
              <div className="h-4 w-28 bg-[#FFF1F1] rounded-full" />
              <div className="h-4 w-20 bg-[#FFF1F1] rounded-full" />
            </div>
          </div>
          <div className="h-12 w-full bg-[#FFF1F1] rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
