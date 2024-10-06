// src/services/playerService.ts
import { addPlayer, getPlayerByPhone } from '../database/playerRepository';
export async function registerNewPlayer(playerData) {
    // Aqui você pode adicionar validações, como verificar se o jogador já existe
    const existingPlayer = await getPlayerByPhone(playerData.phone);
    if (existingPlayer) {
        throw new Error('Jogador com esse telefone já existe');
    }
    // Adiciona o novo jogador
    return await addPlayer(playerData);
}
