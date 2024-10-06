import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import express from 'express';
import http  from 'http';
import socketIO from 'socket.io';
import qrcode from 'qrcode';
import fileUpload from 'express-fileupload';
import axios  from 'axios';
import fs from 'fs';
import path from 'path';
import { body, validationResult } from 'express-validator';
import { mime } from 'mime-types';
import { schedule } from 'node-schedule';
import { google } from 'googleapis';
const app =  express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 8000;
import { fileURLToPath } from 'url';

// Function Groups Impo
import { changeGroupName } from './services/group/changeGroupName.js';
import { welcomeNewMembers } from './services/group/welcomeNewMembers.js';
import { sendAlertMessage } from './services/group/sendAlertMessage.js';
import { ghostMentions } from './services/group/ghostMentions.js';
import { markAll } from './services/group/markAll.js';
// Utils Impo;
import { cleanMessages } from './services/utils/cleanMessages.js';
import { help } from './services/utils/help.js';
import { contact } from './services/utils/contact.js';
import { ping } from './services/utils/ping.js';
import { addPlayer } from './model/player/addPlayer.js';
import { deactivatePlayerByID } from './model/player/deactivatePlayerByID.js';
import { deactivatePlayerByPhone } from './model/player/deactivatePlayerByPhone.js';
import { activatePlayerByID } from './model/player/activatePlayerByID.js';
import { activatePlayerByPhone } from './model/player/activatePlayerByPhone.js';
import { saveImageToDrive } from './services/utils/saveImageToDrive.js';

//GPT Functions Import
import { gptEneas } from '../modules/gptFunctions/gptEneas.js';
import { chatGPT } from '../modules/gptFunctions/chatGPT.js';

//General Messages Import
import { guildInfo } from './services/guild/guildInfo.js';

function delay(t, v) {
  return new Promise(function(resolve) { 
      setTimeout(resolve.bind(null, v), t)
  });
}

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(fileUpload({
  debug: false
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", express.static(__dirname + "/"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'botAlphAI' }),
  puppeteer: { headless: true,
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't work in Windows
      '--disable-gpu'
    ] }
});

client.setMaxListeners(20);

client.initialize();

io.on('connection', function(socket) {
  socket.emit('message', 'botAlphAI - Iniciado');
  socket.emit('qr', '../loading.svg');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', '© botAlphAI QRCode recebido, aponte a câmera  seu celular!');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'botAlphAI Dispositivo pronto!');
    socket.emit('message', 'botAlphAI Dispositivo pronto!');
    socket.emit('qr', '../check.svg');
    console.log('botAlphAI Dispositivo pronto');
  });

  client.on('authenticated', () => {
    socket.emit('authenticated', 'botAlphAI Autenticado!');
    socket.emit('message', 'botAlphAI Autenticado!');
    console.log('botAlphAI Autenticado');
  });

  client.on('auth_failure', function() {
    socket.emit('message', 'botAlphAI Falha na autenticação, reiniciando...');
    console.error('botAlphAI Falha na autenticação');
  });

  client.on('change_state', state => {
    console.log('botAlphAI Status de conexão: ', state );
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'botAlphAI Cliente desconectado!');
    console.log('botAlphAI Cliente desconectado', reason);
    client.initialize();
  });
});

//EXECUÇÃO DAS AÇÕES EXTERNAS

const groupId = '120363198603699526@g.us'; // ID do grupo que você quer monitorar
const alertCloseTimes = ['13:00', '14:30', '15:00', '16:30', '17:00']; // Horários de alerta para Ataque de Grupo
const groupNameChangeTime = '22:30'; // Horário para alterar o nome do grupo

client.on('ready', async () => {

  // Chama a função para limpar as mensagens
  cleanMessages(client);

  // Chama a função para alterar o nome do grupo
  changeGroupName(client, groupId, groupNameChangeTime);

  // Chama a função para enviar mensagens de alerta
  sendAlertMessage(client, groupId, alertCloseTimes);

  // Chama a função para enviar mensagens de boas-vindas
  welcomeNewMembers(client);

  // Chama a função de marcação Fantasma
  ghostMentions(client);

  // Chama a função para marcar todos os participantes
  markAll(client);

  // Chama a função para enviar informações da guilda
  guildInfo(client);

  // Chama a função para interagir com o ChatGPT com contexto Eneas
  //gptEneas(client);

  // Chama a função para interagir com o ChatGPT
  //chatGPT(client);

  // Chama a função de ajuda com o uso do Bot
  help(client);

  // Chama a função de contato com o desenvolvedor
  contact(client);

  // Chama a função de PING
  ping(client);
  
  // Chama a função para salvar imagens no Google Drive
  saveImageToDrive(client);
  
  // Chama a função para adicionar jogador
  addPlayer(client);

  // Chama a função para inativar um jogador pelo ID
  deactivatePlayerByID(client);

  // Chama a função para inativar um jogador pelo Telefone
  deactivatePlayerByPhone(client);

  // Chama a função para ativar um jogador pelo Telefone
  activatePlayerByID(client);
  
  // Chama a função para ativar um jogador pelo Telefone
  activatePlayerByPhone(client);
});

const apiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = 'sk-proj-4kL6glBZCaMmJvZ8qGatT3BlbkFJ3voUusLaZaQ9iIe3W498';


const recommendationsFilePath = path.join(__dirname, '../recomendationsEneas.txt');
const recommendationsText = fs.readFileSync(recommendationsFilePath, 'utf8');

// Função para truncar o texto das recomendações
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const chatGPTRequest = async (message) => {
  try {
    const messages = [
      { role: 'system', content: 'Você é um assistente que responde com base nas seguintes recomendações de um jogo de celular, falando de maneira bem informal e pode usar palavrões e gírias.' },
      { role: 'system', content: `Texto de Recomendações: ${recommendationsText}` }, //${truncatedRecommendationsText}
      { role: 'user', content: `Baseando-se exclusivamente nas recomendações fornecidas, responda à seguinte pergunta: ${message}` },
    ];

    const response = await axios.post(
      apiUrl,
      {
        model: 'chatgpt-4o-latest',
        messages: messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    return reply;
  } catch (error) {
    console.error('Erro ao chamar a API do ChatGPT:', error.response ? error.response.data : error.message);
  }
};

client.on('message', async (msg) => {
  if (msg.body.startsWith('!gpt')) {
    const mensagem = msg.body.replace('!gpt', '').trim();
    const reply = await chatGPTRequest(mensagem);
    client.sendMessage(msg.from, reply);
  }
});

server.listen(port, function() {
  console.log(`botAlphAI está rodando na porta ${port}`);
});
