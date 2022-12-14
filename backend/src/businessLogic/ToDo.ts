import {TodoItem} from '../models/TodoItem'
import {parseUserId} from '../auth/utils'
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import {UpdateTodoRequest} from '../requests/UpdateTodoRequest'
import {TodoUpdate} from '../models/TodoUpdate'
import {ToDoAccess} from '../dataLayer/ToDoAccess'

const uuidv4 = require('uuid/v4')
const toDoAccess = new ToDoAccess()

export async function getAllToDo(jwtTokenAuth: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtTokenAuth)
    return toDoAccess.getAllTodo(userId)
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtTokenAuth: string): Promise<TodoItem> {
    const userId = parseUserId(jwtTokenAuth)
    const todoId =  uuidv4()
    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
    
    return toDoAccess.CreateTodo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    })
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtTokenAuth: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtTokenAuth)
    return toDoAccess.updateTodo(updateTodoRequest, todoId, userId)
}

export function deleteToDo(todoId: string, jwtTokenAuth: string): Promise<string> {
    const userId = parseUserId(jwtTokenAuth)
    return toDoAccess.deleteTodo(todoId, userId)
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return toDoAccess.generateUploadUrl(todoId)
}