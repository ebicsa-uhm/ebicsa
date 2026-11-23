/*
  Warnings:

  - Added the required column `plannedTerm` to the `SavedSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedSchedule" ADD COLUMN     "plannedTerm" TEXT NOT NULL;
