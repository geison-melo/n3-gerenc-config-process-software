# Projeto E-Commerce (Avaliação N3)

Este repositório contém a entrega final da avaliação N3 desenvolvida para a disciplina de **Gerenciamento, Configuração e Processos de Software**, parte da grade do curso de **Engenharia de Software**.

O projeto consiste em uma aplicação web full-stack para gestão de um cenário de E-Commerce, contemplando desde a criação e modelagem da API RESTful até o consumo via Front-end e a automação do ciclo de vida com CI/CD.

## Tecnologias Utilizadas

- **Back-end:** NestJS, TypeScript, Prisma ORM e SQLite
- **Front-end:** React, TypeScript, Vite e Vanilla CSS
- **CI/CD:** Drone CI integrado com Gogs
- **Documentação:** OpenAPI (Swagger)

## Como Executar Localmente

Antes de iniciar o servidor, navegue até a pasta do back-end e execute os comandos do Prisma para estruturar as tabelas do banco de dados local e atualizar o client:

```bash
cd backend
npx prisma db push
npx prisma generate
```

### 1. Back-end (API)
Navegue até a pasta `backend`, instale as dependências e inicie o servidor em modo de desenvolvimento:
```bash
cd backend
npm install
npm run start:dev
```
A API estará rodando na porta 3000. A documentação interativa do Swagger ficará disponível em: `http://localhost:3000/api`

### 2. Front-end (Interface Web)
Abra um novo terminal, navegue até a pasta `frontend` e rode a aplicação:
```bash
cd frontend
npm install
npm run dev
```

### 3. Infraestrutura CI/CD Local (Gogs + Drone CI)

O projeto conta com uma infraestrutura local orquestrada via Docker Compose, provendo um servidor Git privado (Gogs) e um servidor de Integração Contínua (Drone CI).

Para iniciar os servidores em segundo plano, execute na raiz do projeto:
```bash
docker-compose up -d
```

> **Painéis de Acesso:**
> - **Gogs (Repositório):** `http://192.168.1.99:3030`
> - **Drone CI (Esteira):** `http://192.168.1.99:8088`
> *(O IP `192.168.1.99` pode ser ajustado no docker-compose.yml e na URL caso a rede Wi-Fi seja alterada).*

Após o envio do código para o servidor Gogs (`git push gogs main`), a esteira configurada no arquivo `.drone.yml` é disparada automaticamente, realizando o isolamento do código, instalação de dependências, testes unitários, build e simulação de deploy de forma segura.

---
**Alternativa ao Gogs+Drone CI: Drone CLI**
Caso ocorram problemas na rede (Webhooks), as esteiras do `.drone.yml` podem ser executadas e validadas localmente via terminal sem a interface do Gogs. Certifique-se de que o **Docker** está rodando e utilize os executáveis presentes na raiz:
```bash
./drone.exe exec --pipeline backend-ci
./drone.exe exec --pipeline frontend-ci
```

## Integrantes da Equipe

- Arthur Bretzke
- Davi Simplício
- Gabriel Koehler
- Geison Carlos Melo
- Jonatas Jackson Gonçalves
- Kaique Fernandes
- Wesley Diorrani Ferreira
