import React, { useState } from 'react';
import { Input } from '../commonComponents/Input';
import { FileUpload } from '../commonComponents/FileUpload';
import { Select } from '../commonComponents/Select';
import { ImageCropperModal } from '../commonComponents/ImageCropperModal';
import { FilterSearchDropdown } from '../commonComponents/FilterSearchDropdown'; // Import your filter dropdown
import { Trash2, Edit2, Plus, Check, X, Filter } from 'lucide-react';

interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  imageName: string;
  imagePreview?: string;
}

export const SubCategoryManager: React.FC = () => {
  const categories = [
    { value: '1', label: 'Saree' },
    { value: '2', label: 'Dress Materials' },
  ];

  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    { id: '101', categoryId: '1', name: 'Gaji Silk', imageName: 'gaji_silk.jpg' },
    { id: '102', categoryId: '2', name: 'Cotton Dress Piece', imageName: 'cotton.jpg' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('1');
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter Dropdown State - now handles null cleanly as "All"
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Crop & File State management
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleFileUpload = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file.name);
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrcImage(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (finalFile: File, previewUrl: string) => {
    setCroppedFile(finalFile);
    setImagePreview(previewUrl);
    setSrcImage(null);
  };

  const handleCancelCrop = () => {
    setSrcImage(null);
    if (!imagePreview) {
      setSelectedFile('');
    }
  };

  const clearImageSelection = () => {
    setSelectedFile('');
    setCroppedFile(null);
    setImagePreview('');
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingId) {
      setSubCategories(
        subCategories.map((sub) =>
          sub.id === editingId
            ? { 
                ...sub, 
                categoryId: selectedCategory, 
                name, 
                imageName: selectedFile || sub.imageName, 
                imagePreview: imagePreview || sub.imagePreview 
              }
            : sub
        )
      );
      setEditingId(null);
    } else {
      setSubCategories([...subCategories, {
        id: Date.now().toString(),
        categoryId: selectedCategory,
        name,
        imageName: selectedFile || 'placeholder.jpg',
        imagePreview: imagePreview,
      }]);
    }

    setName('');
    clearImageSelection();
  };

  const startEdit = (sub: SubCategory) => {
    setEditingId(sub.id);
    setSelectedCategory(sub.categoryId);
    setName(sub.name);
    setSelectedFile(sub.imageName);
    setImagePreview(sub.imagePreview || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    clearImageSelection();
  };

  const handleDelete = (id: string) => {
    setSubCategories(subCategories.filter((sub) => sub.id !== id));
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  // Live data filtering computation block using our null validation
  const filteredSubCategories = !filterCategory
    ? subCategories
    : subCategories.filter(sub => sub.categoryId === filterCategory);

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-1">Sub-Category Mappings</h2>
      <p className="text-sm text-text-muted mb-6">Map subsets directly inside master categories.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-bg-main/40 p-4 rounded-xl border border-border-main">
        <div className="flex flex-col gap-4">
          <Select label="Parent Category" options={categories} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} />
          <Input label="Sub-Category Name" placeholder="e.g., Banarasi Silk" value={name} onChange={(e) => setName(e.target.value)} />
          
          <div className="flex gap-2 mt-auto">
            <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-maroon-500 hover:bg-brand-maroon-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
              {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Update Variant Set' : 'Map Sub-Category'}
            </button>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2.5 border border-border-main rounded-lg text-sm font-medium text-text-muted hover:bg-bg-main transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        
        <div>
          <div onClick={(e) => {
            const element = e.target as HTMLInputElement;
            if (element.type === 'file') element.value = '';
          }}>
            <FileUpload label="Icon Art / Display Cover File" onChange={handleFileUpload} multiple={false} />
          </div>
          
          {/* Theme-compliant Thumbnail Preview Box */}
          {imagePreview ? (
            <div className="flex items-center justify-between mt-3 p-2 border border-dashed border-border-main rounded-lg bg-bg-card">
              <div className="flex items-center gap-3">
                <img 
                  src={imagePreview} 
                  alt="preview" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-maroon-500 shadow-sm"
                />
                <div className="flex flex-col">
                  <p className="text-xs font-semibold text-text-main">Active Selection</p>
                  <p className="text-[11px] text-text-muted truncate max-w-45">{selectedFile}</p>
                </div>
              </div>
              <button 
                onClick={clearImageSelection}
                className="p-1 hover:bg-bg-main text-text-muted hover:text-red-500 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : selectedFile ? (
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-xs text-brand-maroon-500 font-medium truncate max-w-[85%]">Selected: {selectedFile}</p>
              <button onClick={clearImageSelection} className="text-xs text-text-muted hover:text-red-500 transition">Clear</button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Replaced old box with theme tokens and integrated FilterSearchDropdown */}
      <div className="mb-6 bg-bg-main/60 p-4 rounded-xl border border-border-main">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-text-muted">
          <Filter className="w-3.5 h-3.5 text-brand-maroon-500" /> 
          <span>Filter Table View By Category</span>
        </div>
        <FilterSearchDropdown
          placeholder="All Categories (Type to filter...)"
          options={categories}
          selectedValue={filterCategory}
          onSelect={(value) => setFilterCategory(value)}
        />
      </div>

      {/* Sub-Categories Data Table View */}
      <div className="overflow-hidden border border-border-main rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-main text-text-muted text-xs font-semibold uppercase tracking-wider border-b border-border-main">
              <th className="p-4 w-24">Visual Icon</th>
              <th className="p-4">Parent Reference</th>
              <th className="p-4">Subcategory Component Title</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main text-sm">
            {filteredSubCategories.length > 0 ? (
              filteredSubCategories.map((sub) => (
                <tr key={sub.id} className="hover:bg-bg-main/30 transition-colors">
                  <td className="p-4">
                    {sub.imagePreview ? (
                      <img src={sub.imagePreview} alt="" className="w-10 h-10 rounded-full object-cover border border-border-main shadow-inner"/>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center text-xs font-bold text-text-muted border border-border-main">N/A</div>
                    )}
                  </td>
                  <td className="p-4 text-xs font-semibold text-brand-maroon-500">
                    {categories.find(c => c.value === sub.categoryId)?.label || 'Unknown'}
                  </td>
                  <td className="p-4 text-text-main font-medium">{sub.name}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(sub)} className="p-1.5 hover:bg-bg-main rounded-md text-text-muted hover:text-brand-maroon-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-1.5 hover:bg-bg-main rounded-md text-text-muted hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted text-sm bg-bg-card">
                  No child subcategories found mapped inside this filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {srcImage && (
        <ImageCropperModal
          imageSrc={srcImage}
          onCropComplete={handleCropComplete}
          onClose={handleCancelCrop}
        />
      )}
    </div>
  );
};