import { Client, GroupChat } from 'whatsapp-web.js';

export const ghostMentions = (client: Client) => {
  client.on('message', async (msg) => {
    if (msg.body.startsWith('!ghost')) {
      try {
        const chat = await msg.getChat();
        if (chat.isGroup) {
          const groupChat = chat as GroupChat;
          const mentions = groupChat.participants.map(p => p.id._serialized); // Extraindo o ID como string
          await groupChat.sendMessage(`Ghost Mentions: ${mentions.join(' ')}`, { mentions });
          console.log('Ghost mentions enviados');
        }
      } catch (error) {
        console.error('Erro ao enviar ghost mentions:', error);
      }
    }
  });
};
