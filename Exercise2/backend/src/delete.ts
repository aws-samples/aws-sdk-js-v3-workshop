import dynamoDBClient from "./libs/dynamoDB";
import { success, failure } from "./libs/response";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb-node";
import { APIGatewayProxyEvent } from "aws-lambda";

export async function main(event: APIGatewayProxyEvent) {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'noteId': path parameter
    Key: {
      noteId: {
        S: event.pathParameters.id
      }
    }
  };

  try {
    // @ts-ignore
    await dynamoDBClient.send(new DeleteItemCommand(params));
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
