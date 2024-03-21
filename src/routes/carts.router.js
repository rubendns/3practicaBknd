import { Router } from "express";
import {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteCart,
} from "../controllers/carts.controller.js";

const CartsRouter = Router();

// Rutas
CartsRouter.get("/", getAllCarts);
CartsRouter.post("/", createCart);
CartsRouter.get("/:cid", getCartById);
CartsRouter.post("/:cid/product/:pid", addProductToCart);
CartsRouter.delete("/:cid/products/:pid", deleteProductFromCart);
CartsRouter.put("/:cid", updateCart);
CartsRouter.put("/:cid/products/:pid", updateProductQuantity);
CartsRouter.delete("/:cid", deleteCart);

export { CartsRouter };
