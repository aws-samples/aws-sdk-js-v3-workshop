import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const getClient = () => new DynamoDB({});
