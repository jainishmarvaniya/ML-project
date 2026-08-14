import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
    <div className="h-8 bg-slate-800 rounded w-2/3"></div>
    <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4 min-h-[350px] flex flex-col justify-between">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-slate-800 rounded w-1/4"></div>
      <div className="h-8 bg-slate-800 rounded w-28"></div>
    </div>
    <div className="h-64 bg-slate-800/40 rounded-xl w-full"></div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
    <div className="h-6 bg-slate-800 rounded w-1/4 mb-4"></div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex space-x-4">
        <div className="h-4 bg-slate-800/60 rounded flex-1"></div>
        <div className="h-4 bg-slate-800/60 rounded flex-1"></div>
        <div className="h-4 bg-slate-800/60 rounded flex-1"></div>
        <div className="h-4 bg-slate-800/60 rounded flex-1"></div>
      </div>
    ))}
  </div>
);
