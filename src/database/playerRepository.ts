// src/database/playerRepository.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Interface do jogador para garantir tipagem ao passar dados
interface PlayerData {
  id: number;
  nick: string;
  name: string;
  phone: string;
}

export async function addPlayer(data: PlayerData) {
  try {
    const player = await prisma.erpPlayer.create({
      data: {
        id: data.id,
        nick: data.nick,
        name: data.name,
        phone: data.phone,
      },
    });
    console.log('Jogador adicionado:', player);
    return player;
  } catch (err) {
    console.error('Erro ao adicionar jogador:', err.message);
    return null;
  }
}

export async function getPlayerByPhone(phone: string) {
  try {
    const player = await prisma.erpPlayer.findFirst({
      where: {
        phone: {
          contains: phone, // LIKE '%telefone%'
        },
      },
    });
    return player;
  } catch (err) {
    console.error('Erro ao buscar jogador por telefone:', err.message);
    return null;
  }
}

export async function deactivatePlayerByID(id: number) {
  try {
    const player = await prisma.erpPlayer.update({
      where: { id },
      data: { is_active: false },
    });
    console.log('Jogador inativado:', player);
    return player;
  } catch (err) {
    console.error('Erro ao inativar jogador:', err.message);
    return null;
  }
}

export async function activatePlayerByID(id: number) {
  try {
    const player = await prisma.erpPlayer.update({
      where: { id },
      data: { is_active: true },
    });
    console.log('Jogador ativado:', player);
    return player;
  } catch (err) {
    console.error('Erro ao ativar jogador:', err.message);
    return null;
  }
}
