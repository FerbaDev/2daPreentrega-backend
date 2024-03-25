const express = require("express")
const router = express.Router();
const CartManager = require("../controllers/cartManager.js")

router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
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

     const productsInCart = cart.products.map(item => ({
        product: item.products.toObject(),
        //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
        quantity: item.quantity
     }));

     
     res.render("carts", { productos: productsInCart });
  } catch (error) {
     console.error("Error al obtener el carrito", error);
     res.status(500).json({ error: "Error interno del servidor en views router" });
  }
});

module.exports = router;
