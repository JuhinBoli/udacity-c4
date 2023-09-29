import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodos } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Update a TODO item with the provided id using values in the "updateTodoRequest" object
        let updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)
        let id: string = getUserId(event)
        let todoId: string = event.pathParameters.todoId
        let response: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        let ms = await updateTodos(id, todoId, updateTodoRequest)
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