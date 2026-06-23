const { Joi } = require('celebrate');

module.exports = {
    storeCategory: {
        body: Joi.object({
            categoryName: Joi.string().trim().min(1).required(),
            imageId: Joi.number().integer().optional().allow(null) // FIX: Made optional to match your DB schema
        })
    },
    updateCategory: {
        body: Joi.object({
            id: Joi.number().integer().required(),
            categoryName: Joi.string().trim().min(1).required(),
            imageId: Joi.number().integer().optional().allow(null) // FIX: Made optional
        })
    },
    getCategories: {
        query: Joi.object({
            search: Joi.string().trim().optional().allow('', null) // FIX: Changed from .required() to .optional() so "Get All" works
        })
    },
    deleteCategory: {
        body: Joi.object({
            id: Joi.number().integer().required()
        })
    },
    storeSubCategory: {
        body: Joi.object({
            categoryId: Joi.number().integer().required(),
            subcategoryName: Joi.string().trim().min(1).required(),
            imageId: Joi.number().integer().optional().allow(null) // FIX: Made optional
        })
    },
    updateSubCategory: {
        body: Joi.object({
            id: Joi.number().integer().required(),
            categoryId: Joi.number().integer().required(),
            subcategoryName: Joi.string().trim().min(1).required(),
            imageId: Joi.number().integer().optional().allow(null) // FIX: Made optional
        })
    },
    deleteSubCategory: {
        body: Joi.object({
            id: Joi.number().integer().required()
        })
    },
    getSubCategories: {
        query: Joi.object({ // FIX: Changed from 'body' to 'query' because GET requests use URL parameters (?categoryId=X)
            categoryId: Joi.number().integer().optional().allow('', null) // Allows fetching everything or filtering
        })
    },
    storeMaterial: {
        body: Joi.object({
            materialName: Joi.string().trim().min(1).required()
        })
    },
    deleteMaterial: {
        body: Joi.object({
            id: Joi.number().integer().required()
        })
    },
    storeStructure: {
        body: Joi.object({
            mainName: Joi.string().trim().min(1).required(),
            includes: Joi.array().items(
                Joi.object({
                    product: Joi.string().trim().min(1).required()
                })
            ).min(1).required()
        })
    },
    updateStructure: {
        body: Joi.object({
            id: Joi.number().integer().required(),
            mainName: Joi.string().trim().min(1).required(), // FIX: Changed from Joi.number() to Joi.string()
            includes: Joi.array().items(
                Joi.object({
                    product: Joi.string().trim().min(1).required()
                })
            ).min(1).required()
        })
    },
    deleteStructure: {
        body: Joi.object({
            id: Joi.number().integer().required()
        })
    },
    getStructures: {
        query: Joi.object({
            search: Joi.string().trim().optional().allow('', null) // FIX: Changed from .required() to .optional()
        })
    }
};