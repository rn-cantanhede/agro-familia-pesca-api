const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const AgriculturaFamiliarController = require("../agricultura-familiar.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

// Retorna todos os registros de agricultura familiar.
router.get("/", pagination, AgriculturaFamiliarController.AllAgriculturaFamiliar);

// Busca registros por ID ou nome,
router.get("/:value", pagination, AgriculturaFamiliarController.findAgriculturaFamiliar);

// Busca registros pelo número do CAF.
router.get("/caf/:caf", pagination, AgriculturaFamiliarController.findCafAgriculturaFamiliar);

// Busca registros pelo número da DAP.
router.get("/dap/:dap", pagination, AgriculturaFamiliarController.findDapAgriculturaFamiliar);

// Busca registros vinculados a um programa específico.
router.get("/programa/:programa", pagination, AgriculturaFamiliarController.findProgramaAgriculturaFamiliar);

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

// Cria um novo registro de agricultura familiar.
router.post("/new", AgriculturaFamiliarController.createAgriculturaFamiliar);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */

// Atualiza um registro existente de agricultura familiar,
router.put("/update/:id", AgriculturaFamiliarController.updateAgriculturaFamiliar);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */

// Remove um registro de agricultura familiar
router.delete("/delete/:id", AgriculturaFamiliarController.deleteAgriculturaFamiliar);

module.exports = router;