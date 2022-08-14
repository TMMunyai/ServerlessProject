import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

const todoTable = process.env.TODOS_TABLE
const docClient = new DocumentClient()

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = event.pathParameters.userId

    const validUserId = await userExists(userId)

    if (!validUserId) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Group does not exist'
        })
      }
    }

    const userTodo = await getUsersTodoById(userId)

    //const todos = '...'
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: userTodo
      })  
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

async function userExists(userId: string) { //check if userID ecists
  const result = await docClient
    .get({
      TableName: todoTable,
      Key: {
        id: userId
      }
    })
    .promise()

  console.log('Get group: ', result)
  return !!result.Item
}

async function getUsersTodoById(userId: string) { //if userID exits, this will be called and return todoItems for this user
  const result = await docClient.query({
    TableName: todoTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}
