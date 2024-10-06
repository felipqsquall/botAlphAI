export const contact = (client) => {
    client.on('message', (message) => {
        if (message.body === '!contato' || message.body === '!CONTATO') {
            const txtMensagem = `*Desenvolvido por Felipe Rosa*\n\nEm caso de problemas ou sugestões de melhorias basta enviar um email para feliperosait@gmail.com`;
            message.reply(txtMensagem);
        }
    });
};
