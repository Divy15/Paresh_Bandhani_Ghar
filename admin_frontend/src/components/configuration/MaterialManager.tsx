import React, { useState } from 'react';
import { Input } from '../commonComponents/Input';
import { Trash2, Plus } from 'lucide-react';

export const MaterialManager: React.FC = () => {
  const [materials, setMaterials] = useState<string[]>(['Pure Cotton', 'Modal Silk', 'Georgette']);
  const [item, setItem] = useState('');

  const append = () => {
    if (item.trim() && !materials.includes(item.trim())) {
      setMaterials([...materials, item.trim()]);
      setItem('');
    }
  };

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-1">Material Registry Base</h2>
      <p className="text-sm text-text-muted mb-6">Manage base production yarn and clothing material types.</p>

      <div className="flex gap-3 mb-6 max-w-md">
        <Input label="Add Raw Fabric Variant" placeholder="e.g., Organza Silk" value={item} onChange={(e) => setItem(e.target.value)} />
        <button onClick={append} className="flex items-center justify-center p-2.5 bg-brand-maroon-500 hover:bg-brand-maroon-600 text-white rounded-lg transition-colors self-end h-10.5 w-10.5 shrink-0 shadow-sm">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {materials.map((mat) => (
          <div key={mat} className="flex items-center justify-between p-3 rounded-xl border border-border-main bg-bg-main/30 hover:border-brand-maroon-500/40 transition-colors">
            <span className="text-sm font-medium">{mat}</span>
            <button onClick={() => setMaterials(materials.filter(m => m !== mat))} className="p-1.5 text-text-muted hover:text-red-500 hover:bg-bg-main rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};