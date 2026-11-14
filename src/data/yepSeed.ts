import type {
  EducationLevel,
  EventItem,
  FaqItem,
  LearningCourse,
  UserRole,
  YepWorkspaceState,
} from '../types/yep';

export const ROLE_LABELS: Record<UserRole, string> = {
  youth: 'Youth participant',
  mentor: 'Mentor',
  facilitator: 'Facilitator',
  administrator: 'Administrator',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  youth:
    'Select learning programs, complete interactive lessons and program assessments, collaborate in your assigned group, and earn verified certificates.',
  mentor:
    'Advise assigned teams, review impact projects with actionable feedback, and stay connected with participants.',
  facilitator:
    'Schedule exchange sessions, form balanced teams across education levels, grade program assessments, and moderate discussions.',
  administrator:
    'Add new learning programs, manage users and role assignments, issue program-specific certificates, and monitor platform-wide reports.',
};

export const EDUCATION_LEVELS: EducationLevel[] = [
  'O Level',
  'A Level',
  'Diploma',
  'Bachelor’s',
  'Master’s',
  'PhD',
];

export const PROJECT_THEMES = [
  'Environmental Sustainability',
  'Digital Inclusion',
  'Community Health',
  'Education Access',
  'Civic Leadership',
];

export const UNIFIED_PROGRAMS: LearningCourse[] = [
  {
    id: 'lang-english',
    category: 'languages',
    title: 'Conversational English for Global Teams',
    subtitle:
      'Present project ideas clearly, write team updates, and collaborate across international cohorts.',
    level: 'Beginner',
    totalDuration: '45 min',
    lessons: [
      {
        id: 'lang-en-1',
        title: '1. Introducing Yourself & Your Education Pathway',
        duration: '15 min',
        summary:
          'Practice introducing your name, country, education level, and team goal clearly during Level 1 exchanges.',
        practicePrompt:
          'Which phrase best opens a team check-in professionally?',
        practiceOptions: [
          'Hi everyone, I am Jordan from the UK, currently studying A Levels.',
          'Check-in done, bye.',
          'Send me files only.',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'lang-en-2',
        title: '2. Pitching a Community Impact Idea',
        duration: '15 min',
        summary:
          'Structure a 3-sentence project pitch: local problem, target group, and measurable community outcome.',
        practicePrompt: 'What makes an impact project pitch clear?',
        practiceOptions: [
          'Naming the local need and expected community benefit',
          'Listing technical jargon without context',
          'Avoiding any timeline or goal',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'lang-en-3',
        title: '3. Giving Constructive Peer Feedback',
        duration: '15 min',
        summary:
          'Use supportive language when reviewing teammates’ work across mixed education levels.',
        practicePrompt: 'Choose the strongest peer feedback phrasing:',
        practiceOptions: [
          'Strong map layout — adding street labels will make it easier to navigate.',
          'This does not work at all.',
          'No comment.',
        ],
        correctOptionIndex: 0,
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-en-1',
        prompt:
          'When introducing yourself to an international YEP cohort, which details help teammates collaborate immediately?',
        options: [
          'Your name, country, education level, and how you hope to contribute',
          'Only your favorite movie',
          'Sharing private passwords for group tools',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-en-2',
        prompt:
          'Which three elements form a strong 3-sentence community impact pitch?',
        options: [
          'Local problem, target community, and measurable outcome',
          'Unrelated jokes, long history, and no goal',
          'Random statistics without naming who benefits',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-en-3',
        prompt:
          'How should you phrase peer feedback when a teammate’s draft needs improvement?',
        options: [
          'Highlight one strength first, then give one specific actionable suggestion',
          'Say "This is bad" without explaining why',
          'Rewrite their work without telling them',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'lang-spanish',
    category: 'languages',
    title: 'Spanish Essentials for Community Outreach',
    subtitle:
      'Build everyday vocabulary for greetings, interviews, and bilingual neighborhood surveys.',
    level: 'Beginner',
    totalDuration: '45 min',
    lessons: [
      {
        id: 'lang-es-1',
        title: '1. Polite Greetings & Introductions',
        duration: '15 min',
        summary:
          'Learn "Buenos días", "Mucho gusto", and how to ask someone’s name respectfully.',
        practicePrompt: 'How do you say "Nice to meet you" in Spanish?',
        practiceOptions: ['Mucho gusto', 'Hasta luego', 'Muchas gracias'],
        correctOptionIndex: 0,
      },
      {
        id: 'lang-es-2',
        title: '2. Asking Community Survey Questions',
        duration: '15 min',
        summary:
          'Phrase simple open questions when gathering feedback for local youth projects.',
        practicePrompt: 'What does "¿Cómo podemos ayudar?" mean?',
        practiceOptions: [
          'How can we help?',
          'Where is the bus stop?',
          'What time is lunch?',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'lang-es-3',
        title: '3. Sharing Dates, Places & Thank-Yous',
        duration: '15 min',
        summary:
          'Confirm meeting times ("el sábado a las diez") and close outreach conversations warmly.',
        practicePrompt:
          'Which phrase politely thanks a community member for their time?',
        practiceOptions: [
          'Muchas gracias por su tiempo',
          'No entiendo nada',
          '¿Dónde está el libro?',
        ],
        correctOptionIndex: 0,
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-es-1',
        prompt:
          'Which Spanish greeting is best when meeting a neighborhood leader in the morning?',
        options: [
          'Buenos días, mucho gusto',
          'Buenas noches, adiós',
          'Hasta mañana, gracias',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-es-2',
        prompt:
          'You are running a neighborhood survey and want to ask "How can we help?". Which phrase do you use?',
        options: [
          '¿Cómo podemos ayudar?',
          '¿Cuántos años tiene?',
          '¿Qué hora es?',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-es-3',
        prompt:
          'Which closing sentence expresses gratitude for a resident’s feedback?',
        options: [
          'Muchas gracias por su tiempo y apoyo',
          'No tengo tiempo ahora',
          'El proyecto está cerrado',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'lang-french',
    category: 'languages',
    title: 'French for Youth Exchanges',
    subtitle:
      'Key expressions for collaborating with Francophone peers, mentors, and facilitators.',
    level: 'Beginner',
    totalDuration: '45 min',
    lessons: [
      {
        id: 'lang-fr-1',
        title: '1. Everyday Exchange Expressions',
        duration: '15 min',
        summary:
          'Master "Bonjour", "Enchanté(e)", and polite agreement phrases during group calls.',
        practicePrompt: 'Which phrase means "Let’s work together"?',
        practiceOptions: [
          'Travaillons ensemble',
          'À demain',
          'Je ne sais pas',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'lang-fr-2',
        title: '2. Sharing Project Updates',
        duration: '15 min',
        summary:
          'Describe completed milestones and next steps in short French sentences.',
        practicePrompt: 'What does "Notre projet avance bien" mean?',
        practiceOptions: [
          'Our project is progressing well',
          'The meeting is cancelled',
          'Please sign up tomorrow',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'lang-fr-3',
        title: '3. Asking Questions & Clarifying Next Steps',
        duration: '15 min',
        summary:
          'Use "Pouvez-vous répéter, s’il vous plaît ?" and confirm task owners politely.',
        practicePrompt: 'How do you ask "Who is responsible for this task?"',
        practiceOptions: [
          'Qui est responsable de cette tâche ?',
          'Quelle heure est-il ?',
          'Où est la gare ?',
        ],
        correctOptionIndex: 0,
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-fr-1',
        prompt:
          'During a Francophone exchange call, how do you suggest "Let’s work together"?',
        options: ['Travaillons ensemble', 'Bonne nuit', 'À tout à l’heure'],
        correctOptionIndex: 0,
      },
      {
        id: 'q-fr-2',
        prompt: 'What does "Notre projet avance bien" communicate to your mentor?',
        options: [
          'Our project is progressing well',
          'We need to cancel our project',
          'We lost the team notes',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-fr-3',
        prompt:
          'If you miss a detail during a French workshop, which polite phrase asks the speaker to repeat?',
        options: [
          'Pouvez-vous répéter, s’il vous plaît ?',
          'Je pars maintenant',
          'C’est impossible',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'code-web',
    category: 'coding',
    title: 'Web Design for Mobile & Laptop',
    subtitle:
      'Build responsive interfaces with semantic HTML, Flexbox, CSS Grid, and accessible forms.',
    level: 'Beginner',
    totalDuration: '60 min',
    lessons: [
      {
        id: 'code-web-1',
        title: '1. Mobile-First Grids & Breakpoints',
        duration: '20 min',
        summary:
          'Design single-column layouts on phones first, then expand cleanly to multi-column laptop grids.',
        practicePrompt:
          'What is the recommended minimum touch target height on mobile?',
        practiceOptions: ['44px', '14px', '8px'],
        correctOptionIndex: 0,
      },
      {
        id: 'code-web-2',
        title: '2. Accessible Forms & Navigation',
        duration: '20 min',
        summary:
          'Pair clear labels with inputs and keep bottom navigation bars ergonomic for thumb reach.',
        practicePrompt:
          'Why should mobile form inputs use at least 16px font size?',
        practiceOptions: [
          'To keep text legible and prevent unwanted mobile browser zoom',
          'To hide the placeholder text',
          'To disable keyboard input',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'code-web-3',
        title: '3. Semantic HTML & Contrast Checks',
        duration: '20 min',
        summary:
          'Use <header>, <main>, <nav>, and high-contrast text colors so screen readers and users on bright screens can read easily.',
        practicePrompt:
          'Which HTML element should wrap the primary page content?',
        practiceOptions: ['<main>', '<blink>', '<font>'],
        correctOptionIndex: 0,
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-web-1',
        prompt:
          'Why do responsive web engineers start with mobile layout rules before adding laptop breakpoints?',
        options: [
          'It ensures essential content fits narrow screens cleanly without horizontal overflow',
          'Because laptops cannot display CSS Grid',
          'To remove all navigation on desktop',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-web-2',
        prompt:
          'What minimum height should interactive buttons and form controls have for comfortable mobile touch?',
        options: ['44px', '12px', '18px'],
        correctOptionIndex: 0,
      },
      {
        id: 'q-web-3',
        prompt:
          'Which practice improves accessibility for keyboard and screen-reader users?',
        options: [
          'Using semantic landmarks (<nav>, <main>) and visible focus rings',
          'Replacing all <button> tags with unlabelled <div> tags',
          'Using light gray text on a white background',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'code-python',
    category: 'coding',
    title: 'Python & Everyday AI Literacy',
    subtitle:
      'Master variables, loops, and responsible AI prompting for study and community projects.',
    level: 'Intermediate',
    totalDuration: '60 min',
    lessons: [
      {
        id: 'code-py-1',
        title: '1. Lists, Loops & Community Data',
        duration: '20 min',
        summary:
          'Process survey responses and count participant attendance using Python lists and dictionaries.',
        practicePrompt: 'Which Python keyword starts a loop over a list?',
        practiceOptions: ['for', 'switch', 'var'],
        correctOptionIndex: 0,
      },
      {
        id: 'code-py-2',
        title: '2. Fact-Checking AI Outputs',
        duration: '20 min',
        summary:
          'Use AI tools as study assistants while verifying facts, citations, and privacy boundaries.',
        practicePrompt:
          'What should you never paste into a public AI prompt?',
        practiceOptions: [
          'Personal passwords or private participant records',
          'A generic study topic',
          'A practice math problem',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'code-py-3',
        title: '3. Writing Reusable Python Functions',
        duration: '20 min',
        summary:
          'Bundle repeated calculations—like average quiz score or attendance rate—into clean def functions.',
        practicePrompt: 'Which keyword defines a function in Python?',
        practiceOptions: ['def', 'function', 'create'],
        correctOptionIndex: 0,
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-py-1',
        prompt:
          'You have a Python list of attendance counts: `counts = [18, 22, 20]`. Which keyword iterates over each item?',
        options: ['for item in counts:', 'loop counts:', 'repeat counts:'],
        correctOptionIndex: 0,
      },
      {
        id: 'q-py-2',
        prompt:
          'When using an AI assistant to summarize community research, what is the safest rule for participant privacy?',
        options: [
          'Remove personal names, emails, and passwords before prompting',
          'Paste full private spreadsheets including phone numbers',
          'Assume AI never makes factual mistakes',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-py-3',
        prompt:
          'How do you define a reusable function named `calc_average` in Python?',
        options: [
          'def calc_average(scores):',
          'func calc_average(scores):',
          'make calc_average(scores):',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'digital-data',
    category: 'digital',
    title: 'Spreadsheets & Financial Literacy',
    subtitle:
      'Track project budgets, micro-grants, and community impact metrics with accuracy.',
    level: 'Beginner',
    totalDuration: '50 min',
    lessons: [
      {
        id: 'dig-data-1',
        title: '1. Building a Project Budget Sheet',
        duration: '15 min',
        summary:
          'Organise income, supply costs, and totals using SUM formulas and clear column headers.',
        practicePrompt: 'Which formula totals cells B2 through B10?',
        practiceOptions: ['=SUM(B2:B10)', '=TOTAL(B2-B10)', '=ADD(B2,B10)'],
        correctOptionIndex: 0,
      },
      {
        id: 'dig-data-2',
        title: '2. Visualizing Outcomes Clearly',
        duration: '15 min',
        summary:
          'Pick bar charts for comparisons and line charts for tracking growth over time.',
        practicePrompt:
          'Which chart best shows monthly attendance changes over a year?',
        practiceOptions: ['Line chart', 'Pie chart', 'Scatter plot of IDs'],
        correctOptionIndex: 0,
      },
      {
        id: 'dig-data-3',
        title: '3. Micro-Grant Cashflow & Contingency',
        duration: '20 min',
        summary:
          'Reserve 10% contingency for unexpected supply costs and reconcile receipts weekly.',
        practicePrompt:
          'Why should a youth project budget keep a 10% contingency line?',
        practiceOptions: [
          'To handle unexpected price changes or urgent supply needs without halting the project',
          'To hide expenses from mentors',
          'To avoid tracking receipts',
        ],
        correctOptionIndex: 0,
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-dig-1',
        prompt:
          'In a project budget spreadsheet, expenses are listed in cells C2 through C15. Which formula calculates total spending?',
        options: ['=SUM(C2:C15)', '=SUM(C2-C15)', '=COUNT(C2:C15)'],
        correctOptionIndex: 0,
      },
      {
        id: 'q-dig-2',
        prompt:
          'Which chart type communicates how youth workshop attendance changed month-by-month across 12 months?',
        options: [
          'A line chart with months on the horizontal axis',
          'A 12-slice pie chart with no legend',
          'A single unlabelled number',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-dig-3',
        prompt:
          'What is the purpose of setting aside a small contingency budget in a community project?',
        options: [
          'To absorb unexpected material or logistics costs responsibly',
          'To skip keeping receipts',
          'To avoid submitting a budget to the facilitator',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'career-speaking',
    category: 'career',
    title: 'Civic Leadership & Public Speaking',
    subtitle:
      'Prepare presentations, lead mixed-level team check-ins, and communicate with stakeholders.',
    level: 'Intermediate',
    totalDuration: '45 min',
    lessons: [
      {
        id: 'car-spk-1',
        title: '1. Structuring a 3-Minute Demo',
        duration: '15 min',
        summary:
          'Open with a human story, show what your team built, and end with one clear next step.',
        practicePrompt: 'What is the strongest way to close a project demo?',
        practiceOptions: [
          'Share one clear call to action or next milestone',
          'Read raw spreadsheet rows aloud',
          'Apologize for finishing early',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'car-spk-2',
        title: '2. Running Effective Team Check-Ins',
        duration: '15 min',
        summary:
          'Keep meetings under 20 minutes by reviewing progress, blockers, and owners.',
        practicePrompt: 'Which three items belong in a quick team check-in?',
        practiceOptions: [
          'Done, Next step, Blockers',
          'Only social chat',
          'Repeating yesterday’s notes verbatim',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'car-spk-3',
        title: '3. Engaging Local Stakeholders',
        duration: '15 min',
        summary:
          'Tailor your message to school leaders, local partners, and peers with clear evidence.',
        practicePrompt:
          'Before emailing a community partner, what should you double-check?',
        practiceOptions: [
          'Clear subject line, brief purpose, and specific ask with dates',
          'Sending a blank email with no greeting',
          'Attaching unrelated drafts',
        ],
        correctOptionIndex: 0,
      },
    ],
    assessmentQuestions: [
      {
        id: 'q-car-1',
        prompt:
          'What is the ideal three-part flow for a 3-minute youth project presentation?',
        options: [
          'Community story -> Demo of solution -> Clear next step',
          'Read all raw notes -> End abruptly -> Skip the demo',
          'Ten minutes of slides -> No conclusion',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-car-2',
        prompt:
          'To keep a mixed-level team meeting focused in 15 minutes, what should each member share?',
        options: [
          'What they completed, their next task, and any blockers',
          'Unrelated gossip only',
          'Only things they plan to do next year',
        ],
        correctOptionIndex: 0,
      },
      {
        id: 'q-car-3',
        prompt:
          'When inviting a local partner to support your impact project, what makes your request most effective?',
        options: [
          'Stating a specific goal, proposed date, and clear way they can help',
          'Writing a vague message without any date or contact info',
          'Assuming they already know your team’s project brief',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
];

export const APP_SEED: YepWorkspaceState = {
  role: 'youth',
  section: 'dashboard',
  isSignedIn: false,
  userName: 'Jordan Smith',
  userEmail: 'jordan@example.com',
  country: 'United Kingdom',
  educationLevel: 'A Level',
  points: 240,
  programs: UNIFIED_PROGRAMS,
  enrolledCourseIds: ['lang-english', 'code-web'],
  completedLessonIds: ['lang-en-1', 'lang-en-2', 'lang-en-3', 'code-web-1'],
  activities: [
    {
      id: 'A01',
      title: 'Community Impact Lab',
      level: 'Level 1 exchange',
      date: 'Nov 24, 2026',
      spots: 8,
      enrolled: false,
    },
    {
      id: 'A02',
      title: 'Digital Storytelling Exchange',
      level: 'Level 1 exchange',
      date: 'Dec 02, 2026',
      spots: 12,
      enrolled: true,
    },
  ],
  teams: [
    {
      id: 'T01',
      name: 'Bright Futures',
      mentorName: 'Maya Patel · Mentor',
      createdAt: 'Oct 15, 2026',
      members: [
        'Jordan Smith · A Level',
        'Amara Okafor · O Level',
        'Leo Chen · Diploma',
      ],
      project: {
        id: 'P01',
        title: 'Community garden map',
        theme: 'Environmental Sustainability',
        brief:
          'Map unused neighborhood plots and partner with local schools to propose community garden sites.',
        progressNote:
          'Identified 4 candidate spaces and drafted neighborhood survey questions.',
        status: 'In progress',
        mentorFeedback:
          'Great start — add two local site contacts before your next check-in.',
      },
    },
    {
      id: 'T02',
      name: 'Digital Bridge',
      mentorName: 'Maya Patel · Mentor',
      createdAt: 'Oct 20, 2026',
      members: [
        'Samira Hassan · Bachelor’s',
        'Kofi Boateng · O Level',
        'Elena Ruiz · Master’s',
      ],
      project: {
        id: 'P02',
        title: 'Neighborhood Digital Literacy Kit',
        theme: 'Digital Inclusion',
        brief:
          'Create a bilingual beginner guide helping older residents safely access online civic and health services.',
        progressNote:
          'Completed outline in English and Spanish; testing readability with community center volunteers.',
        status: 'Submitted for review',
        mentorFeedback:
          'Clear bilingual structure — awaiting final mentor review.',
      },
    },
  ],
  assessments: [
    {
      id: 'AS01',
      programId: 'lang-english',
      programTitle: 'Conversational English for Global Teams',
      participantName: 'Jordan Smith',
      title: 'Conversational English for Global Teams — Program Assessment',
      due: 'Nov 10, 2026',
      status: 'Graded',
      score: '100%',
      feedback: 'Clear communication and strong peer-feedback examples.',
      answers: { 'q-en-1': 0, 'q-en-2': 0, 'q-en-3': 0 },
    },
  ],
  messages: [
    {
      id: 'M01',
      from: 'Maya Patel · Mentor',
      to: 'Bright Futures',
      text: 'Welcome to the team! Let’s set a time to review your Community garden map.',
      time: 'Today',
      isRead: false,
      flagged: false,
    },
    {
      id: 'M02',
      from: 'Leo Chen · Diploma',
      to: 'Bright Futures',
      text: 'I drafted the neighborhood survey questions for our community garden map.',
      time: 'Yesterday',
      isRead: true,
      flagged: true,
    },
    {
      id: 'M03',
      from: 'Samira Hassan · Bachelor’s',
      to: 'Digital Bridge',
      text: 'Uploaded the Spanish literacy checklist for Digital Bridge.',
      time: 'Yesterday',
      isRead: true,
      flagged: false,
    },
  ],
  certificates: [
    {
      id: 'CERT-2026-01',
      recipient: 'Jordan Smith',
      programId: 'lang-english',
      programTitle: 'Conversational English for Global Teams',
      certType: 'Conversational English for Global Teams — Completion',
      issueDate: 'Nov 11, 2026',
      issuer: 'YEP Administration',
    },
  ],
  notices: [
    'Select any program in Programs & Learning to unlock its lessons, tailored assessment questions, and program certificate.',
  ],
  directoryUsers: [
    {
      id: 'U01',
      name: 'Jordan Smith',
      role: 'Youth participant',
      detail: 'A Level',
      country: 'United Kingdom',
      completedProgramIds: ['lang-english'],
    },
    {
      id: 'U02',
      name: 'Maya Patel',
      role: 'Mentor',
      detail: 'Technology',
      country: 'Canada',
    },
    {
      id: 'U03',
      name: 'Ruth Mensah',
      role: 'Facilitator',
      detail: 'Education',
      country: 'Ghana',
    },
    {
      id: 'U04',
      name: 'Amara Okafor',
      role: 'Youth participant',
      detail: 'O Level',
      country: 'Nigeria',
      completedProgramIds: ['code-web', 'lang-english'],
    },
    {
      id: 'U05',
      name: 'Leo Chen',
      role: 'Youth participant',
      detail: 'Diploma',
      country: 'Singapore',
      completedProgramIds: ['digital-data'],
    },
    {
      id: 'U06',
      name: 'Samira Hassan',
      role: 'Youth participant',
      detail: 'Bachelor’s',
      country: 'Kenya',
      completedProgramIds: ['lang-spanish', 'career-speaking'],
    },
    {
      id: 'U07',
      name: 'Kofi Boateng',
      role: 'Youth participant',
      detail: 'O Level',
      country: 'Ghana',
      completedProgramIds: ['code-python'],
    },
    {
      id: 'U08',
      name: 'Elena Ruiz',
      role: 'Youth participant',
      detail: 'Master’s',
      country: 'Spain',
      completedProgramIds: ['lang-french', 'career-speaking'],
    },
  ],
};

export const IMPACT_METRICS = [
  { value: '28,500+', label: 'Youth Reached & Empowered' },
  { value: '94.8%', label: 'High School Graduation Rate' },
  { value: '1,400+', label: 'Active Volunteer Mentors' },
  { value: '$3.2M', label: 'Scholarships & Micro-Grants Awarded' },
];

export const PILLARS = [
  {
    index: '01',
    title: 'Academic Excellence',
    description:
      'Free one-on-one after-school tutoring, college prep workshops, SAT/ACT assistance, and direct application mentorship to ensure higher education is within reach.',
    tone: 'bg-brand-50 text-brand-700',
  },
  {
    index: '02',
    title: 'Workforce & Apprenticeship',
    description:
      'Hands-on technical certifications, resume polish, mock interviews, and subsidized corporate apprenticeships connecting young talent directly to living-wage careers.',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    index: '03',
    title: 'Leadership & Civic Voice',
    description:
      'Empowering youth to design community service projects, speak at municipal policy forums, and champion neighborhood-led environmental and social initiatives.',
    tone: 'bg-amber-50 text-amber-700',
  },
];

export const ALUMNI_STORIES = [
  {
    initials: 'MJ',
    name: 'Marcus Johnson',
    role: 'YEP Class of ’24 · Software Engineer',
    quote:
      'Before YEP, I had never written a single line of code and didn’t believe I could go to college. Through the Code Academy and my mentor Carlos, I graduated with a scholarship and now work as a Jr. Cloud Engineer.',
    avatarClass: 'bg-brand-600 text-white',
  },
  {
    initials: 'AL',
    name: 'Amina Layla',
    role: 'YEP Class of ’23 · Pre-Law Scholar',
    quote:
      'The 1:1 mentorship provided a steady anchor when my family faced eviction. YEP didn’t just help me study; they helped me believe I was worthy of big dreams.',
    avatarClass: 'bg-emerald-600 text-white',
  },
  {
    initials: 'DK',
    name: 'David Kim',
    role: 'YEP Class of ’25 · Multimedia Creator',
    quote:
      'In the Creative Media Lab, I found my voice. My documentary on food justice won an award at the Youth Film Festival and received a grant to help our local community garden.',
    avatarClass: 'bg-slate-800 text-white',
  },
];

export const EVENTS: EventItem[] = [
  {
    id: 'hackathon-2026',
    date: 'April 18, 2026',
    time: '10:00 AM – 2:00 PM',
    title: 'Youth Tech Hackathon 2026',
    description:
      'A friendly beginner-oriented competition solving local urban challenges with code.',
    location: 'YEP Innovation Lab & Virtual',
    ctaLabel: 'RSVP Free',
    badgeTone: 'text-brand-700',
  },
  {
    id: 'career-mixer',
    date: 'May 02, 2026',
    time: '1:00 PM – 4:00 PM',
    title: 'Resume & Career Networking Mixer',
    description:
      'Meet recruiters from partner tech, design, and healthcare enterprises.',
    location: 'Downtown Civic Center',
    ctaLabel: 'RSVP Free',
    badgeTone: 'text-emerald-700',
  },
  {
    id: 'annual-gala',
    date: 'June 12, 2026',
    time: '6:30 PM – 9:00 PM',
    title: 'Annual YEP Gala & Awards',
    description:
      'Celebrating our youth graduating seniors and recognizing community partners.',
    location: 'Grand Metropolitan Hall',
    ctaLabel: 'Get Tickets',
    badgeTone: 'text-amber-700',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'eligibility',
    question: 'Who is eligible to participate in YEP programs?',
    answer:
      'Our programs are open to youth aged 12 to 24 from underserved and underrepresented communities. All regular academic, tech, and creative workshops are 100% free of charge.',
  },
  {
    id: 'volunteer',
    question: 'How do I become a volunteer or mentor?',
    answer:
      'Select "Volunteer" to fill out our quick intake form. We require a background check and a short orientation session before matching mentors with students.',
  },
  {
    id: 'donations',
    question: 'Where do my donations go?',
    answer:
      'Over 87 cents of every dollar goes directly into youth programming, including laptops for students, certified educators, meals during afterschool sessions, and college micro-scholarships.',
  },
  {
    id: 'partnerships',
    question:
      'Can companies partner with YEP for corporate social responsibility?',
    answer:
      'Yes! We partner with leading corporations for sponsored apprenticeships, employee volunteer days, guest speaker panels, and technology donations.',
  },
];

export const DONATION_IMPACTS: Record<
  number,
  { monthly: string; onetime: string }
> = {
  25: {
    monthly:
      'funds a student’s essential learning materials and backpack kits.',
    onetime: 'covers educational supplies for one student.',
  },
  50: {
    monthly:
      'provides 1-on-1 weekly tutoring & study materials for an aspiring college student.',
    onetime: 'provides two weeks of after-school meal & study programs.',
  },
  100: {
    monthly: 'sponsors a laptop and internet stipend for a digital bootcamper.',
    onetime: 'funds equipment & licenses for our multimedia lab.',
  },
  250: {
    monthly:
      'sponsors an entire student scholarship for our 16-week Code & AI Academy.',
    onetime: 'funds an intensive leadership retreat for 5 youth leaders.',
  },
};
