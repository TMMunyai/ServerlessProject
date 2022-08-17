import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {createToDo} from '../../businessLogic/ToDo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //print the event received by the lamda func
  //check authorization status
  //parse the event data received into newTodo variable of type CreateTodoRequest interface
  //return results upon completion

  console.log("Processing Event ", event)
  const authorization = event.headers.Authorization
  const splitAuth = authorization.split(' ')
  const jwtTokenAuth = splitAuth[1]

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const toDoItem = await createToDo(newTodo, jwtTokenAuth)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      'item': toDoItem
    }),
  }
}
