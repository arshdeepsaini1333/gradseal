-- AlterTable: add nullable first so existing rows aren't rejected
ALTER TABLE "certificates" ADD COLUMN "certificate_name" TEXT;

-- Backfill existing certificates (issued before this column existed) with the
-- student's account name, since we can't ask them retroactively.
UPDATE "certificates" c
SET "certificate_name" = COALESCE(NULLIF(TRIM(s.first_name || ' ' || s.last_name), ''), 'GradSeal Learner')
FROM "students" s
WHERE c."student_id" = s.id AND c."certificate_name" IS NULL;

-- Now that every row has a value, enforce NOT NULL for all future inserts.
ALTER TABLE "certificates" ALTER COLUMN "certificate_name" SET NOT NULL;
