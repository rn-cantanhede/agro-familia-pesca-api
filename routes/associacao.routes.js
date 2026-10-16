const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const Authorize = require("../middleware/Authorize");

/**
 * Importação dos módulos de rotas da aplicação,
 * organizados por domínio funcional.
 */
const agriculturaRoutes = require("../modules/AgriculturaFamiliar/routes/agricultura.associacao.routes");
const associacoesRoutes = require("../modules/Associacoes/routes/associacoes.associacao.routes");
const associadosRoutes = require("../modules/Associados/routes/associados.asociacao.routes");
const categoriasRoutes = require("../modules/Categorias/routes/categorias.associacao.routes");
const localizacoesRoutes = require("../modules/LocalizacaoBeneficiado/routes/localizacao.associacao.routes");
const movimentacoesRoutes = require("../modules/Movimentacoes/routes/movimentacoes.associacao.routes");
const pessoasRoutes = require("../modules/Pessoas/routes/pessoas.associados.routes");
const produtosRoutes = require("../modules/Produtos/routes/produtos.associacao.routes");
const programasRoutes = require("../modules/Programas/routes/programas.associacao.routes");
const secretariasRoutes = require("../modules/Secretarias/routes/secretarias.associacao.routes");
const tipoProdutoRoutes = require("../modules/TipoProduto/routes/tipos-produtos.associacao.routes")
const usuariosRoutes = require("../modules/Usuarios/routes/usuarios.associacao.routes");

router.use(Auth);
router.use(Authorize(3));

/**
 * Registro das rotas da API por contexto de domínio.
 */
router.use("/agricultura-familiar", agriculturaRoutes);
router.use(associacoesRoutes);
router.use("/associados", associadosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/localizacao-beneficiado", localizacoesRoutes);
router.use("/movimentacoes", movimentacoesRoutes);
router.use("/pessoas", pessoasRoutes);
router.use("/produtos", produtosRoutes);
router.use("/programas", programasRoutes);
router.use("/secretaria", secretariasRoutes);
router.use("/tipo-produto", tipoProdutoRoutes);
router.use("/usuarios", usuariosRoutes);

module.exports = router;