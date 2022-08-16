import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { S3Helper } from '../../helpers/s3Helper';
import { TodosAccess } from '../../helpers/todosAccess'
import { createLogger } from '../../utils/logger'

const todosAccess = new TodosAccess()
const logger = createLogger('todos')

export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = '1234'
  //toImplement authorization
  const item = await todosAccess.getTodoById(todoId)
  if(item.Count == 0){
      logger.error(`user ${userId} requesting upload url for todo item that do not exist with id ${todoId}`)
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
      logger.error(`user ${userId} requesting upload url for todo item that belongs to another user. Todo id ${todoId}`)
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
  
  const url = new S3Helper().getPresignedUrl(todoId)
  return {
      statusCode:200 ,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          ['uploadUrl']:url
    })
    }
}