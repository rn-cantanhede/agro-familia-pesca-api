const Erros = require("../errors/Errors");

class BaseService {
    /**
     * Aplica o escopo de visibilidade nos dados seguindo o seu padrão de escrita.
     */
    static applyScope({ user, data, mapping = {} }) {
        if (!data) {
            if (Array.isArray(data)) {
                return [];
            }
            return null;
        }

        // Mapeamento de campos
        let secretariaField = 'ID_SECRETARIA';
        if (mapping.secretaria) {
            secretariaField = mapping.secretaria;
        }

        let pessoaField = 'ID_PESSOA';
        if (mapping.pessoa) {
            pessoaField = mapping.pessoa;
        }

        // Normalização para array para processamento uniforme
        let isArray = Array.isArray(data);
        let items = [];
        if (isArray) {
            items = data;
        } else {
            items = [data];
        }

        let filtered = [];

        if (user.nivel == 1) {
            filtered = items;
        }

        if (user.nivel == 2 || user.nivel == 3) {
            filtered = items.filter(function (item) {
                return item[secretariaField] == user.secretaria;
            });
        }

        if (user.nivel == 4) {
            filtered = items.filter(function (item) {
                if (item[pessoaField]) {
                    return item[pessoaField] == user.id;
                }
                return item[secretariaField] == user.secretaria;
            });
        };

        if (filtered.length == 0) {
            throw new Erros("Acesso negado aos dados ou registro não encontrado", 404);
        };

        if (isArray) {
            return filtered;
        }
        return filtered[0];
    };
};

module.exports = BaseService;