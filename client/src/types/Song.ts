export interface Song {
  userId: string
  songId: string
  createdAt: string
  name: string
  author: string
  singer: string
  releaseDate: string
  done: boolean
  attachmentUrl?: string
}
