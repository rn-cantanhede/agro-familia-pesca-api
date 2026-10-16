const express = require("express");
const router = express.Router();
const Auth = require("../middleware/Auth");
const Authorize = require("../middleware/Authorize");

/**
 * Importação dos módulos de rotas da aplicação,
 * organizados por domínio funcional.
 */
const agriculturaRoutes = require("../modules/AgriculturaFamiliar/routes/agricultura.secretaria.routes");
const associacoesRoutes = require("../modules/Associacoes/routes/associacoes.secretaria.routes");
const associadosRoutes = require("../modules/Associados/routes/associados.secretaria.routes");
const categoriasRoutes = require("../modules/Categorias/routes/categorias.secretaria.routes");
const localizacoesRoutes = require("../modules/LocalizacaoBeneficiado/routes/localizacao.secretaria.routes");
const movimentacoesRoutes = require("../modules/Movimentacoes/routes/movimentacoes.secretaria.routes");
const pessoasRoutes = require("../modules/Pessoas/routes/pessoas.secretaria.routes");
const produtosRoutes = require("../modules/Produtos/routes/produtos.secretaria.routes");
const programasRoutes = require("../modules/Programas/routes/programas.secretaria.routes");
const secretariaRoutes = require("../modules/Secretarias/routes/secretarias.secretaria.routes");
const tipoProdutoRoutes = require("../modules/TipoProduto/routes/tipos-produtos.secretaria.routes");
const usuariosRoutes = require("../modules/Usuarios/routes/usuarios.secretaria.routes");

router.use(Auth);
router.use(Authorize(2));

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
router.use("/secretaria", secretariaRoutes);
router.use("/tipo-produto", tipoProdutoRoutes);
router.use("/usuarios", usuariosRoutes);

module.exports = router;