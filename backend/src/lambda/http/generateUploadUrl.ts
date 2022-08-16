import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {generateUploadUrl} from '../../businessLogic/ToDo'


export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //print the event received by the lamda func
  //get todoId from the event data
  //call the generateUploadUrl func to query the item  from the db and generate rfequred url
  
  console.log('Processing Event ', event)
  const todoId = event.pathParameters.todoId
    
  const URL = await generateUploadUrl(todoId)
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      uploadUrl: URL,
    })
  }
}