const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use("/citas/public", express.static(process.cwd() + "/public"));

app.get("/citas/", (req, res) => {
  res.render("index", { titulo: "My page" });
});

app.get("/citas/pagos/", (req, res) => {
  res.render("pago", { titulo: "My page" });
});

app.listen(3000, () => {
  console.log("Running");
});
