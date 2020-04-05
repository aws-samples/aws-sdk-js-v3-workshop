import { getClient } from "./getClient";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

export const deleteItem = async (params: any) =>
  getClient().send(new DeleteItemCommand(params));
