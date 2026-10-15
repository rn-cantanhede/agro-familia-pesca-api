# Agro Família Pesca

Sistema de gerenciamento da **agricultura familiar e da pesca artesanal**, desenvolvido para apoiar Secretarias Municipais e Associações no controle de produtores, programas governamentais e movimentações produtivas.

Projeto acadêmico desenvolvido no **Instituto Federal do Maranhão (IFMA)**, como parte da Especialização em Back-end com Node.js.

## Objetivo do Projeto

O Agro Família Pesca tem como objetivo centralizar e organizar dados relacionados à agricultura familiar e à pesca artesanal, oferecendo:

- Controle de acesso por nível de usuário;
- Controle de escopo dos dados;
- Autenticação e gerenciamento de sessões;
- Segurança institucional;
- Paginação das consultas;
- Respostas com links de navegação utilizando HATEOAS;
- Organização modular;
- Base para futuras expansões tecnológicas no setor público.

## Estrutura do Repositório

A API principal está organizada diretamente na raiz do repositório.

```text
agro-familia-pesca-api/
├── modules/
│   ├── usuarios/
│   ├── secretarias/
│   ├── associacoes/
│   ├── produtos/
│   ├── movimentacoes/
│   └── programas/
├── shared/
├── database/
├── config/
├── middleware/
├── routes/
├── docs/
├── .github/
│   └── workflows/
├── package.json
├── package-lock.json
├── server.js
├── README.md
└── SECURITY.md
```

A estrutura acima representa a organização geral da API. Os diretórios e arquivos específicos devem corresponder à implementação atual do repositório.

## Tecnologias Utilizadas

### Backend

- Node.js
- Express.js
- MySQL
- Knex.js
- JWT (JSON Web Token)
- express-session
- connect-redis
- redis
- bcryptjs
- Pino
- Pino HTTP
- express-rate-limit
- dotenv
- nodemon

### Testes e Qualidade

- Jest
- Supertest
- GitHub Actions / CI

### Ferramentas de Teste Manual

- Insomnia
- Postman

## Requisitos do Sistema

- Node.js 22
- npm
- MySQL
- Redis, caso a persistência de sessões via Redis esteja habilitada
- Insomnia ou Postman, para testes manuais da API

### Redis — Opcional

O Redis pode ser utilizado como armazenamento externo para as sessões da aplicação.

Sua utilização depende da configuração adotada. Quando a persistência de sessões via Redis estiver habilitada, é necessário possuir um servidor Redis em execução e configurar a variável `REDIS_URL`.

O pacote `redis` utilizado pelo Node.js é apenas o cliente de comunicação com o servidor Redis; ele não instala nem executa o servidor Redis.

## Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone https://github.com/rn-cantanhede/agro-familia-pesca-api.git
cd agro-familia-pesca-api
```

### 2. Instalar as Dependências

Execute na raiz do repositório:

```bash
npm ci
```

Em ambiente de desenvolvimento, também é possível utilizar:

```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```dotenv
NODE_ENV=development

URL=http://localhost:3000/

REDIS=redis://localhost:6379

SESSION_NAME_DEV=auth
SESSION_NAME_PRO=__Host-auth
SESSION_SECURE=false

LOG_LEVEL=debug

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=db_agrofamilia_pesca

PORT=3000
JWT_SECRET=chave_secreta
SESSION_SECRET=chave_secreta
```

Ajuste os valores de acordo com seu ambiente.

**Importante:** não versione credenciais reais, senhas ou segredos no Git.

A variável `REDIS_URL` só é necessária quando a persistência de sessões através do Redis estiver habilitada.

### 4. Configuração do Banco de Dados

A aplicação realiza a configuração da estrutura do banco de dados durante a inicialização.

O versionamento da estrutura utiliza **Knex Migrations**, enquanto os dados iniciais são gerenciados por **Knex Seeds**.

Não é necessário executar manualmente os antigos scripts SQL para preparar a estrutura do banco de dados. O servidor MySQL precisa estar em execução e acessível, com as credenciais configuradas corretamente.

### 5. Executar a API

Para iniciar a aplicação:

```bash
npm start
```

Em modo de desenvolvimento:

```bash
nodemon || nodemon server.js
```

Por padrão, o servidor fica disponível em:

```text
http://localhost:3000
```

A porta utilizada depende do valor configurado na variável `PORT`.

## Autenticação e Gerenciamento de Sessões

A API utiliza **JWT (JSON Web Token)** em conjunto com o gerenciamento de sessões.

Entre os recursos implementados estão:

- Access token;
- Refresh token;
- Registro e controle das sessões;
- Controle de sessões revogadas, expiradas ou inexistentes;
- Validação de inconsistências entre os dados da sessão e do token;
- Renovação ou reutilização do refresh token enquanto válido;
- Gerenciamento de cookies de autenticação;
- Possibilidade de persistência das sessões através do Redis.

### Login

**Endpoint:** `POST /login`

Exemplo de payload:

```json
{
  "LOGIN": "admin",
  "SENHA": "senha_1"
}
```

Os valores são ilustrativos.

Após a autenticação, a aplicação gera os tokens necessários e registra ou controla a sessão correspondente. O middleware de autenticação utiliza essas informações para validar a sessão e autorizar as requisições protegidas.

## Arquitetura da API

A API segue uma **Arquitetura Monolítica Modular**, organizada em camadas com responsabilidades definidas.

### Controller

- Recebe as requisições HTTP;
- Coordena a resposta ao cliente;
- Não deve concentrar regras de negócio.

### Service

- Concentra as regras de negócio;
- Executa validações;
- Orquestra as operações da aplicação.

### Repository

- Responsável pelo acesso ao banco de dados;
- Executa consultas através de tabelas e views;
- Pode utilizar consultas alternativas quando uma view não puder ser utilizada.

### BaseScope

- Aplica filtros de escopo diretamente nas consultas;
- Restringe os dados conforme o contexto de acesso do usuário.

### Policy

- Define as permissões conforme o nível de acesso.

### Shared

- Reúne recursos reutilizáveis entre os módulos.

### Módulos Funcionais

A API está organizada em módulos, incluindo:

- Usuários;
- Secretarias;
- Associações;
- Produtos;
- Movimentações;
- Programas.

## Paginação

As consultas da API possuem suporte à paginação, incluindo validação dos parâmetros e padronização dos resultados.

A paginação limita a quantidade de registros retornados em uma consulta e está integrada aos mecanismos compartilhados de consulta e controle de escopo.

Entre os recursos relacionados estão:

- Middleware de validação dos parâmetros de paginação;
- Paginação nas consultas compartilhadas;
- Integração com consultas que aplicam escopo;
- Compatibilidade com consultas existentes;
- Padronização dos resultados paginados.

## HATEOAS

A API utiliza **HATEOAS (Hypermedia as the Engine of Application State)** para incluir links de navegação nas respostas dos recursos.

A implementação busca padronizar os links retornados pelos endpoints e facilitar a navegação entre recursos relacionados.

A geração dos links está integrada aos controllers e utiliza funções auxiliares para construir os parâmetros necessários.

## Controle de Escopo dos Dados

A API utiliza o `BaseScope` para aplicar restrições de acesso diretamente nas consultas ao banco de dados.

Em vez de buscar todos os registros e filtrá-los posteriormente na aplicação, as condições de escopo são incorporadas à própria consulta.

Essa abordagem proporciona benefícios potenciais, como:

- Redução da quantidade de dados retornados pelo banco;
- Menor processamento desnecessário na aplicação;
- Consultas mais eficientes;
- Maior isolamento dos dados;
- Redução do risco de exposição de registros fora do escopo autorizado.

Os endpoints de consulta devem respeitar o escopo de acesso do usuário. O escopo `own`, quando aplicável, limita o acesso aos registros pertencentes ao próprio usuário.

A combinação entre `BaseScope` e paginação permite controlar tanto **quais registros podem ser acessados** quanto **quantos registros são retornados por consulta**.

## Controle de Acesso

A API combina dois mecanismos complementares.

### RBAC — Role-Based Access Control

Define quais operações cada nível de usuário pode executar.

| Nível | Perfil |
|---|---|
| 1 | Administrador |
| 2 | Secretaria |
| 3 | Associação |
| 4 | Usuário |

### Data Scoping

Além da autorização por nível, as consultas são restringidas pelo `BaseScope`, de acordo com o contexto de acesso do usuário.

O escopo `own`, por exemplo, limita o acesso aos registros pertencentes ao próprio usuário quando aplicável.

A autorização define quais operações podem ser executadas; o controle de escopo restringe quais dados podem ser acessados.

## Segurança e Observabilidade

A API utiliza múltiplas camadas de proteção, incluindo:

- Autenticação baseada em JWT;
- Gerenciamento e validação de sessões;
- Access token e refresh token;
- Senhas protegidas com `bcryptjs`;
- Controle de acesso baseado em RBAC;
- Escopo de dados aplicado diretamente nas consultas;
- Rate limiting na rota de login;
- Validação de IDs antes de operações destrutivas;
- Logs estruturados para diagnóstico e auditoria;
- Política de segurança documentada em `SECURITY.md`.

A aplicação adota o princípio de **Defense in Depth**, combinando mecanismos de proteção em diferentes camadas.

O logging utiliza Pino e Pino HTTP para registrar eventos relevantes à operação e ao diagnóstico da aplicação.

## Testes Automatizados

O projeto utiliza **Jest** e **Supertest** para automatizar testes.

Os testes abrangem, entre outros:

- Middleware de autenticação;
- Autorização;
- Paginação;
- Tratamento de erros;
- Rate limiting do login;
- Consultas com e sem escopo;
- Operações de inserção, atualização e exclusão;
- Login e validações relacionadas à sessão;
- Operações compartilhadas do `DBUtils`.

Os testes automatizados também fazem parte do fluxo de integração contínua.

## Integração Contínua — GitHub Actions

O projeto possui um workflow de **CI (Continuous Integration)** configurado através do GitHub Actions.

O workflow é executado em eventos de `push` e `pull_request` nas branches `main` e `develop`.

As etapas incluem:

1. Checkout do código;
2. Configuração do Node.js 22;
3. Instalação das dependências com `npm ci`;
4. Verificação de sintaxe do `server.js`;
5. Execução dos testes com `npm test`.

Como a API está organizada na raiz, os comandos e o cache do npm utilizam os arquivos dessa localização, sem depender do antigo diretório `API_agrofamilia_pesca`.

## Fallback nos Repositories

Os repositories que utilizam views possuem mecanismos de **fallback** para determinadas consultas.

Quando uma view não puder ser utilizada, o repository pode executar uma consulta alternativa, aumentando a resiliência da camada de persistência.

Essa abordagem mantém a separação entre as regras de negócio e os detalhes de acesso ao banco de dados.

## Boas Práticas Adotadas

- Controllers sem regras de negócio;
- Services responsáveis pelas validações e pela lógica de negócio;
- Repositories sem acesso direto a `req` ou `res`;
- Uso de views SQL para leitura, quando aplicável;
- Fallback para consultas quando necessário;
- Escrita nas tabelas-base;
- Validação de IDs antes de operações destrutivas;
- Segurança em profundidade (*Defense in Depth*);
- Logs estruturados com Pino;
- Logging HTTP com Pino HTTP;
- Rate limiting para autenticação;
- Aplicação de escopo diretamente nas consultas;
- Paginação das consultas;
- Separação entre autorização e regras de negócio;
- Testes automatizados com Jest e Supertest;
- Integração contínua com GitHub Actions;
- Padronização das respostas através de HATEOAS.

## Documentação

- **Documento acadêmico completo:** `docs/Documentação-Agro-família-Pesca.md`
- **Manual técnico detalhado:** `docs/Manual-Tecnico.md`
- **Política de segurança:** `SECURITY.md`
- **README:** visão geral do sistema e instruções de início rápido.

Consulte os documentos disponíveis no repositório para obter informações detalhadas sobre endpoints, métodos HTTP, payloads, respostas, permissões e configurações.

## Créditos

Projeto acadêmico desenvolvido pelo **Grupo B — IFMA**.

**Autor / mantenedor:** Renã Cantanhede

- GitHub: https://github.com/rn-cantanhede
- LinkedIn: https://www.linkedin.com/in/rn-cantanhede

## Observação Final

O Agro Família Pesca foi desenvolvido com finalidade acadêmica e utiliza práticas de organização, segurança, testes e manutenção aplicadas ao desenvolvimento de APIs.

O projeto pode servir como base para futuras evoluções, mas sua utilização em ambientes institucionais reais exige avaliação, configuração, testes e validação adicionais.

A versão atual reúne recursos de paginação, testes automatizados, gerenciamento de sessões, controle de escopo, HATEOAS, resiliência da camada de persistência, logging estruturado e integração contínua.