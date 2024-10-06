import { google } from 'googleapis';
import mime from 'mime-types';
import fs from 'fs';
// Função para criar subdiretório no Google Drive
export async function createSubdirectory(auth, parentFolderId, subdirectoryName) {
    const driveService = google.drive({ version: 'v3', auth });
    const existingFolderResponse = await driveService.files.list({
        q: `'${parentFolderId}' in parents and name='${subdirectoryName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
        spaces: 'drive'
    });
    if (existingFolderResponse.data.files.length > 0) {
        console.log('Subdiretório já existe:', existingFolderResponse.data.files[0].id);
        return existingFolderResponse.data.files[0].id;
    }
    else {
        const fileMetadata = {
            name: subdirectoryName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId]
        };
        const folder = await driveService.files.create({
            requestBody: fileMetadata, // Usar requestBody ao invés de resource
            fields: 'id'
        });
        if (folder && folder.id) {
            console.log('Subdiretório criado com sucesso:', folder.id);
            return folder.id;
        }
        else {
            throw new Error('Erro ao criar subdiretório');
        }
    }
}
// Função para fazer upload no Google Drive
export async function uploadToGoogleDrive(auth, fileName, filePath, parentFolderId) {
    const driveService = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        name: fileName,
        parents: [parentFolderId]
    };
    const media = {
        mimeType: mime.lookup(filePath) || undefined,
        body: fs.createReadStream(filePath)
    };
    const response = await driveService.files.create({
        requestBody: fileMetadata, // Usar requestBody ao invés de resource
        media: media,
        fields: 'id'
    });
    if (response && response.id) {
        console.log('Arquivo enviado com sucesso:', response.id);
        return response;
    }
    else {
        throw new Error('Erro ao fazer upload do arquivo');
    }
}
