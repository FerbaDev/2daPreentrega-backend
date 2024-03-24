//configuramos dotenv
require("dotenv").config();
//configuramos mongo db
const mongoose = require("mongoose");
 //crear la conexion con la base de datos

mongoose.connect(`mongodb+srv://Ferbadev:${process.env.PASSWORD}@cluster0.qaz6nck.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("Conexion a Mongo DB exitosa"))
    .catch((error) => console.log("Conexion a Mongo DB falló", error))//luego lo requerimos en app