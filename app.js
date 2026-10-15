const express = require("express");
const cors = require("cors");
const routers = require("./routes/index");
const errorHandle = require("./middleware/errorHandle");
const session = require("express-session");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
// const { createClient } = require("redis");
// const { RedisStore } = require("connect-redis");

const app = express();

/**
 * Configura sistema de logs da API
 */
app.use(
    pinoHttp({
        logger,

        serializers: {
            req(req) {
                return {
                    id: req.id,
                    method: req.method,
                    url: req.url,
                    remoteAddress: req.remoteAddress
                }
            }
        }
    })
);

/**
 * Habilita o middleware de CORS para controle de acesso entre origens.
 */

app.use(cors());

/**
 * Middleware para interpretar dados enviados
 *via application/x-www-form-urlencoded.
 */
app.use(express.urlencoded({ extended: false }));

/**
 * Middleware para interpretar dados enviados
 * no formato JSON no corpo da requisição.
 */
app.use(express.json());

/**
 * Configuração do Redis para armazenamento das sessões.
 * Mantém os dados fora da aplicação e permite compartilhá-los entre instâncias.
 * Requer um Redis Server em execução e a variável REDIS_URL configurada.
 */

/**
 * Redis opcional.

Para utilizar Redis, é necessário ter um Redis Server executando localmente.

Linux:
  O Redis possui suporte nativo.
  Exemplo (Ubuntu/Debian):
    sudo apt update
    sudo apt install redis-server
    sudo service redis-server start
    redis-cli ping

Windows:
  O Redis Server oficial não possui suporte nativo tradicional.
  Opções:
    1. WSL (recomendado para desenvolvimento):
       sudo apt update
       sudo apt install redis-server
       sudo service redis-server start
       redis-cli ping

    2. Docker:
       docker run --name redis -p 6379:6379 -d redis

    3. Utilizar uma implementação compatível com Redis para Windows,
       como o Memurai.

macOS:
  O Redis pode ser instalado nativamente pelo Homebrew:
    brew install redis
    brew services start redis
    redis-cli ping

Após iniciar o Redis em qualquer ambiente:

  REDIS_URL=redis://localhost:6379

Depois:
  1. Configure REDIS_URL no .env.
  2. Descomente a configuração do Redis abaixo e store no session.
  3. Inicie a aplicação.

Observação:
O pacote "redis" é apenas o cliente Redis para Node.js.
Ele NÃO instala o Redis Server.
 */

// const redisClient = createClient({
//     url: process.env.REDIS || "redis://localhost:6379"
// });

// redisClient.on("error", (erro) => {
//     logger.error(erro, "Erro na conexão com Redis");
// });

// redisClient.connect();

/**
 * Configura o gerenciamento de sessão da aplicação. 
 */
app.use(session({
    name: process.env.NODE_ENV === "production"
        ? "__Host-auth"
        : "auth"
    ,

    // store: new RedisStore({
    //     client: redisClient,
    //     prefix: "sess:"
    // }),

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    }
}));

/**
 * Registro das rotas principais da aplicação.
 */

app.use("/", routers);



/**
 * Middleware global para tratamento centralizado de erros.
 * Deve ser registrado após as rotas.
 */

app.use(errorHandle);

module.exports = app;