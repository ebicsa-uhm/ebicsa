export type Participation = 'In-Person' | 'Hybrid' | 'Online';

export type IcsCourse = {
  code: string;
  title: string;
  credits: string;
  participation?: Participation;
  prerequisites?: string;
  schedule?: string;
  faculty?: string;
  rating?: string;
  notes?: string;
};

/**
 * ICS course data compiled from uh_manoa_ics_courses.txt.
 * Sourced from the UH Mānoa course catalog and Star GPS schedule data.
 */
export const icsCourses: IcsCourse[] = [
  // 100-Level: Introductory & Foundational
  {
    code: 'ICS 101',
    title: 'Digital Tools for the Information World',
    credits: '4',
    prerequisites: 'None',
    schedule: 'TR 9:00 AM - 10:15 AM, TR 10:30 AM - 11:45 AM',
    faculty: 'Department Pool / Lab Lecturers',
    rating: '3.5 / 5.0',
    notes: 'Heavy emphasis on Microsoft Office suite mastery. High workload but straightforward grading.',
  },
  {
    code: 'ICS 102',
    title: 'Introduction to Data Science',
    credits: '3',
    prerequisites: 'None',
    schedule: 'MWF 10:30 AM - 11:20 AM',
    faculty: 'Mahdi Belcaid',
    rating: '4.1 / 5.0',
    notes: 'Great introductory look at data parsing, visualization, and python environments.',
  },
  {
    code: 'ICS 103',
    title: 'Computer Science Principles',
    credits: '3',
    prerequisites: 'None',
    schedule: 'TR 12:00 PM - 1:15 PM',
    faculty: 'Department Lecturers',
    rating: '3.8 / 5.0',
    notes: 'Concept-focused, minimal programming, ideal for testing out the major field.',
  },
  {
    code: 'ICS 110',
    title: 'Introduction to Computer Programming',
    credits: '3',
    prerequisites: 'None',
    schedule: 'MWF 11:30 AM - 12:20 PM',
    faculty: 'Department Staff',
    rating: '4.0 / 5.0',
    notes: 'For true beginners before taking ICS 111. Highly accessible.',
  },
  {
    code: 'ICS 111',
    title: 'Introduction to Computer Science I',
    credits: '4',
    prerequisites: 'MATH 134 or MATH 140 or math placement test',
    schedule: 'TR 1:30 PM - 2:45 PM + Scheduled Lab Sessions (W/F)',
    faculty: 'William Albritton / Laura Garrison',
    rating: '4.2 / 5.0 (Albritton)',
    notes: 'Standard Java foundation. Albritton is highly praised for clear code demos and thorough explanations.',
  },
  {
    code: 'ICS 141',
    title: 'Discrete Mathematics for Computer Science I',
    credits: '3',
    prerequisites: 'MATH 215 or MATH 241 or concurrent enrollment',
    schedule: 'MWF 9:30 AM - 10:20 AM',
    faculty: 'David Chin / Torben Podolske',
    rating: '3.4 / 5.0',
    notes: 'Heavy focus on mathematical logic, proofs, and sets. Demands significant self-study time.',
  },

  // 200-Level: Intermediate Core
  {
    code: 'ICS 211',
    title: 'Introduction to Computer Science II',
    credits: '4',
    prerequisites: 'ICS 111 with B or better, and ICS 141 with C or better',
    schedule: 'TR 10:30 AM - 11:45 AM + Scheduled Lab Sessions (M/W)',
    faculty: 'Vern Takebayashi',
    rating: '3.9 / 5.0',
    notes: 'Data structures in Java (Linked Lists, Trees, Stacks). Takebayashi gives rigorous, helpful feedback.',
  },
  {
    code: 'ICS 212',
    title: 'Program Structure',
    credits: '3',
    prerequisites: 'ICS 211 with B or better',
    schedule: 'MW 1:30 PM - 2:45 PM',
    faculty: 'Ravi Narayan',
    rating: '4.5 / 5.0',
    notes: 'Teaches low-level memory management in C and C++. Narayan is highly regarded as clear, strict, and incredibly practical.',
  },
  {
    code: 'ICS 215',
    title: 'Introduction to Scripting',
    credits: '3',
    prerequisites: 'ICS 211 with C or better',
    schedule: 'TR 9:00 AM - 10:15 AM',
    faculty: 'Department Staff',
    rating: '3.7 / 5.0',
    notes: 'Practical skills focusing on Bash shell syntax, automation tools, and configuration scripting.',
  },
  {
    code: 'ICS 241',
    title: 'Discrete Mathematics for Computer Science II',
    credits: '3',
    prerequisites: 'ICS 141 with C or better',
    schedule: 'MWF 1:30 PM - 2:20 PM',
    faculty: 'Torben Podolske / David Chin',
    rating: '3.2 / 5.0',
    notes: 'Combinatorics, probability, graph theory. Conceptual hurdle for many sophomore students.',
  },

  // 300-Level: Upper-Division Required Core
  {
    code: 'ICS 311',
    title: 'Algorithms',
    credits: '4',
    prerequisites: 'ICS 211 with B or better, and ICS 241 with C or better',
    schedule: 'TR 12:00 PM - 1:15 PM + Mandatory Friday Problem Sessions',
    faculty: 'Nodari Sitchinava',
    rating: '4.3 / 5.0',
    notes: 'Fast-paced algorithmic time/space analysis. Sitchinava is tough but exceptionally organized.',
  },
  {
    code: 'ICS 312',
    title: 'Machine-Level and Systems Programming',
    credits: '3',
    prerequisites: 'ICS 212 with C or better',
    schedule: 'TR 3:00 PM - 4:15 PM',
    faculty: 'Henri Casanova',
    rating: '4.4 / 5.0',
    notes: 'Deep dive into Assembly and system architecture. Casanova\u2019s lectures are meticulously prepared.',
  },
  {
    code: 'ICS 314',
    title: 'Software Engineering I',
    credits: '3',
    prerequisites: 'ICS 211 with B or better',
    schedule: 'MW 3:00 PM - 4:15 PM',
    faculty: 'Philip Johnson',
    rating: '4.6 / 5.0',
    notes: 'Open source development, web stacks, tech portfolio building. Highly structured project timelines.',
  },
  {
    code: 'ICS 321',
    title: 'Database Systems I',
    credits: '3',
    prerequisites: 'ICS 211 with B or better, and ICS 141 with C or better',
    schedule: 'TR 1:30 PM - 2:45 PM',
    faculty: 'Kyungim Baek',
    rating: '3.8 / 5.0',
    notes: 'Essential for backend design. Focuses on SQL commands, normalization, and building application data endpoints.',
  },
  {
    code: 'ICS 332',
    title: 'Operating Systems',
    credits: '3',
    prerequisites: 'ICS 212 with C or better, and ICS 311 with C or better',
    schedule: 'MWF 10:30 AM - 11:20 AM',
    faculty: 'Henri Casanova / Lipyeow Lim',
    rating: '4.1 / 5.0',
    notes: 'Processes, threading, memory management, and file systems. Programming projects are C-intensive.',
  },
  {
    code: 'ICS 351',
    title: 'Computer Networks',
    credits: '3',
    prerequisites: 'ICS 212 or concurrent',
    schedule: 'TR 10:30 AM - 11:45 AM',
    faculty: 'Edoardo Biagioni',
    rating: '3.6 / 5.0',
    notes: 'Networking routing layers, TCP/IP models, hands-on lab infrastructure building.',
  },
  {
    code: 'ICS 355',
    title: 'Security Science I',
    credits: '3',
    prerequisites: 'ICS 211 with C or better',
    schedule: 'MW 4:30 PM - 5:45 PM',
    faculty: 'Benjamin Kuperman',
    rating: '4.3 / 5.0',
    notes: 'Introduction to systems security, cryptography concepts, vulnerabilities, and offensive/defensive methodologies.',
  },
  {
    code: 'ICS 361',
    title: 'Artificial Intelligence I',
    credits: '3',
    prerequisites: 'ICS 241 and ICS 311',
    schedule: 'TR 12:00 PM - 1:15 PM',
    faculty: 'Peter Washington',
    rating: '4.0 / 5.0',
    notes: 'Search logic, heuristics, state machines, and basic machine learning structures.',
  },

  // 400-Level & Elective Specializations
  {
    code: 'ICS 414',
    title: 'Software Engineering II',
    credits: '3',
    prerequisites: 'ICS 314 with C or better',
    schedule: 'MW 1:30 PM - 2:45 PM',
    faculty: 'Philip Johnson',
    rating: '4.5 / 5.0',
    notes: 'Large-scale student group development sprints tracking user stories and automated continuous integration.',
  },
  {
    code: 'ICS 421',
    title: 'Database Systems II',
    credits: '3',
    prerequisites: 'ICS 321 with C or better',
    schedule: 'TR 9:00 AM - 10:15 AM',
    faculty: 'Lipyeow Lim',
    rating: '4.0 / 5.0',
    notes: 'Distributed architectures, cluster scaling, text retrieval indices, and parallel data query parsing.',
  },
  {
    code: 'ICS 423',
    title: 'Computer Security',
    credits: '3',
    prerequisites: 'ICS 355 or equivalent',
    schedule: 'TR 1:30 PM - 2:45 PM',
    faculty: 'Benjamin Kuperman',
    rating: '4.2 / 5.0',
    notes: 'Advanced application exploits, sandboxing, reverse engineering, and threat auditing.',
  },
  {
    code: 'ICS 431',
    title: 'Computer Architecture',
    credits: '3',
    prerequisites: 'ICS 312',
    schedule: 'MW 3:00 PM - 4:15 PM',
    faculty: 'Henri Casanova',
    rating: '4.3 / 5.0',
    notes: 'Pipeline execution, caching layers, and microcode instructions.',
  },
  {
    code: 'ICS 435',
    title: 'Machine Learning Fundamentals',
    credits: '3',
    prerequisites: 'ICS 311 and MATH 307/372',
    schedule: 'TR 10:30 AM - 11:45 AM',
    faculty: 'Mahdi Belcaid',
    rating: '4.2 / 5.0',
    notes: 'Heavy mathematical backbone. Covers regression, support vector clustering, and gradient descent.',
  },
  {
    code: 'ICS 451',
    title: 'Data Networks II',
    credits: '3',
    prerequisites: 'ICS 351',
    schedule: 'TR 12:00 PM - 1:15 PM',
    faculty: 'Edoardo Biagioni',
    rating: '3.5 / 5.0',
    notes: 'Deep network protocols, congestion avoidance math, and socket system scripting.',
  },
  {
    code: 'ICS 464',
    title: 'Human Computer Interaction',
    credits: '3',
    prerequisites: 'ICS 314',
    schedule: 'MWF 11:30 AM - 12:20 PM',
    faculty: 'Scott Robertson',
    rating: '4.1 / 5.0',
    notes: 'Interface prototyping, behavioral analysis, and wireframe testing. Highly collaborative.',
  },
  {
    code: 'ICS 481',
    title: 'Introduction to Computer Graphics',
    credits: '3',
    prerequisites: 'ICS 311 and MATH 307/311',
    schedule: 'TR 4:30 PM - 5:45 PM',
    faculty: 'Guylaine Poisson',
    rating: '3.9 / 5.0',
    notes: '3D vector spaces, rendering matrix pipes, and low-level shading code interfaces.',
  },
  {
    code: 'ICS 496',
    title: 'Capstone Project',
    credits: '3',
    prerequisites: 'Senior Standing',
    schedule: 'Arranged / Friday Seminars',
    faculty: 'Department Advisors',
    rating: '4.4 / 5.0',
    notes: 'Culminating software presentation building complete systems for public display or industry clients.',
  },

  // 600-800 Level: Graduate Research & Advanced Seminars
  {
    code: 'ICS 611',
    title: 'Advanced Software Engineering',
    credits: '3',
    prerequisites: 'Graduate Standing',
    schedule: 'M 4:30 PM - 7:00 PM',
    faculty: 'Philip Johnson',
  },
  {
    code: 'ICS 621',
    title: 'Analysis of Algorithms',
    credits: '3',
    prerequisites: 'Graduate Standing',
    schedule: 'T 4:30 PM - 7:00 PM',
    faculty: 'Nodari Sitchinava',
  },
  {
    code: 'ICS 624',
    title: 'Advanced Data Management',
    credits: '3',
    prerequisites: 'Graduate Standing',
    schedule: 'W 5:00 PM - 7:30 PM',
    faculty: 'Lipyeow Lim',
  },
  {
    code: 'ICS 635',
    title: 'Machine Learning',
    credits: '3',
    prerequisites: 'Graduate Standing',
    schedule: 'TR 1:30 PM - 2:45 PM',
    faculty: 'Peter Washington',
  },
  {
    code: 'ICS 661',
    title: 'Advanced Artificial Intelligence',
    credits: '3',
    prerequisites: 'Graduate Standing',
    schedule: 'R 4:30 PM - 7:00 PM',
    faculty: 'Department Staff',
  },
  {
    code: 'ICS 690',
    title: 'Seminar in ICS',
    credits: '1',
    schedule: 'F 3:30 PM - 4:45 PM',
    faculty: 'Rotating Chairs',
  },
  {
    code: 'ICS 700',
    title: 'Thesis Research',
    credits: 'Variable',
    schedule: 'Arranged / Independent Study',
  },
  {
    code: 'ICS 800',
    title: 'Dissertation Research',
    credits: 'Variable',
    schedule: 'Arranged / Doctoral Level Only',
  },
];

/**
 * Modality for a course. The source data has no participation info, so
 * courses default to 'In-Person' until verified per-section in Star GPS.
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
