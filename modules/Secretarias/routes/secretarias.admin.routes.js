const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const SecretariasController = require("../secretarias.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */

//Lista todas as secretarias cadastradas no sistema.
router.get("/", pagination, SecretariasController.AllSecretarias);

/**
 * Recupera uma secretaria com base em um identificador genérico,
 * permitindo busca tanto por ID quanto por nome.
 */

router.get("/:value", pagination, SecretariasController.findSecretarias);

//Recupera secretarias filtradas pelo estado.
router.get("/estado/:estado", pagination, SecretariasController.findEstadoSecretarias);

//Recupera secretarias filtradas pela cidade.
router.get("/cidade/:cidade", pagination, SecretariasController.findCidadeSecretarias);

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

//Cria uma nova secretaria no sistema.
router.post("/new", SecretariasController.createSecretaria);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */

//Atualiza os dados de uma secretaria existente.
router.put("/update/:id", SecretariasController.updateSecretaria);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */

//Remove uma secretaria existente do sistema.
router.delete("/delete/:id", SecretariasController.deleteSecretaria);

module.exports = router;