import { Client, GroupChat } from 'whatsapp-web.js';
import schedule from 'node-schedule';

export const changeGroupName = (client: Client, groupId: string, groupNameChangeTime: string) => {
  // Função para alterar o nome do grupo
  const changeName = async () => {
    try {
      const chat = await client.getChatById(groupId);
      
      if (chat.isGroup) {
        const groupChat = chat as GroupChat; // Faz um cast para GroupChat
        const novoNome = '气 GvG - ???';
        await groupChat.setSubject(novoNome); // Agora você pode chamar setSubject
        console.log(`Nome do grupo alterado para: ${novoNome}`);
      }
    } catch (error) {
      console.error(`Erro ao alterar o nome do grupo ${groupId}:`, error);
    }
  };

  const [changeHour, changeMinute] = groupNameChangeTime.split(':');
  schedule.scheduleJob(
    { hour: parseInt(changeHour), minute: parseInt(changeMinute), dayOfWeek: [new schedule.Range(1, 6)] },
    changeName
  );
};
