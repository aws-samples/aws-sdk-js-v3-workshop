import { s3Client } from "./s3Client";
import { config } from "../config";

const deleteObject = async (fileName: string) =>
  s3Client
    .deleteObject({
      Key: fileName,
      Bucket: config.s3Bucket
    })
    .promise();

export { deleteObject };
