import { useEffect, useState, type FormEvent } from 'react';
import { EDUCATION_LEVELS, ROLE_LABELS } from '../data/yepSeed';
import type { EducationLevel, UserRole } from '../types/yep';

interface AuthViewProps {
  initialMode: 'signin' | 'signup';
  isSignedIn: boolean;
  currentRole: UserRole;
  currentName: string;
  currentEmail: string;
  currentCountry: string;
  currentEducation: EducationLevel;
  onSignIn: (email: string, role: UserRole) => void;
  onSignUp: (
    role: UserRole,
    fullName: string,
    email: string,
    educationLevel: EducationLevel,
    country: string
  ) => void;
  onSignOut: () => void;
}

export function AuthView({
  initialMode,
  isSignedIn,
  currentRole,
  currentName,
  currentEmail,
  currentCountry,
  currentEducation,
  onSignIn,
  onSignUp,
  onSignOut,
}: AuthViewProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [country, setCountry] = useState(currentCountry);
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>(currentEducation);
  const [role, setRole] = useState<UserRole>(currentRole);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setAuthMessage(null);
  }, [initialMode]);

  const handleSignIn = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setAuthMessage('Please enter your email address and password.');
      return;
    }
    setAuthMessage(null);
    onSignIn(email.trim(), role);
    setPassword('');
  };

  const handleSignUp = (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setAuthMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== passwordConfirm) {
      setAuthMessage('Passwords do not match.');
      return;
    }
    setAuthMessage(null);
    onSignUp(
      role,
      name.trim() || currentName,
      email.trim() || currentEmail,
      educationLevel,
      country.trim() || currentCountry
    );
    setPassword('');
    setPasswordConfirm('');
  };

  const isSignUp = mode === 'signup';
  const inputCls =
    'mt-1.5 w-full min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-base sm:text-sm font-normal';

  return (
    <div className="space-y-5">
      {isSignedIn && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Active Session
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Logged in as {currentName} ({currentEmail}) ·{' '}
              {ROLE_LABELS[currentRole]}
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            Log out
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 items-stretch">
        {/* Left Brand Column (Desktop / Laptop) */}
        <div
          className="hidden lg:flex flex-col justify-between p-10 text-white"
          style={{
            background:
              'linear-gradient(145deg, #312e81, #4f46e5 58%, #059669)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">
            {isSignUp
              ? 'Join the YEP community'
              : 'Your next chapter starts here'}
          </p>

          <div>
            <h2 className="text-3xl font-extrabold leading-tight">
              {isSignUp
                ? 'Make room for what you can become.'
                : 'Welcome back to your YEP community.'}
            </h2>
            <p className="mt-4 text-indigo-100 leading-relaxed text-sm">
              {isSignUp
                ? 'Connect with mentors, learn languages and digital skills, and work with your team to make a positive impact.'
                : 'Pick up your learning programs, reconnect with your team, and keep building a brighter future.'}
            </p>
          </div>

          <p className="text-xs text-indigo-100 font-medium">
            Active preview: {ROLE_LABELS[currentRole]} · Learn · Lead · Impact
          </p>
        </div>

        {/* Right Form Column */}
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-xs mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMessage(null);
                setMode('signin');
              }}
              className={`min-h-[42px] py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                !isSignUp
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMessage(null);
                setMode('signup');
              }}
              className={`min-h-[42px] py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                isSignUp
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {isSignUp ? 'Create your YEP account' : 'Log in to YEP'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isSignUp
                ? 'Choose your role and education level to personalize your workspace.'
                : 'Enter your email, password, and role to access your dashboard.'}
            </p>
          </div>

          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Full name
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputCls}
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Country
                  <input
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Your country"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Joining as
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className={inputCls}
                  >
                    <option value="youth">Youth participant</option>
                    <option value="mentor">Mentor</option>
                    <option value="facilitator">Facilitator</option>
                    <option value="administrator">
                      Administrator (demo preview only)
                    </option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Education level
                  <select
                    name="educationLevel"
                    value={educationLevel}
                    onChange={(e) =>
                      setEducationLevel(e.target.value as EducationLevel)
                    }
                    className={inputCls}
                  >
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Create password
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className={inputCls}
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Confirm password
                  <input
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Enter password again"
                    className={inputCls}
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Sign up & Open Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={inputCls}
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Workspace role
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className={inputCls}
                >
                  <option value="youth">Youth participant</option>
                  <option value="mentor">Mentor</option>
                  <option value="facilitator">Facilitator</option>
                  <option value="administrator">Administrator</option>
                </select>
              </label>

              <button
                type="submit"
                className="w-full min-h-[48px] py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Log in
              </button>
            </form>
          )}

          {authMessage && (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 text-sm text-amber-900 dark:text-amber-200"
            >
              {authMessage}
            </p>
          )}

          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
            {isSignUp ? 'Already have an account? ' : 'New to YEP? '}
            <button
              type="button"
              onClick={() => {
                setAuthMessage(null);
                setMode(isSignUp ? 'signin' : 'signup');
              }}
              className="font-bold text-brand-700 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 underline-offset-2 hover:underline cursor-pointer"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>

          <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Front-end workspace session: changes save in your browser.
            Production accounts and approved administrator permissions require a
            secure backend authentication service.
          </p>
        </div>
      </div>
    </div>
  );
}
