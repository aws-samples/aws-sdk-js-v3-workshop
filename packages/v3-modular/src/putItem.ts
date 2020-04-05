import { getClient } from "./getClient";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";

export const putItem = async (params: any) =>
  getClient().send(new PutItemCommand(params));
