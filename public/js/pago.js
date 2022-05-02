const pagarBtn = document.getElementById("pagar_btn");
// este event listener solo lleva a la página de confirmación
// pagarBtn.addEventListener("click", () => {
//   window.location.href = "http://127.0.0.1:5500/confirmacion.html";
// });

// y este era para probar el modal de error
// pagarBtn.addEventListener("click", () => {
//   fetch("http://localhost:3000/mensajes/2")
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById("modal_text").innerText = data.mensaje;
//       document.getElementById("modal").style.display = "flex";
//       document.getElementById("modalBtn").addEventListener("click", () => {
//         document.getElementById("modal").style.display = "none";
//       });
//     });
// });

// esta función se ejecuta al cargar la página de pago para obtener el precio del mes, previamente seleccionado
// function setPrecio() {
//   const url_string = window.location.href;
//   const url = new URL(url_string);
//   const param = url.searchParams.get("mes");

//   fetch("http://localhost:3000/precioMes?id=" + param)
//     .then((response) => response.json())
//     .then((data) => {
//       document.getElementById("precio").innerText = data[0].precio;
//       document.getElementById("mes").innerText = data[0].mes.toUpperCase();
//     });
// }
