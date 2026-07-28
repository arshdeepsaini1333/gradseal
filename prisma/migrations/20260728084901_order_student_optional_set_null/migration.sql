-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_student_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "student_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
