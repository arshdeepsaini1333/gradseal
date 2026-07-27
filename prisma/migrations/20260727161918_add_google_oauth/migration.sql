-- AlterTable
ALTER TABLE "students" ADD COLUMN     "google_id" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "date_of_birth" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "pincode" DROP NOT NULL,
ALTER COLUMN "highest_qualification" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_google_id_key" ON "students"("google_id");
