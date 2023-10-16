import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/songs'
import { getUserId } from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
        let id: string = getUserId(event)
        let songId: string = event.pathParameters.songId
        let url = await createAttachmentPresignedUrl(id, songId)
        let res: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        if (url != "") {
            res = {
                statusCode: 201,
                body: JSON.stringify({
                    uploadUrl: url
                })
            }
        } else {
            res = {
                statusCode: 500,
                body: "Created item fail!"
            }
        }
        return res;
    }
)

handler.use(httpErrorHandler()).use(
    cors({
        origin: '*',
        credentials: true
    })
)