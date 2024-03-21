import CustomRouter from "./custom/custom.router.js";
import {
  getAllCarts,
  getCartById,
  getCartByUserId,
  createCart,
  deleteWholeCart,
  deleteProductFromCartById,
  addProductToCartById,
  purchaseCart,
} from "../controllers/carts.controller.js";

export default class CartExtendRouter extends CustomRouter {
  init() {

    this.post('/:cid/purchase', ["USER", "ADMIN"], async (req, res) => {
      purchaseCart(req, res)
        .then((result) => {
          res.status(200).json(result);
        })
    });

    this.get('/', ["ADMIN"], async (req, res) => {
      getAllCarts(req, res)
    });

    this.get('/:id', ["USER", "ADMIN"], async (req, res) => {
      getCartById(req, res)
    });

    this.get('/user/:uid', ["USER", "ADMIN"], async (req, res) => {
      getCartByUserId(req, res)
    });

    this.put('/:cid/product/:pid/:qtty', ["USER", "ADMIN"], async (req, res) => {
      addProductToCartById(req, res)
    });

    this.delete('/:cid/product/:pid', ["USER", "ADMIN"], async (req, res) => {
      deleteProductFromCartById(req, res)
    });

    this.delete('/:cid/', ["USER", "ADMIN"], async (req, res) => {
      deleteWholeCart(req, res)
    });

    this.post('/:uid', ["USER", "ADMIN"], async (req, res) => {
      createCart(req, res)
    });
  }
}
