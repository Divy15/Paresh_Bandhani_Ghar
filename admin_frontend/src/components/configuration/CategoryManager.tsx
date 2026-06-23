import React, { useState } from 'react';
import { Input } from '../commonComponents/Input';
import { FileUpload } from '../commonComponents/FileUpload';
import { ImageCropperModal } from '../commonComponents/ImageCropperModal'; // Import your new component
import { FilterSearchDropdown } from '../commonComponents/FilterSearchDropdown'; // Import your common component
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  imageName: string;
  imagePreview?: string; // Tracks cropped visual previews smoothly
}

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Saree', imageName: 'saree_thumb.jpg' },
    { id: '2', name: 'Dress Materials', imageName: 'dress_thumb.jpg' },
  ]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Selected Filter State from our Suggestion Component
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  
  // Crop & File State management
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleFileUpload = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file.name);
      
      // Convert image to dataURI so the cropper component can display it
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrcImage(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (finalFile: File, previewUrl: string) => {
    setCroppedFile(finalFile);
    setImagePreview(previewUrl); // Set state to visually render a circle thumbnail
    setSrcImage(null); // Close Modal
  };

  const handleCancelCrop = () => {
    setSrcImage(null);
    // If cancelling a fresh upload without an existing image, clear out file selections
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

    // Note: 'croppedFile' holds the final blob data payload ready for API uploads
    if (editingId) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingId
            ? { ...cat, name, imageName: selectedFile || cat.imageName, imagePreview: imagePreview || cat.imagePreview }
            : cat
        )
      );
      setEditingId(null);
    } else {
      setCategories([
        ...categories,
        { 
          id: Date.now().toString(), 
          name, 
          imageName: selectedFile || 'placeholder.jpg',
          imagePreview: imagePreview 
        },
      ]);
    }
    
    // Clear all inputs back to original state
    setName('');
    clearImageSelection();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSelectedFile(cat.imageName);
    setImagePreview(cat.imagePreview || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    clearImageSelection();
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    if (editingId === id) {
      handleCancelEdit();
    }
    // If the active filter target gets deleted, drop the selection safely
    if (selectedFilterId === id) {
      setSelectedFilterId(null);
    }
  };

  // Convert your active category state into options format required by the common component
  const dropdownOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  // Filter Table computed results block
  const filteredCategories = selectedFilterId
    ? categories.filter((cat) => cat.id === selectedFilterId)
    : categories;

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-1">Category Administration</h2>
      <p className="text-sm text-text-muted mb-6">Create base collection rules for items.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-bg-main/40 p-4 rounded-xl border border-border-main">
        <div className="flex flex-col gap-4">
          <Input
            label="Category Title Name"
            placeholder="e.g., Silk Dupattas"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-maroon-500 hover:bg-brand-maroon-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Update Variant' : 'Add New Category'}
            </button>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        
        <div>
          <div onClick={(e) => {
            // Allows uploading the same filename sequentially without field blockage
            const element = e.target as HTMLInputElement;
            if (element.type === 'file') element.value = '';
          }}>
            <FileUpload label="Category Banner/Icon Thumbnail" onChange={handleFileUpload} multiple={false} />
          </div>
          
          {/* Enhanced Circle Preview State Visualizer */}
          {imagePreview ? (
            <div className="flex items-center justify-between mt-3 p-2 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <img 
                  src={imagePreview} 
                  alt="preview" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-maroon-500 shadow-sm"
                />
                <div className="flex flex-col">
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Active Selection</p>
                  <p className="text-[11px] text-text-muted truncate max-w-45">{selectedFile}</p>
                </div>
              </div>
              <button 
                onClick={clearImageSelection}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-red-500 rounded-full transition"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : selectedFile ? (
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-xs text-brand-maroon-500 font-medium truncate max-w-[85%]">Selected: {selectedFile}</p>
              <button onClick={clearImageSelection} className="text-xs text-neutral-400 hover:text-red-500 transition">Clear</button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Integrated Common Suggestion Filter Component */}
      <div className="mb-6">
        <FilterSearchDropdown
          label="Filter Categories View"
          placeholder="Search and narrow down view..."
          options={dropdownOptions}
          selectedValue={selectedFilterId}
          onSelect={(value) => setSelectedFilterId(value)}
        />
      </div>

      {/* Categories Table View */}
      <div className="overflow-hidden border border-border-main rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-main text-text-muted text-xs font-semibold uppercase tracking-wider border-b border-border-main">
              <th className="p-4 w-24">Visual Icon</th>
              <th className="p-4">File String</th>
              <th className="p-4">Category Node Title</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main text-sm">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-bg-main/30 transition-colors">
                  <td className="p-4">
                    {cat.imagePreview ? (
                      <img src={cat.imagePreview} alt="" className="w-10 h-10 rounded-full object-cover border border-border-main shadow-inner"/>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-neutral-400 border border-neutral-200 dark:border-neutral-700">N/A</div>
                    )}
                  </td>
                  <td className="p-4 font-mono text-xs text-text-muted">{cat.imageName}</td>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(cat)} className="p-1.5 hover:bg-bg-main rounded-md text-text-muted hover:text-brand-maroon-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-bg-main rounded-md text-text-muted hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted text-sm">
                  No matching categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Conditionally trigger Crop workspace overlay */}
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