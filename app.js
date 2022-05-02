require("dotenv").config();
<<<<<<< HEAD
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const datos = require("./datos");
const HOST = process.env.NODE_ENV === "production" ? process.env.HOST : "/";
const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 5500;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get(`${HOST}`, (req, res) => {
  res.render("index", { titulo: "My page" });
});

app.get(`${HOST}pago`, (req, res) => {
  res.render("pago", { titulo: "My page" });
});

app.get(`${HOST}api/horarios`, (req, res) => {
  const fecha = req.query.fecha;
  const horarios = datos.citas.horarios;
  const horaPorFecha = horarios.filter((hora) => hora.fecha == fecha);
  res.json(horaPorFecha);
});

app.listen(PORT, () => {
  console.log(`App running in http://localhost:${PORT}`);
=======
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const path = require("path");

const datos = {
  horarios: [
    { fecha: "02/05/2022", 9: true },
    { fecha: "02/05/2022", 10: true },
    { fecha: "02/05/2022", 11: false },
    { fecha: "02/05/2022", 12: true },
    { fecha: "02/05/2022", 13: true },
    { fecha: "02/05/2022", 14: false },
    { fecha: "03/05/2022", 9: false },
    { fecha: "03/05/2022", 10: true },
    { fecha: "03/05/2022", 11: true },
    { fecha: "03/05/2022", 12: false },
    { fecha: "03/05/2022", 13: false },
    { fecha: "03/05/2022", 14: true },
    { fecha: "04/05/2022", 9: true },
    { fecha: "04/05/2022", 10: true },
    { fecha: "04/05/2022", 11: false },
    { fecha: "04/05/2022", 12: false },
    { fecha: "04/05/2022", 13: false },
    { fecha: "04/05/2022", 14: true },
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use("/citas/public", express.static(process.cwd() + "/public"));

app.get("/citas/api/horarios", (req, res) => {
  const fecha = req.query.fecha;
  const horarios = datos.horarios;
  const horaPorFecha = horarios.filter((hora) => hora.fecha == fecha);
  res.json(horaPorFecha);
});

app.get("/citas/agendar", (req, res) => {
  res.render("index", { titulo: "My page" });
});

app.get("/citas/pagos/", (req, res) => {
  const sucursal = req.query.sucursal;
  const fecha = req.query.fecha;
  res.render("pago", { sucursal: sucursal.toUpperCase(), fecha: fecha });
});

app.get("/citas/pagos/confirmacion", (req, res) => {
  const order_id = req.query.orderId;
  if (order_id) {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: '"CITA INNATE" <from@example.com>',
      to: "luisdanyramirez@hotmail.com",
      subject: "Cita agendada",
      text: "Confirmacion de cita",
      html: `<b>Hola!! </b><br> Tu cita ha sido agendada con exito.<br />El id de tu cita es <b>${order_id}</b>`,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }

      console.log("Message sent: %s", info.messageId);
    });
    res.render("confirmacion", { titulo: "My page" });
  }
});

app.listen(3000, () => {
  console.log(`App running in: http://localhost:3000/citas/agendar`);
>>>>>>> checkout-token
});
