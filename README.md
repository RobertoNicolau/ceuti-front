
## Template Starter CRM

Projeto base usando Next 12 com export estático


![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


## Rodando localmente

- Certifique-se de estar conectado à VPN ou a rede da Datamais

Clone o projeto

```bash
  git clone http://192.168.0.190/datamais-developer/crm-template.git 
```

Entre no diretório do projeto

```bash
  cd crm-template
```

Instale as dependências

```bash
  npm install --legacy-peer-deps
```

Inicie o servidor

```bash
  npm run dev
```

Abra a URL do projeto

```bash
  http://localhost:8081/
```

## Build e Exportação

Existem 2 tipos de Exportação para o projeto, um para servidores como o da Vercel e outro para VPS que suportam apenas arquivos estáticos

### Server Build

Rodar o comando

```bash
  npm run build
```

### Static Build

Rodar o comando

```bash
  npm run export
```