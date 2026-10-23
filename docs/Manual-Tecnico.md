# Agro Família Pesca
## Manual Técnico — Sistema de Gerenciamento da Agricultura Familiar e Pesca Artesanal

## 1. Introdução

O Agro Família Pesca é uma aplicação backend desenvolvida em Node.js, estruturada como uma API RESTful modular para gerenciar dados relacionados à agricultura familiar e à pesca artesanal. O sistema foi concebido para apoiar atividades administrativas de Secretarias Municipais e Associações, organizando informações institucionais, cadastrais e produtivas.

Este manual apresenta a visão técnica da aplicação, sua arquitetura, configuração, mecanismos de segurança, persistência, testes e principais rotas documentadas. Deve ser mantido em conjunto com o código-fonte: detalhes de implementação e payloads podem mudar entre versões.

## 2. Requisitos do sistema

### 2.1 Software

- Node.js 22, versão utilizada no fluxo atual de integração contínua.
- npm, para instalação das dependências e execução dos scripts do projeto.
- MySQL, como banco de dados relacional.
- Redis Server somente quando a integração de sessões e/ou o armazenamento Redis do rate limiter estiver habilitado.
- Insomnia, Postman ou ferramenta equivalente para testes manuais HTTP.
- Jest e Supertest para execução dos testes automatizados.

### 2.2 Ambiente

- Windows, Linux ou macOS.
- Acesso ao terminal.
- Permissões para criar e modificar o banco de dados MySQL.
- Acesso a um servidor Redis quando a configuração Redis estiver habilitada.

## 3. Instalação e configuração inicial

A API principal foi reorganizada para ficar na raiz do repositório. As antigas pastas `API_Simplificada`, `consumo` e os scripts SQL avulsos não devem ser consideradas parte da estrutura atual sem confirmação no repositório.

1. Clone o repositório oficial vigente.
2. Acesse a raiz do repositório.
3. Instale as dependências usando o gerenciador indicado pelo projeto.
4. Configure as variáveis de ambiente necessárias em um arquivo `.env`, de acordo com a configuração esperada pelo código.
5. Garanta que o MySQL esteja acessível e que as credenciais tenham permissões suficientes para criar e modificar o esquema.
6. Execute a aplicação usando os scripts definidos no `package.json`.

Exemplo de comandos para um projeto npm:

```bash
npm ci
npm start
```

Para desenvolvimento, use o script correspondente definido no `package.json` (por exemplo, `npm run dev`, caso exista). Os comandos disponíveis devem ser confirmados no `package.json` da versão em uso.

**Importante:** não publique o arquivo `.env`, senhas, chaves JWT, segredos de sessão ou credenciais de infraestrutura no controle de versão.

## 4. Banco de dados e persistência

### 4.1 MySQL, migrations e seeds

A aplicação utiliza MySQL e Knex.js para acesso e gerenciamento do banco. As **migrations** versionam alterações do esquema e os **seeds** permitem inserir dados iniciais controlados. Esse fluxo substitui a necessidade de executar manualmente os antigos scripts SQL avulsos.

A execução de migrations e seeds depende da configuração e dos scripts efetivamente presentes no projeto. Antes de executar a aplicação em um ambiente novo, confirme no código como a inicialização do banco é realizada e quais seeds podem ser executados com segurança.

### 4.2 Views e fallback nos repositories

Algumas consultas de leitura utilizam views do banco. Para determinados repositories, existe uma consulta alternativa (*fallback*) para situações em que a view não esteja disponível ou não possa ser utilizada. Operações de escrita continuam seguindo os métodos de persistência definidos pelos repositories e pelo esquema relacional.

A existência de fallback não elimina a necessidade de manter migrations, estrutura do banco e consultas compatíveis entre si.

### 4.3 Redis (opcional, conforme configuração)

O projeto oferece integração com Redis para armazenamento externo de sessões e também utiliza `rate-limit-redis` para o rate limiting quando configurado para esse backend. A dependência cliente (`redis`) não instala nem executa o servidor Redis.

A integração de sessões utiliza `connect-redis`. A disponibilidade e o comportamento de fallback dependem da configuração e do código da versão implantada. Configure `REDIS_URL` quando a aplicação estiver preparada para utilizar um servidor Redis e valide a conectividade antes da implantação.

Em Windows, Redis pode ser executado por meio de WSL ou Docker; em Linux, pode ser utilizado um serviço Redis compatível; em macOS, pode-se utilizar uma instalação compatível. Em produção, prefira uma instância gerenciada e protegida por controles de rede e credenciais adequados.

## 5. Execução da aplicação

A aplicação é executada com Node.js. Os comandos de inicialização e desenvolvimento devem corresponder aos scripts declarados no `package.json`.

Antes de disponibilizar a API, confirme:

- variáveis de ambiente e segredos configurados;
- conectividade com o MySQL;
- migrations necessárias aplicadas;
- Redis disponível quando habilitado;
- permissões de escrita no diretório de logs;
- configuração de ambiente e cookies compatível com HTTP/HTTPS utilizado.

A API disponibiliza recursos HTTP conforme as rotas registradas na aplicação e as regras de autenticação, autorização e escopo.

## 6. Estrutura do projeto

A aplicação está organizada em módulos de domínio e componentes compartilhados. A estrutura abaixo descreve as responsabilidades gerais, não substituindo a conferência da árvore real do repositório:

- `modules/`: módulos de domínio, incluindo usuários, secretarias, associações, associados, produtos, programas e movimentações, conforme presentes na versão atual.
- `shared/`: componentes reutilizáveis, como classes base, utilitários, validações e políticas compartilhadas.
- `database/`: configuração e componentes relacionados à persistência, migrations e seeds.
- `config/`: configurações globais da aplicação.
- arquivos de inicialização e configuração na raiz: entrada do servidor, manifesto npm e arquivos relacionados à execução e à integração contínua.

A estrutura modular busca manter responsabilidades coesas e reduzir o acoplamento entre os componentes. Para encontrar um arquivo específico, consulte a árvore do repositório da versão em uso.

## 7. Arquitetura e responsabilidades

O Agro Família Pesca adota uma arquitetura monolítica modular com separação em camadas (*Layered Architecture*).

- **Rotas e middlewares:** definem os endpoints e aplicam os controles transversais necessários.
- **Controllers:** recebem requisições HTTP, coordenam o fluxo da requisição e constroem as respostas.
- **Services:** concentram regras de negócio, validações e orquestração das operações.
- **Repositories:** encapsulam consultas e operações de persistência por meio do Knex.
- **Policies:** expressam regras de autorização baseadas no nível de acesso.
- **BaseScope:** aplica filtros de escopo diretamente às consultas ao banco de dados, evitando consultar um conjunto amplo de registros para filtrá-lo somente depois.
- **Paginação:** middleware valida parâmetros de paginação, que são processados em conjunto com a camada de persistência quando o endpoint oferece esse recurso.
- **HATEOAS:** respostas compatíveis podem incluir links de navegação relacionados aos recursos retornados, gerados de forma padronizada.
- **DBUtils:** centraliza operações de banco reutilizadas pelos repositories, conforme a implementação atual.
- **Tratamento de erros:** middleware centralizado padroniza o tratamento de erros da aplicação.

O fluxo esperado separa o tratamento HTTP das regras de negócio e do acesso a dados. A responsabilidade exata de cada módulo deve ser verificada no código quando houver refatorações.

## 8. Autenticação e segurança

### 8.1 JWT e sessões

A autenticação utiliza JWT e gerenciamento de sessões no servidor. O fluxo contempla access token e refresh token, além de registro e validação das sessões para permitir verificar sua existência, validade ou revogação. Dessa forma, a autorização não depende exclusivamente da data de expiração do token.

O sistema também trata cookies de sessão de acordo com o ambiente de execução. Os atributos de cookies e a forma de transmissão dos tokens devem ser conferidos na configuração atual antes da implantação.

**Validade dos tokens:** a documentação anterior informava validade de sete dias para o token de acesso. Confirme o valor nos pontos de geração e validação do JWT antes de usar esse prazo como garantia operacional. A validade e as regras de reutilização do refresh token também devem corresponder à implementação da versão implantada.

### 8.2 Senhas

A aplicação utiliza bcrypt para armazenar senhas em formato de hash, com salt. A documentação legada descreve uma migração automática de senhas em texto simples no momento do login: após uma autenticação legada bem-sucedida, a senha seria substituída por um hash bcrypt.

Esse comportamento é sensível do ponto de vista de segurança e deve ser confirmado no código atual antes de ser considerado vigente. O objetivo recomendado é não armazenar senhas em texto simples e migrar credenciais legadas de maneira controlada, removendo a compatibilidade temporária assim que possível.

### 8.3 Autorização e escopo de dados

O controle de acesso utiliza RBAC (*Role-Based Access Control*) e políticas de autorização. Além de decidir quais operações são permitidas, a aplicação aplica escopo aos dados acessíveis por cada usuário.

Os quatro níveis documentados são:

1. Administrador
2. Secretaria
3. Associação
4. Usuário

Os níveis definem permissões de operação. O escopo institucional restringe os registros que podem ser consultados ou alterados conforme o vínculo do usuário com uma Secretaria ou Associação. Quando aplicável, o escopo `own` restringe a operação aos registros do próprio usuário.

A validação de autorização e a aplicação do escopo são mecanismos complementares: ter permissão para acessar um endpoint não deve permitir acessar dados de outro contexto institucional.

### 8.4 Rate limiting

O endpoint de login utiliza `express-rate-limit` para limitar tentativas de autenticação em um intervalo definido. A aplicação também possui o middleware `apiLimiter`, destinado a limitar a frequência de requisições nos endpoints em que foi aplicado. O projeto inclui `rate-limit-redis` para permitir que o armazenamento dos limites seja feito em Redis quando configurado.

O rate limiting reduz a exposição a tentativas automatizadas e ataques de força bruta. Os limites concretos, a janela temporal e o comportamento quando o Redis está indisponível devem ser consultados na configuração vigente.

### 8.5 Logs e observabilidade

A aplicação utiliza Pino e Pino HTTP para produzir logs estruturados, auxiliando no diagnóstico, monitoramento e investigação de eventos.

Os arquivos documentados na configuração atual incluem:

- `app.log`: registros gerais da aplicação; avisos de segurança também podem ser registrados aqui.
- `error.log`: registros de erros.
- `security.log`: registros específicos de eventos e avisos de segurança.

Os arquivos de log devem permanecer fora do controle de versão. Não registre senhas, tokens completos, segredos de sessão ou outros dados sensíveis. A rotação diária de arquivos não deve ser considerada implementada até que a configuração correspondente seja adicionada e verificada.

### 8.6 Camadas de proteção

Os mecanismos de segurança documentados incluem:

- autenticação por JWT e verificação de sessão;
- hash de senhas com bcrypt;
- autorização por RBAC e Policies;
- restrição de acesso a dados por BaseScope e escopo `own`;
- Rate limiting no login e nos endpoints protegidos pelo middleware `apiLimiter`;
- tratamento centralizado de erros;
- logs estruturados para diagnóstico e eventos de segurança;
- testes automatizados dos componentes críticos.

Essas medidas precisam ser avaliadas em conjunto. A presença de uma camada não substitui a validação das demais.

## 9. Testes automatizados e integração contínua

O projeto utiliza Jest para testes automatizados e Supertest para testes HTTP. A cobertura descrita no projeto inclui componentes como:

- middlewares de autenticação e autorização;
- validação de paginação;
- tratamento centralizado de erros;
- rate limiter de login e middleware `apiLimiter` (nos cenários cobertos pelos testes existentes);
- consultas com escopo presente e comportamento quando a coluna de escopo não existe;
- utilitários de busca e tratamento de parâmetros;
- operações compartilhadas de DBUtils;
- consultas com e sem escopo;
- operações de inserção, atualização e exclusão;
- fluxo de autenticação relacionado ao banco de dados.

A cobertura efetiva deve ser verificada nos arquivos de teste existentes. A lista acima descreve áreas testadas/documentadas e não garante que todos os cenários de cada componente estejam cobertos.

### 9.1 Executar os testes

Na raiz do repositório, execute:

```bash
npm test
```

O comando pressupõe que o script `test` esteja configurado no `package.json`. Consulte esse arquivo se o comando ou o ambiente de teste tiver sido alterado.

### 9.2 Integração contínua

O workflow de CI executa verificações automatizadas em eventos de push e pull request para as branches configuradas no arquivo de workflow. A configuração documentada utiliza Ubuntu e Node.js 22, instala dependências com npm, verifica a sintaxe do arquivo de entrada e executa os testes.

Como a API foi movida para a raiz do repositório, os comandos e caminhos do workflow devem ser relativos à raiz atual; referências antigas a `API_agrofamilia_pesca/` precisam ser removidas se ainda estiverem no arquivo de CI.

## 10. Controle de acesso e boas práticas de consulta

O **BaseScope** aplica filtros de escopo diretamente às consultas de persistência. Essa abordagem substitui a estratégia anterior de buscar registros sem restrição e filtrar os resultados posteriormente no BaseService.

Quando aplicável, o escopo deve ser aplicado não apenas em consultas de leitura, mas também nas operações de atualização e exclusão, para impedir que o usuário altere registros fora do seu contexto autorizado.

A integração entre escopo e paginação deve preservar os filtros de autorização tanto na consulta dos registros quanto na contagem utilizada para gerar metadados de paginação.

No utilitário `findWithScope`, a existência da coluna usada como escopo é verificada antes da consulta. Se a coluna não existir, a função retorna `undefined`, evitando executar uma consulta sem o filtro de escopo esperado. O chamador deve tratar esse retorno de acordo com o contrato do serviço; não deve interpretá-lo como autorização para consultar os registros sem restrição.

Benefícios pretendidos:

- menor exposição de dados;
- redução do volume de registros transferidos e processados;
- padronização das regras de acesso;
- melhor previsibilidade das consultas;
- menor risco de acesso cruzado entre Secretarias, Associações e usuários.

## 11. Manutenção e evolução

A arquitetura modular permite evoluir o sistema de forma incremental. A separação entre controllers, services, repositories e componentes compartilhados facilita manutenção corretiva e evolutiva.

Ao implementar mudanças:

1. verifique a regra de negócio e o escopo de acesso;
2. mantenha as responsabilidades de cada camada;
3. atualize migrations quando houver alteração de esquema;
4. adicione ou ajuste testes automatizados;
5. atualize a documentação técnica e os payloads afetados;
6. execute os testes localmente e aguarde o resultado da CI;
7. revise logs para evitar exposição de informações sensíveis.

## 12. Rotas da API e payloads

Esta seção registra exemplos de rotas presentes na documentação de referência. Ela não substitui o código das rotas nem garante que todos os endpoints estejam listados. Antes de usar os exemplos em produção, valide métodos, permissões, nomes de campos, códigos HTTP e formatos de resposta na versão atual.

As requisições e respostas usam JSON quando aplicável. Rotas protegidas exigem autenticação conforme os middlewares configurados. Consultas de listagem podem oferecer paginação e respostas HATEOAS conforme o endpoint.

### 12.1 Autenticação

#### Login

**Método e rota:** `POST /login`

Payload documentado:

```json
{
  "LOGIN": "novo_login",
  "SENHA": "nova_senha"
}
```

A rota valida as credenciais e, em caso de sucesso, inicia o fluxo de autenticação e emite os tokens previstos pela implementação. O formato exato da resposta e o mecanismo de transporte dos tokens devem ser confirmados no controller atual.

A resposta legada documentada era:

```json
{
  "Message": "Login realizado",
  "APIkey": "<token_jwt>"
}
```

Resposta de erro legada documentada:

```json
{
  "Error": "Login invalido"
}
```

Esses exemplos refletem o documento de referência e devem ser comparados com as respostas atuais antes de serem tratados como contrato definitivo.

### 12.2 Módulo Usuários

Responsável pelo gerenciamento de usuários, autenticação e administração de perfis.

| Operação | Método e rota documentados | Observação |
|---|---|---|
| Consultar usuários | `GET /usuarios` | O escopo deve ser aplicado conforme o contexto do usuário. |
| Buscar por ID ou nome | `GET /usuarios/{value}` | Confirmar formato aceito pelo parâmetro. |
| Buscar por nível | `GET /usuarios/nivel/{nivel}` | Filtra pelo nível de acesso. |
| Buscar por secretaria | `GET /usuarios/secretaria/{secretaria}` | Filtra pelo vínculo institucional. |
| Buscar por login | `GET /usuarios/login/{login}` | Confirmar as permissões atuais. |
| Criar usuário | `POST /usuarios/new` | Payload abaixo. |
| Atualizar usuário | `PUT /usuarios/update/{id}` | Payload abaixo. |
| Atualizar login | `PUT /usuarios/update/login/{id}` | Payload abaixo. |
| Excluir usuário | `DELETE /usuarios/delete/{id}` | A exclusão deve respeitar autorização e escopo. |

Exemplo de criação:

```json
{
  "ID_PESSOA": 1,
  "ID_SECRETARIA": 2,
  "ID_ASSOCIACAO": "1",
  "NIVEL": 1,
  "LOGIN": "usuario_admin",
  "SENHA": "senha123"
}
```

Exemplo de atualização:

```json
{
  "ID_PESSOA": 1,
  "ID_SECRETARIA": 2,
  "ID_ASSOCIACAO": "",
  "NIVEL": 2
}
```

Exemplo de atualização de login:

```json
{
  "LOGIN": "admin",
  "SENHA": "admin"
}
```

Os valores são exemplos ilustrativos, não credenciais recomendadas para ambientes reais.

### 12.3 Módulo Pessoas

Responsável pelo cadastro de pessoas físicas usadas como base para usuários e associados.

**Método e rota documentados:** `POST /pessoas`

```json
{
  "NOME": "João da Silva",
  "CPF": "12345678900",
  "DATA_NASCIMENTO": "1985-06-15",
  "GENERO": "M"
}
```

O payload deve ser validado conforme as regras de negócio e os campos obrigatórios da implementação atual.

### 12.4 Módulo Secretarias

Gerencia os órgãos governamentais vinculados ao sistema.

**Método e rota documentados:** `POST /secretarias`

```json
{
  "NOME": "Secretaria de Agricultura",
  "CIDADE": "Tutóia",
  "ESTADO": "MA",
  "ENDERECO": "Av. Principal, 500"
}
```

### 12.5 Módulo Associações

Gerencia associações vinculadas às Secretarias.

**Método e rota documentados:** `POST /associacoes`

```json
{
  "NOME": "Colônia de Pescadores Z-15",
  "ENDERECO": "Rua do Porto, SN",
  "ID_SECRETARIA": 1,
  "ID_CATEGORIA": 2
}
```

### 12.6 Módulo Associados

Gerencia o vínculo entre pessoas e associações.

**Método e rota documentados:** `POST /associados`

```json
{
  "ID_PESSOA": 10,
  "ID_ASSOCIACAO": 5,
  "CAF": "123.456.789",
  "VALIDADE_CAF": "2027-12-31"
}
```

### 12.7 Módulo Programas

Responsável pelo cadastro de programas governamentais e beneficiários.

**Método e rota documentados:** `POST /programas`

```json
{
  "NOME": "Programa de Apoio à Agricultura Familiar",
  "DESCRICAO": "Incentivo à produção local",
  "DATA_INICIO": "2024-01-01T03:00:00.000Z",
  "DATA_FIM": "2026-12-31T03:00:00.000Z",
  "ORIGEM_RECURSO": "Governo Estadual",
  "VLR_REPASSE": "150000.00",
  "ID_SECRETARIA": 1,
  "ID_ASSOCIACAO": 3
}
```

### 12.8 Módulo Produtos

Gerencia produtos agrícolas e pesqueiros.

**Método e rota documentados:** `POST /produtos`

```json
{
  "NOME": "Tilápia",
  "ID_TIPO_PRODUTO": "2"
}
```

### 12.9 Módulo Movimentações

Registra movimentações relacionadas à produção dos associados.

**Método e rota documentados:** `POST /movimentacoes`

```json
{
  "ID_LOCAL": 1,
  "ID_AGRICULTURA_FAMILIAR": 1,
  "ID_PRODUTO": 1,
  "QNT_PRODUZIDA": "200",
  "VLR_UNITARIO": "15.50",
  "DATA_MOVIMENTACAO": "2025-01-10"
}
```

### 12.10 Observações sobre os endpoints

- Os endpoints e payloads acima foram preservados da documentação fornecida; confirme-os com as rotas e controllers atuais.
- Os endpoints protegidos exigem autenticação conforme a configuração vigente.
- A autorização depende do nível de acesso e das Policies.
- O escopo institucional deve restringir os registros acessíveis.
- A paginação está disponível nos endpoints que a implementam.
- As respostas HATEOAS podem incluir links de navegação quando configuradas.
- Erros são tratados pelo middleware centralizado, conforme a implementação.
- Não se deve assumir que a lista acima é um inventário completo de rotas.

## 13. Referências internas do projeto

Consulte os documentos e arquivos existentes no repositório para informações complementares:

- `docs/Documentação-Agro-família-Pesca.md`: documentação geral do sistema, caso esse caminho permaneça vigente.
- `docs/Manual-Tecnico.md`: este manual técnico, caso esse caminho permaneça vigente.
- `SECURITY.md`: orientações de segurança, caso disponível na raiz.
- `package.json`: scripts npm e dependências.
- Arquivos de configuração de migrations, seeds, rotas, middlewares e workflow de CI: fonte de verdade para o comportamento executável.

Os nomes e caminhos devem ser ajustados à estrutura real do repositório após a reorganização.

## 14. Considerações técnicas finais

O Agro Família Pesca reúne uma API modular para gerenciamento de dados relacionados à agricultura familiar e à pesca artesanal. A separação por camadas, o controle de acesso por nível e escopo, o gerenciamento de sessões, a persistência com Knex, os logs estruturados e os testes automatizados compõem a base técnica documentada do projeto.

Este manual deve evoluir junto com o código. Sempre que uma rota, payload, regra de segurança, variável de ambiente, migration, integração ou comando de execução mudar, a documentação correspondente deve ser revisada e validada contra a implementação antes de uma nova versão ser publicada.