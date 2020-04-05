import { getClient } from "./getClient";

export const putItem = async (params: any) =>
  getClient().putItem(params).promise();
