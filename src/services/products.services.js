import productDao from "../services/dao/products.dao.js";
class ProductsService {
    async getAllProducts(page, limit, sort) {
        try {
        return await productDao.getAllProducts(page, limit, sort);
        } catch (error) {
        throw new Error("Error fetching products: " + error.message);
        }
    }

    async getProductById(pid) {
        try {
        return await productDao.getProductById(pid);
        } catch (error) {
        throw new Error("Error fetching product: " + error.message);
        }
    }

    async createProduct(product) {
        try {
        return await productDao.createProduct(product);
        } catch (error) {
        throw new Error("Error creating product: " + error.message);
        }
    }

    async updateProduct(pid, product) {
        try {
        return await productDao.updateProduct(pid, product);
        } catch (error) {
        throw new Error("Error updating product: " + error.message);
        }
    }

    async deleteProduct(pid) {
        try {
        return await productDao.deleteProduct(pid);
        } catch (error) {
        throw new Error("Error deleting product: " + error.message);
        }
    }
}

export default new ProductsService();
