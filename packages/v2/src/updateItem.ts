import { getClient } from "./getClient";

export const updateItem = async (params: any) =>
  getClient().updateItem(params).promise();
