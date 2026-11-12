/**
 * ICS course data for Spring 2027 (Jan 11 - May 14, 2027), transcribed from
 * UH Mānoa Star GPS schedule listings. Each CRN section is a separate entry,
 * so the same course code can appear multiple times with different times.
 * Seat counts and waitlist availability are intentionally omitted.
 */

export type Participation = 'In-Person' | 'Hybrid' | 'Online';

export type IcsCourse = {
  code: string;
  title: string;
  crn?: string;
  section?: string;
  credits: string;
  gradeMode?: string;
  attributes?: string;
  participation?: Participation;
  prerequisites?: string;
  schedule?: string;
  faculty?: string;
  description?: string;
  rating?: string;
  notes?: string;
};

const GRADE_CN = 'Letter Plus/Minus, Credit/No Credit';
const GRADE_L = 'Letter Plus/Minus';

export const icsCourses: IcsCourse[] = [
  // 100-Level: Introductory & Foundational
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '54558',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'T 10:30 AM - 11:45 AM, UHM POST 318A + Online async + T 9:00 AM - 10:15 AM, UHM ART 132',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '54562',
    section: '006',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'F 12:00 PM - 1:15 PM, UHM POST 318A + Online async + T 9:00 AM - 10:15 AM, UHM ART 132',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '55342',
    section: '004',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'Online async + T 9:00 AM - 10:15 AM, UHM ART 132 + R 10:30 AM - 11:45 AM, UHM POST 318A',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '69111',
    section: '002',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'T 12:00 PM - 1:15 PM, UHM POST 318A + Online async + T 9:00 AM - 10:15 AM, UHM ART 132',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '69112',
    section: '003',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'F 10:30 AM - 11:45 AM, UHM POST 318A + Online async + T 9:00 AM - 10:15 AM, UHM ART 132',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '69113',
    section: '005',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'T 9:00 AM - 10:15 AM, UHM ART 132 + R 12:00 PM - 1:15 PM, UHM POST 318A + Online async',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '71090',
    section: '008',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'T 9:00 AM - 10:15 AM, UHM ART 132 + F 3:00 PM - 4:15 PM, UHM POST 318A + Online async',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 101',
    title: 'Tools for the Info World',
    crn: '71092',
    section: '007',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Hybrid',
    schedule:
      'T 9:00 AM - 10:15 AM, UHM ART 132 + W 10:30 AM - 11:45 AM, UHM POST 318A + Online async',
    faculty: 'Michael-Brian Ogawa',
    description:
      'Fundamental information technology concepts and computing terminology, productivity software for problem solving, computer technology trends and impact on individuals and society. Emphasizes the utilization of operating systems and the production of professional documents, spreadsheets, etc.',
  },
  {
    code: 'ICS 110P',
    title: 'Programming: Python',
    crn: '55344',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    schedule: 'MW 1:30 PM - 2:45 PM, UHM POST 318B',
    faculty: 'Kyungim Baek',
    description:
      'Basic concepts needed to write computer programs. Simple program design and implementation using a specific programming language; (C) C; (D) through animations; (P) Python. Each alpha repeatable unlimited times, but credit earned one time only. ((P) Cross-listed as DATA 110P)',
  },
  {
    code: 'ICS 111',
    title: 'Introduction to Computer Science I',
    crn: '51174',
    section: '001',
    credits: '4',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    schedule:
      'TR 4:30 PM - 5:45 PM, UHM POST 318A + MW 10:30 AM - 11:45 AM, UHM SPAL 155',
    faculty: 'Kyle Berney',
    description:
      'Overview of the fundamentals of computer science emphasizing problem solving, algorithm development, implementation, and debugging/testing using an object-oriented programming language.',
    notes: 'Computer experience recommended',
  },
  {
    code: 'ICS 111',
    title: 'Introduction to Computer Science I',
    crn: '51908',
    section: '003',
    credits: '4',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    schedule:
      'MW 4:30 PM - 5:45 PM, UHM POST 318A + MW 10:30 AM - 11:45 AM, UHM SPAL 155',
    faculty: 'Kyle Berney',
    description:
      'Overview of the fundamentals of computer science emphasizing problem solving, algorithm development, implementation, and debugging/testing using an object-oriented programming language.',
    notes: 'Computer experience recommended',
  },
  {
    code: 'ICS 111',
    title: 'Introduction to Computer Science I',
    crn: '52047',
    section: '004',
    credits: '4',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    schedule:
      'WF 9:00 AM - 10:15 AM, UHM POST 318A + MW 10:30 AM - 11:45 AM, UHM SPAL 155',
    faculty: 'Kyle Berney',
    description:
      'Overview of the fundamentals of computer science emphasizing problem solving, algorithm development, implementation, and debugging/testing using an object-oriented programming language.',
    notes: 'Computer experience recommended',
  },
  {
    code: 'ICS 111',
    title: 'Introduction to Computer Science I',
    crn: '52925',
    section: '002',
    credits: '4',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    schedule:
      'TR 3:00 PM - 4:15 PM, UHM POST 318A + MW 10:30 AM - 11:45 AM, UHM SPAL 155',
    faculty: 'Kyle Berney',
    description:
      'Overview of the fundamentals of computer science emphasizing problem solving, algorithm development, implementation, and debugging/testing using an object-oriented programming language.',
    notes: 'Computer experience recommended',
  },
  {
    code: 'ICS 141',
    title: 'Discrete Math for CS I',
    crn: '53961',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    attributes: 'FQ',
    participation: 'In-Person',
    prerequisites: 'MATH 215, 241, or 251A (C or better)',
    schedule: 'TRF 1:30 PM - 2:45 PM, UHM POST 318A',
    faculty: 'Kyle Berney',
    description:
      'Includes logic, sets, functions, matrices, algorithmic concepts, mathematical reasoning, recursion, counting techniques, and probability theory.',
  },

  // 200-Level: Intermediate Core
  {
    code: 'ICS 211',
    title: 'Intro to Computer Science II',
    crn: '53785',
    section: '003',
    credits: '4',
    gradeMode: GRADE_CN,
    attributes: 'NI',
    participation: 'In-Person',
    prerequisites: 'ICS 111 (C or better)',
    schedule:
      'MW 9:00 AM - 10:15 AM, UHM KUY 101 + MW 3:00 PM - 4:15 PM, UHM POST 319',
    faculty: 'Kyle Berney',
    description:
      '(3 Lec, 1 3-hr. Lab) Reinforce and strengthen problem-solving skills using abstract data types and introduce software development practices. Emphasize the use of searching and sorting algorithms and their complexity, recursion, object-oriented programming, and data structures.',
  },
  {
    code: 'ICS 211',
    title: 'Intro to Computer Science II',
    crn: '52203',
    section: '002',
    credits: '4',
    gradeMode: GRADE_CN,
    attributes: 'NI',
    participation: 'In-Person',
    prerequisites: 'ICS 111 (C or better)',
    schedule:
      'MW 9:00 AM - 10:15 AM, UHM KUY 101 + TR 1:30 PM - 2:45 PM, UHM POST 319',
    faculty: 'Kyle Berney',
    description:
      '(3 Lec, 1 3-hr. Lab) Reinforce and strengthen problem-solving skills using abstract data types and introduce software development practices. Emphasize the use of searching and sorting algorithms and their complexity, recursion, object-oriented programming, and data structures.',
  },
  {
    code: 'ICS 211',
    title: 'Intro to Computer Science II',
    crn: '51653',
    section: '001',
    credits: '4',
    gradeMode: GRADE_CN,
    attributes: 'NI',
    participation: 'In-Person',
    prerequisites: 'ICS 111 (C or better)',
    schedule:
      'MW 4:30 PM - 5:45 PM, UHM POST 319 + MW 9:00 AM - 10:15 AM, UHM KUY 101',
    faculty: 'Kyle Berney',
    description:
      '(3 Lec, 1 3-hr. Lab) Reinforce and strengthen problem-solving skills using abstract data types and introduce software development practices. Emphasize the use of searching and sorting algorithms and their complexity, recursion, object-oriented programming, and data structures.',
  },
  {
    code: 'ICS 212',
    title: 'Program Structure',
    crn: '51775',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    attributes: 'NI',
    participation: 'In-Person',
    prerequisites: 'ICS 211 (C or better)',
    schedule:
      'TR 10:30 AM - 11:45 AM, UHM KUY 210 + T 1:30 PM - 2:45 PM, UHM KUY 210',
    faculty: 'Katy Tarrit Mirakhorli',
    description:
      'Program organization paradigms, programming environments, implementation of a module from specifications, the C and C++ programming languages.',
  },
  {
    code: 'ICS 212',
    title: 'Program Structure',
    crn: '52926',
    section: '002',
    credits: '3',
    gradeMode: GRADE_CN,
    attributes: 'NI',
    participation: 'In-Person',
    prerequisites: 'ICS 211 (C or better)',
    schedule:
      'W 7:30 PM - 8:45 PM, UHM POST 318A + M 6:00 PM - 8:30 PM, UHM KUY 210',
    faculty: 'Ravi Narayan',
    description:
      'Program organization paradigms, programming environments, implementation of a module from specifications, the C and C++ programming languages.',
  },
  {
    code: 'ICS 241',
    title: 'Discrete Mathematics II',
    crn: '51175',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    attributes: 'NI',
    participation: 'In-Person',
    prerequisites: 'ICS 141 (C or better)',
    schedule:
      'F 9:00 AM - 10:15 AM, UHM POST 126 + TR 9:00 AM - 10:15 AM, UHM POST 318A',
    faculty: 'Andrey Popov',
    description:
      'Includes program correctness, recurrence relations and their solutions, relations and their properties, divide and conquer relations, graph theory, trees and their applications, Boolean algebra, introduction to formal languages and automata theory.',
  },

  // 300-Level: Upper-Division Required Core
  {
    code: 'ICS 311',
    title: 'Algorithms',
    crn: '52928',
    section: '002',
    credits: '4',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'ICS 211 (C or better); see department for additional prerequisites',
    schedule: 'MW 2:00 PM - 3:40 PM, UHM POST 318A',
    faculty: 'Kyle Berney',
    description:
      '(4 1-hr Lec) Design and correctness of algorithms, including divide-and-conquer, greedy and dynamic programming methods. Complexity analyses using recurrence relations, probabilistic methods, and NP-completeness. Applications to order statistics, disjoint sets, B-trees and balanced trees, graphs, network flows, and string matching.',
  },
  {
    code: 'ICS 312',
    title: 'Machine-Level and Systems Programming',
    crn: '57042',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites:
      'ICS 311 or ECE 367 (C), ICS 212 or ECE 205 (C or concurrent), and ICS 314 (C)',
    schedule: 'MW 10:30 AM - 11:45 AM, UHM MSB 114',
    faculty: 'Peter-Michael Seidel',
    description:
      'Machine organization, machine instructions, addressing modes, assembler language, subroutine linkage, linking to higher-level languages, interface to operating systems, introduction to assemblers, loaders and compilers.',
  },
  {
    code: 'ICS 313',
    title: 'Programming Language Theory',
    crn: '70564',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites:
      'ICS 311 or ECE 367 (C), ICS 212 or ECE 205 (C), and ICS 314 (C)',
    schedule: 'TR 10:30 AM - 11:45 AM, UHM KUY 306',
    faculty: 'Kimberly Binsted',
    description:
      'Syntax, semantics, control structures, variable binding and scopes, data and control abstractions. Programming in functional (LISP) and logic (Prolog) programming styles.',
  },
  {
    code: 'ICS 314',
    title: 'Software Engineering I',
    crn: '56046',
    section: '003',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites:
      'ICS 211 or ECE 205 (C), and ICS 241, ECE 362, or MATH 301 & 372 (C)',
    schedule: 'TR 9:00 AM - 10:15 AM, UHM POST 319',
    faculty: 'David Conner',
    description:
      'Problem analysis and design, team-oriented development, quality assurance, configuration management, project planning. These topics are covered in the sequence 314-414.',
  },
  {
    code: 'ICS 314',
    title: 'Software Engineering I',
    crn: '52204',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites:
      'ICS 211 or ECE 205 (C), and ICS 241, ECE 362, or MATH 301 & 372 (C)',
    schedule: 'MW 12:00 PM - 1:15 PM, UHM POST 319',
    faculty: 'Anthony Peruma',
    description:
      'Problem analysis and design, team-oriented development, quality assurance, configuration management, project planning. These topics are covered in the sequence 314-414.',
  },
  {
    code: 'ICS 314',
    title: 'Software Engineering I',
    crn: '52436',
    section: '002',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites:
      'ICS 211 or ECE 205 (C), and ICS 241, ECE 362, or MATH 301 & 372 (C)',
    schedule: 'TR 10:30 AM - 11:45 AM, UHM POST 319',
    faculty: 'David Conner',
    description:
      'Problem analysis and design, team-oriented development, quality assurance, configuration management, project planning. These topics are covered in the sequence 314-414.',
  },
  {
    code: 'ICS 321',
    title: 'Database Systems I',
    crn: '52016',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Online',
    prerequisites: 'ICS 311 or ECE 367 (C) and ICS 314 (C)',
    schedule: 'Online async',
    faculty: 'Depeng Li',
    description:
      'Introduction to relational database systems, data modeling, query processing, transaction processing, storage, and indexing.',
  },
  {
    code: 'ICS 332',
    title: 'Operating Systems',
    crn: '53224',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'In-Person',
    prerequisites: 'ICS 311 or ECE 367 (C) and ICS 314 (C)',
    schedule: 'R 6:00 PM - 8:30 PM, UHM POST 127',
    faculty: 'Ravi Narayan',
    description:
      'Operating system concepts and structure, processes and threads, CPU scheduling, memory management, scheduling, file systems, inter-process communication, virtualization, popular operating systems. A-F only.',
  },
  {
    code: 'ICS 355',
    title: 'Security and Trust I',
    crn: '53530',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'ICS 241 or MATH 301 & 372 (C or better)',
    schedule: 'MW 1:30 PM - 2:45 PM, UHM KUY 306',
    faculty: 'Peter-Michael Seidel',
    description:
      'Security and trust in computers, networks, and society. Security models. Access and authorization. Availability and Denial-of-Service. Trust processes and network interactions.',
  },
  {
    code: 'ICS 390',
    title: 'Computing Ethics for LAs',
    crn: '51654',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    attributes: 'ETH, OC, WI',
    participation: 'Hybrid',
    prerequisites: 'Consent',
    schedule: 'T 4:30 PM - 5:45 PM, UHM POST 302 + Online async',
    faculty: 'Martha Crosby',
    description:
      'Lecture/discussion/internship on ethical issues and instructional techniques for students assisting computer sciences classes in various settings. The class uses multiple significant writing and oral presentation activities to help students learn course content.',
    notes: 'Instructor approval required',
  },

  // 400-Level & Elective Specializations
  {
    code: 'ICS 414',
    title: 'Software Engineering II',
    crn: '69109',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'In-Person',
    prerequisites: 'ICS 311 or ECE 367 (C) and ICS 314 (C)',
    schedule: 'TR 10:30 AM - 11:45 AM, UHM POST 325',
    faculty: 'Anthony Peruma',
    description:
      'Continuation of 314. Project management, quality, and productivity control, testing and validation, team management. Team-oriented software-implementation project.',
  },
  {
    code: 'ICS 425',
    title: 'Computer Security and Ethics',
    crn: '52048',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'Online',
    prerequisites: 'ICS 355 (C or better)',
    schedule: 'Online async',
    faculty: 'David Conner',
    description:
      'Theoretical results, security policy, encryption, key management, digital signatures, certificates, passwords. Ethics: privacy, computer crime, professional ethics. Effects of the computer revolution on society. A-F only. (Once a year)',
  },
  {
    code: 'ICS 426',
    title: 'Computer System Security',
    crn: '68907',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'Online',
    prerequisites: 'ICS 355 (C or better)',
    schedule: 'Online async',
    faculty: 'David Conner',
    description:
      'Information flow, confinement, information assurance, malicious programs, vulnerability analysis, network security, writing secure programs. A-F only. (Once a year)',
  },
  {
    code: 'ICS 434',
    title: 'Data Science Fundamentals',
    crn: '55409',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'In-Person',
    prerequisites: 'ICS 211 (C or better)',
    schedule: 'MW 10:30 AM - 11:45 AM, UHM POST 319',
    faculty: 'Kyungim Baek',
    description:
      'Introduction to critical statistical and probabilistic concepts that underlie data science as well as tools that play a central role in the daily work of a data scientist. A-F only. (Once a year) (Cross-listed as DATA 434)',
  },
  {
    code: 'ICS 435',
    title: 'Machine Learning Fundamentals',
    crn: '53487',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Online',
    prerequisites: 'ICS 235 (C or better)',
    schedule: 'TR 9:00 AM - 10:15 AM, Online sync',
    faculty: 'Peter Sadowski',
    description:
      'Introduction to machine learning concepts with a focus on relevant ideas from computational neuroscience. Information processing and learning in the nervous system. Neural networks. Supervised and unsupervised learning. Basics of statistical learning theory. Recommended: MATH 307. (Once a year) (Cross-listed as DATA 435)',
  },
  {
    code: 'ICS 462',
    title: 'AI for Games',
    crn: '68910',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites:
      'ICS 311 or ECE 367 (C), ICS 212 or ECE 205 (C), ICS 314 (C), and PHYS 151 or 170 (D- or better)',
    schedule: 'TR 12:00 PM - 1:15 PM, UHM KELL 103',
    faculty: 'Nurit Kirshenbaum',
    description:
      'Techniques to stimulate intelligence in video games: movement, pathfinding with A* search, decision/behavior trees, state machines, machine learning, tactics. Extend games with your own AI implementations; experience "shootout" contests for the best AI algorithm/implementation. (Alt. years)',
  },
  {
    code: 'ICS 464',
    title: 'Human Computer Interaction I',
    crn: '57299',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'ICS 311 or ECE 367 (C) and ICS 314 (C)',
    schedule: 'TR 3:00 PM - 4:15 PM, UHM POST 318B',
    faculty: 'Daniel Suthers',
    description:
      'Application of concepts and methodologies of human factors, psychology and software engineering to address ergonomic, cognitive, and social factors in the design and evaluation of human-computer systems.',
  },
  {
    code: 'ICS 469',
    title: 'Cognitive Science',
    crn: '56934',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    attributes: 'WI',
    participation: 'Online',
    prerequisites: 'ICS 311 or ECE 367 (C) and ICS 314 (C)',
    schedule: 'Online async + T 1:30 PM - 2:45 PM, Online sync',
    faculty: 'Martha Crosby',
    description:
      'Introduces basic concepts, central problems, and methods from cognitive science. Identifies contributions from disciplines such as cognitive psychology, linguistics, artificial intelligence, philosophy, and neuroscience. A-F only.',
  },
  {
    code: 'ICS 485',
    title: 'Video Game Design',
    crn: '55095',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'ICS 110, ICS 111, or CINE 215 (C or better)',
    schedule: 'W 3:00 PM - 5:30 PM, UHM KELL 103',
    faculty: 'Jason Leigh',
    description:
      'Students will team design, build, and demonstrate video games or related interactive entertainment environments and applications. Topics will include emerging computer science techniques relevant to the development of these types of environments. Junior standing or higher. (Cross-listed as CINE 487)',
  },
  {
    code: 'ICS 487',
    title: '3D Modeling and Animation',
    crn: '68908',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'In-Person',
    prerequisites: 'ICS 369 (C or better)',
    schedule: 'TR 1:30 PM - 2:45 PM, UHM POST 325',
    faculty: 'Kaveh Kardan',
    description:
      'Principles, techniques, and history of 3D computer graphics. Modeling and animation techniques will be covered, as well as basic lighting and rendering. A-F only.',
  },
  {
    code: 'ICS 488',
    title: '3D Rendering Techniques',
    crn: '57927',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'In-Person',
    prerequisites: 'ICS 369 (C or better)',
    schedule: 'MW 1:30 PM - 2:45 PM, UHM POST 319',
    faculty: 'Kaveh Kardan',
    description:
      'Software development within a commercial 3D application with a focus on scripting and plugin development for procedural modeling, animation, and shading. A-F only.',
  },
  {
    code: 'ICS 491',
    title: 'Special Topics',
    crn: '68909',
    section: '002',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Two 300-level ICS courses (C or better)',
    schedule: 'MW 12:00 PM - 1:15 PM, UHM POST 318B',
    faculty: 'Katy Tarrit Mirakhorli',
    description:
      'Reflects special interests of faculty. Oriented toward juniors and seniors. Repeatable one time for BS/CS students.',
  },
  {
    code: 'ICS 491',
    title: 'Special Topics',
    crn: '57950',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Two 300-level ICS courses (C or better)',
    schedule: 'TR 3:00 PM - 4:15 PM, UHM POST 325',
    faculty: 'Kaveh Kardan',
    description:
      'Reflects special interests of faculty. Oriented toward juniors and seniors. Repeatable one time for BS/CS students.',
  },
  {
    code: 'ICS 496',
    title: 'Capstone Project',
    crn: '55461',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'In-Person',
    prerequisites: 'ICS 311 or ECE 367 (C) and ICS 314 (C)',
    schedule: 'M 9:00 AM - 11:30 AM, UHM POST 318A',
    faculty: 'Italo De Oliveira Santos',
    description:
      'Project-based course where students work in teams on a software project. Knowledge acquired in the computer science curriculum will be applied to design and implement a software product with potential real-world applicability. Repeatable one time. CS majors only. Senior standing or higher. A-F only.',
  },
  {
    code: 'ICS 499',
    title: 'Computer Project',
    crn: '56284',
    section: '016',
    credits: '1',
    gradeMode: GRADE_CN,
    schedule: 'TBA',
    faculty: 'Peter Sadowski',
    description:
      'Individual or small-group projects in system design or application under faculty supervision.',
    prerequisites: 'Consent',
  },

  // Graduate Level
  {
    code: 'ICS 621',
    title: 'Analysis of Algorithms',
    crn: '57947',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Graduate standing or consent',
    schedule: 'TR 10:30 AM - 11:45 AM, UHM POST 318B',
    faculty: 'Nodar Sitchinava',
    description:
      'Analysis and design of algorithms: modeling, comparison, measures, applications.',
  },
  {
    code: 'ICS 623',
    title: 'Advanced Cryptography',
    crn: '69108',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Graduate standing or consent',
    schedule: 'MW 3:00 PM - 4:15 PM, UHM POST 325',
    faculty: 'Depeng Li',
    description:
      'Taxonomy of security properties: methods for defining and proving security. Randomness, pseudorandomness, and indistinguishability. Functional encryption and obfuscation. Zero knowledge.',
  },
  {
    code: 'ICS 635',
    title: 'Machine Learning',
    crn: '69085',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'Online',
    prerequisites: 'Consent',
    schedule: 'TR 9:00 AM - 10:15 AM, Online sync',
    faculty: 'Peter Sadowski',
    description:
      'Introduction to key theoretical concepts of machine learning. Practical experience with decision free methods, artificial neural networks. Bayesian belief networks and contemporary statistical methods including regression, clustering and classification. (Once a year)',
  },
  {
    code: 'ICS 664',
    title: 'Adv Human-Computer Interaction',
    crn: '68917',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Graduate standing or consent',
    schedule: 'T 3:00 PM - 5:30 PM, UHM KELL 103',
    faculty: 'Nurit Kirshenbaum',
    description:
      'Studies of human performance in designing and using information systems. Emphasizes concepts and methodologies from human factors, psychology, and software engineering relating to human performance.',
  },
  {
    code: 'ICS 668',
    title: 'Social Informatics',
    crn: '68913',
    section: '001',
    credits: '3',
    gradeMode: GRADE_L,
    participation: 'In-Person',
    prerequisites: 'ICS 464, 465, 664, 665, or 667, or LIS 677; or consent',
    schedule: 'TR 6:00 PM - 7:15 PM, UHM SAKAM D101',
    faculty: 'Daniel Suthers',
    description:
      'An advanced introduction to the design of human-computer systems and other technological artifacts for supporting human collaboration in learning, work and social contexts, and to theoretical perspectives and empirical studies of collaboration that inform such design. A-F only.',
  },
  {
    code: 'ICS 682',
    title: 'Numerical Computation',
    crn: '68938',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Consent',
    schedule: 'TR 1:30 PM - 2:45 PM, UHM POST 318B',
    faculty: 'Andrey Popov',
    description:
      'Selected topics in numerical analysis, mathematical software, and scientific computation; examples include sparse matrix methods, finite element methods, mathematical programming.',
  },
  {
    code: 'ICS 691B',
    title: 'Topics in CS: Area 1',
    crn: '68916',
    section: '002',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Consent',
    schedule: 'F 1:30 PM - 4:00 PM, UHM POST 325',
    faculty: 'Dusko Pavlovic',
    description:
      'Reflects special interests of faculty in various areas of computer science. (B) area 1; (C) area 2; (D) area 3; (E) area 4; (G) general. Repeatable unlimited times in different topics and different areas.',
  },
  {
    code: 'ICS 691B',
    title: 'Topics in CS: Area 1',
    crn: '57059',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Consent',
    schedule: 'MW 1:30 PM - 2:45 PM, UHM POST 325',
    faculty: 'Yifan Wang',
    description:
      'Reflects special interests of faculty in various areas of computer science. (B) area 1; (C) area 2; (D) area 3; (E) area 4; (G) general. Repeatable unlimited times in different topics and different areas.',
  },
  {
    code: 'ICS 691E',
    title: 'Topics in CS: Area 4',
    crn: '56047',
    section: '001',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Consent',
    schedule: 'W 3:00 PM - 5:30 PM, UHM KELL 103',
    faculty: 'Jason Leigh',
    description:
      'Reflects special interests of faculty in various areas of computer science. (B) area 1; (C) area 2; (D) area 3; (E) area 4; (G) general. Repeatable unlimited times in different topics and different areas.',
  },
  {
    code: 'ICS 691E',
    title: 'Topics in CS: Area 4',
    crn: '68912',
    section: '002',
    credits: '3',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    prerequisites: 'Consent',
    schedule: 'MW 12:00 PM - 1:15 PM, UHM POST 325',
    faculty: 'Mehdi Tarrit Mirakhorli',
    description:
      'Reflects special interests of faculty in various areas of computer science. (B) area 1; (C) area 2; (D) area 3; (E) area 4; (G) general. Repeatable unlimited times in different topics and different areas.',
  },
  {
    code: 'ICS 692',
    title: 'Topics Seminar',
    crn: '69100',
    section: '002',
    credits: '1',
    gradeMode: GRADE_CN,
    participation: 'In-Person',
    schedule: 'F 12:00 PM - 1:15 PM, UHM POST 302',
    faculty: 'Peter Sadowski',
    description:
      'Seminar discussing special topics in information and computer science. Topics and number of credits vary. Repeatable unlimited times.',
  },
  {
    code: 'ICS 692',
    title: 'Topics Seminar',
    crn: '56324',
    section: '001',
    credits: '1',
    gradeMode: GRADE_CN,
    participation: 'Online',
    schedule: 'F 9:00 AM - 10:15 AM, Online sync',
    faculty: 'Guylaine Poisson',
    description:
      'Seminar discussing special topics in information and computer science. Topics and number of credits vary. Repeatable unlimited times.',
    notes: 'Waitlist only',
  },
];

/**
 * Modality for a course. Sections with only online meeting patterns are
 * 'Online', a mix of in-person and online is 'Hybrid', and courses without
 * participation info default to 'In-Person'.
 */
export const courseParticipation = (course: IcsCourse): Participation =>
  course.participation ?? 'In-Person';

/** Returns the catalog level group for a course code like "ICS 311". */
export const courseLevel = (code: string): string => {
  const num = parseInt(code.split(' ')[1], 10);
  if (num < 200) return '100-Level';
  if (num < 300) return '200-Level';
  if (num < 400) return '300-Level';
  if (num < 600) return '400-Level';
  return 'Graduate';
};

/** Extracts the numeric course number: 'ICS 691B' -> 691, 'ICS 110P' -> 110. */
export const courseNumber = (code: string): number => {
  const n = parseInt(code.split(' ')[1] ?? '', 10);
  return Number.isNaN(n) ? -1 : n;
};

export interface DegreePathway {
  key: string;
  label: string;
  /** Every course code eligible for this pathway (shared core + options). */
  courses: string[];
  /** One-line summary of the double-count rules shown when filter is active. */
  note: string;
}

/** Courses every ICS degree pathway requires (BS/MS bulletin assumption). */
const SHARED_PATHWAY_COURSES = [
  'ICS 111',
  'ICS 141',
  'ICS 211',
  'ICS 212',
  'ICS 241',
  'ICS 311',
  'ICS 314',
];

/**
 * BS/MS double-count pathways. Undergraduate group = pick one course;
 * graduate group = pick up to two. Minimum grade B (not B-) in all cases.
 * BAM students additionally take ICS 690 (1 cr) beyond BS requirements.
 */
export const DEGREE_PATHWAYS: DegreePathway[] = [
  {
    key: 'bs-ms-cs',
    label: 'B.S. & M.S. in Computer Science',
    courses: [
      ...SHARED_PATHWAY_COURSES,
      'ICS 414',
      'ICS 435',
      'ICS 451',
      'ICS 466',
      'ICS 613',
      'ICS 621',
      'ICS 632',
      'ICS 664',
      'ICS 691',
    ],
    note: 'Double-count: one of ICS 414/435/451/466, plus up to two of ICS 613/621/632/664/691. Min grade B (not B-). BAM students add ICS 690 (1 cr).',
  },
  {
    key: 'bs-ms-cs-ds',
    label: 'B.S. CS/Data Science + M.S. CS',
    courses: [
      ...SHARED_PATHWAY_COURSES,
      'ICS 451',
      'ICS 466',
      'ICS 483',
      'ICS 491',
      'ICS 613',
      'ICS 621',
      'ICS 622',
      'ICS 664',
      'ICS 691',
    ],
    note: 'Double-count: one of ICS 451/466/483/491, plus up to two of ICS 613/621/622/664/691. Min grade B (not B-). BAM students add ICS 690 (1 cr).',
  },
  {
    key: 'bs-ms-cs-sec',
    label: 'B.S. CS/Security Science + M.S. CS',
    courses: [
      ...SHARED_PATHWAY_COURSES,
      'ICS 423',
      'ICS 426',
      'ICS 455',
      'ICS 495',
      'ICS 621',
      'ICS 623',
      'ICS 655',
      'ICS 691',
    ],
    note: 'Double-count: one of ICS 423/426/455/495, plus up to two of ICS 621/623/655/691. Min grade B (not B-). BAM students add ICS 690 (1 cr).',
  },
];
