const socket = io();

//creamos una instancia de socket del lado del cliente

//vamos a guardar el nombre del usuario
let user;

const chatbox = document.getElementById("chatBox");

//usamos el objeto Swal y el método Fire

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingrese nombre de usuario",
  inputValidator: (value) => {
    return !value && "Ingrese nombre de usuario para continuar";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  console.log(user);
});

//escuchador de eventos del chatbox
chatbox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      //trim nos permite sacar los espacios en blanco al principio o a final de un string
      socket.emit("message", { user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});

//recibimos los mensajes del server
socket.on("message", (data) => {
  let log = document.getElementById("messagesLogs");
  let mensajes = "";
  data.forEach((mensaje) => {
    mensajes = mensajes + `${mensaje.user} dice: ${mensaje.message} <br>`;
  });
  log.innerHTML = mensajes;
});
