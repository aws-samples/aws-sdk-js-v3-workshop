import { s3Client } from "./s3Client";
import { S3_BUCKET } from "../config.json";

const getObjectUrl = async (fileName: string) =>
  s3Client.getSignedUrlPromise("getObject", {
    Key: fileName,
    Bucket: S3_BUCKET,
  });

export { getObjectUrl };
