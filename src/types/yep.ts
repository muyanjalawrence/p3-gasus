export type UserRole = 'youth' | 'mentor' | 'facilitator' | 'administrator';

export type EducationLevel =
  | 'O Level'
  | 'A Level'
  | 'Diploma'
  | 'Bachelor’s'
  | 'Master’s'
  | 'PhD';

export type AppSection =
  | 'dashboard'
  | 'learning'
  | 'exchanges'
  | 'team'
  | 'assessments'
  | 'messages'
  | 'users'
  | 'reports'
  | 'programs'
  | 'community'
  | 'donate'
  | 'account';

export type LearningCategory =
  | 'all'
  | 'languages'
  | 'coding'
  | 'digital'
  | 'career';

export interface LearningLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  practicePrompt: string;
  practiceOptions: string[];
  correctOptionIndex: number;
}

export interface ProgramQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
}

export interface LearningCourse {
  id: string;
  category: Exclude<LearningCategory, 'all'>;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate';
  totalDuration: string;
  lessons: LearningLesson[];
  assessmentQuestions: ProgramQuestion[];
}

export interface ActivityItem {
  id: string;
  title: string;
  level: string;
  date: string;
  spots: number;
  enrolled: boolean;
}

export interface TeamProject {
  id: string;
  title: string;
  theme: string;
  brief: string;
  progressNote: string;
  status: string;
  mentorFeedback: string;
}

export interface TeamGroup {
  id: string;
  name: string;
  mentorName: string;
  createdAt: string;
  members: string[];
  project: TeamProject;
}

export interface AssessmentItem {
  id: string;
  programId: string;
  programTitle: string;
  participantName: string;
  title: string;
  due: string;
  status: 'Not started' | 'In progress' | 'Submitted' | 'Graded';
  score: string;
  feedback: string;
  answers?: Record<string, number>;
}

export interface MessageItem {
  id: string;
  from: string;
  to: string;
  text: string;
  time: string;
  isRead: boolean;
  flagged?: boolean;
}

export interface CertificateItem {
  id: string;
  recipient: string;
  programId: string;
  programTitle: string;
  certType: string;
  issueDate: string;
  issuer: string;
}

export interface DirectoryUser {
  id: string;
  name: string;
  role: string;
  detail: string;
  country: string;
  completedProgramIds?: string[];
}

export interface YepWorkspaceState {
  role: UserRole;
  section: AppSection;
  isSignedIn: boolean;
  userName: string;
  userEmail: string;
  country: string;
  educationLevel: EducationLevel;
  points: number;
  programs: LearningCourse[];
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  activities: ActivityItem[];
  teams: TeamGroup[];
  assessments: AssessmentItem[];
  messages: MessageItem[];
  certificates: CertificateItem[];
  notices: string[];
  directoryUsers: DirectoryUser[];
}

export interface EventItem {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  location: string;
  ctaLabel: string;
  badgeTone: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
