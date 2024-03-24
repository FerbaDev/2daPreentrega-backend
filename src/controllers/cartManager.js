const CartModel = require("../models/cart.model.js");

class CartManager {
    


    async createCart() {
       try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
       } catch (error) {
        console.log("Error al crear carrito", error);
        throw error;
       }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId)

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const existeProducto = cart.products.find(item => item.product.toString() === productId)

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            //luego de modificar tenemos que marcar como modificado con "markModified".
            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error al agregar un producto al carrito", error);
            throw error;
        }
    }
}

module.exports = CartManager;

