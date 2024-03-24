const express = require("express");

//invocamos el método router de express
const productsRouter = express.Router();
//traemos el product manager
const ProductManager = require("../controllers/productManager");
const productManager = new ProductManager();
const ProductModel = require("../models/product.model.js");

//array de productos


//rutas productos
//get products
productsRouter.get("/products", async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;

  try {
      const productsList = await ProductModel.paginate({}, {limit, page});

      //Recuperamos los docs: 

      const productosResultadoFinal = productsList.docs.map( product => {
          const {_id, ...rest} = product.toObject();
          return rest; 
      })

      res.render("products", {
          products: productosResultadoFinal,
          hasPrevPage: productsList.hasPrevPage,
          hasNextPage: productsList.hasNextPage,
          prevPage: productsList.prevPage,
          nextPage: productsList.nextPage,
          currentPage: productsList.page,
          totalPages: productsList.totalPages
      })
  } catch (error) {
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
    res.status(201).json({ status: "success", message: "Producto creado correctamente!" });
    
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
    res.json({message: "Producto actualizado exitosamente."})
  } catch (error) {
    console.log("error al actualizar el produto", error);
    res.status(500).json({error: "Error interno del servidor"})
  }
})
//eliminar por id
productsRouter.delete("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
      await productManager.deleteProduct(id);
      res.json({message: "Producto eliminado exitosamente"})
  } catch (error) {
    console.log("Error al eliminar el produto", error);
    res.status(500).json({error: "Error interno del servidor"})
  }
 })


//exportamos el router
module.exports = productsRouter;
