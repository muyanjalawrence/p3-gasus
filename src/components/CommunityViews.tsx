import { useState, type FormEvent } from 'react';
import { Check, ChevronDown, Lock, MapPin } from 'lucide-react';
import {
  ALUMNI_STORIES,
  DONATION_IMPACTS,
  EVENTS,
  FAQS,
  IMPACT_METRICS,
  PILLARS,
} from '../data/yepSeed';

export function CommunityView({
  rsvpedIds,
  onRsvp,
  onToast,
}: {
  rsvpedIds: string[];
  onRsvp: (id: string, title: string) => void;
  onToast: (msg: string) => void;
}) {
  const [openFaqId, setOpenFaqId] = useState<string | null>('eligibility');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterEmail('');
    onToast('Subscribed! Welcome to the YEP community.');
  };

  return (
    <div className="space-y-8">
      {/* Impact Stats Strip */}
      <div className="bg-brand-900 dark:bg-slate-900 dark:border dark:border-slate-800 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-200 dark:text-brand-400 mb-4">
          Community Impact
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {IMPACT_METRICS.map((metric) => (
            <div key={metric.label}>
              <p className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                {metric.value}
              </p>
              <p className="text-xs sm:text-sm text-indigo-200 dark:text-slate-300 mt-1">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Upcoming Events & Workshops
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Open to youth participants, mentors, and community supporters.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {EVENTS.map((ev) => {
            const isRsvped = rsvpedIds.includes(ev.id);
            return (
              <article
                key={ev.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className={`font-bold ${ev.badgeTone} dark:text-brand-400`}>
                      {ev.date}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span>{ev.time}</span>
                  </p>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1.5">
                    {ev.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1.5 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-3 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{ev.location}</span>
                  </span>

                  {isRsvped ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      <Check className="w-4 h-4" />
                      Confirmed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRsvp(ev.id, ev.title)}
                      className="min-h-[40px] px-3.5 py-1.5 font-bold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/40 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {ev.ctaLabel}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Alumni Stories & Pillars */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Voices of YEP Alumni
          </h3>
          {ALUMNI_STORIES.map((story) => (
            <blockquote
              key={story.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                “{story.quote}”
              </p>
              <footer className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 shrink-0 rounded-full font-bold flex items-center justify-center text-xs ${story.avatarClass}`}
                >
                  {story.initials}
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {story.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {story.role}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
              Our Core Foundation
            </h3>
            <div className="space-y-3">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
                >
                  <span
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${pillar.tone} dark:bg-slate-800 dark:text-brand-300`}
                  >
                    {pillar.index}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
              Frequently Asked Questions
            </h3>
            <div className="space-y-2.5">
              {FAQS.map((item) => {
                const open = openFaqId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() =>
                        setOpenFaqId((prev) =>
                          prev === item.id ? null : item.id
                        )
                      }
                      className="w-full min-h-[50px] px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Newsletter */}
          <form
            onSubmit={handleSubscribe}
            className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-900 dark:border dark:border-slate-800 text-white space-y-3"
          >
            <h4 className="font-extrabold text-sm">YEP Community Updates</h4>
            <p className="text-xs text-slate-300">
              Monthly stories, cohort dates, and youth showcases.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-base sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function DonateView({
  onOpenVolunteer,
  onToast,
}: {
  onOpenVolunteer: () => void;
  onToast: (msg: string) => void;
}) {
  const [frequency, setFrequency] = useState<'monthly' | 'onetime'>('monthly');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');

  const effectiveAmount =
    customAmount && !Number.isNaN(Number(customAmount)) && Number(customAmount) > 0
      ? Number(customAmount)
      : amount;

  const impactDescription = DONATION_IMPACTS[effectiveAmount]
    ? DONATION_IMPACTS[effectiveAmount][frequency]
    : 'fuels high-impact mentorship and skills for under-resourced youth.';

  return (
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Invest In Human Potential
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Fuel a Young Person’s Ambition
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 mb-6">
          Every contribution directly funds student stipends, tutoring supplies,
          and tech equipment.
        </p>

        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-xs mb-6">
          <button
            type="button"
            onClick={() => setFrequency('monthly')}
            className={`min-h-[44px] py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer ${
              frequency === 'monthly'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Giving
          </button>
          <button
            type="button"
            onClick={() => setFrequency('onetime')}
            className={`min-h-[44px] py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer ${
              frequency === 'onetime'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            One-Time
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[25, 50, 100, 250].map((amt) => {
            const active = !customAmount && amount === amt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setAmount(amt);
                  setCustomAmount('');
                }}
                className={`min-h-[48px] py-3 rounded-2xl border-2 font-extrabold text-lg tabular-nums transition-colors cursor-pointer ${
                  active
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200'
                    : 'border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-800 dark:text-slate-100'
                }`}
              >
                ${amt}
              </button>
            );
          })}
        </div>

        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
            $
          </span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Or enter custom amount"
            aria-label="Custom donation amount in dollars"
            className="w-full min-h-[48px] pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-base sm:text-sm tabular-nums"
          />
        </div>

        <div className="p-4 bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800/60 rounded-2xl mb-6">
          <p className="text-sm text-brand-900 dark:text-brand-100 font-medium">
            Your gift of{' '}
            <span className="font-extrabold tabular-nums">
              ${effectiveAmount}
              {frequency === 'monthly' ? '/month' : ''}
            </span>{' '}
            {impactDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onToast(
              `Thank you! Preparing secure checkout for $${effectiveAmount} (${frequency}).`
            )
          }
          className="w-full min-h-[50px] py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-colors cursor-pointer"
        >
          Proceed to Secure Donation &rarr;
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>
            Secure 256-bit SSL encrypted donation · Tax-deductible 501(c)(3)
          </span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <div className="bg-slate-900 dark:bg-slate-900 dark:border dark:border-slate-800 text-white rounded-2xl sm:rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-extrabold">Volunteer as a Mentor</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Share your industry experience with a YEP team or tutor youth
            participants in coding, leadership, and college readiness.
          </p>
          <button
            type="button"
            onClick={onOpenVolunteer}
            className="w-full min-h-[46px] py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm transition-colors cursor-pointer"
          >
            Apply to Volunteer
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Transparency
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            87¢ of every dollar funds direct youth programming.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Registered 501(c)(3) nonprofit · GuideStar Platinum Transparency ·
            100% free for underserved youth.
          </p>
        </div>
      </div>
    </div>
  );
}
