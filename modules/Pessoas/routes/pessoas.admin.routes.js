const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const PessoasController = require("../pessoas.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

//Rota responsável por retornar todas as pessoas cadastradas.
router.get("/", pagination, PessoasController.AllPessoas);

//Rota responsável por buscar uma pessoa pelo ID ou nome.
router.get("/:value", pagination, PessoasController.findPessoa);

//Rota responsável por listar pessoas filtrando pelo gênero.
router.get("/genero/:genero", pagination, PessoasController.findGeneroPessoa);

//Rota responsável por listar pessoas filtrando pela data de nascimento.
router.get("/data/:data", pagination, PessoasController.findDataPessoa);

//Rota responsável por listar pessoas dentro de um intervalo de datas.
router.get("/data/intervalo/:inicio/:fim", pagination, PessoasController.findInicioFimPessoa);

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

//Rota responsável por criar um novo registro de pessoa.
router.post("/new", PessoasController.createPessoa);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */

//Rota responsável por atualizar os dados de uma pessoa existente.
router.put("/update/:id", PessoasController.updatePessoa);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */

//Rota responsável por remover uma pessoa pelo ID.
router.delete("/delete/:id", PessoasController.deletePessoa);

module.exports = router;