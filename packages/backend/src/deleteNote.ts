import dynamoDB from "./libs/dynamoDB";
import { success, failure } from "./libs/response";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'noteId': path parameter
    Key: {
      noteId: {
        S: event?.pathParameters?.id,
      },
    },
  };

  try {
    await dynamoDB.deleteItem(params).promise();
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
