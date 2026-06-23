import React, { useState } from 'react';
import { Layers, GitCommit, Scroll, Box, HelpCircle } from 'lucide-react';
import { CategoryManager } from '../components/configuration/CategoryManager';
import { SubCategoryManager } from '../components/configuration/SubCategoryManager';
import { MaterialManager } from '../components/configuration/MaterialManager';
import { StructureManager } from '../components/configuration/StructureManager';

type Section = 'category' | 'subcategory' | 'material' | 'structure';

interface TabItem {
  id: Section;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

export const ConfigurationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Section>('category');

  const tabs: TabItem[] = [
    {
      id: 'category',
      label: 'Categories',
      desc: 'Manage parent product groups and visual icon banners.',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'subcategory',
      label: 'Subcategories',
      desc: 'Link secondary classifications under their absolute parent categories.',
      icon: <GitCommit className="w-5 h-5" />,
    },
    {
      id: 'material',
      label: 'Material Registry',
      desc: 'Define and maintain raw fabrics or weave lists.',
      icon: <Scroll className="w-5 h-5" />,
    },
    {
      id: 'structure',
      label: 'Product Structure',
      desc: 'Define mandatory matching internal kit parts (e.g., Saree + Blouse).',
      icon: <Box className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col lg:flex-row bg-bg-main text-text-main">
      {/* Configuration Navigation Sub-Bar */}
      <aside className="w-full lg:w-72 bg-bg-card border-b lg:border-b-0 lg:border-r border-border-main p-4 lg:p-6 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible whitespace-nowrap lg:whitespace-normal">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={`flex items-center justify-between p-1 rounded-xl transition-all duration-200 flex-1 lg:flex-initial ${
              activeTab === tab.id
                ? 'bg-brand-maroon-500 text-white shadow-md'
                : 'text-text-muted hover:bg-bg-main hover:text-text-main'
            }`}
          >
            {/* Nav Selection Trigger Area */}
            <button
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left flex-1"
            >
              <div className="shrink-0">{tab.icon}</div>
              <span>{tab.label}</span>
            </button>

            {/* Isolated Tooltip Trigger Node Zone */}
            <div className="relative group p-2 cursor-help text-text-muted transition-colors hover:text-brand-maroon-500 rounded-lg">
              <HelpCircle className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-white/70 hover:text-white' : 'text-text-muted'}`} />
              
              {/* Custom Tooltip Content Box */}
              <div className="absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs p-2.5 rounded-lg shadow-xl max-w-xs bottom-full lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 right-0 lg:right-auto lg:left-full ml-0 lg:ml-3 mb-2 lg:mb-0 whitespace-normal w-48">
                <p className="font-semibold text-brand-maroon-400 mb-0.5">{tab.label}</p>
                <p className="text-gray-300 leading-normal">{tab.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </aside>

      {/* Dynamic Master Component Container Workspace Panel */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'category' && <CategoryManager />}
          {activeTab === 'subcategory' && <SubCategoryManager />}
          {activeTab === 'material' && <MaterialManager />}
          {activeTab === 'structure' && <StructureManager />}
        </div>
      </main>
    </div>
  );
};