import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWSClient(new AWS.DynamoDB())
const logger = createLogger('todosAccess')
// TODO: Implement the dataLayer logic
export class TodosAccess {
    private documentClient: DocumentClient
    private todosTable: string

    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient({ service: XAWS })
        this.todosTable = process.env.TODOS_TABLE
    }

    async getTodoFromUserId(userId: string): Promise<TodoItem[]> {
        logger.info(`get Todos of userId ${userId}`)
        const result = await this.documentClient
            .query({
                TableName: this.todosTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {':userId': userId}
            }).promise()
        const items = result.Items
        return items as TodoItem[]
    }

    async createTodoItem(item: TodoItem): Promise<TodoItem> {
        logger.info(`Create Todo Item has Id ${item.todoId}`)
        await this.documentClient.put({TableName: this.todosTable, Item: item, ReturnValues: 'NONE'}).promise()
        return item
    }

    async updateTodoItem(userId: string, todoId: string, dataUpdate: TodoUpdate): Promise<void> {
        logger.info(`Update todo item has todoId ${todoId}`)
        await this.documentClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                UpdateExpression: 'set #nameTodo = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: { '#nameTodo': 'name' },
                ExpressionAttributeValues: {
                    ':name': dataUpdate.name,
                    ':dueDate': dataUpdate.dueDate,
                    ':done': dataUpdate.done
                }
            }).promise()
    }

    async deleteTodoItem(userId: string, todoId: string): Promise<void> {
        logger.info(`delete todo item has id + ${todoId}`)
        await this.documentClient.delete({TableName: this.todosTable, Key: { userId, todoId }}).promise()
    }

    async updateTodoAttachment(userId: string, todoId: string, attachmentUrl: string): Promise<void> {
        logger.info(`update todo item attachment has id + ${todoId}`)
        await this.documentClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {':attachmentUrl': attachmentUrl},
            }).promise()
    }
}