import { useState, type ReactNode } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Compass,
  FolderKanban,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  RotateCcw,
  Sun,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';
import { ROLE_LABELS } from '../data/yepSeed';
import type { AppSection, UserRole } from '../types/yep';

interface AppShellProps {
  activeSection: AppSection;
  activeRole: UserRole;
  theme: 'light' | 'dark';
  isSignedIn: boolean;
  userName: string;
  unreadCount: number;
  onSelectSection: (section: AppSection) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onChangeRole: (role: UserRole) => void;
  onToggleTheme: () => void;
  onOpenVolunteer: () => void;
  onResetDemo: () => void;
  children: ReactNode;
}

interface NavItem {
  id: AppSection;
  label: string;
  badge?: string;
}

function getWorkspaceNav(role: UserRole, unreadCount: number): NavItem[] {
  const msgBadge = unreadCount > 0 ? String(unreadCount) : undefined;
  if (role === 'mentor') {
    return [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'learning', label: 'Programs & Learning' },
      { id: 'team', label: 'Teams & Projects' },
      { id: 'messages', label: 'Messages', badge: msgBadge },
    ];
  }
  if (role === 'facilitator') {
    return [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'learning', label: 'Programs & Learning' },
      { id: 'exchanges', label: 'Sessions' },
      { id: 'team', label: 'Team Builder' },
      { id: 'assessments', label: 'Grading' },
      { id: 'messages', label: 'Moderation', badge: msgBadge },
    ];
  }
  if (role === 'administrator') {
    return [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'learning', label: 'Programs & Learning' },
      { id: 'users', label: 'Users & Roles' },
      { id: 'assessments', label: 'Certificates' },
      { id: 'reports', label: 'Reports' },
    ];
  }
  return [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'learning', label: 'Programs & Learning' },
    { id: 'exchanges', label: 'Exchanges' },
    { id: 'team', label: 'Team & Project' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'messages', label: 'Messages', badge: msgBadge },
  ];
}

const COMMUNITY_NAV: NavItem[] = [
  { id: 'community', label: 'Events & Stories' },
  { id: 'donate', label: 'Support YEP' },
];

const SECTION_TITLES: Record<AppSection, string> = {
  dashboard: 'Dashboard',
  learning: 'Programs & Learning',
  exchanges: 'Exchanges & Sessions',
  team: 'Team & Impact Project',
  assessments: 'Assessments & Certificates',
  messages: 'Messages',
  users: 'Users & Roles',
  reports: 'Platform Reports',
  programs: 'Programs & Learning',
  community: 'Events & Community',
  donate: 'Support YEP',
  account: 'Account & Auth',
};

function SectionIcon({ id, className }: { id: AppSection; className?: string }) {
  const cls = className || 'w-4 h-4 shrink-0';
  switch (id) {
    case 'dashboard':
      return <LayoutDashboard className={cls} />;
    case 'learning':
      return <GraduationCap className={cls} />;
    case 'exchanges':
      return <BookOpen className={cls} />;
    case 'team':
      return <FolderKanban className={cls} />;
    case 'assessments':
      return <ClipboardCheck className={cls} />;
    case 'messages':
      return <MessageSquare className={cls} />;
    case 'users':
      return <Users className={cls} />;
    case 'reports':
      return <BarChart3 className={cls} />;
    case 'programs':
      return <Compass className={cls} />;
    case 'community':
      return <CalendarDays className={cls} />;
    case 'donate':
      return <Heart className={cls} />;
    case 'account':
      return <UserCircle2 className={cls} />;
  }
}

export function AppShell({
  activeSection,
  activeRole,
  theme,
  isSignedIn,
  userName,
  unreadCount,
  onSelectSection,
  onOpenAuth,
  onSignOut,
  onChangeRole,
  onToggleTheme,
  onOpenVolunteer,
  onResetDemo,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const workspaceNav = getWorkspaceNav(activeRole, unreadCount);
  const currentTitle = SECTION_TITLES[activeSection];

  const navigate = (section: AppSection) => {
    setMobileMenuOpen(false);
    onSelectSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthScreen = (mode: 'signin' | 'signup') => {
    setMobileMenuOpen(false);
    onOpenAuth(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mobileBottomTabs: { id: AppSection; label: string }[] =
    activeRole === 'administrator'
      ? [
          { id: 'dashboard', label: 'Home' },
          { id: 'learning', label: 'Programs' },
          { id: 'users', label: 'Users' },
          { id: 'assessments', label: 'Certs' },
          { id: 'account', label: 'Account' },
        ]
      : activeRole === 'mentor'
      ? [
          { id: 'dashboard', label: 'Home' },
          { id: 'learning', label: 'Programs' },
          { id: 'team', label: 'Projects' },
          { id: 'messages', label: 'Inbox' },
          { id: 'account', label: 'Account' },
        ]
      : [
          { id: 'dashboard', label: 'Home' },
          { id: 'learning', label: 'Programs' },
          { id: 'exchanges', label: 'Exchanges' },
          { id: 'assessments', label: 'Assess' },
          { id: 'account', label: 'Account' },
        ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* ================= DESKTOP / LAPTOP SIDEBAR (lg+) ================= */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 transition-colors duration-200">
        <div className="h-16 px-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-xl bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center">
              YEP
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              YEP Portal
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Workspace
            </p>
            <nav aria-label="Workspace navigation" className="space-y-1">
              {workspaceNav.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-sm font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <SectionIcon id={item.id} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-300 tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Community
            </p>
            <nav aria-label="Community navigation" className="space-y-1">
              {COMMUNITY_NAV.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-xl flex items-center gap-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <SectionIcon id={item.id} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Role Switcher & Account Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Role
            <select
              value={activeRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="mt-1.5 w-full min-h-[40px] px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="youth">Youth participant</option>
              <option value="mentor">Mentor</option>
              <option value="facilitator">Facilitator</option>
              <option value="administrator">Administrator</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => openAuthScreen(isSignedIn ? 'signin' : 'signup')}
            className={`w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center gap-2.5 text-left transition-colors cursor-pointer ${
              activeSection === 'account'
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100'
            }`}
          >
            <UserCircle2 className="w-5 h-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold truncate">
                {isSignedIn ? userName : 'Guest preview'}
              </p>
              <p
                className={`text-[11px] truncate ${
                  activeSection === 'account'
                    ? 'text-indigo-100'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {isSignedIn ? ROLE_LABELS[activeRole] : 'Log in or sign up'}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* ================= MAIN APP COLUMN ================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Sticky Top App Bar with Theme Toggle & Auth */}
        <header className="sticky top-0 z-30 h-14 lg:h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="lg:hidden w-8 h-8 rounded-xl bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0"
                aria-label="YEP Home"
              >
                YEP
              </button>
              <div className="min-w-0">
                <p className="hidden sm:block text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  YEP Organisation · {ROLE_LABELS[activeRole]}
                </p>
                <h1 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 dark:text-white truncate">
                  {currentTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'
                }
                title={
                  theme === 'dark'
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'
                }
                className="min-h-[38px] sm:min-h-[40px] inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="hidden md:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700 shrink-0" />
                    <span className="hidden md:inline">Dark</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenVolunteer}
                className="hidden md:inline-flex min-h-[40px] items-center justify-center px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={onResetDemo}
                title="Reset workspace demo"
                className="hidden lg:inline-flex min-h-[40px] items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {isSignedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => openAuthScreen('signin')}
                    className="min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-200 bg-brand-50 dark:bg-brand-900/50 hover:bg-brand-100 dark:hover:bg-brand-900/70 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {userName.split(' ')[0]}
                  </button>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="min-h-[38px] sm:min-h-[40px] inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openAuthScreen('signin')}
                    className="min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthScreen('signup')}
                    className="min-h-[38px] sm:min-h-[40px] px-3 sm:px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Sign up
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden min-h-[42px] min-w-[42px] inline-flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-4 space-y-4 shadow-lg max-h-[78dvh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <label className="flex-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  View workspace as
                  <select
                    value={activeRole}
                    onChange={(e) => {
                      onChangeRole(e.target.value as UserRole);
                      setMobileMenuOpen(false);
                    }}
                    className="mt-1.5 w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <option value="youth">Youth participant</option>
                    <option value="mentor">Mentor</option>
                    <option value="facilitator">Facilitator</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Switch to Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-slate-700" />
                      <span>Switch to Dark</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {workspaceNav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-left ${
                      activeSection === item.id
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700'
                    }`}
                  >
                    <SectionIcon id={item.id} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => navigate('community')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-left ${
                    activeSection === 'community'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span>Events & FAQ</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('donate')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-left ${
                    activeSection === 'donate'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700'
                  }`}
                >
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>Support YEP</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthScreen('signin')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-left ${
                    activeSection === 'account'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700'
                  }`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Log in / Sign up</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenVolunteer();
                  }}
                  className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 text-white text-xs font-bold"
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onResetDemo();
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  Reset demo
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main Scrollable App Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-10">
          {children}
        </main>
      </div>

      {/* ================= MOBILE & TABLET FIXED BOTTOM TAB BAR (< lg) ================= */}
      <nav
        aria-label="Mobile and tablet app tabs"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 pb-safe bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 transition-colors duration-200"
      >
        {mobileBottomTabs.map((tab) => {
          const active = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                active
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <SectionIcon id={tab.id} className="w-5 h-5" />
              <span className="truncate max-w-full px-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
