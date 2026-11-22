-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expectedGrad" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "credits" TEXT NOT NULL,
    "description" TEXT,
    "gradeMode" TEXT,
    "attributes" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Undergraduate',
    "prereqText" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "crn" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "participation" TEXT NOT NULL DEFAULT 'In-Person',
    "instructor" TEXT,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "rating" TEXT,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "days" TEXT NOT NULL DEFAULT '',
    "startMin" INTEGER,
    "endMin" INTEGER,
    "location" TEXT,
    "online" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSchedule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "pos" INTEGER NOT NULL,

    CONSTRAINT "SavedSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SavedScheduleToSection" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SavedScheduleToSection_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE INDEX "Course_subject_number_idx" ON "Course"("subject", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Section_crn_key" ON "Section"("crn");

-- CreateIndex
CREATE INDEX "Section_courseId_idx" ON "Section"("courseId");

-- CreateIndex
CREATE INDEX "_SavedScheduleToSection_B_index" ON "_SavedScheduleToSection"("B");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSchedule" ADD CONSTRAINT "SavedSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedScheduleToSection" ADD CONSTRAINT "_SavedScheduleToSection_A_fkey" FOREIGN KEY ("A") REFERENCES "SavedSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedScheduleToSection" ADD CONSTRAINT "_SavedScheduleToSection_B_fkey" FOREIGN KEY ("B") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
