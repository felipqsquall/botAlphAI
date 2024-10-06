// src/services/playerService.ts
import { addPlayer, getPlayerByPhone, deactivatePlayerByID, activatePlayerByID } from '../database/playerRepository';

export async function registerNewPlayer(playerData: { id: number, nick: string, name: string, phone: string }) {
  // Aqui você pode adicionar validações, como verificar se o jogador já existe
  const existingPlayer = await getPlayerByPhone(playerData.phone);
  if (existingPlayer) {
    throw new Error('Jogador com esse telefone já existe');
  }

  // Adiciona o novo jogador
  return await addPlayer(playerData);
}
