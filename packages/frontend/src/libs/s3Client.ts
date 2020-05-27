import AWS from "aws-sdk";
import { IDENTITY_POOL_ID } from "../config.json";

const s3Client = new AWS.S3({
  region: "us-west-2",
  credentials: new AWS.CognitoIdentityCredentials(
    {
      IdentityPoolId: IDENTITY_POOL_ID,
    },
    {
      region: "us-west-2",
    }
  ),
});

export { s3Client };
