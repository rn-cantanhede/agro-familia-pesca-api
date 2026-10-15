const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const AgriculturaFamiliarController = require("../agricultura-familiar.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */
/**
 * Retorna apenas os registros que o nivel > 1 pertence.
 * Apenas o admin tem acesso a todos os registros.
 * O resto das rotas seguem a mesma logica.
 */

// Retorna todos os registros de agricultura familiar.
router.get("/", pagination, AgriculturaFamiliarController.AllAgriculturaFamiliar);

module.exports = router;