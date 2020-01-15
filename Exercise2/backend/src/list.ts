import dynamoDBClient from "./libs/dynamoDB";
import { success, failure } from "./libs/response";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export async function main() {
  const params = {
    TableName: process.env.tableName
  };

  try {
    // @ts-ignore
    const result = await dynamoDBClient.send(new ScanCommand(params));
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}
