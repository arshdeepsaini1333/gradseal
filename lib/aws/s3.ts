import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    // The SDK defaults to signing a CRC32 checksum into every request,
    // including presigned URLs — but the presigner signs it against an
    // empty body (the real file isn't available yet), so a browser PUT
    // of actual file content fails signature validation. Only compute
    // checksums when a caller explicitly asks for one.
    requestChecksumCalculation: "WHEN_REQUIRED",
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

// Returns a short-lived URL the browser can PUT a file to directly, plus the
// permanent public URL it'll be reachable at afterwards. Used for large
// course video/image uploads, which are too big to route through a Server
// Action (1MB request body limit).
export async function createUploadUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const uploadUrl = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 300 }
  );

  return { uploadUrl, publicUrl: `https://${bucket}.s3.${region}.amazonaws.com/${key}` };
}
