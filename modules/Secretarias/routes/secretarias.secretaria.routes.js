const express = require("express");
const router = express.Router();
const SecretariasController = require("../secretarias.controller");

/**
 * Retorna apenas a secretaria que o nivel > 1 pertence.
 * Apenas o admin tem acesso a todas as secretarias.
 */
router.get("/", SecretariasController.AllSecretarias);

module.exports = router;