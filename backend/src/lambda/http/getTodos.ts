import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {getAllToDo} from '../../businessLogic/ToDo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //print the event received by the lamda func
  //check authorization status -- remove spaces from the header data
  //call the getAllToDo func to query the item  from the db and generate list of all todos
  //return results upon completion

  console.log("Processing Event ", event)
  const authorization = event.headers.Authorization
  const splitAuth = authorization.split(' ')
  const jwtTokenAuth = splitAuth[1]

  const toDos = await getAllToDo(jwtTokenAuth)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      'items': toDos,
    }),
  }
}
