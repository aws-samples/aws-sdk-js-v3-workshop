import { getClient } from "./getClient";

export const deleteItem = async (params: any) =>
  getClient().deleteItem(params).promise();
