import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodos } from '../../helpers/todos'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Implement creating a new TODO item
        let createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
        let userId: string = getUserId(event)
        let res: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        let todoItem = await createTodos(userId, createTodoRequest)
        res = {
            statusCode: 201,
            body: JSON.stringify({
                item: todoItem
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