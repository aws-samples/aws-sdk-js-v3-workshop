import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const getClient = () => new DynamoDBClient({});
