const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const MovimentacoesController = require("../movimentacoes.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

// Lista todas as movimentações cadastradas.
router.get("/", pagination, MovimentacoesController.AllMovimentacoes);

// Busca uma movimentação pelo ID.
router.get("/:id", pagination, MovimentacoesController.findByIdMovimentacoes);

// Busca movimentações pelo DAP.
router.get("/dap/:dap", pagination, MovimentacoesController.findDapMovimentacoes);

// Busca movimentações por produto.
router.get("/produto/:produto", pagination, MovimentacoesController.findProdutoMovimentacoes);

// Busca movimentações por data específica.
router.get("/data/:data", pagination, MovimentacoesController.findDataMovimentacoes);

// Busca movimentações dentro de um intervalo de datas.
router.get("/data/intervalo/:inicio/:fim", pagination, MovimentacoesController.findInicioFimMovimentacoes);

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

// Cria uma nova movimentação.
router.post("/new", MovimentacoesController.createMovimentacao);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */

// Atualiza uma movimentação existente.
router.put("/update/:id", MovimentacoesController.updateMovimentacao);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */

// Remove uma movimentação do sistema.
router.delete("/delete/:id", MovimentacoesController.deleteMovimentacao);

module.exports = router;