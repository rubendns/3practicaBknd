import cartDao from "../services/dao/carts.dao.js";
class CartsService {
    async getAllCarts() {
        return await cartDao.getAllCarts();
    }

    async getCartById(cid) {
        return await cartDao.getCartById(cid);
    }

    async createCart() {
        return await cartDao.createCart();
    }

    async addProductToCart(cid, pid) {
        return await cartDao.addProductToCart(cid, pid);
    }

    async deleteProductFromCart(cid, pid) {
        return await cartDao.deleteProductFromCart(cid, pid);
    }

    async updateCart(cid, products) {
        return await cartDao.updateCart(cid, products);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await cartDao.updateProductQuantity(cid, pid, quantity);
    }

    async deleteCart(cid) {
        return await cartDao.deleteCart(cid);
    }
}

export default new CartsService();

