import { Client, GroupChat, Message } from 'whatsapp-web.js';

export const guildInfo = (client: Client) => {
  client.on('message', async (msg: Message) => {
    if (msg.body === null) return;
    
    const acao = msg.body.split(" ");
    const comando = acao[0].toLowerCase();

    // Comando para enviar informações da guilda
    if (comando === "!guild") {
      const chat = await msg.getChat();
      if (chat.isGroup) {
        const groupChat = chat as GroupChat; // Converte para GroupChat
        const participants = groupChat.participants;
        const admins = participants.filter(p => p.isAdmin);
        const adminMapped = admins.map(a => a.id._serialized);

        const admin = adminMapped.find(autor => autor === msg.author);
        if (admin !== undefined) {
          const txtMensagem = `ID: 37901102

Tag: 气

Web: https://eneasredpill.com/

Comunidade: https://chat.whatsapp.com/HcuJY3SX6pR6zSHLwQIDKn

PDF:  https://rb.gy/i3fgtl

Contatos: https://docs.google.com/spreadsheets/d/1tfMC0wnL6h8YPiEFJQjnJdzNRtdWOYWAGZBbgjqyODk/edit?usp=sharing

Drive: https://drive.google.com/drive/folders/1gpAhAvgykgUQa6PWMaoOhCMevte0BxeD?usp=sharing

Drive dos prints da sua conta: https://drive.google.com/drive/folders/1iivltFz3vx4pymO5bvqs-qntlSdIRUaJ?usp=drive_link

Finalidade dos grupos:
* Deepweb: Nenhuma;
* GvG: Organização da temporada de GvG;
* Alpha/Bravo: Eram para organização da temporada de Relics. Mas a próxima temporada teremos uma organização mais elaborada.

Contatos de suporte da EneasRedpill:
admin@eneasredpill.com
+552198138-9149

Contatos de suporte da Wanda no SSLOJ:
seiyaloj@gmail.com
https://instagram.com/saintseiyaloj.global?igshid=MzRlODBiNWFlZA==`;

          await groupChat.sendMessage(txtMensagem);
          msg.delete(true);
        }
      }
    }
  });
};
