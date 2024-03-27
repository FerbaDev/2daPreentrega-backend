const express = require("express");
const productsRouter = express.Router();

//traemos el product manager
const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();
const ProductModel = require("../models/product.model.js");

//rutas productos
//get products
productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const productsList = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    res.json({
      status: "succes",
      payload: productsList,
      totalPages: productsList.totalPages,
      prevPage: productsList.prevPage,
      nextPage: productsList.nextPage,
      page: productsList.page,
      hasPrevPage: productsList.hasPrevPage,
      hasNextPage: productsList.hasNextPage,
      prevLink: productsList.prevLink,
      nextLink: productsList.nextLink,
    });
  } catch (error) {
    console.error("Error al obtener productos en products router", error);
    res.status(500).send("Error en el servidor");
  }
});

//get product por id
productsRouter.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    let product = await productManager.getProductById(id);
    if (!product) {
      return res.json({ error: "id no encontrado" });
    }
    return res.json(product);
  } catch (error) {
    res.status(500).json({
      error: `Error interno del servidor, no se encuentra el id ${id}`,
    });
  }
});

//post de un nuevo producto
productsRouter.post("/", async (req, res) => {
  const newProduct = req.body;

  try {
    await productManager.addProduct(newProduct);
    res
      .status(201)
      .json({ status: "success", message: "Producto creado correctamente!" });
  } catch (error) {
    res.send("Error al agregar producto");
  }
});

//actualizar por id
productsRouter.put("/:pid", async (req, res) => {
  let id = req.params.pid;
  let productoActualizado = req.body;

  try {
    await productManager.updateProduct(id, productoActualizado);
    res.json({ message: "Producto actualizado exitosamente." });
  } catch (error) {
    console.log("error al actualizar el produto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
//eliminar por id
productsRouter.delete("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    await productManager.deleteProduct(id);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.log("Error al eliminar el produto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//exportamos el router
module.exports = productsRouter;
