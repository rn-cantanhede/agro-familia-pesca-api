const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const LocalizacaoBeneficiadoController = require("../localizacao-beneficiado.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

// Retorna todas as localizações beneficiadas.
router.get("/", pagination, LocalizacaoBeneficiadoController.AllLocalizacoes);

module.exports = router;