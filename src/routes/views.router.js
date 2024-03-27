const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();

router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

//views product
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    const newArray = products.docs.map((producto) => {
      const { _id, ...rest } = producto.toObject();
      return rest;
    });
    res.render("products", {
      productos: newArray,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
    });
  } catch (error) {
    console.error("Error al obtener productos en views router", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor en views",
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartManager.getCartById(cartId);
    console.log(cart);
    if (!cart) {
      console.log("No existe el carrito con ese id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productsInCart = cart.products.map((item) => ({
      product: item.products.toObject(),
      //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
      quantity: item.quantity,
    }));

    res.render("carts", { productos: productsInCart });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor en views router" });
  }
});

module.exports = router;
