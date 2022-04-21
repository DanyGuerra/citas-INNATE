const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5500;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.render("index", { titulo: "My page" });
});

app.get("/pago", (req, res) => {
  res.render("pago", { titulo: "My page" });
});

app.listen(PORT, () => {
  console.log(`App running in http://localhost:${PORT}`);
});
