const express = require("express");
const router = express.Router();

/**
 * Importação dos módulos de rotas da aplicação,
 * organizados por domínio funcional.
 */
const adminRoutes = require("./admin.routes");
const secretariaRoutes = require("./secretaria.routes");
const loginRoutes = require("./login.routes");
const associacaoRoutes = require("./associacao.routes");
const usuarioRoutes = require("./usuario.routes");

/**
 * Registro das rotas da API por contexto de domínio.
 */
router.use("/admin", adminRoutes);
router.use("/secretaria", secretariaRoutes);
router.use("/associacao", associacaoRoutes);
router.use("/usuario", usuarioRoutes);

//Rota publica responsavel pelo login e logout
router.use(loginRoutes);

module.exports = router;