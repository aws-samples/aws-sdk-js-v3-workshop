import s3Client from "./s3Client";
import config from "../config";

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`;
  await s3Client
    .putObject({
      Key,
      Body: file,
      Bucket: config.s3Bucket,
      ACL: "public-read"
    })
    .promise();
  return Key;
};

export default putObject;
