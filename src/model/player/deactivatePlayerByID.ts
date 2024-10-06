// src/model/player/deactivatePlayerByID.ts
import { PrismaClient } from '@prisma/client';
import { Client } from 'whatsapp-web.js'; // Importa o tipo Client do whatsapp-web.js

const prisma = new PrismaClient();

export async function deactivatePlayerByID(client: Client) {
  client.on('message', async (msg) => {
    if (msg.body.startsWith('!inativaid')) {
      const args = msg.body.split(' ').slice(1);
      if (args.length < 1) {
        client.sendMessage(msg.from, 'Erro: Comando inválido. Use !inativaplayer <ID>');
      } else {
        const id = parseInt(args[0], 10);

        try {
          // Inativa o jogador pelo ID no banco de dados
          const player = await prisma.erpPlayer.update({
            where: { id },
            data: { is_active: false },
          });

          if (player) {
            client.sendMessage(msg.from, `Jogador ${player.name} (${player.nick}) foi inativado com sucesso!`);
          } else {
            client.sendMessage(msg.from, 'Erro ao inativar jogador. Verifique se o ID está correto.');
          }
        } catch (error) {
          console.error('Erro ao inativar jogador:', error);
          client.sendMessage(msg.from, 'Erro ao inativar jogador. Verifique se o ID está correto ou se ocorreu algum problema no processo.');
        }
      }
    }
  });
}
