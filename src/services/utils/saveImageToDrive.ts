import { Client } from 'whatsapp-web.js';
import { google } from 'googleapis';
import mime from 'mime-types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { createSubdirectory, uploadToGoogleDrive } from './googleDriveHelpers.js';

// Inicializar o Prisma Client
const db = new PrismaClient();

// Para resolver o problema do __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Variável para manter o controle de locks por jogador
const folderLocks = new Map();

export const saveImageToDrive = (client: Client) => {
    client.on('message', async (msg) => {
        if (!msg.from.endsWith('@g.us')) { // Verifica se a mensagem é de um chat privado
            if (msg.hasMedia) {
                try {
                    const media = await msg.downloadMedia();
                    if (media && media.mimetype && media.mimetype.startsWith('image/')) {
                        const fileName = `image_${Date.now()}.jpg`;
                        const uploadDir = path.join(__dirname, '../../uploads');

                        // Verifica se a pasta uploads existe, caso contrário, cria-a
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }

                        const filePath = path.join(uploadDir, fileName);

                        // Salva a imagem localmente
                        fs.writeFileSync(filePath, media.data, { encoding: 'base64' });
                        console.log('Imagem baixada e salva localmente:', filePath);

                        // Busca o jogador pelo telefone (primeiro passo)
                        const telefone = msg.from.replace('@c.us', '').slice(-8); // Captura os últimos 8 dígitos
                        const player = await db.erpPlayer.findUnique({
                            where: { phone: telefone }
                        });

                        if (player) {
                            const folderName = `${player.nick}_${player.id}`;
                            console.log('Jogador encontrado:', player.nick);

                            // Configuração da autenticação Google
                            const auth = new google.auth.JWT({
                                keyFile: path.join(__dirname, '../../config/credentials.json'),
                                scopes: ['https://www.googleapis.com/auth/drive.file']
                            });

                            // Usar uma trava (lock) por jogador para evitar a criação de múltiplas pastas
                            if (!folderLocks.has(player.id)) {
                                folderLocks.set(player.id, new Promise(async (resolve, reject) => {
                                    try {
                                        const userSubdirectoryId = await createSubdirectory(auth, '1jncuW7XyFpcgPpTWOR0Llh_kPekoisa3', folderName);
                                        resolve(userSubdirectoryId);
                                    } catch (error) {
                                        reject(error);
                                    }
                                }));
                            }

                            try {
                                const userSubdirectoryId = await folderLocks.get(player.id);

                                // Faz upload para o subdiretório do Google Drive
                                const uploadPromise = uploadToGoogleDrive(auth, fileName, filePath, userSubdirectoryId);

                                await uploadPromise;
                                console.log('Arquivo enviado para o Google Drive com sucesso:', fileName);

                                // Exclui o arquivo local após o upload
                                fs.unlinkSync(filePath);
                                console.log('Arquivo local excluído:', filePath);

                                // Remove o lock após a conclusão
                                folderLocks.delete(player.id);
                            } catch (error) {
                                console.error('Erro ao verificar/criar a pasta no Google Drive:', error);
                                folderLocks.delete(player.id); // Libera o lock mesmo em caso de erro
                            }
                        } else {
                            console.log('Jogador não encontrado para o telefone:', telefone);
                        }
                    } else {
                        console.log('A mídia recebida não é uma imagem.');
                    }
                } catch (error) {
                    console.error('Erro ao baixar a mídia:', error);
                }
            }
        }
    });
};
