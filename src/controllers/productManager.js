const ProductModel = require("../models/product.model.js")

class ProductManager {


  //Métodos:

  async addProduct(newObject) {
    try {
      
      let { title, description, price, thumbnail, code, category, stock } = newObject;  
      
      //verificaciones
      
      if (!title || !description || !price || !thumbnail || !code || !category || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
      }
      
      const productExist = await ProductModel.findOne({code: code})
      if (productExist) {
        console.log("El codigo debe ser unico");
        return;
      }
      
      //generar producto
      const newProduct = new ProductModel({
        title,
        description,
        price,
        thumbnail,
        category,
        code,
        stock,
        status: true
      });
      
      await newProduct.save()
    } catch (error) {
      console.log("error al cargar producto", error);
      throw error;
    }
  }

  //get products
  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log("Error al recuperar producto", error);
    }
  }

  //get product by id
  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id)
      if (!product) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado! ");
        return product;
      }
    } catch (error) {
      console.log("Error al leer el archivo ", error);
    }
  }

  //actualizar producto
  async updateProduct(id, productoActualizado) {
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado);
      if (!updateProduct) {
        console.log("Producto no encontrado");
        return null;
      }
      console.log("Producto actualizado correctamente");
      return updateProduct
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }
  async deleteProduct(id) {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(id);
      if (!deleteProduct) {
        console.log("Producto no encontrado");
        return null;
      }
      console.log("Producto eliminado correctamente");
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;