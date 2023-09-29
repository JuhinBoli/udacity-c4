import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate'
import { URL } from 'url'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return await todosAccess.getTodoFromUserId(userId)
}

export async function createTodos(id: string, request: CreateTodoRequest): Promise<TodoItem> {
    let newTodo: TodoItem = {
        userId: id,
        todoId: uuid.v4(),
        name: request.name,
        createdAt: new Date().toISOString(),
        dueDate: request.dueDate,
        done: false,
        attachmentUrl: ''
    }
    return await todosAccess.createTodoItem(newTodo)
}

export async function createAttachmentPresignedUrl(id: string, todosId: string): Promise<string> {
    let url: string = await attachmentUtils.createAttachmentPresignedUrl(todosId);
    let urlObj = new URL(url)
    urlObj.search = "";
    await todosAccess.updateTodoAttachment(id, todosId, urlObj.toString());
    return url;
}

export async function updateTodos(id: string, todosId: string, updateTodoRequest: UpdateTodoRequest): Promise<string> {
    await todosAccess.updateTodoItem(id, todosId, updateTodoRequest as TodoUpdate);
    return "Update success todoId" + todosId;
}

export async function deleteTodos(id: string, todosId: string): Promise<string> {
    await todosAccess.deleteTodoItem(id, todosId);
    return "Delete success todoId" + todosId;
}
