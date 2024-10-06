import { Client, Message } from 'whatsapp-web.js';

export const contact = (client: Client) => {
  client.on('message', (message: Message) => {
    if (message.body === '!contato' || message.body === '!CONTATO') {
      const txtMensagem = `*Desenvolvido por Felipe Rosa*\n\nEm caso de problemas ou sugestões de melhorias basta enviar um email para feliperosait@gmail.com`;
      message.reply(txtMensagem);
    }
  });
};
