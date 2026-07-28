import "server-only";
import { randomUUID } from "node:crypto";
import { uploadPublicObject } from "@/lib/aws/s3";

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
  const key = `profilephoto/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  return uploadPublicObject(key, buffer, file.type);
}
