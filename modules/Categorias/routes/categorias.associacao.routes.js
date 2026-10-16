const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const CategoriasController = require("../categorias.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

// Retorna todas as categorias cadastradas.
router.get("/", pagination, CategoriasController.AllCategorias);

// Busca uma categoria específica por ID ou Nome.
router.get("/:value", pagination, CategoriasController.findCategoria);

module.exports = router;