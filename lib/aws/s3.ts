import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "us-east-1";
const bucket = process.env.AWS_S3_BUCKET || "gradseal";

let client: S3Client | null = null;

function getS3Client(): S3Client {
  if (client) return client;
  client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  return client;
}

// Uploads to a bucket/prefix that's expected to already have a public-read
// policy, and returns the object's direct, permanent HTTPS URL — the same
// shape as the external URLs Google login already stores in `profileImage`.
export async function uploadPublicObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
