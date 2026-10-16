const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const PessoasController = require("../pessoas.controller");

/**
 * 
 * ROTAS DE CONSULTA (GET)
 * 
 */

/**
 * Retorna apenas pessoas que o nivel > 1 pertence.
 * Apenas o admin tem acesso a todas as pessoas.
 * O resto das rotas seguem a mesma logica.
 */
router.get("/", pagination,PessoasController.AllPessoas);

module.exports = router;