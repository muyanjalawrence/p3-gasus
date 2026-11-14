import { useMemo, useState, type FormEvent } from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Code2,
  Globe2,
  Mic,
  Plus,
  Search,
  Sparkles,
  TableProperties,
  Trash2,
} from 'lucide-react';
import type {
  LearningCategory,
  LearningCourse,
  LearningLesson,
  ProgramQuestion,
  UserRole,
} from '../types/yep';
import { ModalSheet } from './ModalSheet';

interface DigitalLearningViewProps {
  role: UserRole;
  programs: LearningCourse[];
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  onEnrolCourse: (courseId: string) => void;
  onAddProgram: (program: LearningCourse) => void;
  onCompleteLesson: (lessonId: string, program: LearningCourse) => void;
  onGoToAssessments: (programId?: string) => void;
}

const CATEGORY_TABS: { id: LearningCategory; label: string }[] = [
  { id: 'all', label: 'All Programs' },
  { id: 'languages', label: 'Languages' },
  { id: 'coding', label: 'Coding & AI' },
  { id: 'digital', label: 'Digital Skills' },
  { id: 'career', label: 'Leadership' },
];

function CategoryIcon({
  category,
}: {
  category: LearningCourse['category'];
}) {
  switch (category) {
    case 'languages':
      return <Globe2 className="w-5 h-5 text-brand-700 dark:text-brand-300" />;
    case 'coding':
      return (
        <Code2 className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
      );
    case 'digital':
      return (
        <TableProperties className="w-5 h-5 text-amber-700 dark:text-amber-300" />
      );
    case 'career':
      return <Mic className="w-5 h-5 text-slate-700 dark:text-slate-200" />;
  }
}

function categoryLabel(category: LearningCourse['category']): string {
  switch (category) {
    case 'languages':
      return 'Languages';
    case 'coding':
      return 'Coding & AI';
    case 'digital':
      return 'Digital Skills';
    case 'career':
      return 'Leadership';
  }
}

interface DraftLesson {
  title: string;
  duration: string;
  summary: string;
  practicePrompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctIndex: number;
}

interface DraftQuestion {
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctIndex: number;
}

const EMPTY_LESSON: DraftLesson = {
  title: '',
  duration: '15 min',
  summary: '',
  practicePrompt: '',
  optionA: '',
  optionB: '',
  optionC: '',
  correctIndex: 0,
};

const EMPTY_QUESTION: DraftQuestion = {
  prompt: '',
  optionA: '',
  optionB: '',
  optionC: '',
  correctIndex: 0,
};

export function DigitalLearningView({
  role,
  programs,
  enrolledCourseIds,
  completedLessonIds,
  onEnrolCourse,
  onAddProgram,
  onCompleteLesson,
  onGoToAssessments,
}: DigitalLearningViewProps) {
  const [category, setCategory] = useState<LearningCategory>('all');
  const [viewScope, setViewScope] = useState<'all' | 'selected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  // Administrator: Add Program Modal
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [progTitle, setProgTitle] = useState('');
  const [progSubtitle, setProgSubtitle] = useState('');
  const [progCategory, setProgCategory] =
    useState<LearningCourse['category']>('coding');
  const [progLevel, setProgLevel] =
    useState<LearningCourse['level']>('Beginner');
  const [progDuration, setProgDuration] = useState('45 min');
  const [draftLessons, setDraftLessons] = useState<DraftLesson[]>([
    {
      title: '1. Core Concepts & Setup',
      duration: '15 min',
      summary: 'Introduce key concepts and real-world community applications.',
      practicePrompt: 'What is the first goal of this program module?',
      optionA: 'Understand core principles and practical team application',
      optionB: 'Skip planning completely',
      optionC: 'Ignore community context',
      correctIndex: 0,
    },
    {
      title: '2. Hands-On Community Practice',
      duration: '20 min',
      summary: 'Apply what you learned to a realistic neighborhood case study.',
      practicePrompt: 'How do you verify your solution works for local users?',
      optionA: 'Test with clear feedback from peers or community members',
      optionB: 'Never test before presenting',
      optionC: 'Guess without reviewing requirements',
      correctIndex: 0,
    },
  ]);
  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>([
    {
      prompt: 'Which approach shows mastery of this program’s core workflow?',
      optionA: 'Combining core concepts with clear documentation and peer review',
      optionB: 'Submitting incomplete notes with no reflection',
      optionC: 'Skipping practical application',
      correctIndex: 0,
    },
    {
      prompt: 'How should your team apply skills from this program to a YEP project?',
      optionA: 'Align deliverables with measurable neighborhood needs',
      optionB: 'Work in isolation without mentor feedback',
      optionC: 'Avoid setting milestones',
      correctIndex: 0,
    },
  ]);

  const activeCourse = useMemo(
    () => programs.find((p) => p.id === activeCourseId) || null,
    [programs, activeCourseId]
  );

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return programs.filter((course) => {
      const matchesScope =
        viewScope === 'all' || enrolledCourseIds.includes(course.id);
      const matchesCat = category === 'all' || course.category === category;
      const matchesQuery =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.subtitle.toLowerCase().includes(query) ||
        categoryLabel(course.category).toLowerCase().includes(query);
      return matchesScope && matchesCat && matchesQuery;
    });
  }, [programs, viewScope, enrolledCourseIds, category, searchQuery]);

  const totalLessons = programs.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedCount = programs.reduce(
    (sum, c) =>
      sum + c.lessons.filter((l) => completedLessonIds.includes(l.id)).length,
    0
  );

  const openCoursePlayer = (course: LearningCourse) => {
    if (!enrolledCourseIds.includes(course.id)) {
      onEnrolCourse(course.id);
    }
    const firstIncomplete = course.lessons.findIndex(
      (l) => !completedLessonIds.includes(l.id)
    );
    setActiveLessonIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
    setActiveCourseId(course.id);
  };

  const handleCreateProgram = (event: FormEvent) => {
    event.preventDefault();
    if (!progTitle.trim()) return;

    const stamp = Date.now();
    const cleanLessons: LearningLesson[] = draftLessons
      .filter((l) => l.title.trim())
      .map((l, idx) => ({
        id: `prog-${stamp}-l-${idx + 1}`,
        title: l.title.trim(),
        duration: l.duration.trim() || '15 min',
        summary:
          l.summary.trim() ||
          'Interactive lesson created for this YEP learning program.',
        practicePrompt:
          l.practicePrompt.trim() || 'Choose the strongest takeaway:',
        practiceOptions: [
          l.optionA.trim() || 'Apply the concept accurately in team practice',
          l.optionB.trim() || 'Skip verification steps',
          l.optionC.trim() || 'Work without a clear objective',
        ],
        correctOptionIndex: l.correctIndex,
      }));

    const cleanQuestions: ProgramQuestion[] = draftQuestions
      .filter((q) => q.prompt.trim())
      .map((q, idx) => ({
        id: `prog-${stamp}-q-${idx + 1}`,
        prompt: q.prompt.trim(),
        options: [
          q.optionA.trim() || 'Correct program practice',
          q.optionB.trim() || 'Incomplete approach',
          q.optionC.trim() || 'Unrelated choice',
        ],
        correctOptionIndex: q.correctIndex,
      }));

    if (cleanLessons.length === 0 || cleanQuestions.length === 0) return;

    const newProgram: LearningCourse = {
      id: `prog-${stamp}`,
      category: progCategory,
      title: progTitle.trim(),
      subtitle:
        progSubtitle.trim() ||
        'Hands-on YEP program combining self-paced lessons and practical assessment.',
      level: progLevel,
      totalDuration: progDuration.trim() || '45 min',
      lessons: cleanLessons,
      assessmentQuestions: cleanQuestions,
    };

    onAddProgram(newProgram);
    setProgTitle('');
    setProgSubtitle('');
    setShowAddProgram(false);
  };

  const currentLesson: LearningLesson | undefined =
    activeCourse?.lessons[activeLessonIndex];
  const chosenOption = currentLesson
    ? selectedAnswers[currentLesson.id]
    : undefined;
  const isCurrentCompleted = currentLesson
    ? completedLessonIds.includes(currentLesson.id)
    : false;
  const activeCourseAllDone = activeCourse
    ? activeCourse.lessons.every((l) => completedLessonIds.includes(l.id))
    : false;

  const modalInputCls =
    'mt-1.5 w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100';

  return (
    <div className="space-y-6">
      {/* Header & Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Unified Programs & Digital Learning
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            YEP Learning Programs
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Select a program you want to do, complete its interactive lessons,
            answer assessment questions tailored to that program, and earn your
            verified program certificate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-2xl px-4 py-3">
            <BookOpenCheck className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {programs.length} programs · Lessons done
              </p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {completedCount} / {totalLessons}
              </p>
            </div>
          </div>

          {role === 'administrator' && (
            <button
              type="button"
              onClick={() => setShowAddProgram(true)}
              className="min-h-[46px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Program</span>
            </button>
          )}
        </div>
      </div>

      {/* Scope Toggle, Category Tabs & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setViewScope('all')}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  viewScope === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Programs ({programs.length})
              </button>
              <button
                type="button"
                onClick={() => setViewScope('selected')}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  viewScope === 'selected'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                My Selected Programs ({enrolledCourseIds.length})
              </button>
            </div>
          </div>

          <label className="relative block md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs, languages, Python..."
              aria-label="Search learning programs"
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORY_TABS.map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id)}
                  className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-brand-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-base font-bold text-slate-900 dark:text-white">
            No matching programs found
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {viewScope === 'selected'
              ? 'You have not selected a program in this filter yet. Browse All Programs to pick one.'
              : 'Try clearing your search or selecting All Programs.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setViewScope('all');
              setCategory('all');
              setSearchQuery('');
            }}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold cursor-pointer"
          >
            Show all programs
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredCourses.map((course) => {
            const doneCount = course.lessons.filter((l) =>
              completedLessonIds.includes(l.id)
            ).length;
            const total = course.lessons.length;
            const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
            const enrolled = enrolledCourseIds.includes(course.id);

            return (
              <article
                key={course.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <CategoryIcon category={course.category} />
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums text-right">
                      {categoryLabel(course.category)} · {course.level}
                      {enrolled ? ' · Selected' : ''}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.totalDuration} · {total} lessons ·{' '}
                      {course.assessmentQuestions.length} quiz Qs
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {doneCount}/{total} done
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-brand-600 transition-all duration-200"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => openCoursePlayer(course)}
                      className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                        doneCount === total
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/70'
                          : 'bg-brand-600 hover:bg-brand-700 text-white'
                      }`}
                    >
                      {doneCount === total
                        ? 'Review Lessons'
                        : enrolled
                        ? 'Continue Program'
                        : 'Select & Start'}
                    </button>

                    {enrolled && (
                      <button
                        type="button"
                        onClick={() => onGoToAssessments(course.id)}
                        title="Open assessment questions for this program"
                        className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ClipboardCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        <span>Assessment</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive Lesson Player Modal / Mobile Bottom Sheet */}
      <ModalSheet
        open={Boolean(activeCourse)}
        title={activeCourse?.title || 'Program Lesson'}
        subtitle={
          activeCourse
            ? `${categoryLabel(activeCourse.category)} · ${activeCourse.level}`
            : undefined
        }
        onClose={() => setActiveCourseId(null)}
      >
        {activeCourse && currentLesson && (
          <div className="space-y-5">
            {/* Lesson Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {activeCourse.lessons.map((lesson, idx) => {
                const done = completedLessonIds.includes(lesson.id);
                const selected = idx === activeLessonIndex;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-slate-900 dark:bg-brand-600 text-white'
                        : done
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/70'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Lesson {idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  {currentLesson.title}
                </h4>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums">
                  {currentLesson.duration}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentLesson.summary}
              </p>
            </div>

            {/* Interactive Quick Check */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Practice Check</span>
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {currentLesson.practicePrompt}
              </p>

              <div className="space-y-2">
                {currentLesson.practiceOptions.map((option, optIdx) => {
                  const isPicked = chosenOption === optIdx;
                  const isCorrect =
                    optIdx === currentLesson.correctOptionIndex;
                  let btnStyle =
                    'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70';
                  if (isPicked && isCorrect) {
                    btnStyle =
                      'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200';
                  } else if (isPicked && !isCorrect) {
                    btnStyle =
                      'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200';
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [currentLesson.id]: optIdx,
                        }))
                      }
                      className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {chosenOption !== undefined && (
                <p
                  className={`text-xs font-bold ${
                    chosenOption === currentLesson.correctOptionIndex
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {chosenOption === currentLesson.correctOptionIndex
                    ? 'Correct! You are ready to mark this lesson complete.'
                    : 'Not quite — review the lesson summary above and try another option.'}
                </p>
              )}
            </div>

            {/* Complete / Next / Assessment Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {isCurrentCompleted ? (
                <span className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Lesson Completed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onCompleteLesson(currentLesson.id, activeCourse);
                    if (activeLessonIndex < activeCourse.lessons.length - 1) {
                      setActiveLessonIndex((prev) => prev + 1);
                    }
                  }}
                  className="flex-1 min-h-[46px] px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  Complete Lesson (+15 pts)
                </button>
              )}

              {activeLessonIndex < activeCourse.lessons.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveLessonIndex((prev) => prev + 1)}
                  className="min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold cursor-pointer"
                >
                  Next Lesson
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const id = activeCourse.id;
                    setActiveCourseId(null);
                    onGoToAssessments(id);
                  }}
                  className="min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-bold cursor-pointer"
                >
                  {activeCourseAllDone
                    ? 'Take Program Assessment'
                    : 'Open Program Assessment'}
                </button>
              )}
            </div>
          </div>
        )}
      </ModalSheet>

      {/* Administrator: Add New Program Modal */}
      <ModalSheet
        open={showAddProgram}
        title="Add New Learning Program"
        subtitle="Create a unified program with lessons and program-specific assessment questions."
        onClose={() => setShowAddProgram(false)}
      >
        <form onSubmit={handleCreateProgram} className="space-y-5">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
              Program Title
              <input
                type="text"
                required
                value={progTitle}
                onChange={(e) => setProgTitle(e.target.value)}
                placeholder="e.g. Creative Media & Podcasting"
                className={modalInputCls}
              />
            </label>

            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
              Program Overview
              <textarea
                rows={2}
                required
                value={progSubtitle}
                onChange={(e) => setProgSubtitle(e.target.value)}
                placeholder="Describe what participants will learn and build..."
                className="mt-1.5 w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base sm:text-sm font-normal text-slate-900 dark:text-slate-100"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Category
                <select
                  value={progCategory}
                  onChange={(e) =>
                    setProgCategory(
                      e.target.value as LearningCourse['category']
                    )
                  }
                  className={modalInputCls}
                >
                  <option value="languages">Languages</option>
                  <option value="coding">Coding & AI</option>
                  <option value="digital">Digital Skills</option>
                  <option value="career">Leadership</option>
                </select>
              </label>

              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Level
                <select
                  value={progLevel}
                  onChange={(e) =>
                    setProgLevel(e.target.value as LearningCourse['level'])
                  }
                  className={modalInputCls}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                </select>
              </label>

              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                Duration
                <input
                  type="text"
                  value={progDuration}
                  onChange={(e) => setProgDuration(e.target.value)}
                  placeholder="45 min"
                  className={modalInputCls}
                />
              </label>
            </div>
          </div>

          {/* Lessons Builder */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Program Lessons ({draftLessons.length})
              </p>
              <button
                type="button"
                onClick={() =>
                  setDraftLessons((prev) => [
                    ...prev,
                    {
                      ...EMPTY_LESSON,
                      title: `${prev.length + 1}. New Lesson`,
                    },
                  ])
                }
                className="min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lesson</span>
              </button>
            </div>

            {draftLessons.map((lesson, idx) => (
              <div
                key={`lesson-draft-${idx}`}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Lesson {idx + 1}
                  </span>
                  {draftLessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setDraftLessons((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={lesson.title}
                  onChange={(e) =>
                    setDraftLessons((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, title: e.target.value } : item
                      )
                    )
                  }
                  placeholder="Lesson title"
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
                />
                <input
                  type="text"
                  required
                  value={lesson.summary}
                  onChange={(e) =>
                    setDraftLessons((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, summary: e.target.value } : item
                      )
                    )
                  }
                  placeholder="Short lesson summary"
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Program Assessment Questions Builder */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Program Assessment Questions ({draftQuestions.length})
              </p>
              <button
                type="button"
                onClick={() =>
                  setDraftQuestions((prev) => [...prev, { ...EMPTY_QUESTION }])
                }
                className="min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {draftQuestions.map((q, idx) => (
              <div
                key={`question-draft-${idx}`}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Question {idx + 1}
                  </span>
                  {draftQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setDraftQuestions((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={q.prompt}
                  onChange={(e) =>
                    setDraftQuestions((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, prompt: e.target.value } : item
                      )
                    )
                  }
                  placeholder="Assessment question prompt"
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
                />
                <div className="grid sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={q.optionA}
                    onChange={(e) =>
                      setDraftQuestions((prev) =>
                        prev.map((item, i) =>
                          i === idx
                            ? { ...item, optionA: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Option A (Correct)"
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={q.optionB}
                    onChange={(e) =>
                      setDraftQuestions((prev) =>
                        prev.map((item, i) =>
                          i === idx
                            ? { ...item, optionB: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Option B"
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={q.optionC}
                    onChange={(e) =>
                      setDraftQuestions((prev) =>
                        prev.map((item, i) =>
                          i === idx
                            ? { ...item, optionC: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="Option C"
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full min-h-[46px] py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Publish Program to Platform
          </button>
        </form>
      </ModalSheet>
    </div>
  );
}
