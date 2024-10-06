import { Client } from 'whatsapp-web.js';

export const welcomeNewMembers = (client: Client) => {
  client.on('group_join', async (notification) => {
    const chat = await notification.getChat();
    if (chat.isGroup) {
      const message = `Bem-vindo(a), ${notification.author}! 🎉`;
      await client.sendMessage(chat.id._serialized, message);
      console.log(`Mensagem de boas-vindas enviada para ${notification.author}`);
    }
  });
};
