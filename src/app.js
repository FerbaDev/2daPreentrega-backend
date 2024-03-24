const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io")
//configuramos handlebaars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//importamos las rutas
const viewsRouter = require("./routes/views.router.js")
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
//traemos el product manager
const ProductManager = require("./controllers/productManager.js");
//instanciamos
const productManager = new ProductManager("./src/models/productos.json");
require("./database.js");
//configuramos middleware para recibir datos en formato json
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
//Midelware
app.use(express.static("./src/public"));

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter)

//1)referencia guardada del servidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Conectado a http://localhost:${PUERTO}`);
});

const MessageModel = require("./models/message.model.js")

//instanciamos io pasandole como parametro el servidor
const io = new socket.Server(httpServer);



io.on("connection", (socket) => {
  console.log("Cliente conectado");
  socket.on("message", async (data) => {
    //guardo el mensaje en mongodb
    await MessageModel.create(data)

    //obtengo los mensajes de mongo y se los paso al cliente
    let messages = await MessageModel.find();
    io.sockets.emit("message", messages)

  });
});

module.exports = productManager;
