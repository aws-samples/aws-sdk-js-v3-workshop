import { s3Client } from "./s3Client";
import { S3_BUCKET } from "../config.json";

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client
    .putObject({
      Key,
      Body: file,
      Bucket: S3_BUCKET,
    })
    .promise();
  return Key;
};

export { putObject };
