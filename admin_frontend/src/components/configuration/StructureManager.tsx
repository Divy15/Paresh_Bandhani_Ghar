import React, { useState } from 'react';
import { Input } from '../commonComponents/Input';
import { FilterSearchDropdown } from '../commonComponents/FilterSearchDropdown'; // Integrated your common filter dropdown
import { Trash2, Edit2, Check, X, Filter, Plus } from 'lucide-react';

interface StructureConfig {
  id: string;
  productName: string; // e.g., "Dress"
  components: string[]; // e.g., ["Top", "Bottom", "Dupatta"]
}

export const StructureManager: React.FC = () => {
  const [structures, setStructures] = useState<StructureConfig[]>([
    { id: '1', productName: 'Dress', components: ['Top', 'Bottom', 'Dupatta'] },
    { id: '2', productName: 'Saree Set', components: ['Saree', 'Blouse Piece'] },
  ]);

  const [productName, setProductName] = useState('');
  const [componentInput, setComponentInput] = useState('');
  const [currentComponentList, setCurrentComponentList] = useState<string[]>([]);
  
  // Tracking active editing lifecycle states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Active Dropdown Filtering State
  const [filterStructureId, setFilterStructureId] = useState<string | null>(null);

  const addComponentTag = () => {
    if (componentInput.trim() && !currentComponentList.includes(componentInput.trim())) {
      setCurrentComponentList([...currentComponentList, componentInput.trim()]);
      setComponentInput('');
    }
  };

  const saveStructure = () => {
    if (!productName.trim() || currentComponentList.length === 0) return;

    if (editingId) {
      // Update entry path
      setStructures(
        structures.map((struct) =>
          struct.id === editingId
            ? { ...struct, productName: productName.trim(), components: currentComponentList }
            : struct
        )
      );
      setEditingId(null);
    } else {
      // Direct insertion path
      setStructures([
        ...structures,
        {
          id: Date.now().toString(),
          productName: productName.trim(),
          components: currentComponentList,
        },
      ]);
    }

    // Reset workflow states
    setProductName('');
    setCurrentComponentList([]);
  };

  const startEdit = (struct: StructureConfig) => {
    setEditingId(struct.id);
    setProductName(struct.productName);
    setCurrentComponentList(struct.components);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProductName('');
    setCurrentComponentList([]);
  };

  const handleDelete = (id: string) => {
    setStructures(structures.filter((s) => s.id !== id));
    if (editingId === id) {
      cancelEdit();
    }
    if (filterStructureId === id) {
      setFilterStructureId(null);
    }
  };

  // Convert structures into options required by FilterSearchDropdown component mapping shape
  const dropdownOptions = structures.map((struct) => ({
    value: struct.id,
    label: struct.productName,
  }));

  // Dynamic live filtered records computed block
  const filteredStructures = filterStructureId
    ? structures.filter((struct) => struct.id === filterStructureId)
    : structures;

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-1 text-text-main">Product Component Structure Configuration</h2>
      <p className="text-sm text-text-muted mb-6">Define bundled package items (e.g., Dress = Top + Bottom + Dupatta).</p>

      {/* Dynamic Creation / Edit Panel workspace container */}
      <div className="bg-bg-main/40 p-4 rounded-xl border border-border-main flex flex-col gap-4 mb-6">
        <Input 
          label={editingId ? "Update Product Model Name" : "Main Product Model Name"} 
          placeholder="e.g., Lehenga Choli" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
        />
        
        <div className="flex gap-3 items-end">
          <Input 
            label="Add Component Item Name" 
            placeholder="e.g., Dupatta, Inner Coat" 
            value={componentInput} 
            onChange={(e) => setComponentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComponentTag()}
          />
          <button 
            onClick={addComponentTag} 
            type="button" 
            className="p-2.5 bg-bg-main hover:bg-border-main text-text-main border border-border-main rounded-lg h-10.5 px-4 text-sm font-medium transition-colors"
          >
            Include
          </button>
        </div>

        {currentComponentList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {currentComponentList.map(comp => (
              <span key={comp} className="text-xs bg-brand-maroon-500/10 text-brand-maroon-500 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border border-brand-maroon-500/20">
                {comp}
                <button type="button" onClick={() => setCurrentComponentList(currentComponentList.filter(c => c !== comp))} className="hover:text-red-500 font-bold transition-colors">×</button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button 
            onClick={saveStructure} 
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-maroon-500 hover:bg-brand-maroon-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Update Template Configuration' : 'Save Configuration Template'}
          </button>
          
          {editingId && (
            <button
              onClick={cancelEdit}
              className="px-4 py-2.5 border border-border-main rounded-lg text-sm font-medium text-text-muted hover:bg-bg-main transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Bandhani Theme Filter Dropdown Section */}
      <div className="mb-6 bg-bg-main/60 p-4 rounded-xl border border-border-main">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-text-muted">
          <Filter className="w-3.5 h-3.5 text-brand-maroon-500" /> 
          <span>Filter Model Structures By Name</span>
        </div>
        <FilterSearchDropdown
          placeholder="All Product Structures (Type to filter...)"
          options={dropdownOptions}
          selectedValue={filterStructureId}
          onSelect={(value) => setFilterStructureId(value)}
        />
      </div>

      {/* Render Layout Stack */}
      <div className="space-y-3">
        {filteredStructures.length > 0 ? (
          filteredStructures.map((struct) => (
            <div key={struct.id} className="p-4 border border-border-main bg-bg-main/20 rounded-xl flex items-center justify-between hover:border-brand-maroon-500/30 transition-colors">
              <div>
                <h4 className="font-bold text-sm text-text-main">{struct.productName}</h4>
                <p className="text-xs text-text-muted mt-1">
                  Consists of: <span className="font-medium text-brand-maroon-500">{struct.components.join(' + ')}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => startEdit(struct)} 
                  className="p-2 text-text-muted hover:text-brand-maroon-500 rounded-md hover:bg-bg-main/60 transition-colors"
                  title="Edit Template"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(struct.id)} 
                  className="p-2 text-text-muted hover:text-red-500 rounded-md hover:bg-bg-main/60 transition-colors"
                  title="Delete Template"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-text-muted text-sm border border-dashed border-border-main bg-bg-card rounded-xl">
            No product structure matching this criteria found.
          </div>
        )}
      </div>
    </div>
  );
};