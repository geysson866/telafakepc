## :ledger: Descrição do Projeto

Esse é um projeto feito para simular uma página de vendas de peças de computador. As informações são fictícias, sendo usadas apenas de forma didática para elaboração do site.

## :man_technologist: Tecnologias

Para este projeto foram utilizadas as seguintes tecnologias:

- [Next.JS](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [SASS](https://sass-lang.com/)
- [Cypress](https://www.cypress.io/)
- [FontAwesome](https://fontawesome.com/)
- [UUID](https://www.npmjs.com/package/uuid)

## :grin: Dúvidas ou sugestões?

Caso tenha alguma dúvida ou alguma sugestão fico no aguardo da sua mensagem!

## :computer: Live Demo

Para visualização de uma versão demo do site clique [aqui](https://site-vendas-fake.vercel.app/).

## :rocket: Como Hospedar

### Hospedagem em VPS Windows

1. **Instalar Node.js**
   - Baixe e instale o Node.js LTS do site oficial
   - Verifique a instalação: `node --version` e `npm --version`

2. **Preparar o projeto**
   ```bash
   npm install
   npm run build
   ```

3. **Configurar PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "pcshop" -- start
   pm2 startup
   pm2 save
   ```

4. **Configurar IIS (Internet Information Services)**
   - Instale o IIS
   - Instale o módulo iisnode
   - Configure um site apontando para a pasta do projeto
   - Configure o web.config para Node.js

### Hospedagem em CloudPanel (Linux)

1. **Criar um novo site no CloudPanel**
   - Acesse o painel do CloudPanel
   - Crie um novo site Node.js

2. **Fazer upload dos arquivos**
   ```bash
   # Via SSH ou FTP, envie todos os arquivos do projeto
   scp -r . user@servidor:/home/user/htdocs/
   ```

3. **Instalar dependências**
   ```bash
   cd /home/user/htdocs/
   npm install
   npm run build
   ```

4. **Configurar variáveis de ambiente**
   - Crie um arquivo `.env.local`:
   ```
   NODE_ENV=production
   PORT=3000
   ```

5. **Iniciar a aplicação**
   ```bash
   pm2 start npm --name "pcshop" -- start
   pm2 startup
   pm2 save
   ```

6. **Configurar Nginx (se necessário)**
   ```nginx
   server {
       listen 80;
       server_name seudominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Configurações Adicionais

1. **SSL/HTTPS**
   - Configure certificado SSL (Let's Encrypt recomendado)
   - Redirecione HTTP para HTTPS

2. **Backup**
   - Configure backup automático dos dados
   - Backup do localStorage (pedidos, configurações)

3. **Monitoramento**
   - Configure logs de erro
   - Monitore performance com PM2

4. **Segurança**
   - Configure firewall
   - Mantenha o sistema atualizado
   - Use senhas fortes para o painel admin

### Comandos Úteis

```bash
# Ver status da aplicação
pm2 status

# Ver logs
pm2 logs pcshop

# Reiniciar aplicação
pm2 restart pcshop

# Parar aplicação
pm2 stop pcshop

# Atualizar aplicação
git pull
npm install
npm run build
pm2 restart pcshop
```

