export const ghostMentions = (client) => {
    client.on('message', async (msg) => {
        if (msg.body.startsWith('!ghost')) {
            try {
                const chat = await msg.getChat();
                if (chat.isGroup) {
                    const groupChat = chat;
                    const mentions = groupChat.participants.map(p => p.id._serialized); // Extraindo o ID como string
                    await groupChat.sendMessage(`Ghost Mentions: ${mentions.join(' ')}`, { mentions });
                    console.log('Ghost mentions enviados');
                }
            }
            catch (error) {
                console.error('Erro ao enviar ghost mentions:', error);
            }
        }
    });
};
