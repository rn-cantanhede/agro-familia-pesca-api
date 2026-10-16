# Agro Família Pesca

## Sistema de Gerenciamento da Agricultura Familiar e Pesca Artesanal

## 1. Introdução
A agricultura familiar e a pesca artesanal representam setores fundamentais para a segurança alimentar e o desenvolvimento socioeconômico local. Entretanto, a gestão das informações relacionadas a produtores, associações, programas governamentais e movimentações produtivas ainda enfrenta desafios decorrentes do uso de processos manuais ou sistemas fragmentados.

Neste contexto, o projeto **Agro Família Pesca** foi desenvolvido com o objetivo de criar uma **API RESTful robusta, segura e modular**, capaz de centralizar e organizar dados relacionados à agricultura familiar e pesca artesanal, atendendo às necessidades administrativas de Secretarias Municipais e Associações.

O sistema foi desenvolvido como parte de um **curso de especialização em Back-end com Node.js**, promovido pelo IFMA, servindo tanto como solução prática quanto como instrumento de aplicação de conceitos modernos de engenharia de software, arquitetura de APIs e segurança da informação.

## 2. Objetivos
### 2.1 Objetivo Geral

Desenvolver uma API REST para gerenciamento de dados da agricultura familiar e pesca artesanal, com controle de acesso por nível de usuário e escopo institucional.

### 2.2 Objetivos Específicos

* Implementar autenticação segura baseada em JWT.  

* Controlar o acesso aos dados por níveis hierárquicos (Admin, Secretaria, Associação e Usuário).  

* Aplicar arquitetura modular com separação clara de responsabilidades.  

* Utilizar boas práticas de segurança e organização de código.  

* Disponibilizar uma API reutilizável e extensível.

## 3. Visão Geral do Sistema

O Agro Família Pesca é uma API RESTful desenvolvida em Node.js e Express para apoiar o gerenciamento de informações relacionadas à agricultura familiar e à pesca artesanal. A aplicação concentra regras de negócio, autenticação, autorização e acesso aos dados em uma API modular.

A estrutura atual do repositório foi simplificada: a API principal está localizada na raiz do projeto. As antigas pastas `API_Simplificada`, `consumo` e a pasta de scripts SQL mantidos separadamente foram removidas da organização atual. A configuração e a evolução do esquema do banco são realizadas por meio de Knex Migrations e Seeds.

Este documento descreve a implementação principal da API. Os caminhos e exemplos devem acompanhar a estrutura atual do repositório, não a organização histórica das versões anteriores.

## 4. Arquitetura do Sistema
### 4.1 Estilo Arquitetural

O sistema adota uma **Arquitetura Monolítica Modular**, combinada com o padrão **Layered Architecture**, promovendo alta coesão, baixo acoplamento e facilidade de manutenção.

### 4.2 Camadas da Arquitetura

#### 4.2.1 Camada de Entrada (Router & Controller)

Responsável por receber requisições HTTP, validar parâmetros básicos e encaminhar os dados para a camada de serviço.

* **Localização**: `modules/*/*.controller.js`  

* **Responsabilidade**:  

  * Controle de fluxo  

  * Padronização das respostas HTTP  

  * Tratamento inicial de erros

#### 4.2.2 Camada de Serviço (Service Layer)

É o núcleo da aplicação, onde residem as regras de negócio, validações e controle de escopo.

* **Localização**: `modules/*/*.service.js`  

* **Responsabilidade**:  

  * Aplicar regras de negócio  

  * Validar permissões  

  * Orquestrar chamadas ao repositório  

  * Coordenar operações que dependem do contexto de acesso  

#### 4.2.3 Camada de Persistência (Repository Layer)

Abstrai o acesso ao banco de dados, encapsulando consultas SQL e operações CRUD.

* **Localização**: `modules/*/*.repository.js`  

* **Responsabilidade**:  

  * Isolar o SQL da lógica de negócio  

  * Utilizar tabelas e views conforme o contexto

  * Disponibilizar consultas alternativas quando uma view não puder ser utilizada

Determinados repositories possuem mecanismos de **fallback para consultas baseadas em views**. Quando uma view não estiver disponível ou não puder ser utilizada em determinada operação, o repository pode executar uma consulta alternativa equivalente, aumentando a resiliência da camada de persistência.

#### 4.2.4 Camada Compartilhada (Shared)

Contém componentes e recursos reutilizáveis por diferentes módulos da aplicação.

* **Exemplos**:  

  * BaseService  

  * BaseScope  

  * Errors  

  * validationsUtils  

  * LevelPolicy

#### 4.2.5 Controle de Escopo (BaseScope)

O sistema utiliza o componente **BaseScope** para aplicar restrições de acesso diretamente nas consultas realizadas ao banco de dados.

A implementação atual substitui a abordagem anterior utilizada pelo **BaseService**, na qual os dados eram consultados primeiro e filtrados posteriormente pela aplicação.

Com o **BaseScope**, as condições de escopo são incorporadas à própria consulta, permitindo que o banco de dados retorne somente os registros compatíveis com o contexto de acesso do usuário.

Essa abordagem proporciona:

* Redução da quantidade de dados retornados pelo banco;  

* Redução do processamento realizado pela aplicação;  

* Melhoria da performance das consultas;  

* Maior isolamento dos dados;  

* Redução do risco de carregamento de informações fora do escopo autorizado.

O mecanismo é aplicado de forma transversal aos endpoints que realizam consultas, e não apenas ao módulo de usuários.

Quando aplicável, o escopo **own** restringe a consulta aos registros pertencentes ao próprio usuário.

### 4.2.6 Paginação das Consultas

A API utiliza **paginação** nas consultas que retornam conjuntos de registros, com validação dos parâmetros por middleware e suporte na camada de persistência.

A paginação foi incorporada aos métodos compartilhados de consulta e expandida para os principais módulos da aplicação. A implementação limita a quantidade de registros processados e retornados em cada requisição, reduzindo o consumo de recursos em consultas com grandes volumes de dados.

A paginação também foi integrada ao mecanismo de escopo, permitindo que consultas paginadas mantenham as restrições de acesso aplicadas pelo **BaseScope**.

### 4.2.7 Padronização de Respostas com HATEOAS

A API passou a utilizar **HATEOAS (Hypermedia as the Engine of Application State)** para padronizar a disponibilização de links de navegação nas respostas.

A implementação foi integrada aos controllers e aos diferentes módulos da API, permitindo que as respostas forneçam informações de navegação relacionadas aos recursos disponíveis.

A geração dos links foi padronizada para reduzir inconsistências entre endpoints e facilitar o consumo da API por clientes externos.

## 5. Controle de Acesso e Segurança
### 5.1 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação, associado a um mecanismo de **gerenciamento persistente de sessões**.

* Tokens de acesso com validade de **7 dias**

* Utilização de **access token** e **refresh token**

* Registro e controle das sessões no banco de dados

* Verificação de sessões inexistentes, expiradas ou revogadas

* Validação de inconsistências entre os dados da sessão e os dados utilizados pelo token

* Controle de cookies de autenticação conforme o ambiente

* Senhas armazenadas com **bcrypt (salt rounds = 10)**

A persistência das sessões permite que a aplicação controle a validade dos tokens e realize sua revogação sem depender exclusivamente das informações presentes no JWT.

### 5.1.1 Tratamento de Senhas Legadas

Durante o desenvolvimento do sistema **Agro Família Pesca**, foi identificada a existência de usuários com senhas armazenadas em formato **não criptografado**, oriundas de inserções manuais no banco de dados ou de versões iniciais do sistema, **anteriores à implementação completa dos mecanismos de segurança**.

Visando **manter a continuidade operacional** do sistema sem comprometer os princípios de segurança da informação, adotou-se uma estratégia de **migração automática de senhas** legadas. Nessa abordagem, o sistema identifica, no momento do login, se a senha armazenada no banco de dados encontra-se **criptografada no padrão bcrypt**.

Caso a senha esteja armazenada em **texto simples**, o sistema realiza a autenticação comparando diretamente o valor informado pelo usuário com o valor persistido. Após a autenticação bem-sucedida, **a senha é imediatamente convertida para o formato criptografado** utilizando o algoritmo bcrypt e atualizada no banco de dados.

Quando a senha já se encontra criptografada, o processo de autenticação **ocorre normalmente**. Dessa forma, garante-se **compatibilidade** com dados legados ao mesmo tempo em que **se eleva gradualmente o nível de segurança** do sistema.

Essa solução demonstra um equilíbrio entre usabilidade, segurança e manutenção de sistemas legados, sendo especialmente adequada para contextos institucionais e governamentais, nos quais a migração imediata de todas as credenciais pode não ser viável.

### 5.1.2 Gerenciamento de Sessões e Tokens

O gerenciamento de autenticação utiliza uma estrutura persistente de sessões para acompanhar os tokens emitidos pela aplicação.

A sessão pode ser **revogada**, permitindo invalidar o acesso mesmo quando o token ainda estiver dentro de sua validade original. O mecanismo também contempla a reutilização do refresh token enquanto ele permanecer válido, de acordo com as regras do fluxo de autenticação.

A aplicação realiza verificações para identificar sessões inexistentes, expiradas ou revogadas, além de inconsistências entre as informações da sessão e os dados utilizados na geração do token.

As informações de autenticação são mantidas em cookies configurados de acordo com o ambiente de execução, com tratamento específico para o ambiente de produção.

### 5.1.3 Persistência Opcional de Sessões com Redis

A aplicação possui integração opcional com **Redis** através de \`connect-redis\` e do cliente \`redis\`, permitindo utilizar armazenamento externo para as sessões.

O uso do Redis depende da configuração da variável de ambiente \`REDIS_URL\` e da disponibilidade de um servidor Redis. A biblioteca \`redis\` utilizada pela aplicação é apenas o cliente de comunicação e não fornece o servidor Redis.

Quando a integração não estiver habilitada, a aplicação pode continuar utilizando o mecanismo de armazenamento de sessão configurado localmente.

Essa possibilidade facilita cenários em que a aplicação precise compartilhar sessões entre diferentes instâncias do servidor.

### 5.2 Autorização (RBAC)

O RBAC define as permissões associadas ao nível do usuário, enquanto o escopo contextual restringe os registros que podem ser acessados dentro dessas permissões.

Assim, autorização e filtragem de dados são tratadas como mecanismos complementares.

**Níveis de Acesso**

\| Nível | Perfil |

\| :---: | :---: |

\| 1 | Administrador |

\| 2 | Secretaria |

\| 3 | Associação |

\| 4 | Usuário |

### 5.3 Escopo de Dados

Além do controle de acesso baseado em papéis (RBAC), a API utiliza **escopo contextual de dados**.

O mecanismo é implementado através do **BaseScope**, responsável por aplicar os filtros de acesso diretamente nas consultas ao banco de dados.

Dessa forma, os endpoints que realizam consultas retornam somente informações compatíveis com o escopo do usuário autenticado.

Entre os escopos utilizados está o **own**, que restringe o acesso aos dados pertencentes ao próprio usuário quando essa regra se aplica ao recurso consultado.

A aplicação do escopo diretamente na consulta substitui a abordagem anterior, na qual os dados eram recuperados e filtrados posteriormente pela aplicação.

Essa mudança melhora:

* **Performance**, reduzindo o volume de dados transferidos e processados;  

* **Segurança**, evitando o carregamento desnecessário de registros fora do escopo;  

* **Padronização**, centralizando a aplicação das regras de escopo;  

* **Manutenibilidade**, reduzindo a duplicação da lógica de filtragem entre os módulos.

### 5.4 Rate Limiting

A rota de autenticação utiliza `express-rate-limit` para limitar a quantidade de tentativas de login em determinado intervalo, reduzindo a exposição a ataques de força bruta e tentativas automatizadas. A configuração atual utiliza integração com Redis por meio de `rate-limit-redis`, conforme a configuração do ambiente. A disponibilidade do armazenamento Redis depende da configuração e da conexão com o serviço.

### 5.5 Observabilidade e Logs

A API utiliza `pino` e `pino-http` para geração de logs estruturados. O logger da aplicação registra eventos operacionais e requisições HTTP, apoiando diagnóstico e acompanhamento do comportamento da API.

A implementação separa os registros em arquivos por finalidade:

- `app.log`: eventos gerais da aplicação; avisos relevantes de segurança também são registrados neste arquivo.
- `error.log`: registros de erro.
- `security.log`: eventos e avisos relacionados à segurança.

Os arquivos de log são gerados em diretório próprio e não devem ser versionados no Git. A separação de `security.log` não implica que os eventos de segurança deixem de aparecer em `app.log`. Rotação diária dos arquivos não é descrita aqui como funcionalidade concluída.

### 5.6 Testes Automatizados e Integração Contínua

O projeto utiliza `jest` para testes automatizados e `supertest` para testes de integração HTTP. A cobertura inclui componentes de autenticação e autorização, paginação, tratamento de erros e operações compartilhadas da camada de persistência.

O workflow de Integração Contínua (CI) é executado em eventos de `push` e `pull_request` direcionados às branches `main` e `develop`. O fluxo utiliza Node.js 22, instala as dependências com npm, verifica a sintaxe de `server.js` e executa a suíte de testes. Como a API foi movida para a raiz do repositório, os comandos do workflow devem ser executados nesse diretório, sem depender do caminho antigo `API_agrofamilia_pesca`.

## 6. Diagrama Conceitual (Descrição)
### 6.1 Diagrama de Arquitetura (Descrição Textual)

Cliente

   ↓

Router

   ↓

Middleware de paginação / autenticação

   ↓

Controller

   ↓

Service

   ↓

Policy

   ↓

BaseScope

   ↓

Repository

   ↓

Banco de Dados (MySQL)

### 6.2 Diagrama de Entidades (Resumo)

* Pessoa  

* Usuário  

* Sessão  

* Secretaria  

* Associação  

* Associado  

* Programa  

* Produto  

* Movimentação

## 7. Documentação do Banco de Dados
### 7.1 Visão Geral do Banco de Dados

O sistema **Agro Família Pesca** utiliza um banco de dados relacional baseado em **MySQL**, projetado para garantir integridade referencial, consistência dos dados e eficiência nas consultas. A modelagem foi pensada para atender múltiplos perfis de acesso, com uso extensivo de **views** para isolamento de dados sensíveis e aplicação de escopo institucional.

O banco centraliza informações relacionadas a usuários, pessoas físicas, secretarias, associações, programas governamentais, produtos e movimentações produtivas.

### 7.2 Estratégia de Modelagem

A modelagem do banco segue os princípios da **normalização**, reduzindo redundâncias e garantindo integridade lógica:

* **1ª Forma Normal (1FN)**: Todos os atributos são atômicos.  

* **2ª Forma Normal (2FN)**: Não há dependência parcial de chave.  

* **3ª Forma Normal (3FN)**: Não há dependências transitivas.

As entidades foram separadas entre:

* **Entidades administrativas** (Usuário, Secretaria, Associação)  

* **Entidades civis** (Pessoa)  

* **Entidades operacionais** (Associado, Programa, Produto, Movimentação)

### 7.3 Entidades Principais

#### 7.3.1 Pessoa

Representa o indivíduo físico, sendo a entidade base para usuários e associados.

**Campos principais**:

* ID (PK)  

* NOME  

* CPF  

* DATA_NASCIMENTO  

* GENERO

* ENDERECO

**Observação**:  

 A separação entre Pessoa e Usuário permite que uma pessoa exista no sistema sem, necessariamente, possuir credenciais de acesso.

#### 7.3.2 Usuário

Representa a entidade responsável pela autenticação e autorização no sistema.

**Campos principais**:

* ID (PK)  

* ID_PESSOA (FK → pessoa)  

* ID_SECRETARIA (FK → secretaria)  

* LOGIN  

* SENHA  

* NIVEL

**Regras**:

* A senha é armazenada de forma criptografada.  

* O nível define o escopo de acesso do usuário.

#### 7.3.3 Secretaria

Representa um órgão governamental responsável por associações e programas.

**Campos principais**:

* ID (PK)  

* NOME  

* CIDADE  

* ESTADO  

* ENDERECO

#### 7.3.4 Associação

Entidade que agrupa produtores rurais ou pescadores.

**Campos principais**:

* ID (PK)  

* NOME  

* ENDERECO  

* ID_SECRETARIA (FK → secretaria)  

* ID_CATEGORIA (FK → categoria)

#### 7.3.5 Associado

Representa o vínculo formal entre uma Pessoa e uma Associação.

**Campos principais**:

* ID (PK)  

* ID_PESSOA (FK → pessoa)  

* ID_ASSOCIACAO (FK → associação)  

* CAF  

* VALIDADE_CAF

**Regras de Negócio**:

* O CAF deve ser único.  

* Um associado pertence a apenas uma associação por vínculo ativo.

#### 7.3.6 Programa

Representa programas governamentais de apoio à agricultura familiar e pesca.

**Campos principais**:

* ID (PK)  

* NOME  

* DESCRICAO  

* ID_SECRETARIA (FK → secretaria)

* ID_ASSOCIACAO (FK → associacao)

#### 7.3.7 Produto

Representa produtos agrícolas ou pesqueiros cadastrados no sistema.

**Campos principais**:

* ID (PK)

* NOME

#### 7.3.8 Movimentação

Registra a produção ou movimentação de um associado.

**Campos principais**:

* ID (PK)

* ID_LOCAL (FK → localizacao_beneficiada)

* ID_AGRICULTURA_FAMILIAR (FK → agricultura_familiar)

* ID_PRODUTO (FK → produto)

* QNT_PRODUZIDA

* VLR_UNITARIO

* DATA_MOVIMENTACAO

### 7.3.9 Sessão

Representa o registro persistente de uma sessão de autenticação, permitindo acompanhar e controlar os tokens emitidos para os usuários.

**Finalidades principais**:

* Controlar a validade das sessões;

* Permitir revogação de sessões;

* Apoiar a validação dos tokens de acesso e refresh tokens;

* Manter o estado de autenticação necessário para os fluxos de login e logout.

### 7.4 Relacionamentos Entre Entidades

Os principais relacionamentos do banco de dados são:

* **Pessoa 1:N Usuário**  

* **Pessoa 1:N Associado**  

* **Secretaria 1:N Associação**  

* **Associação 1:N Associado**  

* **Associado 1:N Movimentação**  

* **Produto 1:N Movimentação**

Esses relacionamentos são implementados através de **chaves estrangeiras**, garantindo integridade referencial.

### 7.5 Uso de Views

As **views** são utilizadas como camada de abstração para determinadas consultas de leitura, enquanto o **BaseScope** é responsável por aplicar as restrições contextuais de acesso diretamente às consultas.

Dessa forma, as **views** organizam e simplificam consultas complexas, enquanto o mecanismo de escopo controla quais registros podem ser retornados ao usuário.

**Objetivos do uso de Views:**

* Melhorar a legibilidade das consultas  

* Centralizar joins complexos  

* Facilitar aplicação de escopo por nível de acesso  

* Evitar exposição direta das tabelas base

**Exemplos de Views:**

* view_usuarios  

* view_associados  

* view_pessoas  

* view_movimentacoes

As views são utilizadas exclusivamente para operações de **leitura**, enquanto operações de escrita são realizadas diretamente nas tabelas.

### 7.5.1 Fallback nas Consultas dos Repositories

Para aumentar a resiliência da camada de persistência, determinados repositories possuem uma estratégia de **fallback** para consultas que normalmente utilizam views.

Quando uma view não estiver disponível ou não puder ser utilizada, o repository pode executar uma consulta alternativa equivalente, mantendo o acesso ao dado encapsulado na camada de persistência.

Essa estratégia foi aplicada a módulos como Usuários, Produtos, Programas, Movimentações, Pessoas, Associações, Associados, Agricultura Familiar e Localização de Beneficiados.

### 7.6 Integridade e Consistência dos Dados

O banco de dados implementa diversas estratégias para garantir a consistência:

* **Chaves primárias e estrangeiras**  

* **Restrições de unicidade** (ex.: CAF, LOGIN)  

* **Validação de existência de registros** antes de operações de escrita  

* **Validação lógica na camada de serviço**, evitando inconsistências transacionais

### 7.7 Considerações sobre Escalabilidade e Manutenção

A separação entre tabelas e views, aliada ao uso do Knex.js como camada de acesso, facilita:

* Evolução do esquema sem impacto direto na API  

* Refatoração de consultas complexas  

* Portabilidade para outros bancos relacionais

### 7.8 Síntese da Camada de Persistência

A camada de banco de dados do sistema **Agro Família Pesca** foi projetada para suportar crescimento, segurança e clareza semântica, alinhando-se às boas práticas de engenharia de software e modelagem relacional.

### 7.9 Vinculação entre Banco de Dados e Módulos da API

O banco de dados do sistema **Agro Família Pesca** está diretamente acoplado à arquitetura modular da API, onde cada **módulo funcional** corresponde a um conjunto bem definido de **tabelas e views**, respeitando o princípio de **responsabilidade única**.

Essa vinculação garante:

* Clareza na manutenção  

* Facilidade de rastreabilidade entre regra de negócio e persistência  

* Segurança no controle de acesso por escopo

### 7.9.1 Mapeamento Módulo ↔ Entidades

#### 7.9.1.1 Módulo Usuários

Responsável pela autenticação, autorização e controle de acesso.

**Tabelas**:

* usuario  

* pessoa  

* secretaria  

* sessoes

**Views**:

* view_usuarios

**Relacionamentos-chave**:

* usuario.ID_PESSOA → pessoa.ID  

* usuario.ID_SECRETARIA → secretaria.ID

#### 7.9.1.2 Módulo Pessoas

Entidade base do sistema, utilizada por usuários e associados.

**Tabela**:

* pessoa

**Relacionamentos**:

* Pessoa ↔ Usuário  

* Pessoa ↔ Associado

#### 7.9.1.3 Módulo Secretarias

Representa órgãos governamentais responsáveis pela gestão institucional.

**Tabela**:

* secretaria

**Relacionamentos**:

* Secretaria ↔ Usuários  

* Secretaria ↔ Associações  

* Secretaria ↔ Programas

#### 7.9.1.4 Módulo Associações

Agrupamento institucional de produtores e pescadores.

**Tabelas**:

* associacao  

* associado

**Views**:

* view_associados

**Relacionamentos**:

* Associação ↔ Associados  

* Associação ↔ Secretaria

#### 7.9.1.5 Módulo Produtos / Tipos de Produto

Gerencia os produtos agrícolas e pesqueiros.

**Tabelas**:

* produto  

* tipo_produto

**Relacionamentos**:

* Tipo de Produto ↔ Produto  

* Produto ↔ Movimentação

#### 7.9.1.6 Módulo Movimentações

Registra a produção dos associados.

**Tabela**:

* movimentacao

**Views**:

* view_movimentacoes

**Relacionamentos**:

* Associado ↔ Movimentação  

* Produto ↔ Movimentação

#### 7.9.1.7 Módulo Programas / Agricultura Familiar

Registra beneficiários de políticas públicas.

**Tabelas**:

* programa  

* agricultura_familiar

**Relacionamentos**:

* Programa ↔ Associado  

* Secretaria ↔ Programa

### 7.10 Diagrama Entidade–Relacionamento (ER)

O diagrama abaixo representa a **estrutura lógica do banco de dados**, com suas entidades, atributos essenciais e relacionamentos principais.

![][image1]

### 7.11 Versionamento do Banco de Dados

A estrutura do banco de dados é versionada com `Knex Migrations`, que permite acompanhar e reproduzir a evolução do esquema de forma controlada. Os dados iniciais são gerenciados por `Knex Seeds`.

A criação e a preparação do banco são integradas ao fluxo de configuração da aplicação. A organização atual não depende da execução manual de uma pasta separada de scripts SQL como procedimento principal de inicialização. As migrations e seeds versionadas são a referência para a evolução do esquema e para a carga inicial prevista pelo projeto.

## 8. Considerações Finais
O desenvolvimento do projeto **Agro Família Pesc**&#x61; evidencia a aplicação prática e consistente de conceitos fundamentais e avançados de desenvolvimento **backend**, especialmente no que se refere à arquitetura em camadas, modelagem de banco de dados relacional, controle de acesso baseado em papéis **(RBAC)** e segurança em **APIs RESTful**.

A adoção de uma **estrutura modular**, com clara separação entre Controllers, Services, Repositories e Policies, contribui diretamente para a **manutenibilidade, extensibilidade e legibilidade do sistema**. Essa organização reduz o acoplamento entre componentes, facilita a identificação de responsabilidades e **promove boas práticas** alinhadas à engenharia de software moderna.

Além disso, a implementação do **BaseScope** representa uma evolução importante na arquitetura de segurança do sistema. Os filtros de escopo passaram a ser aplicados diretamente nas consultas ao banco de dados, substituindo a abordagem anterior de filtragem posterior dos resultados.

Essa alteração permite reduzir o volume de dados retornados e processados pela aplicação, contribuindo simultaneamente para a melhoria da performance e para o fortalecimento do isolamento dos dados.

O mecanismo é aplicado de forma transversal aos endpoints que realizam consultas, permitindo que o acesso seja limitado de acordo com o contexto institucional do usuário, incluindo o escopo **own** quando aplicável.

Do ponto de vista acadêmico, o projeto atende plenamente aos objetivos propostos, integrando teoria e prática de forma coerente. Do ponto de vista técnico, o sistema apresenta-se como uma base sólida para futuras expansões, podendo evoluir para incluir funcionalidades como:

* Dashboards analíticos para apoio à tomada de decisão;  

* Relatórios automatizados de produção e beneficiários;  

* Integração com sistemas governamentais externos;  

* Camadas adicionais de auditoria e monitoramento.

Dessa forma, o **Agro Família Pesca** não apenas resolve um problema real do domínio da agricultura familiar e pesca artesanal, como também se consolida como um projeto tecnicamente consistente, academicamente válido e **alinhado às boas práticas profissionais** de desenvolvimento de software.

A evolução recente da API também incorporou mecanismos de **paginação**, **HATEOAS**, **testes automatizados**, **integração contínua**, **persistência de sessões** e **fallback nos repositories**, ampliando a capacidade de manutenção, observabilidade e evolução da aplicação.

### 8.1 Considerações Acadêmicas Finais

A vinculação direta entre os módulos da API e as entidades do banco de dados **evidencia uma arquitetura bem definida** e conceitualmente sólida. Essa relação clara entre domínio, persistência e regras de negócio demonstra aderência aos princípios de:

* **Alta coesão modular**, com cada módulo concentrando responsabilidades específicas;  

* **Separação de responsabilidades**, evitando sobreposição de lógica entre camadas;  

* **Segurança baseada em escopo**, assegurando acesso controlado às informações;  

* **Clareza semântica do domínio**, facilitando o entendimento do sistema por desenvolvedores e stakeholders.

Essa estrutura arquitetural atende simultaneamente aos requisitos acadêmicos exigidos em projetos de formação técnica e superior, bem como às boas práticas profissionais adotadas em sistemas corporativos. Assim, o projeto mostra-se adequado para aplicações institucionais e governamentais, servindo como referência para soluções semelhantes no contexto do setor público.

[image1]: \<data:image/png;base64,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>
