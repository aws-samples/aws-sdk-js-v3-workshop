import { scan } from "@aws-sdk-workshop/v2";
import { success, failure } from "./libs/response";

const handler = async () => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
  };

  try {
    // @ts-ignore
    const result = await scan(params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
};

export { handler };
