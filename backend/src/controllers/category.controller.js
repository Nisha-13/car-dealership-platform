const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');

class CategoryController {
  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.find().sort('name');
      return ApiResponse.success(res, categories, 'Categories retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async createCategory(req, res, next) {
    try {
      const { name, description, icon, image } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const category = await Category.create({ name, slug, description, icon, image });
      return ApiResponse.success(res, category, 'Category created', 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { name, description, icon, image } = req.body;
      const category = await Category.findById(req.params.id);
      if (!category) return ApiResponse.error(res, 'Category not found', 404);

      if (name) {
        category.name = name;
        category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (description !== undefined) category.description = description;
      if (icon !== undefined) category.icon = icon;
      if (image !== undefined) category.image = image;

      await category.save();
      return ApiResponse.success(res, category, 'Category updated');
    } catch (err) {
      next(err);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return ApiResponse.error(res, 'Category not found', 404);
      await category.deleteOne();
      return ApiResponse.success(res, null, 'Category deleted');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
