import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function saveProfileImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Profile picture must be a JPEG, PNG, or WEBP image");
  }
  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    throw new Error("Profile picture must be smaller than 2MB");
  }

  const extension = file.type.split("/")[1];
  const filename = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "students");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  // NOTE: local disk storage works for a single-instance/dev deployment only.
  // Swap this for S3/Cloudinary/Vercel Blob before deploying to serverless infra.
  return `/uploads/students/${filename}`;
}
