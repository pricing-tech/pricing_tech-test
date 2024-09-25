const express = require("express");
const dotenv = require("dotenv");
const { connectToDatabase } = require("./app/config/connection");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();

app.use(express.json());
app.use(express.static("app/views"));
app.use(express.static("app/public"));
app.use(express.static("app/data"));

app.use("/uploads/users", express.static("app/uploads/users"));

// Array contendo as rotas a serem carregadas
const routes = [require("./app/routes/produtoRoutes")];

// Loop para registrar as rotas
routes.forEach((route) => {
   app.use(route);
});

app.listen(PORT, () => {
   console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
