-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "email_otp" TEXT,
ADD COLUMN     "last_otp_sent_at" TIMESTAMP(3),
ADD COLUMN     "otp_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3);
