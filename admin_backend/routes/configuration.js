const express = require('express');
const route = express.Router();
const { celebrate, Segments } = require('celebrate');
const configCtrl = require('../controllers/configuration');
const paramValidation = require('../validation/configuration');

route.route('/store/category')
.post(
    celebrate({[Segments.BODY]: paramValidation.storeCategory.body}), 
    configCtrl.storeCategory
);

route.route('/update/category')
.post(
    celebrate({[Segments.BODY]: paramValidation.updateCategory.body}), 
    configCtrl.updateCategory
);

route.route('/get/categories')
.get(
    celebrate({[Segments.QUERY]: paramValidation.getCategories.query}), 
    configCtrl.getCategories
);

route.route('/delete/category')
.post(
    celebrate({[Segments.BODY]: paramValidation.deleteCategory.body}), 
    configCtrl.deleteCategory
);

route.route('/store/subcategory')
.post(
    celebrate({[Segments.BODY]: paramValidation.storeSubCategory.body}), 
    configCtrl.storeSubCategory
);

route.route('/update/subcategory')
.post(
    celebrate({[Segments.BODY]: paramValidation.updateSubCategory.body}), 
    configCtrl.updateSubCategory
);

route.route('/delete/subcategory')
.post(
    celebrate({[Segments.BODY]: paramValidation.deleteSubCategory.body}), 
    configCtrl.deleteSubCategory
);

route.route('/get/subcategories')
.get(
    celebrate({[Segments.QUERY]: paramValidation.getSubCategories.query}), 
    configCtrl.getSubCategories
);

route.route('/store/material')
.post(
    celebrate({[Segments.BODY]: paramValidation.storeMaterial.body}), 
    configCtrl.storeMaterial
);

route.route('/delete/material')
.post(
    celebrate({[Segments.BODY]: paramValidation.deleteMaterial.body}), 
    configCtrl.deleteMaterial
);

route.route('/get/materials')
.get(
    configCtrl.getAllMaterials
);

route.route('/store/structure')
.post(
    celebrate({[Segments.BODY]: paramValidation.storeStructure.body}), 
    configCtrl.storeStructure
);

route.route('/update/structure')
.post(
    celebrate({[Segments.BODY]: paramValidation.updateStructure.body}), 
    configCtrl.updateStructure
);

route.route('/delete/structure')
.post(
    celebrate({[Segments.BODY]: paramValidation.deleteStructure.body}), 
    configCtrl.deleteStructure
);

route.route('/get/structures')
.get(
    configCtrl.getStructures
);

module.exports = route;