require("dotenv").config();
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
});
