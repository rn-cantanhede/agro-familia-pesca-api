# Security Policy

## Supported Versions

Atualmente, apenas a versão mais recente do projeto recebe atualizações de segurança.

| Version | Supported |
|---|---|
| Latest | ✅ |
| Older versions | ❌ |

---

# Reporting a Vulnerability

A segurança do **Agro Família Pesca** é uma prioridade.

Se você identificar uma vulnerabilidade de segurança, **não abra uma Issue pública**.

Em vez disso, entre em contato com o mantenedor utilizando o método de contato informado no repositório (perfil do GitHub ou outro canal oficial).

Ao reportar uma vulnerabilidade, inclua, sempre que possível:

- descrição detalhada da vulnerabilidade;
- impacto esperado;
- passos para reproduzir;
- ambiente utilizado;
- versão afetada;
- evidências (logs, prints ou vídeos, quando aplicável);
- sugestão de correção (opcional).

---

# Response Process

Após o recebimento do relatório:

1. O recebimento será confirmado assim que possível.
2. A vulnerabilidade será analisada.
3. Caso confirmada, uma correção será desenvolvida.
4. Após a correção, será publicada uma nova versão do projeto.

---

# Disclosure Policy

Solicitamos que vulnerabilidades não sejam divulgadas publicamente antes da disponibilização de uma correção.

A divulgação responsável ajuda a proteger os usuários do projeto.

---

# Security Best Practices

Este projeto busca seguir boas práticas de segurança, incluindo:

- autenticação baseada em JWT e gerenciamento de sessões;
- controle de acesso por níveis de permissão (RBAC) e Policies;
- restrição de acesso aos dados por escopo institucional, utilizando `BaseScope`;
- validação de entradas;
- consultas parametrizadas com Knex para reduzir o risco de SQL Injection;
- sanitização de dados quando aplicável;
- proteção contra XSS quando aplicável;
- utilização de Helmet, conforme a configuração da aplicação;
- rate limiting no login e nos endpoints em que o middleware `apiLimiter` está aplicado;
- suporte opcional ao Redis para armazenamento compartilhado dos limites de requisições, quando configurado;
- gerenciamento seguro de variáveis de ambiente;
- utilização de bcrypt para hash de senhas;
- logs estruturados para auxiliar no diagnóstico e na investigação de eventos de segurança;
- testes automatizados para componentes críticos de autenticação, autorização, rate limiting e escopo de dados.

O rate limiting complementa os mecanismos de autenticação, autorização e validação, mas não os substitui.

O `BaseScope` deve aplicar os filtros de escopo diretamente às consultas ao banco de dados. Quando a coluna de escopo esperada não estiver disponível, a consulta não deve prosseguir sem o filtro de segurança correspondente.

Segredos, senhas, tokens completos e credenciais de infraestrutura não devem ser registrados nos logs nem enviados ao controle de versão.

---

# Scope

Esta política se aplica ao código-fonte oficial do projeto e aos componentes mantidos neste repositório.

Não cobre sistemas modificados por terceiros.

---

# Acknowledgements

Contribuições responsáveis para melhoria da segurança são muito bem-vindas e ajudam a tornar o projeto mais seguro para toda a comunidade.