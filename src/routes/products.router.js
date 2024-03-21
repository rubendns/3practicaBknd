import { Router } from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const ProductRouter = Router();

ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:pid", getProductById);
ProductRouter.post("/", createProduct);
ProductRouter.put("/:pid", updateProduct);
ProductRouter.delete("/:pid", deleteProduct);

export { ProductRouter };
