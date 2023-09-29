import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodos } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Remove a TODO item by id
        let todoId: string = event.pathParameters.todoId
        let response: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        let userId: string = getUserId(event)
        let ms = await deleteTodos(userId, todoId)
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