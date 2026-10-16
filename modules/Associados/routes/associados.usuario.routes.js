const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const AssociadosController = require("../associados.controller");

/**
 *   
 * ROTAS DE CONSULTA (GET)
 *   
 */

// Retorna todos os associados cadastrados.
router.get("/", pagination, AssociadosController.AllAssociados);

module.exports = router;