import { APIGatewayProxyEvent, APIGatewayProxyResult,APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
//import * as middy from 'middy'
//import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { TodosAccess } from '../../helpers/todosAccess'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  //skipping auth part for now
  const userId = '1234' 
  logger.info(`create group for user ${userId} with data ${newTodo}`)
  const item = await new TodosAccess().CreateTodo(newTodo,userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item:item
    })
    }
  }
