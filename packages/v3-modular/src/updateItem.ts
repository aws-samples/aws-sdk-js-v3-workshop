import { getClient } from "./getClient";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export const updateItem = async (params: any) =>
  getClient().send(new UpdateItemCommand(params));
