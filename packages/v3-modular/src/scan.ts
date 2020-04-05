import { getClient } from "./getClient";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export const scan = async (params: any) =>
  getClient().send(new ScanCommand(params));
