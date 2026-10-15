const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const TipoProdutoController = require("../tipos-produtos.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

//Retorna todos os tipos de produto.
router.get("/", pagination, TipoProdutoController.findallTipoProduto);

//Busca tipo de produto por ID ou Nome.
router.get("/:value", pagination, TipoProdutoController.findTipoProduto);

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

//Cria um novo tipo de produto.
router.post("/new", TipoProdutoController.insertCategoria);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */

//Atualiza um tipo de produto existente.
router.put("/update/:id", TipoProdutoController.updateCategoria);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */

//Remove um tipo de produto existente.
router.delete("/delete/:id", TipoProdutoController.deleteTipoProduto);

module.exports = router;