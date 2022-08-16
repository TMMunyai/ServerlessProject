import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {updateToDo} from '../../businessLogic/ToDo';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //print the event received by the lamda func
  //check authorization status
  //parse the event data received into newTodo variable of type UpdateTodoRequest interface
  //call updateToDo function to push updates to the databse and return results upon completion

  console.log('Processing Event ', event);
  const authorization = event.headers.Authorization;
  const splitAuth = authorization.split(' ');
  const jwtTokenAUth = splitAuth[1];

  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  const toDoItem = await updateToDo(updatedTodo, todoId, jwtTokenAUth);

  return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
          'item': toDoItem
      }),
  }
};
