const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const ProdutosController = require("../produtos.controller");

/**
 * 
 * ROTAS DE CONSULTA (GET)
 * 
 */

// Retorna a lista completa de produtos.
router.get("/", pagination, ProdutosController.AllProdutos);

//Busca produtos pelo ID ou pelo nome.
router.get("/:value", pagination, ProdutosController.findProdutos);

module.exports = router;