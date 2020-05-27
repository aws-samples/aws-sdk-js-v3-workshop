import crypto from "crypto";
import dynamoDB from "./libs/dynamoDB";
import { success, failure } from "./libs/response";

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
  const data = JSON.parse(event.body || "{}");
  const params = {
    TableName: process.env.NOTES_TABLE_NAME || "",
    Item: {
      noteId: {
        S: crypto.randomBytes(20).toString("hex"),
      },
      content: {
        S: data.content,
      },
      createdAt: { N: Date.now().toString() },
    },
  };

  if (data.attachment) {
    // @ts-ignore: Property 'attachment' does not exist on type
    params.Item.attachment = {
      S: data.attachment,
    };
  }

  try {
    await dynamoDB.putItem(params).promise();
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};
