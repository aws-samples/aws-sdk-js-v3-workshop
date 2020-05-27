import dynamoDB from "./libs/dynamoDB";
import { success, failure } from "./libs/response";

export const handler = async () => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
