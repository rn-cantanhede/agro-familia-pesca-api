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

// Busca um associado por um valor genérico.
router.get("/:value", pagination, AssociadosController.findAssociado);

// Busca associados pelo número do CAF.
router.get("/caf/:caf", pagination, AssociadosController.findCafAssociado);

// Busca associados pelo número do DAP.
router.get("/dap/:dap", pagination, AssociadosController.findDapAssociado);

// Busca associados vinculados a uma associação específica.
router.get("/associacao/:associacao", pagination, AssociadosController.findAssociacaoAssociado);

// Busca associados cadastrados em uma data específica.
router.get("/data/:data", pagination, AssociadosController.findDataAssociado);

// Busca associados dentro de um intervalo de datas.
router.get("/data/intervalo/:inicio/:fim", pagination, AssociadosController.findInicioFimAssociado);

/**
 *   
 * ROTAS DE CRIAÇÃO (POST)
 *   
 */
// Cria um novo associado.
router.post("/new", AssociadosController.createAssociado);

/**
 *   
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *   
 */

// Atualiza um associado existente.
router.put("/update/:id", AssociadosController.updateAssociado);

/**
 *   
 * ROTAS DE REMOÇÃO (DELETE)
 *   
 */

// Remove um associado existente.
router.delete("/delete/:id", AssociadosController.deleteAssociado);

module.exports = router;