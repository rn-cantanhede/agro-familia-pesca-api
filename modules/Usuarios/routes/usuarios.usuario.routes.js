const express = require("express");
const router = express.Router();
const UsuariosController = require("../usuarios.controller");

/**
 * ROTAS APENAS PARA PERMISSÃO NIVEL USUARIO(4);
 */

//Acessa os dados do usuario
router.use("/", UsuariosController.findAllUsuarios);

module.exports = router;