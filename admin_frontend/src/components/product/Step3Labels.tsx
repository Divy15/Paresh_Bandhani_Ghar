import React, { useState } from 'react';

interface ResponseProduct {
  productId: string;
  name: string;
  quantity: number;
}

interface Step3Props {
  apiResponse: ResponseProduct[];
  onReset: () => void;
}

export const Step3Labels: React.FC<Step3Props> = ({ apiResponse, onReset }) => {
  const shopName = "Paresh Bandhani Ghar";
  const [printQuantities, setPrintQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    apiResponse.forEach(p => { initial[p.productId] = p.quantity; });
    return initial;
  });

  const handlePrintCommand = (productId: string, name: string) => {
    const qty = printQuantities[productId] || 1;
    alert(`Bluetooth Command Sent! \nPrinting [${qty}] stickers for:\nProduct ID: ${productId}\nName: ${name}\nShop: ${shopName}`);
  };

  const handlePrintAll = () => {
    let totalStickers = 0;
    apiResponse.forEach(p => { totalStickers += (printQuantities[p.productId] || 0); });
    alert(`Universal Print Triggered!\nSending payload parameters for total of [${totalStickers}] stickers to Connected Hardware.`);
  };

  return (
    <div className="space-y-6 text-text-main">
      <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
        ✓ Catalog profiles successfully updated on cloud! Barcode profiles generated.
      </div>

      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
        {apiResponse.map((prod) => (
          <div key={prod.productId} className="p-4 rounded-xl border border-border-main bg-bg-card flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Visual Stencil Layout Representation */}
            <div className="border border-text-main/20 p-3 rounded bg-white text-black w-64 shadow-sm flex items-center gap-3 select-none">
              <div className="w-16 h-16 border-2 border-black flex flex-col items-center justify-center font-mono text-[9px] font-bold p-1 text-center">
                [ QR CODE ]
                <span className="text-[7px] mt-1 break-all">{prod.productId}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-tight uppercase border-b border-black/40 pb-0.5 truncate">{shopName}</p>
                <p className="text-[11px] font-mono font-bold mt-1 truncate">{prod.productId}</p>
                <p className="text-[9px] font-medium opacity-80 truncate">{prod.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="w-28">
                <label className="text-xs text-text-muted block mb-1">Print Count</label>
                <input 
                  type="number" 
                  value={printQuantities[prod.productId] || ''}
                  onChange={(e) => setPrintQuantities({ ...printQuantities, [prod.productId]: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border border-border-main bg-bg-main text-text-main rounded text-sm text-center"
                />
              </div>
              <button 
                type="button" 
                onClick={() => handlePrintCommand(prod.productId, prod.name)}
                className="px-4 py-2 bg-brand-maroon-500 hover:bg-brand-maroon-600 text-white rounded-lg text-sm font-semibold transition-colors mt-4 shadow"
              >
                Print Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4 border-t border-border-main">
        <button type="button" onClick={onReset} className="px-6 py-2 border border-border-main rounded-lg hover:bg-bg-card transition-colors">Register Another Catalog</button>
        <button type="button" onClick={handlePrintAll} className="flex-1 py-2 bg-brand-gold-500 hover:bg-brand-gold-600 text-white font-bold rounded-lg shadow transition-colors text-center">
          🖨️ Batch Print Everything Together
        </button>
      </div>
    </div>
  );
};