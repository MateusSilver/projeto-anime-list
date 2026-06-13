# My Anime List Pro - Projeto Fullstack

Este é um sistema robusto de gerenciamento de listas de animes, desenvolvido para demonstrar competências em arquitetura de software corporativa, integração com bancos de dados em nuvem e desenvolvimento Fullstack.

## Arquitetura do Projeto

O projeto é estruturado como um monorepo, facilitando a governança do código e o deploy contínuo.

### Backend Java Spring Boot

- **Framework:** Spring Boot 4.0.6
- **Linguagem:** Java 25
- **Persistência:** Spring Data JPA / Hibernate
- **Banco de Dados:** PostgreSQL (Hospedado via Neon.tech)
- **Segurança:** Planejado para Spring Security + JWT
- **Recursos implementados:** - Mapeamento Relacional entre Usuários e Animes.
  - Script de ETL customizado para importação de dados via XML.
  - API REST inicial para listagem de dados.

### Frontend Next.js + Bootstrap

- **Framework:** Next.js 14 (App Router)
- **Estilização:** Bootstrap 5
- **Integração:** Consumo de API REST via Fetch API/Axios.

## Plano de Desenvolvimento

- [x] Setup do Backend e Conexão com Banco de Dados (Neon).
- [x] Modelagem de Entidades Relacionais (User <-> Anime).
- [x] Importação em lote de dados legados (XML para PostgreSQL).
- [x] Enriquecimento usando jikanAPI para addos adicionais de Títulos.
- [x] Implementação de Autenticação JWT (Backend).
- [x] Criação do Dashboard Administrativo com Next.js e Bootstrap (Frontend).
- [x] Implementação de filtros avançados e busca (Spring Query Methods).

## Adicionais

- [x] Dark mode
- [x] lucide react para icones
- [x] Resenhas em animes
- [x] Visualização de outros perfis
- [] Comentários em animes listados de outros usuários
- [] Menu

## Como rodar o projeto

1. Clone o repositório.
2. No backend, configure o seu `application.properties` com as credenciais do seu banco.
3. Execute a aplicação via IntelliJ ou `mvn spring-boot:run`.
4. Acesse a API em `http://localhost:8080/api/animes`.

```.end
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
```
