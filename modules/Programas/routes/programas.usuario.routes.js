const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const ProgramasController = require("../programas.controller");

/**
 * 
 * ROTAS DE CONSULTA (GET)
 * 
 */

/**
 * Retorna apenas a programas que o nivel > 1 pertence.
 * Apenas o admin tem acesso a todos os programas.
 * O resto das rotas seguem a mesma logica.
 */
router.get("/", pagination, ProgramasController.AllProgramas);

/*
 * Rota responsável por buscar um programa específico
 * pelo ID ou pelo nome, conforme o valor informado.
 */

router.get("/:value", pagination, ProgramasController.findProgramas);

/*
 * Rota responsável por buscar programas filtrando
 * pela origem do recurso financeiro.
 */

router.get("/recurso/:recurso", pagination, ProgramasController.findOrigemRecursoPrograma);

/*
 * Rota responsável por buscar programas com base
 * na data de início.
 */

router.get("/data-inicio/:data", pagination, ProgramasController.findDataInicioPrograma);

/*
 * Rota responsável por buscar programas com base
 * na data de término.
 */

router.get("/data-fim/:data", pagination, ProgramasController.findDataFimPrograma);

module.exports = router;