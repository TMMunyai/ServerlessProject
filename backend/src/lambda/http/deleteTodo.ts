import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { TodosAccess } from '../../helpers/todosAccess'

const logger = createLogger('todos')
const todosAccess = new TodosAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  if(!todoId){
    logger.error('Error!! invalid delete attempt without todo id. Please include todo id')
    return {        
      statusCode:400 ,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message:'Error! invalid parameters'
      })
    }
  }

  //to implement authorization later
  const userId = '1234'
  const item = await todosAccess.getTodoById(todoId)
  if(item.Count == 0){
    logger.error(`user ${userId} requesting delete for a todo that do not exist. Id of requested TODO : ${todoId}`)
    return {
      statusCode:400 ,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        //confirm this part
        message: 'TODO with specified id does not exists'
      })
    }
  }

  if(item.Items[0].userId !== userId){
    logger.error(`user ${userId} requesting delete todo created by another user, Todo id ${todoId}`)
    return {
      statusCode:400 ,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          message:'Error! TODO owened by another user'
    })
    }
  }

  logger.info(`User ${userId} deleting todo ${todoId}`)
  await todosAccess.deleteTodoById(todoId)
  return {
    statusCode:204 ,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      messgae: 'Item with id ${todoId} deleted successfully'
    })
  }
}