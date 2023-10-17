import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { SongItem } from '../models/SongItem'
import { SongUpdate } from '../models/SongUpdate';
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWSClient(new AWS.DynamoDB())
const logger = createLogger('songsAccess')
// TODO: Implement the dataLayer logic
export class SongsAccess {
    private table: string
    private documentClient: DocumentClient

    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient({ service: XAWS })
        this.table = process.env.SONGS_TABLE
    }

    async createSongItem(SongItem: SongItem): Promise<SongItem> {
        logger.info(`Create item has Id ${SongItem.songId}`)
        await this.documentClient.put({TableName: this.table, Item: SongItem, ReturnValues: 'NONE'}).promise();
        logger.info(`Create item success`)
        return SongItem;
    }

    async getSongFromUserId(userId: string): Promise<SongItem[]> {
        logger.info(`get song of ${userId}`)
        let result = await this.documentClient
            .query({
                TableName: this.table,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {':userId': userId}
            }).promise()
        let SongItem = result.Items
        logger.info(`get song success`)
        return SongItem as SongItem[]
    }

    async updateSongItem(userId: string, songId: string, dataUpdate: SongUpdate): Promise<void> {
        logger.info(`update item has songId ${songId}`)
        await this.documentClient
            .update({
                TableName: this.table,
                Key: { userId, songId },
                UpdateExpression: 'set #nameSong = :name, author = :author, singer = :singer, done = :done',
                ExpressionAttributeNames: { '#nameSong': 'name' },
                ExpressionAttributeValues: {
                    ':name': dataUpdate.name,
                    ':author': dataUpdate.author,
                    ':singer': dataUpdate.singer,
                    ':done': dataUpdate.done
                }
            }).promise()
        logger.info(`update item success`)
    }

    async deleteSongItem(userId: string, songId: string): Promise<void> {
        logger.info(`delete item has id + ${songId}`)
        await this.documentClient.
            delete({
                TableName: this.table, 
                Key: { userId, songId }
            }).promise()
        logger.info(`delete item success`)
    }

    async updateSongAttachment(userId: string, songId: string, attachmentUrl: string): Promise<void> {
        logger.info(`update item attachment has id + ${songId}`)
        await this.documentClient
            .update({
                TableName: this.table,
                Key: { userId, songId },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {':attachmentUrl': attachmentUrl},
            }).promise()
        logger.info(`update item attachment success`)
    }
}