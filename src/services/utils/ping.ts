import { Client, Message } from 'whatsapp-web.js';

export const ping = (client: Client) => {
  client.on('message', async (message: Message) => {
    if (message.body === '!ping' || message.body === '!PONG') {
      message.reply('pong');
    }
  });
};
