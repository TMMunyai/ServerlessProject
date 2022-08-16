import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {deleteToDo} from '../../businessLogic/ToDo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //print the event received by the lamda func
  //check authorization status -- remove spaces from the header data
  //get todoId from the event data
  //call the deteteTodo func to query the item  from the db and delete if found in the db

  console.log('Processing Event ', event)
  const authorization = event.headers.Authorization
  const splitAuth = authorization.split(' ')
  const jwtTokenAuth = splitAuth[1]

  const todoId = event.pathParameters.todoId

  const deletedData = await deleteToDo(todoId, jwtTokenAuth)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: deletedData,
  }
}
