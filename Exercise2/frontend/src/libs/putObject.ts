import s3Client from "./s3Client";
import config from "../config";
import { PutObjectCommand } from "@aws-sdk/client-s3-browser/commands/PutObjectCommand";

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client.send(
    new PutObjectCommand({
      Key,
      Body: file,
      Bucket: config.s3Bucket,
      ACL: "public-read"
    })
  );
  return Key;
};

export default putObject;
