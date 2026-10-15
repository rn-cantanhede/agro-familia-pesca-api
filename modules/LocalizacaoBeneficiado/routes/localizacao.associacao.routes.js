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

// Busca uma localização beneficiada por ID ou Nome.
router.get("/:value", pagination, LocalizacaoBeneficiadoController.findLocalizacao);

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

// Cria uma nova localização beneficiada.
router.post("/new", LocalizacaoBeneficiadoController.createlocalizacao);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */

// Atualiza uma localização beneficiada existente.
router.put("/update/:id", LocalizacaoBeneficiadoController.updateLocalizacao);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */

// Remove uma localização beneficiada.
router.delete("/delete/:id", LocalizacaoBeneficiadoController.deleteLocalizacao);

module.exports = router;