// src/model/player/addPlayer.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function addPlayer(client) {
    client.on('message', async (msg) => {
        if (msg.body.startsWith('!addplayer')) {
            const args = msg.body.split(' ').slice(1);
            if (args.length < 4) {
                client.sendMessage(msg.from, 'Erro: Comando inválido. Use !addplayer <ID> <Nick> <Nome> <Telefone>');
            }
            else {
                const [id, nick, name, phone] = args;
                try {
                    // Adiciona o jogador ao banco de dados
                    const player = await prisma.erpPlayer.create({
                        data: {
                            id: parseInt(id, 10),
                            nick,
                            name,
                            phone,
                        },
                    });
                    client.sendMessage(msg.from, `Jogador ${player.name} (${player.nick}) adicionado com sucesso!`);
                }
                catch (error) {
                    console.error('Erro ao adicionar jogador:', error);
                    client.sendMessage(msg.from, 'Erro ao adicionar jogador. Verifique se o telefone já está cadastrado ou se os dados estão corretos.');
                }
            }
        }
    });
}
