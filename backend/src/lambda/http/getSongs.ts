import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getSongsForUser } from '../../businessLogic/songs'
import { getUserId } from '../utils';
import { SongItem } from '../../models/SongItem'

// TODO: Get all TODO items for a current user
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        let id: string = getUserId(event)
        let songs: SongItem[] = await getSongsForUser(id)
        let response: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        if (songs != null) {
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    items: songs
                })
            }
        } else {
            response = {
                statusCode: 500,
                body: 'Cannot get song'
            }
        }
        return response
    }
)

handler.use(
    cors({
        origin: '*',
        credentials: true
    })
)