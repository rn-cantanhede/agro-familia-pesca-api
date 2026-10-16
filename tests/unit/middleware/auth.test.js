// Mocka o módulo jsonwebtoken.
//
// Não utilizaremos JWT real durante os testes.
// Dessa forma podemos controlar manualmente o comportamento
// de jwt.verify() e jwt.decode().
jest.mock("jsonwebtoken");

// Mocka as funções utilizadas pelo middleware para acesso
// ao banco de dados.
//
// Assim os testes não precisam de um banco real.
jest.mock("../../../shared/Utils/dbUtils", () => ({
    findBy: jest.fn(),
    updateData: jest.fn()
}));

// Mocka o módulo responsável pela criação/renovação do token.
jest.mock("../../../shared/Utils/authToken", () => ({
    createToken: jest.fn()
}));

const jwt = require("jsonwebtoken");

const {
    findBy,
    updateData
} = require("../../../shared/Utils/dbUtils");

const authToken = require("../../../shared/Utils/authToken");

const auth = require("../../../middleware/Auth");


describe("Middleware auth", () => {

    /*
     * Antes de cada teste, limpamos os mocks.
     *
     * Isso impede que chamadas realizadas em um teste
     * interfiram nos testes seguintes.
     */
    beforeEach(() => {
        jest.clearAllMocks();
    });


    /*
     * ==========================================================
     * TESTE 1
     * ==========================================================
     *
     * Cenário:
     *
     * A sessão não possui token.
     *
     * Esperamos que:
     *
     * 1. O middleware não tente validar JWT;
     * 2. next() seja chamado com erro;
     * 3. O erro tenha status 401;
     * 4. O aviso seja registrado no log.
     */
    test("deve rejeitar requisição sem token", async () => {

        const req = {
            session: {},

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();

        await auth(req, res, next);

        expect(next).toHaveBeenCalled();

        const error = next.mock.calls[0][0];

        expect(error.message).toBe(
            "Token não informado"
        );

        expect(error.statusCode).toBe(401);

        expect(req.log.warn).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "login"
            }),
            "Token não informado"
        );

        expect(jwt.verify).not.toHaveBeenCalled();
    });


    /*
     * ==========================================================
     * TESTE 2
     * ==========================================================
     *
     * Cenário:
     *
     * O token é válido.
     *
     * A sessão existe, não está expirada, não está revogada
     * e o usuário possui os mesmos dados presentes no JWT.
     *
     * Esperamos que a autenticação seja aceita.
     */
    test("deve aceitar um token válido", async () => {

        /*
         * Dados presentes no JWT.
         *
         * O middleware compara esses valores com os dados
         * atuais do usuário no banco.
         */
        jwt.verify.mockReturnValue({
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        });


        /*
         * Primeira chamada:
         *
         * procura a sessão.
         */
        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10,
                EXPIRA: new Date(Date.now() + 60 * 60 * 1000),
                REVOGADO: null
            }
        });


        /*
         * Segunda chamada:
         *
         * procura o usuário.
         *
         * Os dados precisam ser iguais aos dados
         * presentes no JWT.
         */
        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10,
                NIVEL: 4,
                LOGIN: "usuario",
                ID_SECRETARIA: 2,
                ID_ASSOCIACAO: 3
            }
        });


        updateData.mockResolvedValue({});


        let req = {
            session: {
                token: "token-falso",
                refreshToken: "refresh-token"
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        req.session.user = {
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        expect(jwt.verify).toHaveBeenCalledWith(
            "token-falso",
            process.env.JWT_SECRET
        );


        expect(findBy).toHaveBeenNthCalledWith(
            1,
            "ID_PESSOA",
            10,
            false,
            "sessoes",
            1,
            1
        );


        expect(findBy).toHaveBeenNthCalledWith(
            2,
            "ID_PESSOA",
            10,
            false,
            "usuario",
            1,
            1
        );


        expect(req.session.user).toEqual({
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        });


        /*
         * O middleware atualiza o último uso da sessão.
         */
        expect(updateData).toHaveBeenCalledWith(
            10,
            {
                USADO: expect.any(Date)
            },
            "sessoes"
        );


        expect(next).toHaveBeenCalledWith();


        expect(req.log.info).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "AUTH_TOKEN",
                resource: "authentication",
                action: "auth",
                usuarioId: 10
            }),
            "Token válido"
        );
    });


    /*
     * ==========================================================
     * TESTE 3
     * ==========================================================
     *
     * Cenário:
     *
     * O JWT é válido, mas a sessão correspondente não existe.
     */
    test("deve rejeitar quando a sessão não for encontrada", async () => {

        jwt.verify.mockReturnValue({
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        });


        /*
         * A consulta da sessão retorna null.
         */
        findBy.mockResolvedValueOnce(null);

        updateData.mockResolvedValue({});


        const req = {
            session: {
                token: "token-falso",

                user: {
                    id: 10
                }
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        const error = next.mock.calls[0][0];


        expect(error.message).toBe(
            "Sessão não encontrada"
        );

        expect(error.statusCode).toBe(404);


        expect(updateData).toHaveBeenCalledWith(
            10,
            {
                REVOGADO: expect.any(Date)
            },
            "sessoes"
        );


        expect(req.log.error).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }),
            "Sessão não encontrada"
        );
    });


    /*
     * ==========================================================
     * TESTE 4
     * ==========================================================
     *
     * Cenário:
     *
     * A sessão existe, mas já expirou.
     */
    test("deve rejeitar sessão expirada", async () => {

        jwt.verify.mockReturnValue({
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        });


        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10,

                // Data no passado.
                EXPIRA: new Date(Date.now() - 1000),

                REVOGADO: null
            }
        });


        const req = {
            session: {
                token: "token-falso"
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        const error = next.mock.calls[0][0];


        expect(error.message).toBe(
            "Sessão expirada"
        );

        expect(error.statusCode).toBe(400);


        expect(req.log.error).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }),
            "Sessão expirada"
        );
    });


    /*
     * ==========================================================
     * TESTE 5
     * ==========================================================
     *
     * Cenário:
     *
     * A sessão existe, mas já foi revogada.
     */
    test("deve rejeitar sessão revogada", async () => {

        jwt.verify.mockReturnValue({
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        });


        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10,

                EXPIRA: new Date(Date.now() + 60 * 60 * 1000),

                // Sessão revogada.
                REVOGADO: new Date()
            }
        });


        const req = {
            session: {
                token: "token-falso"
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        const error = next.mock.calls[0][0];


        expect(error.message).toBe(
            "Sessão revogada"
        );

        expect(error.statusCode).toBe(400);


        expect(req.log.error).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }),
            "Sessão revogada"
        );
    });


    /*
     * ==========================================================
     * TESTE 6
     * ==========================================================
     *
     * Cenário:
     *
     * A sessão existe, mas o usuário não existe.
     */
    test("deve tratar usuário não encontrado", async () => {

        jwt.verify.mockReturnValue({
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        });


        /*
         * Primeira chamada:
         *
         * sessão encontrada.
         */
        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10,
                EXPIRA: new Date(Date.now() + 60 * 60 * 1000),
                REVOGADO: null
            }
        });


        /*
         * Segunda chamada:
         *
         * usuário não encontrado.
         */
        findBy.mockResolvedValueOnce(null);


        const req = {
            session: {
                token: "token-falso"
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        const error = next.mock.calls[0][0];


        expect(error.message).toBe(
            "Usuário não encontrado"
        );

        expect(error.statusCode).toBe(404);
    });


    /*
     * ==========================================================
     * TESTE 7
     * ==========================================================
     *
     * Cenário:
     *
     * O JWT continua válido, mas os dados atuais do usuário
     * são diferentes dos dados presentes no JWT.
     *
     * Exemplo:
     *
     * JWT:
     * NIVEL = 4
     *
     * Banco:
     * NIVEL = 5
     *
     * Nesse caso a sessão deve ser revogada.
     */
    test("deve revogar sessão quando houver inconsistência nos dados", async () => {

        /*
         * Dados originais presentes no JWT.
         */
        jwt.verify.mockReturnValue({
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        });


        /*
         * Primeira chamada:
         *
         * sessão válida.
         */
        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10,
                EXPIRA: new Date(Date.now() + 60 * 60 * 1000),
                REVOGADO: null
            }
        });


        /*
         * Segunda chamada:
         *
         * usuário atual no banco.
         *
         * NIVEL propositalmente diferente do JWT.
         */
        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10,
                NIVEL: 5,
                LOGIN: "usuario",
                ID_SECRETARIA: 2,
                ID_ASSOCIACAO: 3
            }
        });


        updateData.mockResolvedValue({});


        let req = {
            session: {
                token: "token-falso",
                refreshToken: "refresh-token"
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        req.session.user = {
            id: 10,
            nivel: 4,
            login: "usuario",
            secretaria: 2,
            associacao: 3
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        /*
         * O middleware deve chamar next() com o erro
         * de inconsistência.
         */
        expect(next).toHaveBeenCalled();


        const error = next.mock.calls[0][0];


        expect(error).toBeDefined();


        expect(error.message).toBe(
            "Inconsistência na geração do token. Realize login novamente"
        );

        expect(error.statusCode).toBe(400);


        /*
         * A sessão deve ser revogada.
         */
        expect(updateData).toHaveBeenCalledWith(
            10,
            {
                REVOGADO: expect.any(Date)
            },
            "sessoes"
        );


        /*
         * O evento de inconsistência deve ser registrado.
         */
        expect(req.log.warn).toHaveBeenCalledWith(
            expect.objectContaining({
                event: "AUTH_TOKEN_WARN",
                resource: "authentication",
                action: "auth"
            }),
            "Inconsistência na geração do token"
        );
    });


    /*
     * ==========================================================
     * TESTE 8
     * ==========================================================
     *
     * Cenário:
     *
     * O JWT expirou.
     *
     * O middleware deve:
     *
     * 1. Decodificar o token;
     * 2. Localizar a sessão;
     * 3. Gerar um novo token;
     * 4. Salvar o novo token na sessão;
     * 5. Continuar a requisição.
     */
    test("deve renovar token quando o JWT estiver expirado", async () => {

        const erro = new Error("jwt expired");

        erro.name = "TokenExpiredError";


        jwt.verify.mockImplementation(() => {
            throw erro;
        });


        jwt.decode.mockReturnValue({
            id: 10
        });


        findBy.mockResolvedValueOnce({
            result: {
                ID_PESSOA: 10
            }
        });


        authToken.createToken.mockResolvedValue({
            token: "novo-token"
        });


        const req = {
            session: {
                token: "token-expirado",
                refreshToken: "refresh-token",

                /*
                 * O middleware utiliza req.session.user.id
                 * dentro do tratamento de TokenExpiredError.
                 */
                user: {
                    id: 10
                }
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        expect(jwt.decode).toHaveBeenCalledWith(
            "token-expirado"
        );


        expect(findBy).toHaveBeenCalledWith(
            "ID_PESSOA",
            10,
            false,
            "sessoes",
            1,
            1
        );


        expect(authToken.createToken).toHaveBeenCalledWith(
            {
                ID_PESSOA: 10
            },
            "refresh-token"
        );


        expect(req.session.token).toBe(
            "novo-token"
        );


        expect(next).toHaveBeenCalledWith();
    });


    /*
     * ==========================================================
     * TESTE 9
     * ==========================================================
     *
     * Cenário:
     *
     * O JWT expirou, mas não possui ID.
     *
     * Sem o ID não é possível localizar a sessão.
     */
    test("deve rejeitar token expirado sem ID", async () => {

        const erro = new Error("jwt expired");

        erro.name = "TokenExpiredError";


        jwt.verify.mockImplementation(() => {
            throw erro;
        });


        jwt.decode.mockReturnValue({});


        const req = {
            session: {
                token: "token-expirado",

                /*
                 * Necessário porque o middleware registra
                 * req.session.user.id antes de executar jwt.decode().
                 */
                user: {
                    id: 10
                }
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        const error = next.mock.calls[0][0];


        expect(error.message).toBe(
            "Token inválido"
        );

        expect(error.statusCode).toBe(401);


        expect(findBy).not.toHaveBeenCalled();

        expect(authToken.createToken).not.toHaveBeenCalled();
    });


    /*
     * ==========================================================
     * TESTE 10
     * ==========================================================
     *
     * Cenário:
     *
     * jwt.verify() lança um erro diferente de
     * TokenExpiredError.
     *
     * Nesse caso o token deve ser considerado inválido.
     */
    test("deve rejeitar token com erro JWT genérico", async () => {

        jwt.verify.mockImplementation(() => {
            throw new Error("invalid token");
        });


        const req = {
            session: {
                token: "token-invalido"
            },

            log: {
                warn: jest.fn(),
                info: jest.fn(),
                error: jest.fn()
            }
        };

        const res = {};

        const next = jest.fn();


        await auth(req, res, next);


        const error = next.mock.calls[0][0];


        expect(error.message).toBe(
            "Token inválido"
        );

        expect(error.statusCode).toBe(401);
    });

});