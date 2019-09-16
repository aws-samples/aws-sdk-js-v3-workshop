import crypto from "crypto";
import dynamoDB from "./libs/dynamoDB";
import { success, failure } from "./libs/response";

export async function main(event) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      noteId: {
        S: crypto.randomBytes(20).toString("hex")
      },
      content: {
        S: data.content
      },
      createdAt: { N: Date.now().toString() }
    }
  };

  if (data.attachment) {
    // @ts-ignore
    params.Item.attachment = {
      S: data.attachment
    };
  }

  try {
    await dynamoDB.putItem(params).promise();
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
