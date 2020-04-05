import DynamoDB from "aws-sdk/clients/dynamodb";

export const getClient = () => new DynamoDB({});
