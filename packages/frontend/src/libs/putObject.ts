import { s3Client } from "./s3Client";
import { FILES_BUCKET } from "../config.json";

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client
    .putObject({
      Key,
      Body: file,
      Bucket: FILES_BUCKET,
    })
    .promise();
  return Key;
};

export { putObject };
