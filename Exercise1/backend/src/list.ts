import dynamoDB from "./libs/dynamoDB";
import { success, failure } from "./libs/response";

export async function main() {
  const params = {
    TableName: process.env.tableName
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}
