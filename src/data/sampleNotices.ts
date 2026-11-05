import { Notice } from '../types/notice';

export const INITIAL_SAMPLE_NOTICES: Notice[] = [
  {
    id: 'c588-notice-001',
    title: 'End Semester Theory & Practical Examination Schedule – Autumn 2026',
    description:
      'All undergraduate and postgraduate students are hereby notified that the End Semester Examinations for the Autumn 2026 semester will commence from December 1st, 2026. Hall tickets will be downloadable via the Student ERP Portal starting November 20th. Strict adherence to the exam code of conduct and college uniform is mandatory. Possession of electronic gadgets inside examination halls is strictly prohibited.',
    department: 'General / All Departments',
    category: 'Examination',
    priority: 'High',
    publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    publisherName: 'Controller of Examinations (CoE)',
  },
  {
    id: 'c588-notice-002',
    title: 'Google & Microsoft Campus Placement Drive 2026 – Online Registration',
    description:
      'Training and Placement Cell (T&P) is pleased to announce the On-Campus Recruitment Drive for B.Tech CSE, IT, and ECE final-year students for the roles of Software Development Engineer (SDE-1) and Cloud Solutions Architect. Eligible students having CGPA >= 7.5 with no active backlogs must submit their updated resume and coding profile links on the T&P portal before November 15, 2026, 5:00 PM.',
    department: 'Computer Science and Engineering (CSE)',
    category: 'Placement & Training',
    priority: 'High',
    publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    publisherName: 'Prof. R. Sengupta, Head of Placement Cell',
  },
  {
    id: 'c588-notice-003',
    title: 'National Level Technical Symposium & Hackathon: "TechPulse 2026"',
    description:
      'The Department of Information Technology cordially invites teams across all engineering disciplines to participate in "TechPulse 2026" - a 36-hour non-stop national hackathon. Themes include Generative AI, Sustainable Smart Cities, Cyber Security, and Healthcare IoT. Total cash prizes worth ₹1,50,000 + internship opportunities for winning teams. Early bird registration ends next Monday.',
    department: 'Information Technology (IT)',
    category: 'Academic',
    priority: 'Medium',
    publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    publisherName: 'Faculty Coordinator, TechPulse IT',
  },
  {
    id: 'c588-notice-004',
    title: 'Hands-on VLSI Design & FPGA Synthesis Workshop for 3rd & 4th Year',
    description:
      'The ECE Department in association with Cadence and IEEE Circuits & Systems Society is hosting an intensive 3-day practical training workshop on modern ASIC/FPGA digital design methodologies. Participants will gain experience with industry-standard EDA tools and physical layout synthesis. Certificates and kit materials will be distributed to all registered attendees.',
    department: 'Electronics and Communication Engineering (ECE)',
    category: 'Academic',
    priority: 'Medium',
    publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    publisherName: 'Dr. K. Narayanan, ECE Dept',
  },
  {
    id: 'c588-notice-005',
    title: 'Green Grid Innovations & Electric Vehicle Powertrain Guest Lecture',
    description:
      'Department of Electrical & Electronics Engineering invites all students and faculty members to a distinguished guest lecture by Dr. S. Rao, Principal Scientist at Central Power Research Institute (CPRI). Topic: "Challenges and Breakthroughs in Solid-State Battery Management and Micro-Grid Synchronizations." Venue: Dr. Kalam Auditorium.',
    department: 'Electrical and Electronics Engineering (EEE)',
    category: 'Academic',
    priority: 'Low',
    publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    publisherName: 'EEE Student Chapter Head',
  },
  {
    id: 'c588-notice-006',
    title: 'Industrial Field Visit to Tata Motors Pune Manufacturing Facility',
    description:
      'The Department of Mechanical Engineering has organized a one-day educational industrial excursion to Tata Motors Pune manufacturing plant for 5th semester students. Students will inspect robotic welding bays, automated conveyor assembly lines, and engine testing dyno facilities. Parental consent forms must be submitted to the ME department office by Friday.',
    department: 'Mechanical Engineering (ME)',
    category: 'Academic',
    priority: 'Medium',
    publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    publisherName: 'Prof. M. Kulkarni, ME Excursion In-charge',
  },
  {
    id: 'c588-notice-007',
    title: 'Hostel Mess Menu Revision and Central Gymnasium Timings Update',
    description:
      'Following constructive student council recommendations, the central hostel mess committee has approved an updated nutritional weekly menu effective from next Monday. Additionally, the campus central gymnasium will now remain open from 5:30 AM to 9:30 AM (Morning session) and 4:30 PM to 9:30 PM (Evening session). Students must carry their valid college hostel ID cards.',
    department: 'General / All Departments',
    category: 'Hostel & Transport',
    priority: 'Low',
    publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    expiryDate: null,
    publisherName: 'Chief Warden & Student Welfare Dean',
  },
];
