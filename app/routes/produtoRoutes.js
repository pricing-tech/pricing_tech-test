const express = require("express");

const produtoRoutes = express.Router();

const produtoController = require("../controllers/produtoController.js");

produtoRoutes.get("/produto_filter/:produto", produtoController.filterProduto);
produtoRoutes.get("/produto/:id", produtoController.getOne);
produtoRoutes.get("/produto_All", produtoController.getAll);
produtoRoutes.get("/category_All", produtoController.categoryAll);
produtoRoutes.get("/commodity_All", produtoController.commodityAll);

module.exports = produtoRoutes;
