import schedule from 'node-schedule';
export const sendAlertMessage = (client, groupId, alertCloseTimes) => {
    const sendAlertMessage = async (time) => {
        try {
            const chat = await client.getChatById(groupId);
            if (chat.isGroup && chat.name.includes('GRUPO')) {
                const groupChat = chat;
                const participants = groupChat.participants.map(({ id: { _serialized } }) => _serialized);
                let mensagem = '';
                // Verifica o horário para determinar a mensagem
                if (time === '13:00') {
                    mensagem = '*Começou a GvG Tchutchucos!!!* Grupo C, Ataque Liberado.';
                }
                else if (time === '14:30') {
                    mensagem = '*Atenção Grupo C*, faltam 30 minutos para finalizar os ataques. Quem ainda não atacou, ataque!!!';
                }
                else if (time === '15:00') {
                    mensagem = '*Atenção Grupo B*, Ataque Liberado.';
                }
                else if (time === '16:30') {
                    mensagem = '*Atenção Grupo B*, faltam 30 minutos para finalizar os ataques. Quem ainda não atacou, ataque!!!';
                }
                else if (time === '17:00') {
                    mensagem = '*Atenção Grupo A*, Ataque Liberado.';
                }
                // Remova o uso de 'caption' no primeiro envio
                await client.sendMessage(groupId, 'Marcando todos escondido', { mentions: participants });
                // Aguardar 3 segundos e enviar a mensagem de ataque
                delay(3000).then(async () => {
                    await client.sendMessage(groupId, mensagem, { mentions: participants });
                });
            }
        }
        catch (error) {
            console.error(`Erro ao enviar alerta para o grupo ${groupId} às ${time}:`, error);
        }
    };
    // Agenda as mensagens de alerta
    alertCloseTimes.forEach(time => {
        const [hour, minute] = time.split(':');
        schedule.scheduleJob({ hour: parseInt(hour), minute: parseInt(minute), dayOfWeek: [new schedule.Range(1, 6)] }, () => sendAlertMessage(time));
    });
    // Função de delay para aguardar um tempo específico
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
