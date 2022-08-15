import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new DocumentClient()
const uuid = require('uuid/v4')
const todosTable = process.env.TODO_TABLE
const userIdIndex = process.env.USER_ID_INDEX

export class TodosAccess{ async getUserTodos(userId: string): Promise<TodoItem[]>{
        const result = await docClient.query({
            TableName: todosTable,
            IndexName: userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId':userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }

    async CreateTodo(request: CreateTodoRequest,userId: string): Promise<TodoItem>{
        const newTodoId = uuid()

        //how to instantiate interface

        const item = new TodoItem ()
        item.userId= userId
        item.todoId= newTodoId
        item.dueDate= request.dueDate
        item.createdAt= new Date().toISOString()
        item.name= request.name
        item.done= false
        
        await docClient.put({
            TableName: todosTable,
            Item: item
        }).promise()

        return item
    } 

    async getTodoById(id: string): Promise<AWS.DynamoDB.QueryOutput>{
        return await docClient.query({
            TableName: todosTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues:{
                ':todoId': id
            }
        }).promise()
    }

    async deleteTodoById(todoId: string){
        const param = {
            TableName: todosTable,
            Key:{
                "todoId":todoId
            }
        }
      
         await docClient.delete(param).promise()
    }

    async updateTodo(updatedTodo:UpdateTodoRequest, todoId:string){
        await docClient.update({
            TableName: todosTable,
            Key:{
                'todoId':todoId
            },
            UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
            ExpressionAttributeValues: {
                ':n' : updatedTodo.name,
                ':d' : updatedTodo.dueDate,
                ':done' : updatedTodo.done
            },
            ExpressionAttributeNames:{
                "#namefield": "name"
              }
          }).promise()
    }


}