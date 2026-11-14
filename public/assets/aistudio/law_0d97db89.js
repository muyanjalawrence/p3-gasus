// Browser-only YEP workspace prototype. Replace this store with an API/database for deployment.
    const appSeed = {
      role: 'youth', view: 'overview',
      activities: [
        { id: 'A01', title: 'Community Impact Lab', level: 'Level 1 exchange', date: 'Nov 24, 2026', spots: 8, enrolled: false },
        { id: 'A02', title: 'Digital Storytelling Exchange', level: 'Level 1 exchange', date: 'Dec 02, 2026', spots: 12, enrolled: true }
      ],
      team: { name: 'Bright Futures', members: ['Jordan Smith · A Level', 'Amara Okafor · O Level', 'Leo Chen · Diploma'], joined: true },
      project: { title: 'Community garden map', status: 'In progress', description: 'Mapping unused spaces for neighborhood gardens.' },
      assessments: [{ title: 'Community needs reflection', due: 'Nov 28, 2026', status: 'In progress', score: '—' }],
      messages: [{ from: 'Maya Patel · Mentor', text: 'Welcome to the team! Let’s set a time to review your project idea.', time: 'Today' }],
      notices: ['Your team has 3 members. Add your first project update.']
    };
    let yepApp = loadAppState();
    const rolePreview = new URLSearchParams(window.location.search).get('role');
    const dashboardRoles = {
      youth: 'Youth participant',
      mentor: 'Mentor',
      facilitator: 'Facilitator',
      administrator: 'Administrator'
    };
    if (Object.prototype.hasOwnProperty.call(dashboardRoles, rolePreview)) {
      yepApp.role = rolePreview;
      yepApp.view = 'overview';
      saveAppState();
    }
    function loadAppState() {
      try { return { ...appSeed, ...JSON.parse(localStorage.getItem('yepWorkspace') || '{}') }; }
      catch (error) { return { ...appSeed }; }
    }
    function saveAppState() { localStorage.setItem('yepWorkspace', JSON.stringify(yepApp)); }
    function escapeAppText(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
    function setAppRole(role) { yepApp.role = role; yepApp.view = 'overview'; saveAppState(); renderYepApp(); }
    function resetAppDemo() { yepApp = JSON.parse(JSON.stringify(appSeed)); saveAppState(); renderYepApp(); showToast('Demo workspace reset.'); }
    function appButton(action, label, extra = '') { return `<button data-app-action="${action}" ${extra} class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition">${label}</button>`; }
    function appCard(title, subtitle, action = '') { return `<div class="bg-white border border-slate-200 rounded-2xl p-5"><div class="flex items-start justify-between gap-3"><div><h4 class="font-extrabold text-slate-900">${title}</h4><p class="text-sm text-slate-500 mt-1">${subtitle}</p></div>${action}</div></div>`; }
    function appNavItems() {
      const common = [['overview', 'Overview'], ['activities', 'Exchanges'], ['team', 'My team'], ['project', 'Impact project'], ['assessments', 'Assessments'], ['messages', 'Messages']];
      if (yepApp.role === 'mentor') return [['overview', 'Overview'], ['team', 'My teams'], ['project', 'Project reviews'], ['messages', 'Messages']];
      if (yepApp.role === 'facilitator') return [['overview', 'Overview'], ['activities', 'Sessions'], ['team', 'Team builder'], ['assessments', 'Assessments'], ['messages', 'Moderation']];
      if (yepApp.role === 'administrator') return [['overview', 'Overview'], ['users', 'Users & roles'], ['assessments', 'Certificates'], ['reports', 'Reports']];
      return common;
    }
    function renderYepApp() {
      const role = yepApp.role;
      const roleName = { youth: 'Youth participant', mentor: 'Mentor', facilitator: 'Facilitator', administrator: 'Administrator' }[role];
      const roleDescriptions = {
        youth: 'Join exchanges, work with your team, track learning progress, and message your mentor.',
        mentor: 'Support assigned teams, review impact projects, and stay connected with participants.',
        facilitator: 'Coordinate sessions, form balanced teams, review assessments, and manage moderation.',
        administrator: 'Oversee users, role assignments, certificates, and platform-wide reports.'
      };
      const nav = appNavItems();
      if (!nav.some(item => item[0] === yepApp.view)) yepApp.view = 'overview';
      document.getElementById('roleSelect').value = role;
      document.getElementById('workspaceTitle').textContent = `${roleName} dashboard`;
      document.getElementById('workspaceDescription').textContent = roleDescriptions[role];
      document.getElementById('appWelcome').textContent = role === 'youth' ? 'Welcome, Jordan' : `${roleName} dashboard`;
      document.getElementById('appNav').innerHTML = nav.map(([id, label]) => `<button data-app-view="${id}" class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold ${yepApp.view === id ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}">${label}</button>`).join('');
      const stats = role === 'youth' ? [['Points', '240'], ['My team', yepApp.team.joined ? 'Bright Futures' : 'Not joined'], ['Assessments', `${yepApp.assessments.length} active`], ['Certificates', '1 earned']] : role === 'mentor' ? [['Assigned teams', '3'], ['Projects to review', '2'], ['Unread messages', '1'], ['Youth supported', '12']] : role === 'facilitator' ? [['Active sessions', '4'], ['Teams', '8'], ['To grade', `${yepApp.assessments.length}`], ['Moderation queue', '1']] : [['Active users', '128'], ['Teams', '24'], ['Certificates', '36'], ['Reports', '4']];
      document.getElementById('appStats').innerHTML = stats.map(([label, value]) => `<div class="p-4 rounded-2xl bg-slate-50 border border-slate-100"><p class="text-xs font-semibold text-slate-500">${label}</p><p class="font-extrabold text-slate-900 mt-1 truncate">${value}</p></div>`).join('');
      document.getElementById('appContent').innerHTML = renderAppView();
    }
    function renderDashboardHeader(title, description, action) {
      return `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"><div><h3 class="text-xl font-extrabold text-slate-900">${title}</h3><p class="text-sm text-slate-500 mt-1">${description}</p></div>${action}</div>`;
    }
    function renderYouthDashboard() {
      const latestMessage = yepApp.messages.at(-1)?.text || 'No messages yet.';
      return `${renderDashboardHeader('Your learning journey', 'Pick up where you left off and keep moving toward your goals.', appButton('browse', 'Find an exchange'))}<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">${appCard('Next exchange', 'Community Impact Lab · Nov 24 · 8 places available', appButton('browse', 'Browse exchanges'))}${appCard('My team', yepApp.team.joined ? `${escapeAppText(yepApp.team.name)} · ${yepApp.team.members.length} members` : 'Join a team to start collaborating.', appButton('team', 'Open my team'))}${appCard('Impact project', `${escapeAppText(yepApp.project.title)} · ${escapeAppText(yepApp.project.status)}`, appButton('project', 'Continue project'))}${appCard('Assessment due next', 'Community needs reflection · Due Nov 28', appButton('assessments', 'View assessments'))}${appCard('Mentor message', escapeAppText(latestMessage), appButton('messages', 'Open inbox'))}${appCard('My achievements', '240 learning points · 1 certificate earned', appButton('assessments', 'View progress'))}</div>`;
    }
    function renderMentorDashboard() {
      const latestMessage = yepApp.messages.at(-1)?.text || 'No new participant messages.';
      return `${renderDashboardHeader('Mentor overview', 'Track your teams, follow up on project reviews, and support participants.', appButton('team', 'View my teams'))}<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">${appCard('Projects to review', '2 team projects are ready for mentor feedback.', appButton('project', 'Review projects'))}${appCard('Assigned teams', 'Bright Futures · 3 participants · Next check-in this week', appButton('team', 'Open team'))}${appCard('Participant messages', escapeAppText(latestMessage), appButton('messages', 'Reply to participants'))}${appCard('Mentorship focus', 'Help each participant set a clear next step for their project.', appButton('team', 'Plan a check-in'))}${appCard('Youth supported', '12 participants are active in your mentorship pathway.')}${appCard('Unread messages', '1 conversation needs your attention.', appButton('messages', 'Open messages'))}</div>`;
    }
    function renderFacilitatorDashboard() {
      const sessions = yepApp.activities.slice(0, 3).map(activity => `<div class="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0"><div><p class="font-bold text-sm text-slate-800">${escapeAppText(activity.title)}</p><p class="text-xs text-slate-500 mt-1">${escapeAppText(activity.date)} · ${activity.spots} places</p></div><span class="text-xs font-semibold text-brand-700">${escapeAppText(activity.level)}</span></div>`).join('');
      return `${renderDashboardHeader('Facilitator overview', 'Coordinate learning sessions and keep participant activities on track.', appButton('create-session', '＋ Create session'))}<div class="grid lg:grid-cols-[1.4fr_1fr] gap-4"><div class="bg-white border border-slate-200 rounded-2xl p-5"><div class="flex items-center justify-between gap-3"><div><h4 class="font-extrabold text-slate-900">Upcoming sessions</h4><p class="text-sm text-slate-500 mt-1">Review the next activities on your calendar.</p></div>${appButton('activities', 'All sessions')}</div><div class="mt-3">${sessions}</div></div><div class="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">${appCard('Team builder', '8 active teams · Build balanced groups across education levels.', appButton('team', 'Form teams'))}${appCard('Assessment queue', `${yepApp.assessments.length} submission(s) awaiting review.`, appButton('assessments', 'Review work'))}${appCard('Moderation queue', '1 item is waiting for facilitator attention.', appButton('messages', 'Open moderation'))}</div></div>`;
    }
    function renderAdministratorDashboard() {
      return `${renderDashboardHeader('Administrator overview', 'Monitor platform health and manage access across the YEP community.', appButton('users', 'Manage users'))}<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">${appCard('User and role management', 'Review participant, mentor, and facilitator accounts and role requests.', appButton('users', 'Open user directory'))}${appCard('Platform activity', '128 active users · 24 teams · 86% exchange attendance.', appButton('reports', 'View reports'))}${appCard('Certificates', '36 certificates issued this term; review learner completion.', appButton('assessments', 'Manage certificates'))}${appCard('Learning progress', '72 assessments completed · average score 84%.', appButton('reports', 'View learning report'))}${appCard('Access and oversight', 'Administrator access should be granted only to approved staff.', appButton('users', 'Review roles'))}${appCard('Platform notices', 'Check current usage and follow up on operational issues.', appButton('reports', 'Open dashboard reports'))}</div>`;
    }
    function renderRoleDashboard(role) {
      if (role === 'mentor') return renderMentorDashboard();
      if (role === 'facilitator') return renderFacilitatorDashboard();
      if (role === 'administrator') return renderAdministratorDashboard();
      return renderYouthDashboard();
    }
    function renderAppView() {
      const view = yepApp.view, role = yepApp.role;
      if (view === 'overview') return renderRoleDashboard(role);
      if (view === 'activities') return `<div class="flex items-center justify-between mb-5"><div><h3 class="text-xl font-extrabold">${role === 'facilitator' ? 'Exchange sessions' : 'Available exchanges'}</h3><p class="text-sm text-slate-500 mt-1">${role === 'facilitator' ? 'Manage activities and participant enrolment.' : 'Enrol in a Level 1 exchange to meet your cohort.'}</p></div>${role === 'facilitator' ? appButton('create-session', '＋ Create session') : ''}</div><div class="space-y-3">${yepApp.activities.map(activity => `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-slate-200 rounded-2xl"><div><span class="text-[11px] font-bold uppercase text-brand-600">${activity.level}</span><h4 class="font-extrabold mt-1">${escapeAppText(activity.title)}</h4><p class="text-sm text-slate-500 mt-1">${activity.date} · ${activity.spots} places</p></div>${role === 'facilitator' ? '<span class="text-sm font-semibold text-emerald-700">Scheduled</span>' : activity.enrolled ? '<span class="text-sm font-bold text-emerald-700">✓ Enrolled</span>' : appButton('enrol', 'Enrol', `data-id="${activity.id}"`)}</div>`).join('')}</div>`;
      if (view === 'team') {
        if (role === 'facilitator') return `<h3 class="text-xl font-extrabold">Mixed-level team builder</h3><p class="text-sm text-slate-500 mt-1 mb-5">Create balanced teams across education levels.</p><div class="p-5 rounded-2xl border border-slate-200"><p class="font-bold">Available participants · O Level, A Level, Diploma, Bachelor’s</p><p class="text-sm text-slate-600 mt-2">The demo team currently has members from three levels.</p><div class="mt-4">${appButton('form-teams', 'Form balanced teams')}</div></div>`;
        return `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"><div><h3 class="text-xl font-extrabold">${role === 'mentor' ? 'Teams I mentor' : 'My team'}</h3><p class="text-sm text-slate-500 mt-1">Participants collaborate across education levels.</p></div>${!yepApp.team.joined && role === 'youth' ? appButton('join-team', 'Join a team') : ''}</div>${yepApp.team.joined ? `<div class="p-5 border border-slate-200 rounded-2xl"><div class="flex items-center justify-between"><div><h4 class="font-extrabold text-lg">${escapeAppText(yepApp.team.name)}</h4><p class="text-sm text-slate-500">Level 2 · Mixed education levels</p></div><span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">Active</span></div><div class="mt-5 space-y-2">${yepApp.team.members.map(member => `<div class="px-4 py-3 bg-slate-50 rounded-xl text-sm">${escapeAppText(member)}</div>`).join('')}</div><div class="mt-4">${appButton('project', 'Open team project')}</div></div>` : '<div class="p-6 bg-slate-50 rounded-2xl text-sm text-slate-600">No team assigned yet. Join a team to start collaborating.</div>'}`;
      }
      if (view === 'project') return `<div class="flex items-center justify-between mb-5"><div><h3 class="text-xl font-extrabold">Impact project</h3><p class="text-sm text-slate-500 mt-1">Work with your team and mentor to make a local impact.</p></div><span class="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">${escapeAppText(yepApp.project.status)}</span></div><form data-app-form="project" class="p-5 border border-slate-200 rounded-2xl space-y-4"><label class="block text-sm font-bold">Project title<input name="title" required value="${escapeAppText(yepApp.project.title)}" class="mt-2 block w-full px-4 py-3 rounded-xl border border-slate-300 font-normal"></label><label class="block text-sm font-bold">Project summary<textarea name="description" rows="4" class="mt-2 block w-full px-4 py-3 rounded-xl border border-slate-300 font-normal">${escapeAppText(yepApp.project.description)}</textarea></label><div>${appButton('save-project', 'Save project update')} <button type="button" data-app-action="submit-project" class="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-700 text-sm font-bold ml-2">Submit for review</button></div></form><div class="mt-4 p-4 bg-emerald-50 rounded-xl text-sm text-emerald-900">Mentor review: Add feedback and next steps during your team check-in.</div>`;
      if (view === 'assessments') return `<h3 class="text-xl font-extrabold mb-5">${role === 'administrator' ? 'Certificates' : role === 'facilitator' ? 'Assessment grading' : 'Assessments'}</h3><div class="space-y-3">${yepApp.assessments.map((item, index) => `<div class="p-5 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h4 class="font-bold">${escapeAppText(item.title)}</h4><p class="text-sm text-slate-500 mt-1">Due ${item.due} · ${item.status}${item.score !== '—' ? ` · Score: ${item.score}` : ''}</p></div>${role === 'facilitator' ? `<button data-app-action="grade" data-index="${index}" class="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-bold">Grade</button>` : role === 'administrator' ? appButton('issue-certificate', 'Issue certificate') : appButton('submit-assessment', 'Open assessment')}</div>`).join('')}</div><div class="mt-5">${appButton('new-assessment', role === 'facilitator' ? '＋ Set assessment' : '＋ Add practice reflection')}</div>`;
      if (view === 'messages') return `<h3 class="text-xl font-extrabold mb-5">${role === 'facilitator' ? 'Moderation queue' : 'Messages'}</h3><div class="space-y-3 mb-5">${yepApp.messages.map(message => `<div class="p-4 bg-slate-50 rounded-2xl"><div class="flex justify-between gap-3"><b class="text-sm">${escapeAppText(message.from)}</b><span class="text-xs text-slate-400">${escapeAppText(message.time)}</span></div><p class="text-sm text-slate-700 mt-2">${escapeAppText(message.text)}</p></div>`).join('')}</div><form data-app-form="message" class="flex flex-col sm:flex-row gap-2"><input name="text" required placeholder="Write a message…" class="flex-1 px-4 py-3 border border-slate-300 rounded-xl"><button class="px-5 py-3 bg-brand-600 text-white rounded-xl font-bold">Send</button></form>`;
      if (view === 'users') return `<h3 class="text-xl font-extrabold mb-5">Users & roles</h3><div class="space-y-3">${[['Jordan Smith','Youth participant','A Level'],['Maya Patel','Mentor','Technology'],['Ruth Mensah','Facilitator','Education']].map(([name, role, detail]) => `<div class="p-4 border border-slate-200 rounded-xl flex justify-between"><div><b>${name}</b><p class="text-sm text-slate-500">${detail}</p></div><span class="text-sm text-brand-700 font-semibold">${role}</span></div>`).join('')}</div><div class="mt-5">${appButton('manage-users', '＋ Add user')}</div>`;
      if (view === 'reports') return `<h3 class="text-xl font-extrabold mb-5">Platform reports</h3><div class="grid sm:grid-cols-2 gap-4">${appCard('Participation', '128 active users · 24 teams · 86% exchange attendance')}${appCard('Learning progress', '72 assessments completed · average score 84%')}${appCard('Education-level mix', 'Teams include participants across O Level through Bachelor’s')}${appCard('Certificates', '36 certificates issued this term')}</div>`;
      return '<p class="text-slate-500">Choose a workspace section.</p>';
    }
    document.getElementById('appNav').addEventListener('click', event => { const button = event.target.closest('[data-app-view]'); if (button) { yepApp.view = button.dataset.appView; renderYepApp(); } });
    document.getElementById('appContent').addEventListener('click', event => {
      const button = event.target.closest('[data-app-action]'); if (!button) return;
      const action = button.dataset.appAction;
      if (['browse', 'activities'].includes(action)) yepApp.view = 'activities';
      else if (['team', 'join-team', 'form-teams'].includes(action)) { yepApp.view = 'team'; if (action === 'join-team') yepApp.team.joined = true; if (action === 'form-teams') yepApp.notices.push('Balanced teams formed across education levels.'); }
      else if (['project', 'submit-project'].includes(action)) { yepApp.view = 'project'; if (action === 'submit-project') yepApp.project.status = 'Submitted for review'; }
      else if (['assessments', 'new-assessment', 'submit-assessment'].includes(action)) { yepApp.view = 'assessments'; if (action === 'new-assessment') yepApp.assessments.push({ title: 'Weekly learning reflection', due: 'Dec 05, 2026', status: 'Not started', score: '—' }); else if (action === 'submit-assessment') showToast('Assessment opened. Your progress is saved in this demo.'); }
      else if (action === 'grade') { const item = yepApp.assessments[Number(button.dataset.index)]; if (item) { item.status = 'Graded'; item.score = '88%'; showToast('Assessment graded: 88%.'); } yepApp.view = 'assessments'; }
      else if (action === 'messages') yepApp.view = 'messages';
      else if (action === 'create-session') { yepApp.activities.push({ id: `A${Date.now()}`, title: 'New facilitator session', level: 'Level 1 exchange', date: 'Dec 10, 2026', spots: 15, enrolled: false }); showToast('Session created in the demo workspace.'); yepApp.view = 'activities'; }
      else if (action === 'issue-certificate') showToast('Certificate issued in the demo workspace.');
      else if (action === 'users' || action === 'manage-users') { yepApp.view = 'users'; if (action === 'manage-users') showToast('User form is part of the connected-backend setup.'); }
      else if (action === 'reports') yepApp.view = 'reports';
      else if (action === 'enrol') { const activity = yepApp.activities.find(item => item.id === button.dataset.id); if (activity) activity.enrolled = true; showToast('You are enrolled in this exchange.'); yepApp.view = 'activities'; }
      saveAppState(); renderYepApp();
    });
    document.getElementById('appContent').addEventListener('submit', event => {
      const form = event.target.closest('[data-app-form]'); if (!form) return;
      event.preventDefault(); const data = new FormData(form);
      if (form.dataset.appForm === 'message') { yepApp.messages.push({ from: 'Jordan Smith', text: String(data.get('text') || ''), time: 'Just now' }); showToast('Message sent in the demo workspace.'); }
      if (form.dataset.appForm === 'project') { yepApp.project.title = String(data.get('title') || ''); yepApp.project.description = String(data.get('description') || ''); showToast('Project update saved.'); }
      saveAppState(); renderYepApp();
    });
    renderYepApp();
    if (Object.prototype.hasOwnProperty.call(dashboardRoles, rolePreview)) {
      showToast(`${dashboardRoles[rolePreview]} dashboard preview. No account was created.`);
    }

    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    function toggleMenu() {
      mobileMenu.classList.toggle('hidden');
    }
    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Modal Handlers
    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
      document.body.style.overflow = 'auto';
    }

    document.addEventListener('click', event => {
      const target = event.target.closest('[data-mobile-link], [data-open-modal], [data-close-modal], [data-program-filter], [data-frequency], .donation-btn, [data-donation-submit], [data-rsvp], [data-faq], [data-reset-app]');
      if (!target) return;
      if (target.hasAttribute('data-mobile-link')) toggleMenu();
      if (target.dataset.openModal) openModal(target.dataset.openModal);
      if (target.dataset.closeModal) closeModal(target.dataset.closeModal);
      if (target.dataset.programFilter) filterPrograms(target.dataset.programFilter, target);
      if (target.dataset.frequency) setFrequency(target.dataset.frequency);
      if (target.classList.contains('donation-btn')) setDonation(Number(target.dataset.amount));
      if (target.hasAttribute('data-donation-submit')) handleDonationSubmit();
      if (target.dataset.rsvp) rsvpEvent(target.dataset.rsvp);
      if (target.hasAttribute('data-faq')) toggleFaq(target);
      if (target.hasAttribute('data-reset-app')) resetAppDemo();
    });

    document.getElementById('roleSelect').addEventListener('change', event => setAppRole(event.currentTarget.value));
    document.getElementById('customAmount').addEventListener('input', event => handleCustomAmount(event.currentTarget.value));

    document.querySelectorAll('form[data-demo-form]').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (form.dataset.modal) closeModal(form.dataset.modal);
        showToast(form.dataset.successMessage);
        form.reset();
      });
    });

    // Program Filter
    function filterPrograms(category, activeTab) {
      const cards = document.querySelectorAll('.program-card');
      const tabs = document.querySelectorAll('.program-tab');

      tabs.forEach(tab => {
        tab.classList.remove('bg-brand-600', 'text-white');
        tab.classList.add('bg-white', 'text-slate-700');
      });
      activeTab.classList.add('bg-brand-600', 'text-white');
      activeTab.classList.remove('bg-white', 'text-slate-700');

      cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }

    // Donation Calculator Logic
    let currentFrequency = 'monthly';
    let currentAmount = 50;

    const impacts = {
      25: { monthly: 'funds a student’s essential learning materials and backpack kits.', onetime: 'covers educational supplies for one student.' },
      50: { monthly: 'provides 1-on-1 weekly tutoring & study materials for an aspiring college student.', onetime: 'provides two weeks of after-school meal & study programs.' },
      100: { monthly: 'sponsors a laptop and internet stipend for a digital bootcamper.', onetime: 'funds equipment & licenses for our multimedia lab.' },
      250: { monthly: 'sponsors an entire student scholarship for our 16-week Code & AI Academy.', onetime: 'funds an intensive leadership retreat for 5 youth leaders.' }
    };

    function setFrequency(freq) {
      currentFrequency = freq;
      const mBtn = document.getElementById('btnMonthly');
      const oBtn = document.getElementById('btnOnetime');

      if (freq === 'monthly') {
        mBtn.className = 'flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl bg-brand-600 text-white transition';
        oBtn.className = 'flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl text-slate-600 hover:text-slate-900 transition';
      } else {
        oBtn.className = 'flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl bg-brand-600 text-white transition';
        mBtn.className = 'flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl text-slate-600 hover:text-slate-900 transition';
      }
      updateImpact();
    }

    function setDonation(amt) {
      currentAmount = amt;
      document.getElementById('customAmount').value = '';
      document.querySelectorAll('.donation-btn').forEach(btn => {
        if (parseInt(btn.getAttribute('data-amount')) === amt) {
          btn.className = 'donation-btn py-3 rounded-2xl border-2 border-brand-600 bg-brand-50 text-brand-700 font-extrabold text-lg transition';
        } else {
          btn.className = 'donation-btn py-3 rounded-2xl border-2 border-slate-200 hover:border-brand-600 font-extrabold text-lg text-slate-800 transition';
        }
      });
      updateImpact();
    }

    function handleCustomAmount(val) {
      if (val && !isNaN(val) && Number(val) > 0) {
        currentAmount = Number(val);
        document.querySelectorAll('.donation-btn').forEach(btn => {
          btn.className = 'donation-btn py-3 rounded-2xl border-2 border-slate-200 hover:border-brand-600 font-extrabold text-lg text-slate-800 transition';
        });
        document.getElementById('impactMessage').innerHTML = `Your custom donation of <span class="font-extrabold">$${currentAmount}${currentFrequency === 'monthly' ? '/month' : ''}</span> directly powers transformational youth opportunities!`;
      }
    }

    function updateImpact() {
      const desc = impacts[currentAmount] ? impacts[currentAmount][currentFrequency] : 'fuels high-impact mentorship and skills for under-resourced youth.';
      document.getElementById('impactMessage').innerHTML = `Your gift of <span class="font-extrabold">$${currentAmount}${currentFrequency === 'monthly' ? '/month' : ''}</span> ${desc}`;
    }

    function handleDonationSubmit() {
      showToast(`Thank you! Redirecting to secure checkout for $${currentAmount} (${currentFrequency})...`);
    }

    // FAQ Accordion
    function toggleFaq(element) {
      const content = element.querySelector('.faq-content');
      const icon = element.querySelector('.faq-icon');
      const isHidden = content.classList.contains('hidden');

      // Close open items
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.textContent = '+');

      if (isHidden) {
        content.classList.remove('hidden');
        icon.textContent = '−';
      }
    }

    // RSVP Action
    function rsvpEvent(eventName) {
      showToast(`RSVP Confirmed for ${eventName}! We'll send the pass to your calendar.`);
    }

    // Toast Notification helper
    function showToast(msg) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      toastMsg.innerText = msg;
      toast.classList.remove('translate-y-24', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
      }, 4000);
    }
