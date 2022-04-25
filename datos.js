const citas = {
  horarios: [
    { fecha: "21/04/2022", 9: true },
    { fecha: "21/04/2022", 10: true },
    { fecha: "21/04/2022", 11: false },
    { fecha: "21/04/2022", 12: true },
    { fecha: "21/04/2022", 13: true },
    { fecha: "21/04/2022", 14: false },
    { fecha: "22/04/2022", 9: false },
    { fecha: "22/04/2022", 10: true },
    { fecha: "22/04/2022", 11: true },
    { fecha: "22/04/2022", 12: false },
    { fecha: "22/04/2022", 13: false },
    { fecha: "22/04/2022", 14: true },
    { fecha: "23/04/2022", 9: true },
    { fecha: "23/04/2022", 10: true },
    { fecha: "23/04/2022", 11: false },
    { fecha: "23/04/2022", 12: false },
    { fecha: "23/04/2022", 13: false },
    { fecha: "23/04/2022", 14: true },
  ],
  precioMes: [
    { id: 1, mes: "enero", precio: "$1,000.00" },
    { id: 2, mes: "febrero", precio: "$1,100.00" },
    { id: 3, mes: "marzo", precio: "$1,200.00" },
    { id: 4, mes: "abril", precio: "$1,300.00" },
    { id: 5, mes: "mayo", precio: "$1,400.00" },
    { id: 6, mes: "junio", precio: "$1,500.00" },
    { id: 7, mes: "julio", precio: "$1,600.00" },
    { id: 8, mes: "agosto", precio: "$1,700.00" },
    { id: 9, mes: "septiembre", precio: "$1,800.00" },
    { id: 10, mes: "octubre", precio: "$1,900.00" },
    { id: 11, mes: "noviembre", precio: "$2,000.00" },
    { id: 12, mes: "diciembre", precio: "$2,100.00" },
  ],
  mensajes: [
    { id: 1, tipo: "exito", mensaje: "Pago realizado correctamente." },
    { id: 2, tipo: "error", mensaje: "No se pudo realizar el pago." },
  ],
};

module.exports = {
  citas,
};
