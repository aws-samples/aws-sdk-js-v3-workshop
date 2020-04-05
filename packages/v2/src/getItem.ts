import { getClient } from "./getClient";

export const getItem = async (params: any) =>
  getClient().getItem(params).promise();
