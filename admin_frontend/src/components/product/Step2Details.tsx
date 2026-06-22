import React, { useState } from 'react';

interface ProductItem {
  id: string;
  files: { url: string; type: 'image' | 'video' }[];
  name: string;
  material: string;
  color: string;
  measurements: Record<string, string>;
  optionalFields: Record<string, string>;
  price: string;
  quantity: string;
}

interface Step2Props {
  products: ProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  onBack: () => void;
  onNext: () => void;
}

export const Step2Details: React.FC<Step2Props> = ({ products, setProducts, onBack, onNext }) => {
  const [activeProductId, setActiveProductId] = useState<string>(products[0]?.id || '');
  const activeProduct = products.find((p) => p.id === activeProductId) || products[0];

  const handleFieldChange = (field: 'price' | 'quantity', value: string) => {
    setProducts(products.map((p) => (p.id === activeProductId ? { ...p, [field]: value } : p)));
  };

  const handleMeasurementChange = (key: string, value: string) => {
    setProducts(
      products.map((p) =>
        p.id === activeProductId
          ? { ...p, measurements: { ...p.measurements, [key]: value } }
          : p
      )
    );
  };

  // Bulk synchronization routine - duplicates attributes across all variants
  const replicateToAllProducts = () => {
    if (!activeProduct) return;
    if (confirm(`Apply specs from "${activeProduct.name || 'Current Item'}" to all other items?`)) {
      setProducts(
        products.map((p) => ({
          ...p,
          price: activeProduct.price,
          quantity: activeProduct.quantity,
          measurements: { ...activeProduct.measurements },
        }))
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Standardized Left Navigation Catalog Layout */}
      <div className="md:col-span-1 border-r border-border-main pr-4 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
            Selected Items
          </label>
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
            {products.map((product, idx) => (
              <div
                key={product.id}
                onClick={() => setActiveProductId(product.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border text-sm ${
                  activeProductId === product.id
                    ? 'bg-brand-maroon-500/10 border-brand-maroon-500 text-brand-maroon-500 font-semibold'
                    : 'bg-bg-main border-transparent hover:bg-bg-card text-text-main'
                }`}
              >
                <div className="truncate">{product.name.trim() !== '' ? product.name : `Item #${idx + 1}`}</div>
                <div className="text-[10px] text-text-muted mt-0.5 truncate">
                  {product.material || 'No Material'} • {product.color || 'No Color'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={replicateToAllProducts}
          className="w-full py-2 px-3 bg-bg-main hover:bg-brand-maroon-500/5 text-brand-maroon-500 border border-brand-maroon-500/30 rounded-xl text-xs font-medium transition-colors"
        >
          🔀 Apply Current Specs to All
        </button>
      </div>

      {/* Specification Entry Matrix Panels */}
      {activeProduct && (
        <div className="md:col-span-3 space-y-6">
          <div className="bg-bg-main/30 p-4 rounded-xl border border-border-main flex items-center justify-between">
            <div>
              <span className="text-xs text-text-muted font-medium">Configuring Metrics for:</span>
              <h4 className="text-base font-bold text-brand-maroon-500">
                {activeProduct.name || 'Unnamed Product Entry'}
              </h4>
            </div>
            <div className="text-xs bg-bg-card px-2.5 py-1 rounded-md border border-border-main font-mono text-text-muted">
              ID: {activeProduct.id.slice(0, 8)}...
            </div>
          </div>

          {/* Pricing & Commercial Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Target Base Price ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={activeProduct.price}
                onChange={(e) => handleFieldChange('price', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border-main bg-bg-main text-sm focus:outline-brand-maroon-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Available Quantity</label>
              <input
                type="number"
                placeholder="1"
                value={activeProduct.quantity}
                onChange={(e) => handleFieldChange('quantity', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border-main bg-bg-main text-sm focus:outline-brand-maroon-500"
              />
            </div>
          </div>

          {/* Sizing Matrix Subform Block */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">Dimensional Metrics</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.keys(activeProduct.measurements).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-text-main mb-1">{key}</label>
                  <input
                    type="text"
                    placeholder="--"
                    value={activeProduct.measurements[key] || ''}
                    onChange={(e) => handleMeasurementChange(key, e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border-main bg-bg-main text-sm focus:outline-brand-maroon-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Master Control Footer Row */}
          <div className="flex items-center justify-between pt-4 border-t border-border-main">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-border-main text-text-main text-sm rounded-xl hover:bg-bg-main transition-colors"
            >
              Back to Assets
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-8 py-2 bg-brand-maroon-500 text-white font-semibold text-sm rounded-xl hover:bg-brand-maroon-600 shadow-xs transition-colors"
            >
              Complete Registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};