import React, { useState } from 'react';
import { FileUpload } from '../commonComponents/FileUpload';

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

interface Step1Props {
  products: ProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  onNext: () => void;
}

export const Step1Media: React.FC<Step1Props> = ({ products, setProducts, onNext }) => {
  const [activeProductId, setActiveProductId] = useState<string>(products[0]?.id || '');

  const activeProduct = products.find((p) => p.id === activeProductId) || products[0];

  const addMoreProduct = () => {
    const newId = crypto.randomUUID();
    setProducts([
      ...products,
      {
        id: newId,
        files: [],
        name: '',
        material: '',
        color: '',
        measurements: { Weight: '', Height: '', Length: '' },
        optionalFields: {},
        price: '',
        quantity: '1',
      },
    ]);
    setActiveProductId(newId);
  };

  const removeProduct = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (products.length <= 1) return; // Prevent clearing the last remaining placeholder row
    
    const remaining = products.filter((p) => p.id !== idToRemove);
    setProducts(remaining);
    
    if (activeProductId === idToRemove) {
      setActiveProductId(remaining[0].id);
    }
  };

  const handleFieldChange = (field: keyof ProductItem, value: string) => {
    setProducts(
      products.map((p) => (p.id === activeProductId ? { ...p, [field]: value } : p))
    );
  };

  const handleFileChange = (fileList: FileList) => {
    const updatedFiles = Array.from(fileList).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? ('video' as const) : ('image' as const),
    }));

    setProducts(
      products.map((p) =>
        p.id === activeProductId ? { ...p, files: [...p.files, ...updatedFiles] } : p
      )
    );
  };

  const moveMedia = (index: number, direction: 'left' | 'right') => {
    if (!activeProduct) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeProduct.files.length) return;

    const reorderedFiles = [...activeProduct.files];
    const [movedItem] = reorderedFiles.splice(index, 1);
    reorderedFiles.splice(targetIndex, 0, movedItem);

    setProducts(
      products.map((p) => (p.id === activeProductId ? { ...p, files: reorderedFiles } : p))
    );
  };

  const removeMedia = (mIndex: number) => {
    setProducts(
      products.map((p) =>
        p.id === activeProductId
          ? { ...p, files: p.files.filter((_, idx) => idx !== mIndex) }
          : p
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Navigation Catalog Management Bar */}
      <div className="md:col-span-1 border-r border-border-main pr-4 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
            Catalog Items ({products.length})
          </label>
          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
            {products.map((product, idx) => (
              <div
                key={product.id}
                onClick={() => setActiveProductId(product.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                  activeProductId === product.id
                    ? 'bg-brand-maroon-500/10 border-brand-maroon-500 text-brand-maroon-500 font-semibold'
                    : 'bg-bg-main border-transparent hover:bg-bg-card text-text-main'
                }`}
              >
                <span className="truncate text-sm">
                  {product.name.trim() !== '' ? product.name : `Product Entry #${idx + 1}`}
                </span>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => removeProduct(product.id, e)}
                    className="text-text-muted hover:text-red-500 p-1 text-xs transition-colors rounded-md"
                    title="Remove item"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={addMoreProduct}
          className="w-full py-2.5 rounded-xl border border-dashed border-brand-maroon-500 text-brand-maroon-500 font-medium text-xs hover:bg-brand-maroon-500/5 transition-colors"
        >
          + Append Entry Row
        </button>
      </div>

      {/* Main Focus Detail Assignment Editor Area */}
      {activeProduct && (
        <div className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Product Title</label>
              <input
                type="text"
                placeholder="e.g. Leather Satchel"
                value={activeProduct.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border-main bg-bg-main text-sm focus:outline-brand-maroon-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Base Material</label>
              <input
                type="text"
                placeholder="e.g. Full Grain Leather"
                value={activeProduct.material}
                onChange={(e) => handleFieldChange('material', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border-main bg-bg-main text-sm focus:outline-brand-maroon-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">Color Shade</label>
              <input
                type="text"
                placeholder="e.g. Chestnut Brown"
                value={activeProduct.color}
                onChange={(e) => handleFieldChange('color', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border-main bg-bg-main text-sm focus:outline-brand-maroon-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border-main bg-bg-main/40">
            <FileUpload label="Upload Catalog Media Assets" onChange={handleFileChange} />

            {activeProduct.files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {activeProduct.files.map((file, fIdx) => (
                  <div key={fIdx} className="relative group rounded-xl overflow-hidden border border-border-main aspect-square bg-bg-main flex flex-col justify-between">
                    <div className="w-full h-full relative overflow-hidden">
                      {file.type === 'image' ? (
                        <img src={file.url} alt="catalog preview" className="object-cover w-full h-full" />
                      ) : (
                        <video src={file.url} className="object-cover w-full h-full" muted />
                      )}
                      
                      {/* Trash Removal Trigger */}
                      <button
                        type="button"
                        onClick={() => removeMedia(fIdx)}
                        className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow transition-opacity"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Array Sequencing Controller Interface */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xs p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        disabled={fIdx === 0}
                        onClick={() => moveMedia(fIdx, 'left')}
                        className="text-white text-xs px-1.5 py-0.5 rounded bg-white/20 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/40"
                      >
                        ◀
                      </button>
                      <span className="text-[10px] text-white self-center font-mono">Pos {fIdx + 1}</span>
                      <button
                        type="button"
                        disabled={fIdx === activeProduct.files.length - 1}
                        onClick={() => moveMedia(fIdx, 'right')}
                        className="text-white text-xs px-1.5 py-0.5 rounded bg-white/20 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/40"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-border-main">
            <button
              type="button"
              onClick={onNext}
              className="px-10 py-2.5 bg-brand-maroon-500 text-white font-semibold text-sm rounded-xl hover:bg-brand-maroon-600 shadow-xs transition-colors"
            >
              Continue to Specifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};