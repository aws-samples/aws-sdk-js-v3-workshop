import { deleteItem } from "@aws-sdk-workshop/v2";
import { success, failure } from "./libs/response";
import { APIGatewayProxyEvent } from "aws-lambda";

const handler = async (event: APIGatewayProxyEvent) => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'noteId': path parameter
    Key: {
      noteId: {
        S: event.pathParameters?.id,
      },
    },
  };

  try {
    await deleteItem(params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
};

export { handler };
