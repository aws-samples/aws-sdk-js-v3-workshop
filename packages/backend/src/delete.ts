import dynamoDB from "./libs/dynamoDB";
import { success, failure } from "./libs/response";

export async function main(event) {
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
    await dynamoDB.deleteItem(params).promise();
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
