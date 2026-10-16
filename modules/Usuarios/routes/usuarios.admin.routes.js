const express = require("express");
const router = express.Router();
const UsuariosController = require("../usuarios.controller");
const pagination = require("../../../middleware/pagination");

/**
 * ROTAS APENAS PARA PERMISSÃO NIVEL ADMIN(1);
 */

/**
 * ROTAS DE CONSULTA (GET)
 */

// Busca usuario pela secretaria.
router.get("/secretaria/:secretaria", pagination, UsuariosController.findSecretariaUsuarios);

// Busca usuario pelo nivel.
router.get("/nivel/:nivel", pagination, UsuariosController.findNivelUsuarios);

// Busca usuario pelo login.
router.get("/login/:login", pagination, UsuariosController.findByLogin);

// Retorna todos os usuarios cadastrados.
router.get("/", pagination, UsuariosController.findAllUsuarios);

// Busca um usuario por um valor genérico.
router.get("/:value", pagination, UsuariosController.findUsuarios);

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


router.put("/update/login/:id", UsuariosController.updateLogin);

/**
 * ROTAS DE REMOÇÃO (DELETE)
 */

// Remove um usuario existente.
router.delete("/delete/:id", UsuariosController.deleteUsuario);

module.exports = router;