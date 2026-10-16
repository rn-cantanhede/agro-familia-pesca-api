const express = require("express");
const router = express.Router();
const UsuariosController = require("../modules/Usuarios/usuarios.controller");
const Auth = require("../middleware/Auth");
const loginLimiter = require("../middleware/loginLimiter");

//Rota publica responsavel pelo logout
router.get("/logout", Auth, UsuariosController.logout);

//Rota publica responsavel pelo login
router.post("/login", loginLimiter, UsuariosController.login);

module.exports = router;