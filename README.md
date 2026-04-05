# AutoData Transaction API

API em NestJS para migração automatizada de dados entre APIs REST, com arquitetura hexagonal, logs de execução, retry de falhas e validação de compatibilidade de campos.

## Objetivo

Permitir que uma transação de migração seja configurada com:

- API de origem (exportação)
- API de destino (importação)
- Exemplo de JSON de origem e destino

A aplicação tenta mapear os campos automaticamente por nome da chave.

- Se as chaves forem iguais: mapeia automaticamente.
- Se houver divergência: informa os campos sem correspondência e orienta o uso de `manualMappings`.

## Stack

- NestJS 11
- TypeScript
- MongoDB + Mongoose
- Swagger
- Throttler (rate limit global)
- Jest + Supertest (e2e)
- Docker + Docker Compose

## Arquitetura

O projeto está organizado em arquitetura hexagonal por módulos:

- `export-api`
- `import-api`
- `transaction`
- `migration-log`
- `shared`

Cada módulo segue camadas:

- `domain` (entidades e portas)
- `application` (DTOs e casos de uso)
- `infrastructure` (controllers, schemas, repositórios)

## Fluxo de Migração

1. Cadastrar API de exportação com `dtoSample` (JSON de exemplo da origem).
2. Cadastrar API de importação com `dtoSample` (JSON de exemplo do destino).
3. Verificar compatibilidade (`/transactions/check-compatibility`).
4. Criar transação:
- Se houver compatibilidade total: sem `manualMappings`.
- Se houver incompatibilidade: informar `manualMappings`.
5. Executar transação (`/transactions/:id/execute`).
6. Consultar logs e, se necessário, executar retry (`/migration-logs/retry`).

## Compatibilidade Automática

### Cenário compatível (sem intervenção)

Origem:

```json
{
  "name": "Carlos Marques",
  "email": "carlos@example.com"
}
```

Destino:

```json
{
  "name": "",
  "email": ""
}
```

Resultado: mapeamento automático (`name -> name`, `email -> email`).

### Cenário incompatível (precisa de `manualMappings`)

Origem:

```json
{
  "nome": "Carlos Marques",
  "email": "carlos@example.com"
}
```

Destino:

```json
{
  "name": "",
  "field": ""
}
```

Resultado: API retorna campos sem correspondência e orienta, por exemplo:

- `nome -> name`
- `email -> field`

## Variáveis de Ambiente

### `.env` (execução local)

```env
PORT=4000
MONGODB_URI=mongodb://mongo:27017/autodata
```

### `.env.prod` (compose de produção)

```env
PORT=4000
MONGODB_URI=mongodb://mongo:27017/autodata
```

## Executar Localmente

### 1) Instalar dependências

```bash
npm install
```

### 2) Subir apenas o MongoDB (ambiente dev)

```bash
docker compose up -d
```

### 3) Rodar API localmente

```bash
npm run start:dev
```

### 4) Acessar documentação Swagger

- http://localhost:4000/swagger

## Executar com Docker (API + Mongo)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Para parar:

```bash
docker compose -f docker-compose.prod.yml down
```

## Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

## Endpoints

### 1. Export APIs

- `POST /export-apis` - Criar configuração
- `GET /export-apis` - Listar todas
- `GET /export-apis/:id` - Buscar por ID
- `PUT /export-apis/:id` - Atualizar configuração
- `DELETE /export-apis/:id` - Remover

Exemplo de criação:

```json
{
  "name": "Legacy API",
  "baseUrl": "https://legacy.example.com",
  "endpoint": "/customers",
  "method": "GET",
  "authType": "none",
  "dtoSample": {
    "customer_id": 1,
    "name": "Ana"
  },
  "rateLimit": {
    "requests": 10,
    "windowMs": 1000
  }
}
```

### 2. Import APIs

- `POST /import-apis` - Criar configuração
- `GET /import-apis` - Listar todas
- `GET /import-apis/:id` - Buscar por ID
- `PUT /import-apis/:id` - Atualizar configuração
- `DELETE /import-apis/:id` - Remover

Exemplo de criação:

```json
{
  "name": "Target API",
  "baseUrl": "https://target.example.com",
  "endpoint": "/clients",
  "method": "POST",
  "authType": "none",
  "dtoSample": {
    "clientId": 0,
    "fullName": ""
  }
}
```

### 3. Transactions

- `POST /transactions/check-compatibility` - Verificar compatibilidade de campos
- `POST /transactions` - Criar transação
- `GET /transactions` - Listar todas
- `GET /transactions/:id` - Buscar por ID
- `POST /transactions/:id/execute` - Executar migração
- `DELETE /transactions/:id` - Remover

#### `POST /transactions/check-compatibility`

Request:

```json
{
  "exportApiId": "ID_EXPORT",
  "importApiId": "ID_IMPORT"
}
```

Response (exemplo incompatível):

```json
{
  "compatible": false,
  "autoMapped": [],
  "unmatched": {
    "exportKeys": ["nome", "email"],
    "importKeys": ["name", "field"]
  },
  "suggestion": "Forneça manualMappings ao criar a transação para conectar os campos sem correspondência: exportKeys [nome, email] -> importKeys [name, field]"
}
```

#### `POST /transactions`

Com mapeamento automático total (sem `manualMappings`):

```json
{
  "name": "Migrar clientes",
  "exportApiId": "ID_EXPORT",
  "importApiId": "ID_IMPORT"
}
```

Com mapeamento manual:

```json
{
  "name": "Migrar clientes",
  "exportApiId": "ID_EXPORT",
  "importApiId": "ID_IMPORT",
  "manualMappings": [
    { "exportKey": "customer_id", "importKey": "clientId", "transform": "toNumber" },
    { "exportKey": "name", "importKey": "fullName", "transform": "toString" }
  ]
}
```

### 4. Migration Logs

- `GET /migration-logs`
- `GET /migration-logs/failed`
- `GET /migration-logs/transaction/:transactionId`
- `POST /migration-logs/retry`

## Retry e Cache de Falhas

Quando um registro falha no envio para a API de destino, ele é salvo em log com status `failed`.

O endpoint `POST /migration-logs/retry` reprocessa esses registros automaticamente.

## Rate Limiting

A API possui limitação global configurada via Throttler:

- `60` requisições por `60` segundos

Além disso, cada configuração de API de exportação pode ter um `rateLimit` próprio para controlar chamadas externas.

## Testes

Executar testes e2e:

```bash
npm run test:e2e
```

Estado atual: suíte e2e principal passando.

## Estrutura Simplificada

```text
src/
  modules/
    export-api/
    import-api/
    transaction/
    migration-log/
  shared/
```

## Licença

UNLICENSED
