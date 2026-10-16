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

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

//Cria um novo produto.
router.post("/new", ProdutosController.createProduto);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */


// Atualiza um produto existente.
router.put("/update/:id", ProdutosController.updateProduto);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */
//Remove um produto pelo ID.
router.delete("/delete/:id", ProdutosController.deleteProduto);

module.exports = router;