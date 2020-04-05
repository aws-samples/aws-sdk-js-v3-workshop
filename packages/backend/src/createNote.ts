import crypto from "crypto";
import { putItem } from "@aws-sdk-workshop/v2";
import { success, failure } from "./libs/response";
import { APIGatewayEvent } from "aws-lambda";

const handler = async (event: APIGatewayEvent) => {
  const data = JSON.parse(event.body || "{}");
  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
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
    await putItem(params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
};

export { handler };
