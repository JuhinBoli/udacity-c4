import { SongsAccess } from '../dataLayer/songsAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { SongItem } from '../models/SongItem'
import { CreateSongRequest } from '../requests/CreateSongRequest'
import { UpdateSongRequest } from '../requests/UpdateSongRequest'
import * as uuid from 'uuid'
import { SongUpdate } from '../models/SongUpdate'
import { URL } from 'url'

// TODO: Implement businessLogic
const songsAccess = new SongsAccess()
const attachmentUtils = new AttachmentUtils()

export async function getSongsForUser(userId: string): Promise<SongItem[]> {
    return await songsAccess.getSongFromUserId(userId)
}

export async function createSongs(id: string, request: CreateSongRequest): Promise<SongItem> {
    let newSong: SongItem = {
        userId: id,
        songId: uuid.v4(),
        name: request.name,
        author: request.author,
        singer: request.singer,
        createdAt: new Date().toISOString(),
        releaseDate: request.releaseDate,
        done: false,
        attachmentUrl: ''
    }
    return await songsAccess.createSongItem(newSong)
}

export async function createAttachmentPresignedUrl(id: string, songsId: string): Promise<string> {
    let url: string = await attachmentUtils.createAttachmentPresignedUrl(songsId);
    let urlObj = new URL(url)
    urlObj.search = "";
    await songsAccess.updateSongAttachment(id, songsId, urlObj.toString());
    return url;
}

export async function updateSong(userId: string, songsId: string, UpdateSongRequest: UpdateSongRequest): Promise<string> {
    await songsAccess.updateSongItem(userId, songsId, UpdateSongRequest as SongUpdate);
    return "Update success songId" + songsId;
}

export async function deleteSong(id: string, songsId: string): Promise<string> {
    await songsAccess.deleteSongItem(id, songsId);
    return "Delete success songId" + songsId;
}
