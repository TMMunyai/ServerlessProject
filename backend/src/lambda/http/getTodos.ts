import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import { S3Helper } from '../../helpers/s3Helper'
import { TodosAccess } from '../../helpers/todosAccess'

const s3Helper = new S3Helper()
const logger = createLogger('todos')

// TODO: Get all TODO items for a current user
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //skipping auth part for now
  const userId = '1234' 
  logger.info(`get groups for user ${userId}`)
  const result = await new TodosAccess().getUserTodos(userId)
    
  for(const recordItem of result){
      recordItem.attachmentUrl = await s3Helper.getTodoAttachmentUrl(recordItem.todoId)
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items:result
    })
    }
  }