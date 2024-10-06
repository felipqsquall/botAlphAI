import { Client, Message } from 'whatsapp-web.js';

export const help = (client: Client) => {
  client.on('message', (message: Message) => {
    if (message.body === '!ajuda' || message.body === '!AJUDA') {
      const txtMensagem = `Digite *!todos* para realizar a marcação de todos os membros.

Digite *!aviso* seguido de sua mensagem para realizar a marcação fantasma e notificar todos os membros, mesmo que o grupo esteja silenciado.

Digite *!ping* para testar o BotShaka.

Digite *!contato* Para entrar em contato com o Desenvolvedor.

*****PARA ADMS da Guilda*****

Para adicionar um player na Guilda use o comando: !addplayer ID Nick Nome Telefone

Para Inativar um player através do nro. de telefone na Guilda use o comando: !inativatel <Telefone com DDI e sem espaços> Exemplo: 5511991234567

Para Inativar um player através do ID na Guilda use o comando: !inativaid ID

Para ativar um player através do ID na Guilda use o comando: !ativaid ID

Para ativar um player através do nro. de telefone na Guilda use o comando: !ativatel <Telefone com DDI e sem espaços> Exemplo: 5511991234567`;

      message.reply(txtMensagem);
    }
  });
};
