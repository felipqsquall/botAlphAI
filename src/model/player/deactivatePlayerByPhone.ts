// src/model/player/deactivatePlayerByPhone.ts
import { PrismaClient } from '@prisma/client';
import { Client } from 'whatsapp-web.js'; // Importa o tipo Client do whatsapp-web.js

const prisma = new PrismaClient();

export async function deactivatePlayerByPhone(client: Client) {
  client.on('message', async (msg) => {
    if (msg.body.startsWith('!inativatel')) {
      const args = msg.body.split(' ').slice(1);
      if (args.length < 1) {
        client.sendMessage(msg.from, 'Erro: Comando inválido. Use !inativaplayer <telefone>');
      } else {
        const phone = args[0];

        try {
          // Inativa o jogador pelo telefone no banco de dados
          const player = await prisma.erpPlayer.updateMany({
            where: { phone },
            data: { is_active: false },
          });

          if (player.count > 0) {
            client.sendMessage(msg.from, `Jogador com telefone ${phone} foi inativado com sucesso!`);
          } else {
            client.sendMessage(msg.from, 'Erro ao inativar jogador. Verifique se o telefone está correto.');
          }
        } catch (error) {
          console.error('Erro ao inativar jogador:', error);
          client.sendMessage(msg.from, 'Erro ao inativar jogador. Verifique se o telefone está correto ou se ocorreu algum problema no processo.');
        }
      }
    }
  });
}
