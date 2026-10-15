const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const AssociacoesController = require("../associacoes.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

/**
 * Retorna apenas associações que o nivel > 1 pertence.
 * Apenas o admin tem acesso a todas as associações.
 */
router.get("/", pagination, AssociacoesController.AllAssociacoes);

module.exports = router;