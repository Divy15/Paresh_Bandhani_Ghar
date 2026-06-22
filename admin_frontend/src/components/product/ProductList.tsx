import React, { useState } from 'react';
import { Input } from '../commonComponents/Input';

export const ProductList: React.FC = () => {
  const [search, setSearch] = useState('');
  
  // Mock Data representation inside registry view
  const mockProducts = [
    { id: 'PROD-90812', name: 'Silk Bandhani Dupatta', stock: 12, price: '₹1,250' },
    { id: 'PROD-32451', name: 'Gaji Silk Saree Crimson', stock: 4, price: '₹8,900' },
    { id: 'PROD-11029', name: 'Cotton Dress Material Indigo', stock: 24, price: '₹750' },
  ];

  const filtered = mockProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input 
        label="Filter Registered Database" 
        placeholder="Type to filter by Product Name or Catalog ID..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ==========================================
          1. DESKTOP VIEW: Traditional Matrix Table
         ========================================== */}
      <div className="hidden sm:block border border-border-main rounded-xl overflow-hidden bg-bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-main border-b border-border-main text-xs font-bold uppercase tracking-wider text-text-muted">
              <th className="p-3">Product ID</th>
              <th className="p-3">Item Detail Descriptor</th>
              <th className="p-3">In-Stock</th>
              <th className="p-3 text-right">Price Point</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main text-sm text-text-main">
            {filtered.length > 0 ? filtered.map(p => (
              <tr key={p.id} className="hover:bg-bg-main/40 transition-colors">
                <td className="p-3 font-mono text-brand-maroon-500 font-bold">{p.id}</td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-text-muted">{p.stock} units</td>
                <td className="p-3 text-right font-semibold">{p.price}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-text-muted opacity-60">No matched profiles found inside memory grid.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==========================================
          2. MOBILE VIEW: Stacking Adaptive Cards
         ========================================== */}
      <div className="block sm:hidden space-y-3">
        {filtered.length > 0 ? filtered.map(p => (
          <div 
            key={p.id} 
            className="bg-bg-card border border-border-main rounded-xl p-4 space-y-3 shadow-sm"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-brand-maroon-500 bg-brand-maroon-500/10 px-2 py-0.5 rounded">
                  {p.id}
                </span>
                <h4 className="font-medium text-text-main text-base mt-2">{p.name}</h4>
              </div>
              <span className="text-base font-bold text-text-main shrink-0">{p.price}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2.5 border-t border-border-main/60 text-xs">
              <span className="text-text-muted font-medium uppercase tracking-wider">Inventory Availability</span>
              <span className="text-text-main font-semibold bg-bg-main px-2.5 py-1 rounded-md border border-border-main">
                {p.stock} units
              </span>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-text-muted opacity-60 border border-dashed border-border-main rounded-xl bg-bg-card text-sm">
            No matched profiles found inside memory grid.
          </div>
        )}
      </div>
    </div>
  );
};