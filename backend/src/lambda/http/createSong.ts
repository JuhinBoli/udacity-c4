import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateSongRequest } from '../../requests/CreateSongRequest'
import { getUserId } from '../utils';
import { createSongs } from '../../businessLogic/songs'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Implement creating a new TODO item
        let CreateSongRequest: CreateSongRequest = JSON.parse(event.body)
        let userId: string = getUserId(event)
        let res: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        let SongItem = await createSongs(userId, CreateSongRequest)
        res = {
            statusCode: 201,
            body: JSON.stringify({
                item: SongItem
            })
        }
        return res
    }
)

handler.use(
    cors({
        origin: '*',
        credentials: true
    })
)