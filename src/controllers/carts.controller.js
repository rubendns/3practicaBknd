import { cartService } from "../services/repository/services.js";
import { updateStockController } from "./products.controller.js";
import { createTicket } from "../controllers/tickets.controller.js";
import { sendMail } from "./email.controller.js";
import CustomError from "../services/errors/CustomErrors.js";
import EErrors from "../services/errors/errors-nums.js";
// import { addtoCartErrorInfo } from '../services/errors/products-error.messages.js';

export const purchaseCartController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    // obtengo los productos del carrito
    const productsFromCart = await getProductsFromCartById(cartId);
    //  le envio el arreglo de productos y que me devuelva un array de validos e invalidos
    const { validProducts, invalidProducts } = evaluateStock(productsFromCart);
    // lo validos deben bajar stock
    let grandTotal = 0;
    // Recorrer los productos válidos y realizar operaciones asincrónicas
    for (const product of validProducts) {
      // Sumar al total
      grandTotal += product.productId.price * product.quantity;
      // Actualizar stock
      await updateStockController(product.productId, product.quantity);
      // Eliminar producto del carrito
      const reqs = { cid: cartId, pid: product.productId };
      await deleteProductFromCartByIdController(reqs, res);
    }
    // Si hay productos válidos, crear el ticket
    if (validProducts.length > 0) {
      // console.log("total: ", grandTotal);
      const ticket = {
        amount: grandTotal,
        purchaser: req.session.user.username,
      };
      const createdTicket = await createTicket(ticket, res);
      // console.log(createTicket);
      sendMail(
        req.session.user.email,
        " compra realizada "
      );
    } else {
      // res.status(400).json({ message: "No hay productos válidos en el carrito" });
    }
  } catch (error) {
    console.error("Error en purchaseCartController:", error);
    // res.status(500).json({ message: "Error en el servidor" });
  }
};

function evaluateStock(productsFromCart) {
  const validProducts = [];
  const invalidProducts = [];
  productsFromCart.forEach((product) => {
    if (product.quantity <= product.productId.stock) {
      validProducts.push(product);
    } else {
      invalidProducts.push(product);
    }
  });
  return { validProducts, invalidProducts };
}

export const getAllCartsController = async (req, res) => {
  return await res.json(cartService.getAllCarts());
};

export const getCartByIdController = async (req, res) => {
  const cartId = req.params.id;
  try {
    const cart = await cartService.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carro no encontrado" });
    }
    res.render("cart", {
      name: "admin",
      admin: true,
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartByUserIdController = async (req, res) => {
  const userId = req.params.uid;
  try {
    const cart = await cartService.getCartByUserId(userId);
    if (!cart) {
      await cartService.createCart(userId);
    }
    res.render("cart", {
      user: req.session.user,
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCartController = async (req, res) => {
  const userID = req.params.uid;
  try {
    const newCart = await cartService.createCart(userID);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWholeCartController = async (req, res) => {
  const cartID = req.params.cid;
  try {
    const updatedCart = await cartService.deleteCart(cartID);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductFromCartByIdController = async (req, res) => {
  // console.log(req.params.cid, req.params.pid);
  const cartID = req.params ? req.params.cid : req.cid;
  const productID = req.params ? req.params.pid : req.pid._id;
  try {
    const updatedCart = await cartService.deleteProductFromCart(
      cartID,
      productID
    );
    if (!updatedCart) {
      // return res.status(404).json({ error: 'carrito no actualizado' });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    // res.status(500).json({ error: error.message });
  }
};

export const addProductToCartByIdController = async (req, res) => {
  const anID = req.params.cid;
  const productID = req.params.pid;
  const qtty = req.params.qtty;
  try {
    const updatedCart = await cartService.addProductToCart(
      anID,
      productID,
      qtty
    );
    if (!updatedCart) {
      return res.status(404).json({ error: "carrito no actualizado" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function getProductsFromCartById(cartId) {
  try {
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
      console.error("Cart not found for ID:", cartId);
      return res.status(404).json({ error: "Cart not found" });
    }
    return cart.products;
  } catch (error) {
    console.error(
      "Error while getting products for cart with ID:",
      cartId,
      error
    );
    return res.status(500).json({ error: error.message });
  }
}
