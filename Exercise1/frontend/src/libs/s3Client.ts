import AWS from "aws-sdk";
import config from "../config";

const s3Client = new AWS.S3({
  region: "us-west-2",
  credentials: new AWS.CognitoIdentityCredentials(
    {
      IdentityPoolId: config.IdentityPoolId
    },
    {
      region: "us-west-2"
    }
  )
});

export { s3Client };
