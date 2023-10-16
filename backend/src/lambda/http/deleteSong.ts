import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteSong } from '../../helpers/songs'
import { getUserId } from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Remove a TODO item by id
        let songId: string = event.pathParameters.songId
        let response: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        let id: string = getUserId(event)
        let ms = await deleteSong(id, songId)
        response = {
            statusCode: 204,
            body: ms
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