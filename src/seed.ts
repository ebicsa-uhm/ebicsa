import { prisma } from './lib/prisma';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';
import { courseParticipation, courseStatus, icsCourses } from './data/icsCourses';
import type { IcsCourse } from './data/icsCourses';
import { parseMeetings } from './lib/parse-meetings';

async function seedCourses() {
  const byCode = new Map<string, IcsCourse[]>();
  for (const entry of icsCourses) byCode.set(entry.code, [...(byCode.get(entry.code) ?? []), entry]);

  for (const [code, entries] of byCode) {
    const first = entries[0];
    const [subject, number] = code.split(' ');
    const courseData = {
      subject,
      number,
      title: first.title,
      credits: first.credits,
      description: first.description ?? null,
      gradeMode: first.gradeMode ?? null,
      attributes: first.attributes ?? null,
      notes: first.crn ? null : first.notes ?? null,
      status: courseStatus(code),
      prereqText: first.prerequisites ?? null,
    };
    console.log(`  Creating course: ${code}`);
    const { id: courseId } = await prisma.course.upsert({
      where: { code },
      update: courseData,
      create: { code, ...courseData },
    });

    for (const entry of entries) {
      if (!entry.crn) continue;
      const sectionData = {
        number: entry.section ?? '',
        participation: courseParticipation(entry),
        instructor: entry.faculty ?? null,
        closed: entry.closed ?? false,
        notes: entry.notes ?? null,
        rating: entry.rating ?? null,
        courseId,
      };
      const { id: sectionId } = await prisma.section.upsert({
        where: { crn: entry.crn },
        update: sectionData,
        create: { crn: entry.crn, ...sectionData },
      });
      await prisma.meeting.deleteMany({ where: { sectionId } });
      await prisma.meeting.createMany({
        data: parseMeetings(entry.schedule).map((meeting) => ({ ...meeting, sectionId })),
      });
    }
  }
}

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  for (const account of config.defaultAccounts) {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  }
  await seedCourses();
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
