import { DeleteObjectCommand } from "@aws-sdk/client-s3-browser/commands/DeleteObjectCommand";
import { s3Client } from "./s3Client";
import { config } from "../config";

const deleteObject = async (fileName: string) =>
  s3Client.send(
    new DeleteObjectCommand({
      Key: fileName,
      Bucket: config.s3Bucket
    })
  );

export { deleteObject };
