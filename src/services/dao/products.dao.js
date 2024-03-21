import { productModel } from "../models/products.model.js";
class ProductDao {
  async getAllProducts(page, limit, sort) {
    try {
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      };

      if (sort !== undefined) {
        options.sort = { price: parseInt(sort) };
      }

      const response = await productModel.paginate({}, options);

      return response;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getProductById(pid) {
    try {
      const product = await productModel.findById(pid);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw new Error("Error fetching product: " + error.message);
    }
  }

  async createProduct(product) {
    try {
      return await productModel.create(product);
    } catch (error) {
      throw new Error("Error creating product: " + error.message);
    }
  }

  async updateProduct(pid, product) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(pid, product, { new: true });
      if (!updatedProduct) {
        throw new Error("Product not found");
      }
      return updatedProduct;
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  async deleteProduct(pid) {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(pid);
      if (!deletedProduct) {
        throw new Error("Product not found");
      }
      return deletedProduct;
    } catch (error) {
      throw new Error("Error deleting product: " + error.message);
    }
  }
}

export default new ProductDao();
