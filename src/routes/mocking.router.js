import { Router } from "express";
import { getProducts } from "../controllers/mocking.controller.js";


const router = Router();

router.get('/', getProducts);

export default router;