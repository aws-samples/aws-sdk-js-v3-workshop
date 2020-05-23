import { s3Client } from "./s3Client";
import { S3_BUCKET } from "../config.json";

const deleteObject = async (fileName: string) =>
  s3Client
    .deleteObject({
      Key: fileName,
      Bucket: S3_BUCKET,
    })
    .promise();

export { deleteObject };
