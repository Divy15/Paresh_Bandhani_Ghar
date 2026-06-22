import React, { useState } from 'react';
import { ProductList } from '../components/product/ProductList';
import { Step1Media } from '../components/product/Step1Media';
import { Step2Details } from '../components/product/Step2Details';
import { Step3Labels } from '../components/product/Step3Labels';

export interface ProductItem {
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

interface ApiResponseProduct {
  productId: string;
  name: string;
  quantity: number;
}

export const ProductRegistrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'register'>('list');
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // FIXED: Properties now match the ProductItem interface structure perfectly
  // Replace your current createBlankProduct with this:
const createBlankProduct = (): ProductItem => {
  // Check if crypto.randomUUID is available (Secure Contexts / Localhost)
  const id = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  return {
    id: id,
    files: [],
    name: '',
    material: '',
    color: '', 
    measurements: { Weight: '', Height: '', Length: '' }, 
    optionalFields: {}, 
    price: '',
    quantity: '1',
  };
};

  const [products, setProducts] = useState<ProductItem[]>([createBlankProduct()]);
  const [apiResponse, setApiResponse] = useState<ApiResponseProduct[]>([]);

  // Orchestrated Backend Processing Emulation
  const handleBackendSubmission = async () => {
    // FIXED: Maps your structural matrix variables correctly without breaking types
    const submittablePayload = products.map(p => ({
      name: p.name || "Unnamed Catalog Item",
      material: p.material,
      color: p.color,
      measurements: p.measurements,
      optionalFields: p.optionalFields,
      price: parseFloat(p.price) || 0,
      quantity: parseInt(p.quantity) || 1,
      mediaCount: p.files.length
    }));

    console.log("Dispatching API Request Body payload:", submittablePayload);

    const simulatedResponse: ApiResponseProduct[] = products.map((p, index) => ({
      productId: `PBG-${Math.floor(10000 + Math.random() * 90000)}`,
      name: p.name || `Catalog Item Block #${index + 1}`,
      quantity: parseInt(p.quantity) || 1
    }));

    setApiResponse(simulatedResponse);
    setCurrentStep(3);
  };

  const resetFormState = () => {
    setProducts([createBlankProduct()]);
    setApiResponse([]);
    setCurrentStep(1);
    setActiveTab('list');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-border-main pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-maroon-500">Product Administration</h1>
          <p className="text-xs text-text-muted">Manage product directories and catalog prints.</p>
        </div>
        
        <div className="flex bg-bg-card p-1 rounded-lg border border-border-main">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'list' ? 'bg-brand-maroon-500 text-white shadow' : 'text-text-muted hover:text-text-main'}`}
          >
            All Listed Products
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'register' ? 'bg-brand-maroon-500 text-white shadow' : 'text-text-muted hover:text-text-main'}`}
          >
            Register Product Catalog
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <ProductList />
      ) : (
        <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between max-w-md mx-auto relative mb-4">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border-main z-0" />
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 border transition-all ${
                  currentStep >= step 
                    ? 'bg-brand-maroon-500 border-brand-maroon-500 text-white shadow-md' 
                    : 'bg-bg-main border-border-main text-text-muted'
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <Step1Media products={products} setProducts={setProducts} onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <Step2Details products={products} setProducts={setProducts} onBack={() => setCurrentStep(1)} onNext={handleBackendSubmission} />
          )}
          {currentStep === 3 && (
            <Step3Labels apiResponse={apiResponse} onReset={resetFormState} />
          )}
        </div>
      )}
    </div>
  );
};