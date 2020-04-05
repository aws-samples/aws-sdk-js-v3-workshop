import { getClient } from "./getClient";

export const scan = async (params: any) => getClient().scan(params).promise();
