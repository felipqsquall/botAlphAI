export const markAll = (client) => {
    client.on('message', async (msg) => {
        if (msg.body === '!marcarTodos') {
            try {
                const chat = await msg.getChat();
                if (chat.isGroup) {
                    const groupChat = chat; // Faz um cast para GroupChat
                    const mentions = groupChat.participants.map(p => p.id._serialized); // Extrai o ID como string
                    await groupChat.sendMessage(`Marcando todos: ${mentions.join(' ')}`, { mentions });
                    console.log('Todos os participantes foram marcados');
                }
            }
            catch (error) {
                console.error('Erro ao marcar todos:', error);
            }
        }
    });
};
