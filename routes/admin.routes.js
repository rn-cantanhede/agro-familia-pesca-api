const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const Authorize = require("../middleware/Authorize");


/**
 * Importação dos módulos de rotas da aplicação,
 * organizados por domínio funcional.
 */
const agriculturaRoutes = require("../modules/AgriculturaFamiliar/routes/agricultura.admin.routes");
const associacoesRoutes = require("../modules/Associacoes/routes/associacoes.admin.routes");
const associadosRoutes = require("../modules/Associados/routes/associados.admin.routes");
const categoriasRoutes = require("../modules/Categorias/routes/categorias.admin.routes");
const localizacoesRoutes = require("../modules/LocalizacaoBeneficiado/routes/localizacao.admin.routes");
const movimentacoesRoutes = require("../modules/Movimentacoes/routes/movimentacoes.admin.routes");
const pessoasRoutes = require("../modules/Pessoas/routes/pessoas.admin.routes");
const produtosRoutes = require("../modules/Produtos/routes/produtos.admin.routes");
const programasRoutes = require("../modules/Programas/routes/programas.admin.routes");
const secretariaRoutes = require("../modules/Secretarias/routes/secretarias.admin.routes");
const tipoProdutoRoutes = require("../modules/TipoProduto/routes/tipos-produtos.admin.routes");
const usuariosRoutes = require("../modules/Usuarios/routes/usuarios.admin.routes");

router.use(Auth);
router.use(Authorize(1));

/**
 * Registro das rotas da API por contexto de domínio.
 */
router.use("/agricultura-familiar", agriculturaRoutes);
router.use("/associacoes", associacoesRoutes);
router.use("/associados", associadosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/localizacao-beneficiado", localizacoesRoutes);
router.use("/movimentacoes", movimentacoesRoutes);
router.use("/pessoas", pessoasRoutes);
router.use("/produtos", produtosRoutes);
router.use("/programas", programasRoutes);
router.use("/secretarias", secretariaRoutes);
router.use("/tipo-produto", tipoProdutoRoutes);
router.use("/usuarios", usuariosRoutes);

module.exports = router;