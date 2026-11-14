import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { AuthView } from './components/AuthView';
import { CommunityView, DonateView } from './components/CommunityViews';
import { DigitalLearningView } from './components/DigitalLearningView';
import { ModalSheet } from './components/ModalSheet';
import { WorkspaceViews } from './components/WorkspaceViews';
import { APP_SEED, ROLE_LABELS } from './data/yepSeed';
import type {
  AppSection,
  EducationLevel,
  LearningCourse,
  UserRole,
  YepWorkspaceState,
} from './types/yep';

const STORAGE_KEY = 'yepWorkspaceApp';
const THEME_STORAGE_KEY = 'yepTheme';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Ignore storage read errors
  }
  return 'light';
}

function loadWorkspaceState(): YepWorkspaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return APP_SEED;
    const parsed = JSON.parse(raw) as Partial<YepWorkspaceState>;

    const savedPrograms =
      Array.isArray(parsed.programs) && parsed.programs.length > 0
        ? parsed.programs.map((prog) => {
            const seedMatch = APP_SEED.programs.find((s) => s.id === prog.id);
            return {
              ...prog,
              assessmentQuestions:
                Array.isArray(prog.assessmentQuestions) &&
                prog.assessmentQuestions.length > 0
                  ? prog.assessmentQuestions
                  : seedMatch?.assessmentQuestions || [],
            };
          })
        : APP_SEED.programs;

    const savedAssessments = Array.isArray(parsed.assessments)
      ? parsed.assessments.map((a) => ({
          ...a,
          programId: a.programId || savedPrograms[0]?.id || 'lang-english',
          programTitle:
            a.programTitle ||
            savedPrograms[0]?.title ||
            'Conversational English for Global Teams',
          participantName:
            a.participantName || parsed.userName || APP_SEED.userName,
        }))
      : APP_SEED.assessments;

    const savedCertificates = Array.isArray(parsed.certificates)
      ? parsed.certificates.map((c) => ({
          ...c,
          programId: c.programId || savedPrograms[0]?.id || 'lang-english',
          programTitle:
            c.programTitle || c.certType || 'YEP Learning Program',
        }))
      : APP_SEED.certificates;

    return {
      ...APP_SEED,
      ...parsed,
      programs: savedPrograms,
      teams:
        Array.isArray(parsed.teams) && parsed.teams.length > 0
          ? parsed.teams
          : APP_SEED.teams,
      assessments: savedAssessments,
      certificates: savedCertificates,
      directoryUsers: Array.isArray(parsed.directoryUsers)
        ? parsed.directoryUsers
        : APP_SEED.directoryUsers,
      enrolledCourseIds: Array.isArray(parsed.enrolledCourseIds)
        ? parsed.enrolledCourseIds
        : APP_SEED.enrolledCourseIds,
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : APP_SEED.completedLessonIds,
    };
  } catch {
    return APP_SEED;
  }
}

export default function App() {
  const [workspace, setWorkspace] = useState<YepWorkspaceState>(() =>
    loadWorkspaceState()
  );
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme());
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [rsvpedIds, setRsvpedIds] = useState<string[]>([]);
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [focusedProgramId, setFocusedProgramId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }, [workspace]);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = window.setTimeout(() => setToastMsg(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toastMsg]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  const selectSection = (section: AppSection) => {
    setWorkspace((prev) => ({
      ...prev,
      section: section === 'programs' ? 'learning' : section,
    }));
  };

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setWorkspace((prev) => ({ ...prev, section: 'account' }));
  };

  const changeRole = (role: UserRole) => {
    setWorkspace((prev) => ({ ...prev, role, section: 'dashboard' }));
    showToast(`Switched workspace view to ${ROLE_LABELS[role]}.`);
  };

  const handleSignIn = (email: string, role: UserRole) => {
    setWorkspace((prev) => ({
      ...prev,
      isSignedIn: true,
      userEmail: email,
      role,
      section: 'dashboard',
    }));
    showToast(`Logged in as ${email} (${ROLE_LABELS[role]}).`);
  };

  const handleSignUp = (
    role: UserRole,
    fullName: string,
    email: string,
    educationLevel: EducationLevel,
    country: string
  ) => {
    setWorkspace((prev) => {
      const existsInDir = prev.directoryUsers.some(
        (u) => u.name.toLowerCase() === fullName.toLowerCase()
      );
      const nextDirectory = existsInDir
        ? prev.directoryUsers
        : [
            ...prev.directoryUsers,
            {
              id: `U${Date.now()}`,
              name: fullName,
              role: ROLE_LABELS[role],
              detail: role === 'youth' ? educationLevel : 'Community',
              country,
              completedProgramIds: [],
            },
          ];

      return {
        ...prev,
        isSignedIn: true,
        role,
        section: 'dashboard',
        userName: fullName,
        userEmail: email,
        educationLevel,
        country,
        directoryUsers: nextDirectory,
      };
    });
    showToast(`Welcome, ${fullName}! ${ROLE_LABELS[role]} workspace ready.`);
  };

  const handleSignOut = () => {
    setWorkspace((prev) => ({
      ...prev,
      isSignedIn: false,
      section: 'account',
    }));
    setAuthMode('signin');
    showToast('You have logged out.');
  };

  const handleEnrolCourse = (courseId: string) => {
    const program = workspace.programs.find((p) => p.id === courseId);
    setWorkspace((prev) => ({
      ...prev,
      enrolledCourseIds: prev.enrolledCourseIds.includes(courseId)
        ? prev.enrolledCourseIds
        : [...prev.enrolledCourseIds, courseId],
    }));
    if (program && !workspace.enrolledCourseIds.includes(courseId)) {
      showToast(
        `Selected "${program.title}". Its lessons and assessment questions are now unlocked.`
      );
    }
  };

  const handleAddProgram = (program: LearningCourse) => {
    setWorkspace((prev) => ({
      ...prev,
      programs: [program, ...prev.programs],
    }));
    showToast(
      `Published "${program.title}" (${program.lessons.length} lessons, ${program.assessmentQuestions.length} assessment questions).`
    );
  };

  const handleCompleteLesson = (lessonId: string, program: LearningCourse) => {
    setWorkspace((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      const nextCompletedLessons = [...prev.completedLessonIds, lessonId];
      const allProgramLessonsDone = program.lessons.every((l) =>
        nextCompletedLessons.includes(l.id)
      );
      const nextDirectory = allProgramLessonsDone
        ? prev.directoryUsers.map((u) => {
            if (
              u.name.trim().toLowerCase() ===
              prev.userName.trim().toLowerCase()
            ) {
              const existing = u.completedProgramIds || [];
              return {
                ...u,
                completedProgramIds: existing.includes(program.id)
                  ? existing
                  : [...existing, program.id],
              };
            }
            return u;
          })
        : prev.directoryUsers;

      return {
        ...prev,
        points: prev.points + 15,
        completedLessonIds: nextCompletedLessons,
        directoryUsers: nextDirectory,
      };
    });
    showToast(`Lesson completed in ${program.title} (+15 learning points).`);
  };

  const handleGoToAssessments = (programId?: string) => {
    if (programId) {
      setFocusedProgramId(programId);
    }
    setWorkspace((prev) => ({ ...prev, section: 'assessments' }));
  };

  const handleResetDemo = () => {
    setWorkspace(APP_SEED);
    showToast('Demo workspace reset.');
  };

  const handleRsvp = (eventId: string, title: string) => {
    setRsvpedIds((prev) =>
      prev.includes(eventId) ? prev : [...prev, eventId]
    );
    showToast(
      `RSVP Confirmed for ${title}! We’ll send the pass to your calendar.`
    );
  };

  const handleVolunteerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVolunteerOpen(false);
    event.currentTarget.reset();
    showToast('Thank you! A YEP coordinator will be in touch within 48 hours.');
  };

  const youthTeam = workspace.teams.find((t) =>
    t.members.some(
      (m) =>
        m.split('·')[0].trim().toLowerCase() ===
        workspace.userName.trim().toLowerCase()
    )
  );
  const unreadCount =
    workspace.role === 'youth'
      ? youthTeam
        ? workspace.messages.filter(
            (m) => !m.isRead && m.to === youthTeam.name
          ).length
        : 0
      : workspace.messages.filter((m) => !m.isRead).length;

  return (
    <>
      <AppShell
        activeSection={
          workspace.section === 'programs' ? 'learning' : workspace.section
        }
        activeRole={workspace.role}
        theme={theme}
        isSignedIn={workspace.isSignedIn}
        userName={workspace.userName}
        unreadCount={unreadCount}
        onSelectSection={selectSection}
        onOpenAuth={openAuth}
        onSignOut={handleSignOut}
        onChangeRole={changeRole}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
        }
        onOpenVolunteer={() => setVolunteerOpen(true)}
        onResetDemo={handleResetDemo}
      >
        {workspace.section === 'learning' ||
        workspace.section === 'programs' ? (
          <DigitalLearningView
            role={workspace.role}
            programs={workspace.programs}
            enrolledCourseIds={workspace.enrolledCourseIds}
            completedLessonIds={workspace.completedLessonIds}
            onEnrolCourse={handleEnrolCourse}
            onAddProgram={handleAddProgram}
            onCompleteLesson={handleCompleteLesson}
            onGoToAssessments={handleGoToAssessments}
          />
        ) : workspace.section === 'community' ? (
          <CommunityView
            rsvpedIds={rsvpedIds}
            onRsvp={handleRsvp}
            onToast={showToast}
          />
        ) : workspace.section === 'donate' ? (
          <DonateView
            onOpenVolunteer={() => setVolunteerOpen(true)}
            onToast={showToast}
          />
        ) : workspace.section === 'account' ? (
          <AuthView
            initialMode={authMode}
            isSignedIn={workspace.isSignedIn}
            currentRole={workspace.role}
            currentName={workspace.userName}
            currentEmail={workspace.userEmail}
            currentCountry={workspace.country}
            currentEducation={workspace.educationLevel}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onSignOut={handleSignOut}
          />
        ) : (
          <WorkspaceViews
            state={workspace}
            focusedProgramId={focusedProgramId}
            onClearFocusedProgram={() => setFocusedProgramId(null)}
            onChangeState={setWorkspace}
            onNavigate={selectSection}
            onToast={showToast}
          />
        )}
      </AppShell>

      {/* Volunteer Modal / Bottom Sheet */}
      <ModalSheet
        open={volunteerOpen}
        title="Get Involved with YEP"
        subtitle="Join our network of passionate mentors, tutors, and event volunteers."
        onClose={() => setVolunteerOpen(false)}
      >
        <form onSubmit={handleVolunteerSubmit} className="space-y-4">
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
            Full Name
            <input
              type="text"
              required
              placeholder="Alex Morgan"
              className="mt-1.5 w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </label>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
            Email Address
            <input
              type="email"
              required
              placeholder="alex@example.com"
              className="mt-1.5 w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </label>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
            Area of Interest
            <select className="mt-1.5 w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100">
              <option>1-on-1 Youth Mentorship</option>
              <option>Academic Tutoring (STEM / Humanities)</option>
              <option>Tech & Coding Workshop Instructor</option>
              <option>Event Planning & Operations</option>
              <option>Corporate Partnership</option>
            </select>
          </label>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
            Tell us briefly about your background
            <textarea
              rows={3}
              placeholder="Share your experience and motivation..."
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </label>
          <button
            type="submit"
            className="w-full min-h-[48px] py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Submit Application
          </button>
        </form>
      </ModalSheet>

      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-18 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-slate-900 dark:bg-slate-800 dark:border dark:border-slate-700 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}
    </>
  );
}
