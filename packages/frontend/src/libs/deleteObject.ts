import { s3Client } from "./s3Client";
import { FILES_BUCKET } from "../config.json";

const deleteObject = async (fileName: string) =>
  s3Client
    .deleteObject({
      Key: fileName,
      Bucket: FILES_BUCKET,
    })
    .promise();

export { deleteObject };
