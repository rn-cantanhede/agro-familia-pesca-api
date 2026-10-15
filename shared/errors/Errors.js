class Erros extends Error {

    /**
     * Classe de erro customizada para padronização de respostas da aplicação.
     */
    constructor(message, statusCode = 400) {
        super(message);

        // Código HTTP associado ao erro
        this.statusCode = statusCode;
    };
};

module.exports = Erros;