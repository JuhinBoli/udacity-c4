import { apiEndpoint } from '../config'
import { Song } from '../types/Song';
import { CreateSongRequest } from '../types/CreateSongRequest';
import Axios from 'axios'
import { UpdateSongRequest } from '../types/UpdateSongRequest';

export async function getSongs(idToken: string): Promise<Song[]> {
  console.log('Fetching songs')

  const response = await Axios.get(`${apiEndpoint}/songs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Songs:', response.data)
  return response.data.items
}

export async function createSong(
  idToken: string,
  newSong: CreateSongRequest
): Promise<Song> {
  const response = await Axios.post(`${apiEndpoint}/songs`,  JSON.stringify(newSong), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchSong(
  idToken: string,
  songId: string,
  updatedSong: UpdateSongRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/songs/${songId}`, JSON.stringify(updatedSong), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteSong(
  idToken: string,
  songId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/songs/${songId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  songId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/songs/${songId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
