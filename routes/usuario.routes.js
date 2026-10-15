const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const Authorize = require("../middleware/Authorize");

/**
 * Importação dos módulos de rotas da aplicação,
 * organizados por domínio funcional.
 */
const agriculturaRoutes = require("../modules/AgriculturaFamiliar/routes/agricultura.usuario.routes");
const associacoesRoutes = require("../modules/Associacoes/routes/associacoes.usuario.routes");
const associadosRoutes = require("../modules/Associados/routes/associados.usuario.routes");
const categoriasRoutes = require("../modules/Categorias/routes/categorias.usuario.routes");
const localizacoesRoutes = require("../modules/LocalizacaoBeneficiado/routes/localizacao.usuario.routes");
const movimentacoesRoutes = require("../modules/Movimentacoes/routes/movimentacoes.usuario.routes");
const pessoasRoutes = require("../modules/Pessoas/routes/pessoas.usuario.routes");
const produtosRoutes = require("../modules/Produtos/routes/produtos.usuario.routes");
const programasRoutes = require("../modules/Programas/routes/programas.usuario.routes");
const secretariasRoutes = require("../modules/Secretarias/routes/secretarias.usuario.routes");
const tipoProdutoRoutes = require("../modules/TipoProduto/routes/tipos-produtos.usuario.routes");
const usuariosRoutes = require("../modules/Usuarios/routes/usuarios.usuario.routes");

router.use(Auth);
router.use(Authorize(4));

/**
 * Registro das rotas da API por contexto de domínio.
 */
router.use("/agricultura-familiar", agriculturaRoutes);
router.use("/associacao", associacoesRoutes);
router.use("/associados", associadosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/localizacao-beneficiado", localizacoesRoutes);
router.use("/movimentacoes", movimentacoesRoutes);
router.use("/pessoa", pessoasRoutes)
router.use("/produtos", produtosRoutes);
router.use("/programas", programasRoutes);
router.use("/secretaria", secretariasRoutes);
router.use("/tipo-produto", tipoProdutoRoutes);
router.use(usuariosRoutes);

module.exports = router;