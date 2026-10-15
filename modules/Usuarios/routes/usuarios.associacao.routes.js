const express = require("express");
const router = express.Router();
const pagination = require("../../../middleware/pagination");
const UsuariosController = require("../usuarios.controller");

/**
 * ROTAS APENAS PARA PERMISSÃO NIVEL ASSOCIAÇÃO(3);
 */

/**
 * ROTAS DE CONSULTA (GET)
 */

// Retorna todos os usuarios cadastrados.
router.get("/", pagination, UsuariosController.findAllUsuarios);


// Busca um usuario por um valor genérico.
router.get("/:value", pagination, UsuariosController.findUsuarios);

router.get("/nivel/:nivel", pagination, UsuariosController.findNivelUsuarios);

router.get("/login/:login", pagination, UsuariosController.findByLogin);

/**
 * ROTAS DE CRIAÇÃO (POST)
 */

// Cria um novo usuario.
router.post("/new", UsuariosController.createUsuario);


/**
 * ROTAS DE ATUALIZAÇÃO (PUT)
 */

// Atualiza um usuario existente.
router.put("/update/:id", UsuariosController.updateUsuario);

/**
 * ROTAS DE REMOÇÃO (DELETE)
 */

// Remove um usuario existente.
router.delete("/delete/:id", UsuariosController.deleteUsuario);

module.exports = router;