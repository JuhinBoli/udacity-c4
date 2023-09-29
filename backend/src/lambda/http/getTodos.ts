import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';
import { TodoItem } from '../../models/TodoItem'

// TODO: Get all TODO items for a current user
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        let id: string = getUserId(event)
        let todos: TodoItem[] = await getTodosForUser(id)
        let response: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>
        if (todos != null) {
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    items: todos
                })
            }
        } else {
            response = {
                statusCode: 500,
                body: 'Cannot get todo'
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