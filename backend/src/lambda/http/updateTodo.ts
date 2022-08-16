import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodosAccess } from '../../helpers/todosAccess'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todos')
const todosAccess = new TodosAccess()

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = '1234'
  
  const item = await todosAccess.getTodoById(todoId)

  if(item.Count == 0){
      logger.error(`user ${userId} requesting to update a TODO that does not exist with ID ${todoId}`)
      return {
          statusCode:400 ,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
              message:'Error! TODO does not exist'
        })
        }
  } 

  if(item.Items[0].userId !== userId){
      logger.error(`user ${userId} requesting to update a todo item, ID ${todoId} , that belong to another user `)
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

  logger.info(`User ${userId} updating group ${todoId} to be ${updatedTodo}`)
  await new TodosAccess().updateTodo(updatedTodo,todoId)
  return {
      statusCode:204 ,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          message:'Update successful'
    })
    }

}