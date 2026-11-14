import { useEffect, useState, type FormEvent } from 'react';
import {
  Award,
  CheckCircle2,
  Edit3,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  EDUCATION_LEVELS,
  PROJECT_THEMES,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
} from '../data/yepSeed';
import type {
  AppSection,
  EducationLevel,
  LearningCourse,
  TeamGroup,
  YepWorkspaceState,
} from '../types/yep';

interface WorkspaceViewsProps {
  state: YepWorkspaceState;
  focusedProgramId?: string | null;
  onClearFocusedProgram?: () => void;
  onChangeState: (updater: (prev: YepWorkspaceState) => YepWorkspaceState) => void;
  onNavigate: (section: AppSection) => void;
  onToast: (message: string) => void;
}

function isCurrentUserMember(memberLabel: string, userName: string): boolean {
  const target = userName.trim().toLowerCase();
  if (!target) return false;
  const memberName = memberLabel.split('·')[0].trim().toLowerCase();
  return memberName === target;
}

function findUserTeam(state: YepWorkspaceState): TeamGroup | undefined {
  return state.teams.find((t) =>
    t.members.some((m) => isCurrentUserMember(m, state.userName))
  );
}

export function WorkspaceViews({
  state,
  focusedProgramId,
  onClearFocusedProgram,
  onChangeState,
  onNavigate,
  onToast,
}: WorkspaceViewsProps) {
  const [messageInput, setMessageInput] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Youth participant');
  const [newUserDetail, setNewUserDetail] = useState('O Level');
  const [newUserCountry, setNewUserCountry] = useState('Kenya');

  const [showCreateSession, setShowCreateSession] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionLevel, setSessionLevel] = useState('Level 1 exchange');
  const [sessionDate, setSessionDate] = useState('Dec 10, 2026');
  const [sessionSpots, setSessionSpots] = useState('15');

  const [gradingIndex, setGradingIndex] = useState<number | null>(null);
  const [gradeScore, setGradeScore] = useState('88');
  const [gradeFeedback, setGradeFeedback] = useState(
    'Strong reflection and clear local context.'
  );

  // Facilitator Team Builder states
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamMentorInput, setTeamMentorInput] = useState('Maya Patel · Mentor');
  const [selectedMemberLabels, setSelectedMemberLabels] = useState<string[]>(
    []
  );
  const [projectTitleInput, setProjectTitleInput] = useState('');
  const [projectThemeInput, setProjectThemeInput] = useState(PROJECT_THEMES[0]);
  const [projectBriefInput, setProjectBriefInput] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // Youth progress note input
  const myTeam = findUserTeam(state);
  const [progressDraft, setProgressDraft] = useState(
    myTeam?.project.progressNote || ''
  );

  // Mentor active team review state
  const [mentorTeamId, setMentorTeamId] = useState<string>(
    state.teams[0]?.id || ''
  );
  const activeMentorTeam =
    state.teams.find((t) => t.id === mentorTeamId) || state.teams[0];
  const [mentorReviewNotes, setMentorReviewNotes] = useState(
    activeMentorTeam?.project.mentorFeedback || ''
  );

  useEffect(() => {
    setProgressDraft(myTeam?.project.progressNote || '');
  }, [myTeam?.id, myTeam?.project.progressNote]);

  useEffect(() => {
    setMentorReviewNotes(activeMentorTeam?.project.mentorFeedback || '');
  }, [activeMentorTeam?.id, activeMentorTeam?.project.mentorFeedback]);

  const youthParticipants = state.directoryUsers.filter(
    (u) => u.role === 'Youth participant'
  );
  const [certRecipient, setCertRecipient] = useState(
    youthParticipants[0]?.name || state.userName
  );
  const [certProgramId, setCertProgramId] = useState(
    state.programs[0]?.id || ''
  );

  // Program-based assessment runner states (for Youth)
  const [activeQuizProgramId, setActiveQuizProgramId] = useState<string | null>(
    focusedProgramId || null
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (focusedProgramId) {
      setActiveQuizProgramId(focusedProgramId);
      onClearFocusedProgram?.();
    }
  }, [focusedProgramId, onClearFocusedProgram]);

  const firstName = state.userName.split(' ')[0] || 'Jordan';
  const pathwayIndex = Math.max(
    0,
    EDUCATION_LEVELS.indexOf(state.educationLevel)
  );
  const pathwayPercent = Math.round(
    ((pathwayIndex + 1) / EDUCATION_LEVELS.length) * 100
  );

  const youthDirectoryOptions = state.directoryUsers
    .filter((u) => u.role === 'Youth participant')
    .map((u) => `${u.name} · ${u.detail}`);

  const mentorOptions = state.directoryUsers
    .filter((u) => u.role === 'Mentor')
    .map((u) => `${u.name} · Mentor`);

  const visibleMessages =
    state.role === 'youth'
      ? myTeam
        ? state.messages.filter((m) => m.to === myTeam.name)
        : []
      : state.messages;

  const unreadMessagesCount = visibleMessages.filter((m) => !m.isRead).length;
  const flaggedMessagesCount = state.messages.filter((m) => m.flagged).length;
  const pendingAssessmentsCount = state.assessments.filter(
    (a) => a.status !== 'Graded'
  ).length;

  const gradedScores = state.assessments
    .map((a) => Number.parseInt(a.score, 10))
    .filter((n) => !Number.isNaN(n));
  const avgScore =
    gradedScores.length > 0
      ? `${Math.round(
          gradedScores.reduce((sum, n) => sum + n, 0) / gradedScores.length
        )}%`
      : '—';

  const stats: [string, string][] =
    state.role === 'youth'
      ? [
          ['Learning points', `${state.points}`],
          ['Selected programs', `${state.enrolledCourseIds.length}`],
          ['My group', myTeam ? myTeam.name : 'Unassigned'],
          [
            'Certificates',
            `${
              state.certificates.filter(
                (c) =>
                  c.recipient.trim().toLowerCase() ===
                  state.userName.trim().toLowerCase()
              ).length
            } earned`,
          ],
        ]
      : state.role === 'mentor'
      ? [
          ['Assigned teams', `${state.teams.length}`],
          [
            'Reviews due',
            `${
              state.teams.filter(
                (t) => t.project.status === 'Submitted for review'
              ).length
            }`,
          ],
          ['Unread messages', `${unreadMessagesCount}`],
          [
            'Youth supported',
            `${state.teams.reduce((s, t) => s + t.members.length, 0)}`,
          ],
        ]
      : state.role === 'facilitator'
      ? [
          ['Active sessions', `${state.activities.length}`],
          ['Teams created', `${state.teams.length}`],
          ['To grade', `${pendingAssessmentsCount}`],
          ['Moderation queue', `${flaggedMessagesCount}`],
        ]
      : [
          ['Learning programs', `${state.programs.length}`],
          ['Directory users', `${state.directoryUsers.length}`],
          ['Certificates issued', `${state.certificates.length}`],
          ['Avg assessment', avgScore],
        ];

  const getCompletedProgramIdsForUser = (participantName: string): string[] => {
    const dirUser = state.directoryUsers.find(
      (u) => u.name.trim().toLowerCase() === participantName.trim().toLowerCase()
    );
    const ids = new Set<string>(dirUser?.completedProgramIds || []);

    // Include programs completed via assessments
    state.assessments.forEach((a) => {
      if (
        a.participantName.trim().toLowerCase() ===
          participantName.trim().toLowerCase() &&
        (a.status === 'Graded' || a.status === 'Submitted')
      ) {
        ids.add(a.programId);
      }
    });

    // For active youth user, also check live lesson completion
    if (
      participantName.trim().toLowerCase() ===
      state.userName.trim().toLowerCase()
    ) {
      state.programs.forEach((prog) => {
        if (
          prog.lessons.length > 0 &&
          prog.lessons.every((l) => state.completedLessonIds.includes(l.id))
        ) {
          ids.add(prog.id);
        }
      });
    }
    return Array.from(ids);
  };

  const handleEnrol = (id: string) => {
    onChangeState((prev) => ({
      ...prev,
      points: prev.points + 20,
      activities: prev.activities.map((a) =>
        a.id === id
          ? { ...a, enrolled: true, spots: Math.max(0, a.spots - 1) }
          : a
      ),
    }));
    onToast('Enrolled in exchange (+20 learning points).');
  };

  const handleCreateSession = (event: FormEvent) => {
    event.preventDefault();
    if (!sessionTitle.trim()) return;
    onChangeState((prev) => ({
      ...prev,
      section: 'exchanges',
      activities: [
        ...prev.activities,
        {
          id: `A${Date.now()}`,
          title: sessionTitle.trim(),
          level: sessionLevel,
          date: sessionDate.trim() || 'Dec 10, 2026',
          spots: Math.max(1, Number(sessionSpots) || 15),
          enrolled: false,
        },
      ],
    }));
    setSessionTitle('');
    setShowCreateSession(false);
    onToast('Exchange session scheduled.');
  };

  const toggleMemberSelection = (memberLabel: string) => {
    setSelectedMemberLabels((prev) =>
      prev.includes(memberLabel)
        ? prev.filter((item) => item !== memberLabel)
        : [...prev, memberLabel]
    );
  };

  const openCreateTeamForm = () => {
    setEditingTeamId(null);
    setTeamNameInput('');
    setTeamMentorInput(mentorOptions[0] || 'Maya Patel · Mentor');
    setSelectedMemberLabels([]);
    setProjectTitleInput('');
    setProjectThemeInput(PROJECT_THEMES[0]);
    setProjectBriefInput('');
    setShowCreateTeam(true);
  };

  const openEditTeamForm = (team: TeamGroup) => {
    setEditingTeamId(team.id);
    setTeamNameInput(team.name);
    setTeamMentorInput(team.mentorName);
    setSelectedMemberLabels(team.members);
    setProjectTitleInput(team.project.title);
    setProjectThemeInput(team.project.theme);
    setProjectBriefInput(team.project.brief);
    setShowCreateTeam(true);
  };

  const handleSaveTeamByFacilitator = (event: FormEvent) => {
    event.preventDefault();
    if (!teamNameInput.trim() || !projectTitleInput.trim()) return;
    if (selectedMemberLabels.length === 0) {
      onToast('Select at least one youth participant for this group.');
      return;
    }

    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    if (editingTeamId) {
      onChangeState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === editingTeamId
            ? {
                ...t,
                name: teamNameInput.trim(),
                mentorName: teamMentorInput,
                members: selectedMemberLabels,
                project: {
                  ...t.project,
                  title: projectTitleInput.trim(),
                  theme: projectThemeInput,
                  brief:
                    projectBriefInput.trim() ||
                    'Facilitator-assigned community impact project.',
                },
              }
            : t
        ),
      }));
      onToast(`Updated group "${teamNameInput.trim()}" and assigned project.`);
    } else {
      const newTeam: TeamGroup = {
        id: `T${Date.now()}`,
        name: teamNameInput.trim(),
        mentorName: teamMentorInput,
        createdAt: today,
        members: selectedMemberLabels,
        project: {
          id: `P${Date.now()}`,
          title: projectTitleInput.trim(),
          theme: projectThemeInput,
          brief:
            projectBriefInput.trim() ||
            'Facilitator-assigned community impact project.',
          progressNote: 'Team formed — awaiting first progress update.',
          status: 'Assigned',
          mentorFeedback: 'Facilitator assigned this project to your team.',
        },
      };
      onChangeState((prev) => ({
        ...prev,
        teams: [newTeam, ...prev.teams],
      }));
      onToast(
        `Created group "${newTeam.name}" with project "${newTeam.project.title}".`
      );
    }

    setShowCreateTeam(false);
    setEditingTeamId(null);
  };

  const handleSaveYouthProgress = (event: FormEvent) => {
    event.preventDefault();
    if (!myTeam) return;
    onChangeState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === myTeam.id
          ? {
              ...t,
              project: {
                ...t.project,
                progressNote: progressDraft.trim(),
                status:
                  t.project.status === 'Assigned'
                    ? 'In progress'
                    : t.project.status,
              },
            }
          : t
      ),
    }));
    onToast('Team progress update saved.');
  };

  const handleSubmitYouthProject = () => {
    if (!myTeam) return;
    onChangeState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === myTeam.id
          ? {
              ...t,
              project: {
                ...t.project,
                progressNote: progressDraft.trim() || t.project.progressNote,
                status: 'Submitted for review',
              },
            }
          : t
      ),
    }));
    onToast('Assigned project submitted for mentor review.');
  };

  const handleMentorReview = (decision: 'Approved' | 'Needs revision') => {
    if (!activeMentorTeam) return;
    onChangeState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === activeMentorTeam.id
          ? {
              ...t,
              project: {
                ...t.project,
                status: decision,
                mentorFeedback:
                  mentorReviewNotes.trim() || t.project.mentorFeedback,
              },
            }
          : t
      ),
    }));
    onToast(`${activeMentorTeam.name} project marked as ${decision}.`);
  };

  const handleSubmitProgramAssessment = (program: LearningCourse) => {
    const questions = program.assessmentQuestions;
    if (questions.length === 0) return;

    const unanswered = questions.some((q) => quizAnswers[q.id] === undefined);
    if (unanswered) {
      onToast('Please answer every question for this program before submitting.');
      return;
    }

    const correctCount = questions.filter(
      (q) => quizAnswers[q.id] === q.correctOptionIndex
    ).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    onChangeState((prev) => {
      const existingIdx = prev.assessments.findIndex(
        (a) =>
          a.programId === program.id &&
          a.participantName.trim().toLowerCase() ===
            prev.userName.trim().toLowerCase()
      );
      const nextAssessment = {
        id:
          existingIdx >= 0
            ? prev.assessments[existingIdx].id
            : `AS-${Date.now().toString().slice(-4)}`,
        programId: program.id,
        programTitle: program.title,
        participantName: prev.userName,
        title: `${program.title} — Program Assessment`,
        due: today,
        status: 'Submitted' as const,
        score: `${pct}%`,
        feedback: `Answered ${correctCount} of ${questions.length} correctly — awaiting facilitator confirmation.`,
        answers: { ...quizAnswers },
      };

      const nextAssessments =
        existingIdx >= 0
          ? prev.assessments.map((a, idx) =>
              idx === existingIdx ? nextAssessment : a
            )
          : [nextAssessment, ...prev.assessments];

      const nextDirectory = prev.directoryUsers.map((u) => {
        if (
          u.name.trim().toLowerCase() === prev.userName.trim().toLowerCase()
        ) {
          const existingCompleted = u.completedProgramIds || [];
          return {
            ...u,
            completedProgramIds: existingCompleted.includes(program.id)
              ? existingCompleted
              : [...existingCompleted, program.id],
          };
        }
        return u;
      });

      return {
        ...prev,
        points: existingIdx >= 0 ? prev.points : prev.points + 30,
        assessments: nextAssessments,
        directoryUsers: nextDirectory,
      };
    });

    setActiveQuizProgramId(null);
    onToast(
      `${program.title} assessment submitted (${correctCount}/${questions.length} · ${pct}%).`
    );
  };

  const handleGradeSubmit = (event: FormEvent, index: number) => {
    event.preventDefault();
    const cleanScore = Math.min(100, Math.max(0, Number(gradeScore) || 85));
    onChangeState((prev) => {
      const target = prev.assessments[index];
      const nextAssessments = prev.assessments.map((a, idx) =>
        idx === index
          ? {
              ...a,
              status: 'Graded' as const,
              score: `${cleanScore}%`,
              feedback: gradeFeedback.trim() || 'Good work.',
            }
          : a
      );
      const nextDirectory = target
        ? prev.directoryUsers.map((u) => {
            if (
              u.name.trim().toLowerCase() ===
              target.participantName.trim().toLowerCase()
            ) {
              const existing = u.completedProgramIds || [];
              return {
                ...u,
                completedProgramIds: existing.includes(target.programId)
                  ? existing
                  : [...existing, target.programId],
              };
            }
            return u;
          })
        : prev.directoryUsers;

      return {
        ...prev,
        points: prev.points + 40,
        assessments: nextAssessments,
        directoryUsers: nextDirectory,
      };
    });
    setGradingIndex(null);
    onToast(`Program assessment graded (${cleanScore}%).`);
  };

  const issueCertificateForProgram = (
    recipientName: string,
    programId: string
  ) => {
    const program = state.programs.find((p) => p.id === programId);
    if (!recipientName.trim() || !program) return;

    const duplicate = state.certificates.some(
      (c) =>
        c.recipient.trim().toLowerCase() ===
          recipientName.trim().toLowerCase() && c.programId === program.id
    );
    if (duplicate) {
      onToast(
        `${recipientName} already holds a certificate for ${program.title}.`
      );
      return;
    }

    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    onChangeState((prev) => ({
      ...prev,
      certificates: [
        {
          id: `CERT-${Date.now().toString().slice(-4)}`,
          recipient: recipientName.trim(),
          programId: program.id,
          programTitle: program.title,
          certType: `${program.title} — Completion`,
          issueDate: today,
          issuer: 'YEP Administration',
        },
        ...prev.certificates,
      ],
    }));
    onToast(`Issued ${program.title} certificate to ${recipientName.trim()}.`);
  };

  const handleIssueCertificate = (event: FormEvent) => {
    event.preventDefault();
    issueCertificateForProgram(certRecipient, certProgramId);
  };

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    const targetGroup =
      state.role === 'youth'
        ? myTeam?.name || 'General'
        : activeMentorTeam?.name || 'Bright Futures';
    onChangeState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `M${Date.now()}`,
          from:
            prev.role === 'youth'
              ? `${prev.userName} · ${prev.educationLevel}`
              : `${ROLE_LABELS[prev.role]} · Demo`,
          to: targetGroup,
          text: trimmed,
          time: 'Just now',
          isRead: true,
          flagged: false,
        },
      ],
    }));
    setMessageInput('');
    onToast(`Message sent to ${targetGroup}.`);
  };

  const handleAddUser = (event: FormEvent) => {
    event.preventDefault();
    if (!newUserName.trim()) return;
    onChangeState((prev) => ({
      ...prev,
      directoryUsers: [
        ...prev.directoryUsers,
        {
          id: `U${Date.now()}`,
          name: newUserName.trim(),
          role: newUserRole,
          detail: newUserDetail.trim() || 'Member',
          country: newUserCountry.trim() || 'Global',
        },
      ],
    }));
    setNewUserName('');
    setShowAddUser(false);
    onToast('User added to the directory.');
  };

  const latestMessage =
    visibleMessages[visibleMessages.length - 1]?.text || 'No messages yet.';

  // ===================== DASHBOARD VIEW =====================
  if (state.section === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 dark:bg-slate-900 dark:border dark:border-slate-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 dark:text-brand-400">
              {ROLE_LABELS[state.role]} · {state.country}
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {state.role === 'youth'
                ? `Welcome back, ${firstName}`
                : `${ROLE_LABELS[state.role]} workspace`}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              {ROLE_DESCRIPTIONS[state.role]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {state.role === 'youth' && (
              <button
                type="button"
                onClick={() => onNavigate('learning')}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                Browse Programs & Learn
              </button>
            )}
            {state.role === 'mentor' && (
              <button
                type="button"
                onClick={() => onNavigate('team')}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                Review Projects
              </button>
            )}
            {state.role === 'facilitator' && (
              <button
                type="button"
                onClick={() => {
                  onNavigate('team');
                  openCreateTeamForm();
                }}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Create Team & Project</span>
              </button>
            )}
            {state.role === 'administrator' && (
              <button
                type="button"
                onClick={() => onNavigate('learning')}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add & Manage Programs</span>
              </button>
            )}
          </div>
        </div>

        {state.role === 'youth' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                  Education pathway
                </p>
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                  {state.educationLevel} · {pathwayPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-brand-600 transition-all duration-200"
                  style={{ width: `${pathwayPercent}%` }}
                />
              </div>
            </div>

            <select
              aria-label="Update education level"
              value={state.educationLevel}
              onChange={(e) =>
                onChangeState((prev) => ({
                  ...prev,
                  educationLevel: e.target.value as EducationLevel,
                }))
              }
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100"
            >
              {EDUCATION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
            >
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {label}
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 truncate tabular-nums">
                {value}
              </p>
            </div>
          ))}
        </div>

        {state.role === 'youth' && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AppCard
              title="Programs & Digital Learning"
              subtitle={`${state.enrolledCourseIds.length} program(s) selected · ${state.completedLessonIds.length} lessons completed across ${state.programs.length} platform programs.`}
              actionLabel="Select & learn"
              onAction={() => onNavigate('learning')}
            />
            <AppCard
              title="Program Assessments"
              subtitle={`Answer assessment questions matched to your ${state.enrolledCourseIds.length} selected program(s) · Avg score ${avgScore}.`}
              actionLabel="Open assessments"
              onAction={() => onNavigate('assessments')}
            />
            <AppCard
              title="My Group"
              subtitle={
                myTeam
                  ? `${myTeam.name} · ${myTeam.members.length} members · ${myTeam.mentorName}`
                  : 'Waiting for your facilitator to assign you to a group.'
              }
              actionLabel="View my group"
              onAction={() => onNavigate('team')}
            />
            <AppCard
              title="Assigned Impact Project"
              subtitle={
                myTeam
                  ? `${myTeam.project.title} (${myTeam.project.theme}) · ${myTeam.project.status}`
                  : 'Your facilitator will assign your group’s impact project.'
              }
              actionLabel="Open project"
              onAction={() => onNavigate('team')}
            />
            <AppCard
              title="Next exchange"
              subtitle={`${
                state.activities[0]?.title || 'Community Impact Lab'
              } · ${state.activities[0]?.date || 'Nov 24'} · ${
                state.activities[0]?.spots ?? 8
              } spots`}
              actionLabel="Browse exchanges"
              onAction={() => onNavigate('exchanges')}
            />
            <AppCard
              title="Group messages"
              subtitle={latestMessage}
              actionLabel="Open inbox"
              onAction={() => onNavigate('messages')}
            />
          </div>
        )}

        {state.role === 'mentor' && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {state.teams.map((team) => (
              <AppCard
                key={team.id}
                title={`${team.name} · ${team.project.title}`}
                subtitle={`${team.members.length} members · Status: ${team.project.status}`}
                actionLabel="Review project"
                onAction={() => {
                  setMentorTeamId(team.id);
                  setMentorReviewNotes(team.project.mentorFeedback);
                  onNavigate('team');
                }}
              />
            ))}
            <AppCard
              title="Participant messages"
              subtitle={latestMessage}
              actionLabel="Reply to teams"
              onAction={() => onNavigate('messages')}
            />
          </div>
        )}

        {state.role === 'facilitator' && (
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white">
                    Teams & Assigned Projects
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Groups you created and their assigned impact projects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('team')}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Manage teams
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {state.teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3"
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {team.name} — {team.project.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {team.members.length} members · {team.mentorName}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-brand-700 dark:text-brand-400 whitespace-nowrap">
                      {team.project.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <AppCard
                title="Schedule exchange sessions"
                subtitle={`${state.activities.length} active sessions scheduled.`}
                actionLabel="Manage sessions"
                onAction={() => onNavigate('exchanges')}
              />
              <AppCard
                title="Assessment grading"
                subtitle={`${pendingAssessmentsCount} submission(s) awaiting marks & feedback.`}
                actionLabel="Grade work"
                onAction={() => onNavigate('assessments')}
              />
              <AppCard
                title="Content moderation"
                subtitle={`${flaggedMessagesCount} flagged message(s) in queue.`}
                actionLabel="Open moderation"
                onAction={() => onNavigate('messages')}
              />
            </div>
          </div>
        )}

        {state.role === 'administrator' && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <AppCard
              title="Learning Programs"
              subtitle={`${state.programs.length} unified programs with lessons and tailored assessments. Add new programs anytime.`}
              actionLabel="Add / view programs"
              onAction={() => onNavigate('learning')}
            />
            <AppCard
              title="Program Certificates"
              subtitle={`${state.certificates.length} certificate(s) issued according to each participant’s completed program.`}
              actionLabel="Issue certificates"
              onAction={() => onNavigate('assessments')}
            />
            <AppCard
              title="Users & roles directory"
              subtitle={`${state.directoryUsers.length} registered accounts across Youth, Mentor, and Facilitator roles.`}
              actionLabel="Open directory"
              onAction={() => onNavigate('users')}
            />
            <AppCard
              title="Platform reports"
              subtitle={`Average assessment score ${avgScore} · ${state.teams.length} active teams.`}
              actionLabel="View reports"
              onAction={() => onNavigate('reports')}
            />
          </div>
        )}
      </div>
    );
  }

  // ===================== EXCHANGES / SESSIONS VIEW =====================
  if (state.section === 'exchanges') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {state.role === 'facilitator'
                ? 'Exchange sessions'
                : 'Available exchanges'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {state.role === 'facilitator'
                ? 'Schedule new exchange sessions and track remaining spots.'
                : 'Enrol in Level 1 exchanges to connect with your cohort and earn learning points.'}
            </p>
          </div>
          {state.role === 'facilitator' && (
            <button
              type="button"
              onClick={() => setShowCreateSession((prev) => !prev)}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showCreateSession ? 'Cancel' : 'Create session'}</span>
            </button>
          )}
        </div>

        {showCreateSession && state.role === 'facilitator' && (
          <form
            onSubmit={handleCreateSession}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <input
              type="text"
              required
              placeholder="Session title"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
            />
            <select
              value={sessionLevel}
              onChange={(e) => setSessionLevel(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
            >
              <option>Level 1 exchange</option>
              <option>Level 2 workshop</option>
            </select>
            <input
              type="text"
              placeholder="Start date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                placeholder="Spots"
                value={sessionSpots}
                onChange={(e) => setSessionSpots(e.target.value)}
                className="w-24 min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm tabular-nums"
              />
              <button
                type="submit"
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 text-white text-sm font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {state.activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border border-slate-200 dark:border-slate-800 rounded-2xl"
            >
              <div>
                <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">
                  {activity.level}
                </p>
                <h3 className="font-extrabold text-slate-900 dark:text-white mt-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                  {activity.date} · {activity.spots} places available
                </p>
              </div>

              {state.role === 'facilitator' ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Scheduled
                </span>
              ) : activity.enrolled ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Enrolled
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEnrol(activity.id)}
                  className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  Enrol
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===================== TEAM & IMPACT PROJECT VIEW =====================
  if (state.section === 'team') {
    // 1. FACILITATOR: Create teams, select members, and assign each team's project
    if (state.role === 'facilitator') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Team Builder & Project Assignment
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Create balanced groups across education levels and decide each
                team’s impact project.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                showCreateTeam
                  ? setShowCreateTeam(false)
                  : openCreateTeamForm()
              }
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>
                {showCreateTeam ? 'Close Form' : 'Create Team & Project'}
              </span>
            </button>
          </div>

          {showCreateTeam && (
            <form
              onSubmit={handleSaveTeamByFacilitator}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5"
            >
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {editingTeamId
                  ? 'Edit Group & Assigned Project'
                  : 'Create New Group & Assign Project'}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Group / Team Name
                  <input
                    type="text"
                    required
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    placeholder="e.g. Horizon Builders"
                    className="mt-1.5 block w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal text-base sm:text-sm"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Assign Mentor
                  <select
                    value={teamMentorInput}
                    onChange={(e) => setTeamMentorInput(e.target.value)}
                    className="mt-1.5 block w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal text-base sm:text-sm"
                  >
                    {(mentorOptions.length > 0
                      ? mentorOptions
                      : ['Maya Patel · Mentor']
                    ).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Select Youth Members for This Group
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {youthDirectoryOptions.map((memberLabel) => {
                    const checked = selectedMemberLabels.includes(memberLabel);
                    return (
                      <label
                        key={memberLabel}
                        className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 text-sm font-medium cursor-pointer transition-colors ${
                          checked
                            ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/40 text-brand-900 dark:text-brand-100'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMemberSelection(memberLabel)}
                          className="w-4 h-4 accent-brand-600"
                        />
                        <span className="truncate">{memberLabel}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Facilitator-Assigned Impact Project
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                    Project Title
                    <input
                      type="text"
                      required
                      value={projectTitleInput}
                      onChange={(e) => setProjectTitleInput(e.target.value)}
                      placeholder="e.g. Clean Water Campus Tracker"
                      className="mt-1.5 block w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal text-base sm:text-sm"
                    />
                  </label>

                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                    Project Theme
                    <select
                      value={projectThemeInput}
                      onChange={(e) => setProjectThemeInput(e.target.value)}
                      className="mt-1.5 block w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal text-base sm:text-sm"
                    >
                      {PROJECT_THEMES.map((theme) => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Project Brief & Objectives
                  <textarea
                    rows={3}
                    required
                    value={projectBriefInput}
                    onChange={(e) => setProjectBriefInput(e.target.value)}
                    placeholder="Describe what this team will build and deliver..."
                    className="mt-1.5 block w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal text-base sm:text-sm"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="min-h-[46px] px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold cursor-pointer"
                >
                  {editingTeamId
                    ? 'Save Group & Project Changes'
                    : 'Create Group & Assign Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTeam(false)}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Facilitator's Full List of Groups */}
          <div className="grid md:grid-cols-2 gap-5">
            {state.teams.map((team) => (
              <div
                key={team.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        Group · Formed {team.createdAt}
                      </p>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {team.mentorName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditTeamForm(team)}
                      className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Assigned Project · {team.project.theme}
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {team.project.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {team.project.brief}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                      Members ({team.members.length})
                    </p>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
                      {team.members.map((member) => (
                        <div
                          key={member}
                          className="py-2 text-sm text-slate-700 dark:text-slate-300"
                        >
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 2. MENTOR: Review assigned teams & facilitator-assigned projects
    if (state.role === 'mentor') {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Mentored Teams & Project Reviews
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Select a team to review its facilitator-assigned project progress
              and provide mentor feedback.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {state.teams.map((team) => {
              const selected = activeMentorTeam?.id === team.id;
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => {
                    setMentorTeamId(team.id);
                    setMentorReviewNotes(team.project.mentorFeedback);
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                    selected
                      ? 'bg-brand-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {team.name}
                </button>
              );
            })}
          </div>

          {activeMentorTeam && (
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Team Roster
                </p>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {activeMentorTeam.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeMentorTeam.mentorName} · Formed{' '}
                  {activeMentorTeam.createdAt}
                </p>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 pt-1">
                  {activeMentorTeam.members.map((member) => (
                    <div
                      key={member}
                      className="py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      {member}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Assigned Project · {activeMentorTeam.project.theme}
                    </p>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {activeMentorTeam.project.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    Status: {activeMentorTeam.project.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeMentorTeam.project.brief}
                </p>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Team Progress Note
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {activeMentorTeam.project.progressNote}
                  </p>
                </div>

                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Mentor Feedback
                  <textarea
                    rows={3}
                    value={mentorReviewNotes}
                    onChange={(e) => setMentorReviewNotes(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal text-base sm:text-sm"
                  />
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleMentorReview('Approved')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer"
                  >
                    Approve project
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMentorReview('Needs revision')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold cursor-pointer"
                  >
                    Request revision
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // 3. YOUTH PARTICIPANT (or Admin): Sees ONLY their own group name, members, and facilitator-assigned project
    if (!myTeam) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            No Group Assigned Yet
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your facilitator creates mixed-level teams and assigns each group’s
            impact project. Once your facilitator adds you ({state.userName}) to
            a group, your group name, teammates, and assigned project will
            appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
        {/* Own Group Roster ONLY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                My Assigned Group
              </p>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {myTeam.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {myTeam.mentorName} · Formed {myTeam.createdAt}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {myTeam.members.length} members
            </span>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Group Members
            </p>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
              {myTeam.members.map((member) => (
                <div
                  key={member}
                  className="py-3 text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2"
                >
                  <span>{member}</span>
                  {isCurrentUserMember(member, state.userName) && (
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-400">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facilitator-Assigned Impact Project + Youth Progress Notes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Assigned by Facilitator · {myTeam.project.theme}
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {myTeam.project.title}
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              Status: {myTeam.project.status}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Project Brief
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {myTeam.project.brief}
            </p>
          </div>

          <form onSubmit={handleSaveYouthProgress} className="space-y-4">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
              Your Team’s Progress Update
              <textarea
                rows={4}
                value={progressDraft}
                onChange={(e) => setProgressDraft(e.target.value)}
                placeholder="Share what your group has completed on this assigned project..."
                className="mt-1.5 block w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-normal text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Save progress update
              </button>
              <button
                type="button"
                onClick={handleSubmitYouthProject}
                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/40 text-sm font-bold transition-colors cursor-pointer"
              >
                Submit for mentor review
              </button>
            </div>
          </form>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/70 rounded-xl text-sm text-emerald-900 dark:text-emerald-200">
            <span className="font-bold">Mentor feedback: </span>
            {myTeam.project.mentorFeedback}
          </div>
        </div>
      </div>
    );
  }

  // ===================== ASSESSMENTS & CERTIFICATES VIEW =====================
  if (state.section === 'assessments') {
    const selectedRecipientCompletedIds =
      getCompletedProgramIdsForUser(certRecipient);
    const enrolledPrograms = state.programs.filter((p) =>
      state.enrolledCourseIds.includes(p.id)
    );
    const activeQuizProgram = enrolledPrograms.find(
      (p) => p.id === activeQuizProgramId
    );
    const myCertificates = state.certificates.filter(
      (cert) =>
        cert.recipient.trim().toLowerCase() ===
        state.userName.trim().toLowerCase()
    );

    // Build ready-to-certify items across all youth directory users
    const certificationQueue = youthParticipants.flatMap((participant) => {
      const doneIds = getCompletedProgramIdsForUser(participant.name);
      return doneIds
        .map((progId) => {
          const prog = state.programs.find((p) => p.id === progId);
          if (!prog) return null;
          const alreadyIssued = state.certificates.some(
            (c) =>
              c.recipient.trim().toLowerCase() ===
                participant.name.trim().toLowerCase() &&
              c.programId === prog.id
          );
          if (alreadyIssued) return null;
          return { participant, prog };
        })
        .filter(
          (
            entry
          ): entry is {
            participant: (typeof youthParticipants)[number];
            prog: LearningCourse;
          } => entry !== null
        );
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {state.role === 'administrator'
              ? 'Program Certificates'
              : state.role === 'facilitator'
              ? 'Program Assessment Grading'
              : 'Program Assessments & Certificates'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {state.role === 'administrator'
              ? 'Issue certificates matched to the exact learning program each participant has completed.'
              : state.role === 'facilitator'
              ? 'Review participant submissions by program, confirm scores, and add feedback.'
              : 'Answer assessment questions tailored to each program you are enrolled in and view your earned certificates.'}
          </p>
        </div>

        {state.role === 'administrator' ? (
          <div className="space-y-6">
            {/* Issue Certificate Form (Recipient -> Completed Program) */}
            <form
              onSubmit={handleIssueCertificate}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
            >
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Issue Certificate by Participant & Program
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a participant to see which programs they have done,
                  then issue a verified certificate for that program.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 items-end">
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Participant
                  <select
                    value={certRecipient}
                    onChange={(e) => {
                      const nextName = e.target.value;
                      setCertRecipient(nextName);
                      const doneIds = getCompletedProgramIdsForUser(nextName);
                      if (doneIds.length > 0) {
                        setCertProgramId(doneIds[0]);
                      }
                    }}
                    className="mt-1.5 w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100"
                  >
                    {state.directoryUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Program Completed
                  <select
                    value={certProgramId}
                    onChange={(e) => setCertProgramId(e.target.value)}
                    className="mt-1.5 w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100"
                  >
                    {state.programs.map((prog) => {
                      const done = selectedRecipientCompletedIds.includes(
                        prog.id
                      );
                      return (
                        <option key={prog.id} value={prog.id}>
                          {prog.title}{' '}
                          {done ? '— Completed' : '— Not yet completed'}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <button
                  type="submit"
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue Program Certificate</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Programs completed by{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {certRecipient}
                </span>
                :{' '}
                {selectedRecipientCompletedIds.length > 0
                  ? selectedRecipientCompletedIds
                      .map(
                        (id) =>
                          state.programs.find((p) => p.id === id)?.title || id
                      )
                      .join(' · ')
                  : 'None completed yet'}
              </p>
            </form>

            {/* Ready for Certification Queue */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Completed Programs Ready for Certificate
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Participants who finished a program and have not yet
                    received that program’s certificate.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-400 tabular-nums">
                  {certificationQueue.length} pending
                </span>
              </div>

              {certificationQueue.length === 0 ? (
                <div className="p-5 text-sm text-slate-600 dark:text-slate-400">
                  All completed programs currently have certificates issued.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {certificationQueue.map(({ participant, prog }) => (
                    <div
                      key={`${participant.id}-${prog.id}`}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {participant.name} · {prog.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {participant.detail} · {participant.country} · Program
                          completed
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          issueCertificateForProgram(participant.name, prog.id)
                        }
                        className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Issue Certificate</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Issued Certificates Ledger */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Issued Certificates Ledger ({state.certificates.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {state.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {cert.programTitle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                        Recipient: {cert.recipient} · Issued {cert.issueDate} ·{' '}
                        {cert.issuer}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {cert.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : state.role === 'facilitator' ? (
          <div className="space-y-4">
            {state.assessments.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-sm text-slate-600 dark:text-slate-400">
                No participant program assessments submitted yet.
              </div>
            ) : (
              state.assessments.map((item, index) => {
                const prog = state.programs.find(
                  (p) => p.id === item.programId
                );
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 p-4 sm:p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-brand-700 dark:text-brand-400">
                          {item.participantName} · {item.programTitle}
                        </p>
                        <h3 className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                          Submitted {item.due} · {item.status}
                          {item.score !== '—' ? ` · Score: ${item.score}` : ''}
                        </p>
                        {item.feedback && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                            Feedback: {item.feedback}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setGradingIndex(
                            gradingIndex === index ? null : index
                          );
                          const parsed = Number.parseInt(item.score, 10);
                          if (!Number.isNaN(parsed)) {
                            setGradeScore(String(parsed));
                          }
                        }}
                        className="min-h-[44px] w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors cursor-pointer"
                      >
                        {gradingIndex === index ? 'Close' : 'Review & Grade'}
                      </button>
                    </div>

                    {gradingIndex === index && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        {prog && item.answers && (
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                            <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                              Participant Answers ({prog.title})
                            </p>
                            {prog.assessmentQuestions.map((q, qIdx) => {
                              const picked = item.answers?.[q.id];
                              const correct = picked === q.correctOptionIndex;
                              return (
                                <div key={q.id} className="text-xs space-y-0.5">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    {qIdx + 1}. {q.prompt}
                                  </p>
                                  <p
                                    className={
                                      correct
                                        ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                                        : 'text-amber-700 dark:text-amber-400 font-medium'
                                    }
                                  >
                                    Answer:{' '}
                                    {picked !== undefined
                                      ? q.options[picked]
                                      : 'Unanswered'}{' '}
                                    ({correct ? 'Correct' : 'Needs review'})
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <form
                          onSubmit={(e) => handleGradeSubmit(e, index)}
                          className="grid sm:grid-cols-[120px_1fr_auto] gap-3"
                        >
                          <input
                            type="number"
                            min={0}
                            max={100}
                            required
                            value={gradeScore}
                            onChange={(e) => setGradeScore(e.target.value)}
                            aria-label="Score percentage"
                            className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm tabular-nums"
                          />
                          <input
                            type="text"
                            required
                            value={gradeFeedback}
                            onChange={(e) => setGradeFeedback(e.target.value)}
                            placeholder="Feedback for participant"
                            className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
                          />
                          <button
                            type="submit"
                            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 text-white text-sm font-bold cursor-pointer"
                          >
                            Confirm Grade
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* YOUTH PARTICIPANT: Program-Specific Assessments + Certificates */
          <div className="space-y-6">
            {enrolledPrograms.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Select a Program First
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Assessment questions are generated according to the learning
                  program you choose. Select a program in Programs & Learning to
                  unlock its assessment.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('learning')}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold cursor-pointer"
                >
                  Browse Learning Programs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledPrograms.map((program) => {
                  const submission = state.assessments.find(
                    (a) =>
                      a.programId === program.id &&
                      a.participantName.trim().toLowerCase() ===
                        state.userName.trim().toLowerCase()
                  );
                  const lessonsDone = program.lessons.filter((l) =>
                    state.completedLessonIds.includes(l.id)
                  ).length;
                  const isQuizOpen = activeQuizProgram?.id === program.id;

                  return (
                    <div
                      key={program.id}
                      className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                            {program.title}
                          </p>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-0.5">
                            Program Assessment (
                            {program.assessmentQuestions.length} questions)
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                            Lessons completed: {lessonsDone}/
                            {program.lessons.length} ·{' '}
                            {submission
                              ? `${submission.status} · Score: ${submission.score}`
                              : 'Not started'}
                          </p>
                          {submission?.feedback && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                              {submission.feedback}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isQuizOpen) {
                              setActiveQuizProgramId(null);
                            } else {
                              setQuizAnswers(submission?.answers || {});
                              setActiveQuizProgramId(program.id);
                            }
                          }}
                          className="min-h-[44px] px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {isQuizOpen
                            ? 'Hide Questions'
                            : submission
                            ? 'Review / Retake Quiz'
                            : 'Answer Assessment Questions'}
                        </button>
                      </div>

                      {isQuizOpen && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-5">
                          {program.assessmentQuestions.map((question, qIdx) => (
                            <div key={question.id} className="space-y-2.5">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {qIdx + 1}. {question.prompt}
                              </p>
                              <div className="space-y-2">
                                {question.options.map((opt, optIdx) => {
                                  const selected =
                                    quizAnswers[question.id] === optIdx;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() =>
                                        setQuizAnswers((prev) => ({
                                          ...prev,
                                          [question.id]: optIdx,
                                        }))
                                      }
                                      className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                                        selected
                                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/40 text-brand-900 dark:text-brand-100'
                                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleSubmitProgramAssessment(program)
                              }
                              className="min-h-[46px] px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white text-sm font-bold cursor-pointer"
                            >
                              Submit {program.title} Assessment
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Earned Program Certificates */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                My Program Certificates ({myCertificates.length})
              </h3>
              {myCertificates.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Complete a learning program and its assessment so an
                  administrator can issue your certificate for that program.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {myCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-800/70 flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-brand-950 dark:text-brand-100 text-sm">
                          {cert.programTitle}
                        </p>
                        <p className="text-xs text-brand-700 dark:text-brand-300 mt-1 tabular-nums">
                          Issued {cert.issueDate} · {cert.issuer} · {cert.id}
                        </p>
                      </div>
                      <Award className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===================== MESSAGES / MODERATION VIEW =====================
  if (state.section === 'messages') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {state.role === 'facilitator'
              ? 'Messaging & moderation'
              : myTeam
              ? `${myTeam.name} Messages`
              : 'Team messages'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {state.role === 'facilitator'
              ? 'Review team messages and keep conversations constructive.'
              : myTeam
              ? `Private conversation for members of ${myTeam.name} and ${myTeam.mentorName}.`
              : 'You will see your group conversation once your facilitator assigns you to a group.'}
          </p>
        </div>

        {state.role === 'youth' && !myTeam ? (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
            Group messaging becomes active once your facilitator assigns you to
            a team.
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {visibleMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-2xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {message.from}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {message.to} · {message.time}
                      {message.flagged ? ' · Flagged' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                    {message.text}
                  </p>

                  {state.role === 'facilitator' && (
                    <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700 flex flex-wrap gap-2">
                      {message.flagged && (
                        <button
                          type="button"
                          onClick={() => {
                            onChangeState((prev) => ({
                              ...prev,
                              messages: prev.messages.map((m) =>
                                m.id === message.id
                                  ? { ...m, flagged: false }
                                  : m
                              ),
                            }));
                            onToast('Message approved.');
                          }}
                          className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onChangeState((prev) => ({
                            ...prev,
                            messages: prev.messages.filter(
                              (m) => m.id !== message.id
                            ),
                          }));
                          onToast('Message removed.');
                        }}
                        className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex flex-col sm:flex-row gap-2.5 pt-2"
            >
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                required
                placeholder="Write a message..."
                className="flex-1 min-h-[46px] px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="min-h-[46px] px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  // ===================== USERS & ROLES VIEW =====================
  if (state.section === 'users') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Users & roles
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Manage participant, mentor, facilitator, and administrator records.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddUser((prev) => !prev)}
            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddUser ? 'Cancel' : 'Add user'}</span>
          </button>
        </div>

        {showAddUser && (
          <form
            onSubmit={handleAddUser}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <input
              type="text"
              required
              placeholder="Full name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
            >
              <option>Youth participant</option>
              <option>Mentor</option>
              <option>Facilitator</option>
              <option>Administrator</option>
            </select>
            <input
              type="text"
              placeholder="Level or focus"
              value={newUserDetail}
              onChange={(e) => setNewUserDetail(e.target.value)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Country"
                value={newUserCountry}
                onChange={(e) => setNewUserCountry(e.target.value)}
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 text-white text-sm font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
          {state.directoryUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.detail} · {user.country}
                </p>
              </div>
              <span className="text-xs sm:text-sm text-brand-700 dark:text-brand-400 font-semibold whitespace-nowrap">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===================== PLATFORM REPORTS VIEW =====================
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Platform reports
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          Live summary across participation, teams, assessments, and
          certificates.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <AppCard
          title="Programs & Participation"
          subtitle={`${state.programs.length} active learning programs · ${state.directoryUsers.length} directory users · ${state.teams.length} facilitator-created groups`}
        />
        <AppCard
          title="Learning & Assessments"
          subtitle={`${gradedScores.length} program assessment(s) graded · average score ${avgScore}`}
        />
        <AppCard
          title="Education-level mix"
          subtitle="Facilitators build mixed groups spanning O Level through PhD"
        />
        <AppCard
          title="Program Certificates"
          subtitle={`${state.certificates.length} verified program certificate(s) issued`}
        />
      </div>
    </div>
  );
}

function AppCard({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
      <div>
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      </div>
      {actionLabel && onAction && (
        <div>
          <button
            type="button"
            onClick={onAction}
            className="min-h-[42px] w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
