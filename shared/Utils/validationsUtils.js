const Erros = require("../errors/Errors");

class validationsUtils {

    /**
     * Executa validações genéricas sobre os dados recebidos.
     * Verifica campos vazios e aplica validações externas definidas no array `validations`.
     */
    async validate(data, validations) {

        // Validação de campos obrigatórios
        for (const field of Object.keys(data)) {
            if (data[field] == undefined || data[field] == "" || data[field] == " ") {
                throw new Erros(`Campo ${field} vazio`, 403);
            };
        };

        // Execução das validações específicas definidas pelo chamador
        for (const { field, validation, errorMsg } of validations) {
            const id = data[field];

            if (id) {
                const isValid = await validation(id);

                if (!isValid) {
                    throw new Erros(errorMsg, 404);
                };
            };
        };
    };
};

module.exports = new validationsUtils;