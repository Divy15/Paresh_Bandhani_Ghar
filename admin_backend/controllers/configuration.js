const { pgClient } = require('../utils/db');

/**
 * 1. Store a New Category
 * Expects { categoryName, imageId } in the request body
 */
const storeCategory = async (req, res) => {
  try {
    const { categoryName, imageId } = req.body;

    if (!categoryName || categoryName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.'
      });
    }

    // Clean inputs: default to null if no imageId is provided
    const nameParam = categoryName.trim();
    const imageIdParam = imageId ? parseInt(imageId, 10) : null;

    const queryText = 'SELECT store_category($1, $2) AS new_id;';
    const values = [nameParam, imageIdParam];

    const result = await pgClient.query(queryText, values);
    const newId = result.rows[0].new_id;

    return res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: { id: newId }
    });

  } catch (error) {
    console.error('Error in storeCategory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save category to database.',
      error: error.message
    });
  }
};

/**
 * 2. Update an Existing Category
 * Expects { id, categoryName, imageId } in the request body
 */
const updateCategory = async (req, res) => {
  try {
    const { id, categoryName, imageId } = req.body;

    if (!id || !categoryName || categoryName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category ID and Name are required for updating.'
      });
    }

    const idParam = parseInt(id, 10);
    const nameParam = categoryName.trim();
    const imageIdParam = imageId ? parseInt(imageId, 10) : null;

    const queryText = 'SELECT update_category($1, $2, $3) AS was_updated;';
    const values = [idParam, nameParam, imageIdParam];

    const result = await pgClient.query(queryText, values);
    const wasUpdated = result.rows[0].was_updated;

    if (!wasUpdated) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or no changes made.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully!'
    });

  } catch (error) {
    console.error('Error in updateCategory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update category in database.',
      error: error.message
    });
  }
};

/**
 * 3. Get / Search Categories Catalog
 * Optional fuzzy search string passed via URL query string '?search=...'
 */
const getCategories = async (req, res) => {
  try {
    const { search } = req.query;
    const searchParam = search && search.trim() !== '' ? search.trim() : null;

    const queryText = 'SELECT * FROM get_category_details($1);';
    const values = [searchParam];

    const result = await pgClient.query(queryText, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Error in getCategories controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories catalog from database.',
      error: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    // You can pull this from req.body or req.params depending on your route design
    const { id } = req.body; 

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required to perform deletion.'
      });
    }

    const idParam = parseInt(id, 10);
    const queryText = 'SELECT delete_category($1) AS was_deleted;';
    const values = [idParam];

    const result = await pgClient.query(queryText, values);
    const wasDeleted = result.rows[0].was_deleted;

    if (!wasDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Category not found. No records were deleted.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully!'
    });

  } catch (error) {
    console.error('Error in deleteCategory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete the category from the database.',
      error: error.message
    });
  }
};

/**
 * Expects { categoryId, subcategoryName, imageId } in body
 */
const storeSubCategory = async (req, res) => {
  try {
    const { categoryId, subcategoryName, imageId } = req.body;

    if (!categoryId || !subcategoryName || subcategoryName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Parent categoryId and subcategoryName are required.' });
    }

    const catIdParam = parseInt(categoryId, 10);
    const nameParam = subcategoryName.trim();
    const imgIdParam = imageId ? parseInt(imageId, 10) : null;

    const queryText = 'SELECT store_subcategory($1, $2, $3) AS new_id;';
    const values = [catIdParam, nameParam, imgIdParam];

    const result = await pgClient.query(queryText, values);
    const newId = result.rows[0].new_id;

    return res.status(201).json({
      success: true,
      message: 'Subcategory created successfully!',
      data: { id: newId }
    });
  } catch (error) {
    console.error('Error in storeSubCategory:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Expects { id, categoryId, subcategoryName, imageId } in body
 */
const updateSubCategory = async (req, res) => {
  try {
    const { id, categoryId, subcategoryName, imageId } = req.body;

    if (!id || !categoryId || !subcategoryName || subcategoryName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Subcategory ID, categoryID, and Name are required.' });
    }

    const subIdParam = parseInt(id, 10);
    const catIdParam = parseInt(categoryId, 10);
    const nameParam = subcategoryName.trim();
    const imgIdParam = imageId ? parseInt(imageId, 10) : null;

    const queryText = 'SELECT update_subcategory($1, $2, $3, $4) AS was_updated;';
    const values = [subIdParam, catIdParam, nameParam, imgIdParam];

    const result = await pgClient.query(queryText, values);
    const wasUpdated = result.rows[0].was_updated;

    if (!wasUpdated) {
      return res.status(404).json({ success: false, message: 'Subcategory target missing or no field modifications.' });
    }

    return res.status(200).json({ success: true, message: 'Subcategory updated successfully!' });
  } catch (error) {
    console.error('Error in updateSubCategory:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Expects { id } in body
 */
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Subcategory ID is required for deletion.' });
    }

    const queryText = 'SELECT delete_subcategory($1) AS was_deleted;';
    const values = [parseInt(id, 10)];

    const result = await pgClient.query(queryText, values);
    const wasDeleted = result.rows[0].was_deleted;

    if (!wasDeleted) {
      return res.status(404).json({ success: false, message: 'Subcategory target record does not exist.' });
    }

    return res.status(200).json({ success: true, message: 'Subcategory deleted successfully!' });
  } catch (error) {
    console.error('Error in deleteSubCategory:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Optional filtering via query parameters: /api/subcategories?categoryId=2
 */
const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    // Parse to number if given, otherwise pass null to get every row
    const catIdParam = categoryId && categoryId.trim() !== '' ? parseInt(categoryId, 10) : null;

    const queryText = 'SELECT * FROM get_subcategories_by_category($1);';
    const values = [catIdParam];

    const result = await pgClient.query(queryText, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error in getSubCategories:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Expects { materialName } in the request body
 */
const storeMaterial = async (req, res) => {
  try {
    const { materialName } = req.body;

    // Validation: Check for empty or missing string values
    if (!materialName || materialName.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Material name is required.' 
      });
    }

    const queryText = 'SELECT store_material($1) AS new_id;';
    const values = [materialName.trim()];

    const result = await pgClient.query(queryText, values);
    const newId = result.rows[0].new_id;

    return res.status(201).json({
      success: true,
      message: 'Material type added successfully!',
      data: { id: newId }
    });
  } catch (error) {
    console.error('Error in storeMaterial controller:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to add material type to database.',
      error: error.message 
    });
  }
};

/**
 * Expects { id } in the request body
 */
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Material ID is required for deletion.' 
      });
    }

    const queryText = 'SELECT delete_material($1) AS was_deleted;';
    const values = [parseInt(id, 10)];

    const result = await pgClient.query(queryText, values);
    const wasDeleted = result.rows[0].was_deleted;

    if (!wasDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Material target record not found.' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Material deleted successfully!' 
    });
  } catch (error) {
    console.error('Error in deleteMaterial controller:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete material from database.',
      error: error.message 
    });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    // Execute the database function directly
    const queryText = 'SELECT * FROM get_all_materials();';
    
    const result = await pgClient.query(queryText);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error in getAllMaterials controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve materials catalog from database.',
      error: error.message
    });
  }
};

/**
 * 1. Create a Product Structure Configuration
 * Expects { mainName, includes } in body. e.g., includes: ["Top", "Bottom"]
 */
const storeStructure = async (req, res) => {
  try {
    const { mainName, includes } = req.body;

    if (!mainName || !mainName.trim() || !includes || !Array.isArray(includes)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Main product name and includes array are required.' 
      });
    }

    const queryText = 'SELECT store_product_structure($1, $2::jsonb) AS new_id;';
    const values = [mainName.trim(), JSON.stringify(includes)];

    const result = await pgClient.query(queryText, values);
    const newId = result.rows[0].new_id;

    return res.status(201).json({
      success: true,
      message: 'Product structure configuration saved successfully!',
      data: { id: newId }
    });
  } catch (error) {
    console.error('Error in storeStructure controller:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 2. Update a Product Structure Configuration
 * Expects { id, mainName, includes } in body
 */
const updateStructure = async (req, res) => {
  try {
    const { id, mainName, includes } = req.body;

    if (!id || !mainName || !mainName.trim() || !includes || !Array.isArray(includes)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Structure ID, main product name, and includes array are required.' 
      });
    }

    const queryText = 'SELECT update_product_structure($1, $2, $3::jsonb) AS was_updated;';
    const values = [parseInt(id, 10), mainName.trim(), JSON.stringify(includes)];

    const result = await pgClient.query(queryText, values);
    const wasUpdated = result.rows[0].was_updated;

    if (!wasUpdated) {
      return res.status(404).json({ success: false, message: 'Structure configuration target not found.' });
    }

    return res.status(200).json({ success: true, message: 'Structure configuration updated successfully!' });
  } catch (error) {
    console.error('Error in updateStructure controller:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 3. Delete a Product Structure Configuration
 * Expects { id } in body
 */
const deleteStructure = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Structure ID is required for deletion.' });
    }

    const queryText = 'SELECT delete_product_structure($1) AS was_deleted;';
    const values = [parseInt(id, 10)];

    const result = await pgClient.query(queryText, values);
    const wasDeleted = result.rows[0].was_deleted;

    if (!wasDeleted) {
      return res.status(404).json({ success: false, message: 'Structure target configuration not found.' });
    }

    return res.status(200).json({ success: true, message: 'Structure blueprint template deleted successfully!' });
  } catch (error) {
    console.error('Error in deleteStructure controller:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4. Get / Search Product Structures
 * Optional filtering via query parameters: /api/structures?search=Lehenga
 */
const getStructures = async (req, res) => {
  try {
    const { search } = req.query;
    const searchParam = search && search.trim() !== '' ? search.trim() : null;

    const queryText = 'SELECT * FROM get_product_structures($1);';
    const values = [searchParam];

    const result = await pgClient.query(queryText, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error in getStructures controller:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Export all three handlers cleanly together
module.exports = {
  storeCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  storeSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
  storeMaterial,
  deleteMaterial,
  getAllMaterials,
  storeStructure,
  updateStructure,
  deleteStructure,
  getStructures,
};