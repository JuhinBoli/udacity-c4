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
    private table: string
    private documentClient: DocumentClient

    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient({ service: XAWS })
        this.table = process.env.TODOS_TABLE
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info(`Create item has Id ${todoItem.todoId}`)
        await this.documentClient.put({TableName: this.table, Item: todoItem, ReturnValues: 'NONE'}).promise();
        logger.info(`Create item success`)
        return todoItem;
    }

    async getTodoFromUserId(userId: string): Promise<TodoItem[]> {
        logger.info(`get todo of ${userId}`)
        let result = await this.documentClient
            .query({
                TableName: this.table,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {':userId': userId}
            }).promise()
        let todoItem = result.Items
        logger.info(`get todo success`)
        return todoItem as TodoItem[]
    }

    async updateTodoItem(userId: string, todoId: string, dataUpdate: TodoUpdate): Promise<void> {
        logger.info(`update item has todoId ${todoId}`)
        await this.documentClient
            .update({
                TableName: this.table,
                Key: { userId, todoId },
                UpdateExpression: 'set #nameTodo = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: { '#nameTodo': 'name' },
                ExpressionAttributeValues: {
                    ':name': dataUpdate.name,
                    ':dueDate': dataUpdate.dueDate,
                    ':done': dataUpdate.done
                }
            }).promise()
        logger.info(`update item success`)
    }

    async deleteTodoItem(id: string, todoId: string): Promise<void> {
        logger.info(`delete item has id + ${todoId}`)
        await this.documentClient.
            delete({
                TableName: this.table, 
                Key: { id, todoId }
            }).promise()
        logger.info(`delete item success`)
    }

    async updateTodoAttachment(id: string, todoId: string, attachmentUrl: string): Promise<void> {
        logger.info(`update item attachment has id + ${todoId}`)
        await this.documentClient
            .update({
                TableName: this.table,
                Key: { id, todoId },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {':attachmentUrl': attachmentUrl},
            }).promise()
        logger.info(`update item attachment success`)
    }
}