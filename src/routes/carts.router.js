const express = require("express");
const cartRouter = express.Router();
//traemos el cart manager
const CartManager = require("../controllers/cartManager.js")
const cartManager = new CartManager()
const CartModel = require("../models/cart.model.js")

//creamos el nuevo carrito

cartRouter.post("/", async (req, res) => { 
  try {
    let newCart = await cartManager.createCart();
    res.json(newCart)
  } catch (error) {
    console.error("Error al crear nuevo carrito", error);
    res.status(500).json({error: "Error interno del servidor"})
  }
})

cartRouter.get("/", (req, res) => {
  res.render("carrito", { title: "Carrito" });
})

//listamos los productos 
cartRouter.get("/:cid", async (req, res) => {
  let cartId = req.params.cid;

  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log("No existe el carrito con ese id");
      return res.status(404).json({ error: "Carrito no encontrado" });
  }
    res.json(cart.products)
  } catch (error) {
    console.error("Error al obtener carrito", error);
    res.status(500).json({error: "Error interno del servidor"})
  }
 })

//agregar productos a distintos carritos

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  let quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json(updateCart.products);
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({error: "Error interno del servidor"})
  }
 })

//eliminamos un producto por id
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    const updateCart = await cartManager.deleteProductFromCart(cartId, productId);
    res.json({
      status: "success",
      message: "Producto eliminado del carrito correctamente",
      updateCart
    })
  } catch (error) {
    console.error('Error al eliminar el producto del carrito en cart.router', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
  }
)

//exportamos el router
module.exports = cartRouter;
