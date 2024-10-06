# Usar uma imagem oficial do Node.js
FROM node:20

# Instalar Git no contêiner
RUN apt-get update && apt-get install -y git

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o código para o diretório de trabalho
COPY . .

# Expor a porta usada pela aplicação
EXPOSE 8000

# Comando para iniciar o bot
CMD ["npm", "start"]
