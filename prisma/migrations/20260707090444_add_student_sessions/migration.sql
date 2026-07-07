-- CreateTable
CREATE TABLE "student_sessions" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "student_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_sessions_token_hash_key" ON "student_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "student_sessions_student_id_idx" ON "student_sessions"("student_id");

-- AddForeignKey
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
