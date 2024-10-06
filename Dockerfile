# Usar uma imagem oficial do Node.js
FROM node:20

# Instalar dependências necessárias para o Puppeteer e Chromium
RUN apt-get update && apt-get install -y \
    git \
    wget \
    ca-certificates \
    fonts-liberation \
    --no-install-recommends

# Instalar dependencias manualmente
RUN apt-get update && apt-get -y install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2 chromium

# Definir variáveis de ambiente do Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Copiar o arquivo recomendationsEneas.txt
COPY recomendationsEneas.txt ./recomendationsEneas.txt

# Instalar as dependências do projeto
RUN npm install

# Copiar o código para o diretório de trabalho
COPY . .

# Expor a porta usada pela aplicação
EXPOSE 8000

# Comando para iniciar o bot
CMD ["npm", "start"]
