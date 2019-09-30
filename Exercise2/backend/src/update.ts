import dynamoDBClient from "./libs/dynamoDB";
import { success, failure } from "./libs/response";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb-node";

export async function main(event) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'noteId': path parameter
    Key: {
      noteId: { S: event.pathParameters.id }
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content",
    ExpressionAttributeValues: {
      ":content": {
        S: data.content
      }
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    // @ts-ignore
    await dynamoDBClient.send(new UpdateItemCommand(params));
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
