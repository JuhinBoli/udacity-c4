import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateSong } from '../../businessLogic/songs'
import { UpdateSongRequest } from '../../requests/UpdateSongRequest'
import { getUserId } from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Update a TODO item with the provided id using values in the "UpdateSongRequest" object
        let UpdateSongRequest: UpdateSongRequest = JSON.parse(event.body)
        let id: string = getUserId(event)
        let songId: string = event.pathParameters.songId
        let response: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        let ms = await updateSong(id, songId, UpdateSongRequest)
        if (ms != "") {
            response = {
                statusCode: 200,
                body: ms
            }
        } else {
            response = {
                statusCode: 500,
                body: 'Update fail'
            }
        }

        return response
    }
)

handler.use(httpErrorHandler()).use(
    cors({
        origin: '*',
        credentials: true
    })
)