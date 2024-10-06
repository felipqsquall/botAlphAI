// src/model/player/activatePlayerByID.ts
import { PrismaClient } from '@prisma/client';
import { Client } from 'whatsapp-web.js'; // Importa o tipo Client do whatsapp-web.js

const prisma = new PrismaClient();

export async function activatePlayerByID(client: Client) {
  client.on('message', async (msg) => {
    if (msg.body.startsWith('!ativaid')) {
      const args = msg.body.split(' ').slice(1);
      if (args.length < 1) {
        client.sendMessage(msg.from, 'Erro: Comando inválido. Use !ativaplayer <ID>');
      } else {
        const id = parseInt(args[0], 10);

        try {
          const player = await prisma.erpPlayer.update({
            where: { id },
            data: { is_active: true },
          });

          if (player) {
            client.sendMessage(msg.from, `Jogador ${player.name} (${player.nick}) foi ativado com sucesso!`);
          } else {
            client.sendMessage(msg.from, 'Erro ao ativar jogador. Verifique se o ID está correto.');
          }
        } catch (error) {
          console.error('Erro ao ativar jogador:', error);
          client.sendMessage(msg.from, 'Erro ao ativar jogador.');
        }
      }
    }
  });
}
