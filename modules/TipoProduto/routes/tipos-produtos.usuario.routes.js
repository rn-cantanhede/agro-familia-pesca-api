const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const TipoProdutoController = require("../tipos-produtos.controller");

/**
 * ================================
 * ROTAS DE CONSULTA (GET)
 * ================================
 */

//Retorna todos os tipos de produto.
router.get("/", pagination, TipoProdutoController.findallTipoProduto);

//Busca tipo de produto por ID ou Nome.
router.get("/:value", pagination, TipoProdutoController.findTipoProduto);

module.exports = router;