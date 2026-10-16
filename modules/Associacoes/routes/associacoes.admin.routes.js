const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const AssociacoesController = require("../associacoes.controller");

/**
 *  
 * ROTAS DE CONSULTA (GET)
 *  
 */
/**
 * Retorna apenas associações que o nivel > 1 pertence.
 * Apenas o admin tem acesso a todas as associações.
 * O resto das rotas seguem a mesma logica.
 */
router.get("/", pagination, AssociacoesController.AllAssociacoes);


//Rota para buscar uma associação específica.
router.get("/:value", pagination, AssociacoesController.findAssociacao);


// Rota para buscar associações por categoria.
router.get("/categoria/:categoria", pagination, AssociacoesController.findCategoriaAssociacao);

// Rota para buscar associações por secretaria.
router.get("/secretaria/:secretaria", pagination, AssociacoesController.findSecretariaAssociacao);

/**
 *  
 * ROTAS DE CRIAÇÃO (POST)
 *  
 */

// Rota para criar uma nova associação.
router.post("/new", AssociacoesController.createAssociacao);

/**
 *  
 * ROTAS DE ATUALIZAÇÃO (PUT)
 *  
 */
// Rota para atualizar uma associação existente.
router.put("/update/:id", AssociacoesController.updateAssociacao);

/**
 *  
 * ROTAS DE REMOÇÃO (DELETE)
 *  
 */

// Rota para excluir uma associação.
router.delete("/delete/:id", AssociacoesController.deleteAssociacao);

module.exports = router;