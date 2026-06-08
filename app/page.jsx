'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase, hasSupabase } from '../lib/supabaseClient';
import {
  injuryRegions,
  grades,
  sports,
  movements,
  equipmentOptions,
  mechanisms,
  symptomTypes,
  phases,
  exerciseBank,
  redFlagQuestions
} from '../data/rehabKnowledge';

const emptyAssessment = {
  primaryRegion: 'hamstring',
  secondaryRegions: [],
  grade: 'grade1',
  mechanism: 'Sudden sprint',
  symptoms: [],
  sports: [],
  movements: [],
  equipment: ['Bodyweight'],
  painRest: 1,
  painWalking: 2,
  painSport: 5,
  daysSince: 1,
  story: '',
  redFlags: []
};

const gradeLabels = Object.fromEntries(grades.map((g) => [g.id, g.name]));
const regionLabels = Object.fromEntries(injuryRegions.map((r) => [r.id, r.name]));

export default function Page() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('signin');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authMessage, setAuthMessage] = useState('');
  const [assessment, setAssessment] = useState(emptyAssessment);
  const [profile, setProfile] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [saving, setSaving] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState([
    { role: 'coach', text: 'Tell me what you are thinking about today’s training or your return to sport. I will keep the plan safe and realistic.' }
  ]);

  useEffect(() => {
    if (!hasSupabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !hasSupabase) return;
    loadRemoteProfile(user.id);
  }, [user]);

  useEffect(() => {
    if (hasSupabase && user) return;
    const cached = localStorage.getItem('injury-recovery-local-profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProfile(parsed.profile || null);
        setCheckins(parsed.checkins || []);
      } catch {}
    }
  }, [user]);

  async function loadRemoteProfile(userId) {
    const { data, error } = await supabase
      .from('recovery_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (!error && data) {
      setProfile(data.profile_data?.profile || null);
      setCheckins(data.profile_data?.checkins || []);
      setAssessment(data.profile_data?.assessment || emptyAssessment);
    }
  }

  async function saveState(nextProfile = profile, nextCheckins = checkins, nextAssessment = assessment) {
    if (!nextProfile) return;
    const payload = { profile: nextProfile, checkins: nextCheckins, assessment: nextAssessment, updatedAt: new Date().toISOString() };
    if (hasSupabase && user) {
      setSaving(true);
      await supabase.from('recovery_profiles').upsert({ user_id: user.id, profile_data: payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      setSaving(false);
    } else {
      localStorage.setItem('injury-recovery-local-profile', JSON.stringify(payload));
    }
  }

  async function handleAuth(e) {
    e.preventDefault();
    setAuthMessage('');
    if (!hasSupabase) {
      setAuthMessage('Supabase is not connected yet. Add your Vercel environment variables first.');
      return;
    }
    const action = authMode === 'signin' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await action({ email: authForm.email, password: authForm.password });
    if (error) setAuthMessage(error.message);
    else setAuthMessage(authMode === 'signup' ? 'Account created. Check your email if confirmation is enabled.' : 'Signed in successfully.');
  }

  function toggleArray(field, value) {
    setAssessment((prev) => {
      const exists = prev[field].includes(value);
      return { ...prev, [field]: exists ? prev[field].filter((x) => x !== value) : [...prev[field], value] };
    });
  }

  function generateProfile() {
    const nextProfile = buildProfile(assessment);
    setProfile(nextProfile);
    setCheckins([]);
    setActiveTab('dashboard');
    saveState(nextProfile, [], assessment);
  }

  function completeDay(phaseIndex, weekIndex, dayIndex) {
    if (!profile) return;
    const next = structuredClone(profile);
    const day = next.plan[phaseIndex].weeks[weekIndex].days[dayIndex];
    day.completed = !day.completed;
    next.progress = calculateProgress(next.plan);
    next.today = findToday(next.plan);
    setProfile(next);
    saveState(next, checkins, assessment);
  }

  function addCheckin(status) {
    if (!profile) return;
    const entry = { id: Date.now(), date: new Date().toLocaleDateString(), ...status };
    const nextCheckins = [entry, ...checkins].slice(0, 12);
    const nextProfile = { ...profile, aiStatus: getStatusMessage(status, profile), lastCheckin: entry };
    setCheckins(nextCheckins);
    setProfile(nextProfile);
    saveState(nextProfile, nextCheckins, assessment);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const response = coachResponse(chatInput, profile, assessment);
    setChat((prev) => [...prev, { role: 'user', text: chatInput }, { role: 'coach', text: response }]);
    setChatInput('');
  }

  const dashboardStats = useMemo(() => profile ? calculateProgress(profile.plan) : null, [profile]);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand-lockup">
          <BodyPictogram type="logo" />
          <div>
            <p className="eyebrow">Personal recovery system</p>
            <h1>Injury Recovery</h1>
          </div>
        </div>
        <div className="account-pill">
          <span className={hasSupabase ? 'dot online' : 'dot offline'} />
          {user ? user.email : hasSupabase ? 'Not signed in' : 'Supabase setup needed'}
        </div>
      </header>

      {!user && <AuthCard authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} handleAuth={handleAuth} authMessage={authMessage} />}

      <section className="hero-card">
        <div>
          <p className="eyebrow">Evidence-driven beta</p>
          <h2>Build a plan around the injury you actually have.</h2>
          <p className="hero-copy">Answer the assessment once. The app estimates your recovery lane, creates a phased day-by-day plan, saves your progress, and pushes back when returning too early is risky.</p>
        </div>
        <div className="hero-panel">
          <BodyPictogram type={assessment.primaryRegion} />
          <div>
            <span className="small-label">Current focus</span>
            <strong>{regionLabels[assessment.primaryRegion]}</strong>
            <span>{gradeLabels[assessment.grade]}</span>
          </div>
        </div>
      </section>

      <nav className="tabs">
        {['dashboard', 'assessment', 'plan', 'checkin', 'coach'].map((tab) => (
          <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>
            {tab === 'dashboard' ? 'Home' : tab === 'assessment' ? 'Assessment' : tab === 'plan' ? 'Plan' : tab === 'checkin' ? 'Check-in' : 'Coach'}
          </button>
        ))}
      </nav>

      {activeTab === 'dashboard' && <Dashboard profile={profile} stats={dashboardStats} setActiveTab={setActiveTab} saving={saving} />}
      {activeTab === 'assessment' && <Assessment assessment={assessment} setAssessment={setAssessment} toggleArray={toggleArray} generateProfile={generateProfile} />}
      {activeTab === 'plan' && <PlanView profile={profile} completeDay={completeDay} setActiveTab={setActiveTab} />}
      {activeTab === 'checkin' && <Checkin addCheckin={addCheckin} checkins={checkins} />}
      {activeTab === 'coach' && <Coach chat={chat} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} />}
    </main>
  );
}

function AuthCard({ authMode, setAuthMode, authForm, setAuthForm, handleAuth, authMessage }) {
  return (
    <section className="auth-card">
      <div>
        <p className="eyebrow">Account access</p>
        <h3>{authMode === 'signin' ? 'Sign in to save progress' : 'Create a tester account'}</h3>
        <p>Accounts use Supabase. Progress syncs across devices once your database is connected.</p>
      </div>
      <form onSubmit={handleAuth} className="auth-form">
        <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
        <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
        <button className="primary-btn" type="submit">{authMode === 'signin' ? 'Sign in' : 'Create account'}</button>
        <button className="text-btn" type="button" onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}>
          {authMode === 'signin' ? 'Create a new account' : 'I already have an account'}
        </button>
        {authMessage && <p className="form-note">{authMessage}</p>}
      </form>
    </section>
  );
}

function Dashboard({ profile, stats, setActiveTab, saving }) {
  if (!profile) {
    return (
      <section className="empty-state">
        <BodyPictogram type="assessment" />
        <h2>Start with the assessment.</h2>
        <p>Your home dashboard will appear here after the app builds your recovery plan.</p>
        <button className="primary-btn" onClick={() => setActiveTab('assessment')}>Open assessment</button>
      </section>
    );
  }

  return (
    <section className="dashboard-grid">
      <div className="summary-card span-2">
        <div className="summary-top">
          <div>
            <p className="eyebrow">Current injury</p>
            <h2>{profile.regionName}</h2>
            <p>{profile.gradeName} · {profile.mechanism}</p>
          </div>
          <BodyPictogram type={profile.primaryRegion} />
        </div>
        <div className="metric-row">
          <Metric label="Expected return" value={profile.returnRange} />
          <Metric label="Current phase" value={profile.today?.phaseLabel || 'Not started'} />
          <Metric label="Saved" value={saving ? 'Saving' : 'Synced'} />
        </div>
        <div className="progress-track"><span style={{ width: `${stats.percent}%` }} /></div>
        <p className="progress-caption">{stats.completedDays} of {stats.totalDays} days completed · {stats.percent}%</p>
      </div>

      <div className="today-card span-2">
        <p className="eyebrow">Today</p>
        <h3>{profile.today?.title || 'Open the plan to start'}</h3>
        <p>{profile.today?.summary || 'Your session summary will appear here.'}</p>
        <div className="today-actions">
          <button className="primary-btn" onClick={() => setActiveTab('plan')}>Open today’s plan</button>
          <button className="secondary-btn" onClick={() => setActiveTab('checkin')}>Log check-in</button>
        </div>
      </div>

      <div className="compact-card">
        <span className="small-label">Completed phases</span>
        <strong>{stats.completedPhases} / {stats.totalPhases}</strong>
      </div>
      <div className="compact-card">
        <span className="small-label">Completed weeks</span>
        <strong>{stats.completedWeeks} / {stats.totalWeeks}</strong>
      </div>
      <div className="compact-card span-2">
        <span className="small-label">Recovery coach note</span>
        <p>{profile.aiStatus}</p>
      </div>
    </section>
  );
}

function Assessment({ assessment, setAssessment, toggleArray, generateProfile }) {
  return (
    <section className="assessment-grid">
      <div className="section-card span-2">
        <p className="eyebrow">Step 1</p>
        <h2>Injury profile</h2>
        <div className="form-grid">
          <Field label="Main area">
            <select value={assessment.primaryRegion} onChange={(e) => setAssessment({ ...assessment, primaryRegion: e.target.value })}>
              {injuryRegions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <Field label="Estimated grade">
            <select value={assessment.grade} onChange={(e) => setAssessment({ ...assessment, grade: e.target.value })}>
              {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </Field>
          <Field label="How it happened">
            <select value={assessment.mechanism} onChange={(e) => setAssessment({ ...assessment, mechanism: e.target.value })}>
              {mechanisms.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Days since injury">
            <input type="number" min="0" value={assessment.daysSince} onChange={(e) => setAssessment({ ...assessment, daysSince: Number(e.target.value) })} />
          </Field>
        </div>
        <MultiSelect title="Secondary areas" items={injuryRegions.filter((r) => r.id !== assessment.primaryRegion).map((r) => r.name)} selected={assessment.secondaryRegions} onToggle={(v) => toggleArray('secondaryRegions', v)} />
        <MultiSelect title="What are you feeling?" items={symptomTypes} selected={assessment.symptoms} onToggle={(v) => toggleArray('symptoms', v)} />
      </div>

      <div className="section-card span-2">
        <p className="eyebrow">Step 2</p>
        <h2>Sport, demands, and equipment</h2>
        <MultiSelect title="Sports / activities" items={sports} selected={assessment.sports} onToggle={(v) => toggleArray('sports', v)} />
        <MultiSelect title="Movement demands" items={movements} selected={assessment.movements} onToggle={(v) => toggleArray('movements', v)} />
        <MultiSelect title="Available equipment" items={equipmentOptions} selected={assessment.equipment} onToggle={(v) => toggleArray('equipment', v)} />
      </div>

      <div className="section-card span-2">
        <p className="eyebrow">Step 3</p>
        <h2>Pain and context</h2>
        <div className="slider-grid">
          <Slider label="Pain at rest" value={assessment.painRest} onChange={(v) => setAssessment({ ...assessment, painRest: v })} />
          <Slider label="Pain walking / stairs" value={assessment.painWalking} onChange={(v) => setAssessment({ ...assessment, painWalking: v })} />
          <Slider label="Pain if you try sport movement" value={assessment.painSport} onChange={(v) => setAssessment({ ...assessment, painSport: v })} />
        </div>
        <textarea placeholder="Describe the story in your own words. Example: I felt a pull while sprinting, pain is high when I lengthen the leg, walking is okay." value={assessment.story} onChange={(e) => setAssessment({ ...assessment, story: e.target.value })} />
      </div>

      <div className="section-card span-2 redflag-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Optional safety screen</p>
            <h2>Red flags</h2>
            <p className="short-copy">Select only what applies. These answers help the app avoid unsafe rehab suggestions.</p>
          </div>
        </div>
        <div className="redflag-grid">
          {redFlagQuestions.map((q) => (
            <button key={q} className={assessment.redFlags.includes(q) ? 'tiny-check active' : 'tiny-check'} onClick={() => toggleArray('redFlags', q)} type="button">
              {q}
            </button>
          ))}
        </div>
      </div>

      <button className="primary-btn generate-btn" onClick={generateProfile}>Build my recovery plan</button>
    </section>
  );
}

function PlanView({ profile, completeDay, setActiveTab }) {
  const [openPhase, setOpenPhase] = useState(0);
  const [openWeek, setOpenWeek] = useState('0-0');
  const [openDay, setOpenDay] = useState('0-0-0');
  const [openAlt, setOpenAlt] = useState({});

  if (!profile) return <section className="empty-state"><h2>No plan yet.</h2><p>Complete the assessment to create your day-by-day plan.</p><button className="primary-btn" onClick={() => setActiveTab('assessment')}>Open assessment</button></section>;

  return (
    <section className="plan-shell">
      <div className="plan-intro">
        <p className="eyebrow">Recovery plan</p>
        <h2>{profile.regionName}</h2>
        <p>{profile.planNote}</p>
      </div>
      {profile.plan.map((phase, pIndex) => (
        <article className={`phase-card ${phase.accent}`} key={phase.id}>
          <button className="phase-head" onClick={() => setOpenPhase(openPhase === pIndex ? null : pIndex)}>
            <div>
              <span>{phase.name}</span>
              <h3>{phase.label}</h3>
              <p>{phase.goal}</p>
            </div>
            <strong>{phase.weeks.length} weeks</strong>
          </button>
          {openPhase === pIndex && (
            <div className="phase-body">
              <p className="phase-description">{phase.description}</p>
              {phase.weeks.map((week, wIndex) => {
                const weekKey = `${pIndex}-${wIndex}`;
                return (
                  <div className="week-card" key={weekKey}>
                    <button className="week-head" onClick={() => setOpenWeek(openWeek === weekKey ? null : weekKey)}>
                      <div><strong>{week.title}</strong><span>{week.focus}</span></div>
                      <small>{week.days.filter((d) => d.completed).length}/{week.days.length} done</small>
                    </button>
                    {openWeek === weekKey && (
                      <div className="days-list">
                        {week.days.map((day, dIndex) => {
                          const dayKey = `${pIndex}-${wIndex}-${dIndex}`;
                          return (
                            <div className={day.completed ? 'day-card completed' : 'day-card'} key={dayKey}>
                              <button className="day-head" onClick={() => setOpenDay(openDay === dayKey ? null : dayKey)}>
                                <div><strong>{day.title}</strong><span>{day.summary}</span></div>
                                <small>{day.load}</small>
                              </button>
                              {openDay === dayKey && (
                                <div className="session-card">
                                  <div className="session-header">
                                    <div>
                                      <p className="eyebrow">Session</p>
                                      <h4>{day.sessionTitle}</h4>
                                    </div>
                                    <button className={day.completed ? 'secondary-btn done' : 'secondary-btn'} onClick={() => completeDay(pIndex, wIndex, dIndex)}>
                                      {day.completed ? 'Mark incomplete' : 'Mark complete'}
                                    </button>
                                  </div>
                                  <div className="session-blocks">
                                    {day.exercises.map((ex, eIndex) => {
                                      const altKey = `${dayKey}-${eIndex}`;
                                      return (
                                        <div className="exercise-card" key={altKey}>
                                          <div className="video-placeholder">
                                            <span>Video demo placeholder</span>
                                            <small>{ex.video}</small>
                                          </div>
                                          <div className="exercise-main">
                                            <div className="exercise-title-row"><h5>{ex.name}</h5><span>{ex.intensity}</span></div>
                                            <div className="exercise-details">
                                              <span>{ex.prescription}</span>
                                              <span>{ex.equipment}</span>
                                            </div>
                                            <p>{ex.cue}</p>
                                            <button className="alt-btn" onClick={() => setOpenAlt({ ...openAlt, [altKey]: !openAlt[altKey] })}>
                                              Too hard? Show easier option
                                            </button>
                                            {openAlt[altKey] && <div className="alternative-box"><strong>{ex.alternative.name}</strong><span>{ex.alternative.prescription}</span><p>{ex.alternative.cue}</p></div>}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="day-rule"><strong>Progress rule:</strong> {day.rule}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

function Checkin({ addCheckin, checkins }) {
  const [status, setStatus] = useState({ pain: 2, confidence: 60, swelling: 'No change', response: 'Stable', notes: '' });
  return (
    <section className="checkin-grid">
      <div className="section-card">
        <p className="eyebrow">Daily check-in</p>
        <h2>How did the injury respond?</h2>
        <Slider label="Pain today" value={status.pain} onChange={(v) => setStatus({ ...status, pain: v })} />
        <Slider label="Confidence to move" value={status.confidence} max={100} onChange={(v) => setStatus({ ...status, confidence: v })} />
        <Field label="Swelling / tightness">
          <select value={status.swelling} onChange={(e) => setStatus({ ...status, swelling: e.target.value })}>
            <option>No change</option><option>Better</option><option>Worse</option><option>New swelling</option>
          </select>
        </Field>
        <Field label="Next-day response">
          <select value={status.response} onChange={(e) => setStatus({ ...status, response: e.target.value })}>
            <option>Stable</option><option>Better than yesterday</option><option>Sore but settled</option><option>Worse than yesterday</option>
          </select>
        </Field>
        <textarea placeholder="Notes" value={status.notes} onChange={(e) => setStatus({ ...status, notes: e.target.value })} />
        <button className="primary-btn" onClick={() => addCheckin(status)}>Save check-in</button>
      </div>
      <div className="section-card">
        <p className="eyebrow">History</p>
        <h2>Recent entries</h2>
        <div className="history-list">
          {checkins.length === 0 && <p>No check-ins yet.</p>}
          {checkins.map((c) => <div className="history-item" key={c.id}><strong>{c.date}</strong><span>Pain {c.pain}/10 · Confidence {c.confidence}%</span><p>{c.response} · {c.swelling}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function Coach({ chat, chatInput, setChatInput, sendChat }) {
  return (
    <section className="coach-card">
      <p className="eyebrow">Recovery coach</p>
      <h2>Ask about pain, training, or returning to sport.</h2>
      <div className="chat-window">
        {chat.map((m, i) => <div key={i} className={m.role === 'user' ? 'chat-bubble user' : 'chat-bubble coach'}>{m.text}</div>)}
      </div>
      <div className="chat-input">
        <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Example: I feel good. Can I sprint today?" onKeyDown={(e) => e.key === 'Enter' && sendChat()} />
        <button className="primary-btn" onClick={sendChat}>Send</button>
      </div>
    </section>
  );
}

function MultiSelect({ title, items, selected, onToggle }) {
  return <div className="multi-select"><span className="field-label">{title}</span><div className="pill-grid">{items.map((item) => <button type="button" key={item} className={selected.includes(item) ? 'select-pill active' : 'select-pill'} onClick={() => onToggle(item)}>{item}</button>)}</div></div>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Slider({ label, value, onChange, max = 10 }) {
  return <label className="slider"><span>{label}<strong>{value}{max === 10 ? '/10' : '%'}</strong></span><input type="range" min="0" max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}

function Metric({ label, value }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function BodyPictogram({ type }) {
  const highlightMap = {
    hamstring: [58, 70, 12, 28], quadriceps: [42, 70, 12, 28], calf_shin: [42, 102, 12, 26], adductor_groin: [49, 62, 14, 16], it_band: [38, 66, 6, 36], abdomen: [43, 38, 18, 22], ankle: [39, 128, 20, 8], knee: [38, 91, 24, 8], logo: [43, 38, 18, 70], assessment: [35, 34, 30, 96]
  };
  const h = highlightMap[type] || highlightMap.assessment;
  return (
    <svg className="body-icon" viewBox="0 0 100 145" role="img" aria-label="Body area pictogram">
      <circle cx="50" cy="13" r="8" />
      <path d="M42 25h16l7 34-8 30 7 42H54L50 96l-4 35H36l7-42-8-30 7-34Z" />
      <path d="M42 28 25 58M58 28l17 30" />
      <rect x={h[0]} y={h[1]} width={h[2]} height={h[3]} rx="5" className="highlight" />
    </svg>
  );
}

function buildProfile(a) {
  const region = injuryRegions.find((r) => r.id === a.primaryRegion) || injuryRegions[0];
  const grade = grades.find((g) => g.id === a.grade) || grades[1];
  const isHighRisk = a.redFlags.length > 0 || a.grade === 'grade3' || a.symptoms.includes('Instability / giving way') || a.symptoms.includes('Locking / catching');
  const returnRange = region.returnRanges[a.grade] || region.returnRanges.unknown || 'varies';
  const plan = buildPlan(a, region, grade, isHighRisk);
  const progress = calculateProgress(plan);
  return {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    primaryRegion: a.primaryRegion,
    regionName: region.name,
    gradeName: grade.name,
    mechanism: a.mechanism,
    returnRange: isHighRisk ? `${returnRange} · review recommended` : returnRange,
    plan,
    progress,
    today: findToday(plan),
    aiStatus: isHighRisk ? 'Your answers include higher-risk signs. Use the early-care plan only and arrange medical review before harder loading.' : 'Start with controlled work. Progress only when pain stays low during the session and the next morning feels stable.',
    planNote: buildPlanNote(a, isHighRisk)
  };
}

function buildPlan(a, region, grade, isHighRisk) {
  const lane = exerciseBank[a.primaryRegion] || exerciseBank.hamstring;
  const selectedPhases = isHighRisk ? phases.slice(0, 2) : phases;
  return selectedPhases.map((phase, pIndex) => {
    const weeksCount = Math.max(1, phase.baseWeeks[a.grade] || 1);
    const weeks = Array.from({ length: weeksCount }, (_, wIndex) => buildWeek(phase, lane, a, pIndex, wIndex, weeksCount, grade));
    return { ...phase, weeks };
  });
}

function buildWeek(phase, lane, a, pIndex, wIndex, weeksCount, grade) {
  const focus = weekFocus(phase.id, wIndex, weeksCount, a);
  const days = Array.from({ length: 7 }, (_, dIndex) => buildDay(phase, lane, a, pIndex, wIndex, dIndex, grade));
  return { title: `Week ${wIndex + 1}`, focus, days };
}

function buildDay(phase, lane, a, pIndex, wIndex, dIndex, grade) {
  const isRecovery = dIndex === 3 || dIndex === 6;
  const pool = lane[phase.id] || lane.protect;
  let count = phase.id === 'protect' ? 3 : phase.id === 'restore' ? 4 : phase.id === 'capacity' ? 5 : 5;
  if (isRecovery) count = phase.id === 'protect' ? 2 : 3;
  if (a.grade === 'grade2') count = Math.max(2, count - (phase.id === 'speed' || phase.id === 'return' ? 1 : 0));
  if (a.grade === 'grade3') count = Math.min(3, count);

  const chosen = rotate(pool, dIndex).slice(0, Math.min(count, pool.length)).map((ex, idx) => adjustExercise(ex, phase, a, wIndex, dIndex, idx));
  const title = `Day ${dIndex + 1}`;
  return {
    title,
    sessionTitle: isRecovery ? 'Recovery and control session' : sessionTitle(phase.id, dIndex),
    summary: isRecovery ? 'Lower intensity to let the tissue adapt.' : summaryFor(phase.id, a),
    load: isRecovery ? 'Low load' : phase.intensity,
    exercises: chosen,
    completed: false,
    rule: ruleFor(phase.id, a)
  };
}

function rotate(arr, n) {
  return arr.slice(n % arr.length).concat(arr.slice(0, n % arr.length));
}

function adjustExercise(ex, phase, a, wIndex, dIndex, idx) {
  const copy = structuredClone(ex);
  const gym = a.equipment.includes('Gym machines') || a.equipment.includes('Barbell') || a.equipment.includes('Dumbbells');
  if (!gym && /barbell|machine|cable|DB|Dumbbell|Gym/i.test(copy.equipment)) copy.equipment += ' · use listed easier option if unavailable';
  if (a.grade === 'grade2' || a.grade === 'unknown') copy.intensity = copy.intensity.replace('RPE 7–9', 'RPE 6–7').replace('RPE 6–8', 'RPE 5–7');
  if (a.grade === 'grade3') copy.intensity = 'RPE 2–4 only until cleared';
  if (phase.id === 'capacity' && wIndex > 0 && idx < 2) copy.prescription += ' · add small load if previous day was green';
  if ((phase.id === 'speed' || phase.id === 'return') && a.movements.includes('High-speed running')) copy.cue += ' Keep speed exposure gradual and never chase max speed on a sore day.';
  if (a.movements.includes('Kicking') && (a.primaryRegion === 'quadriceps' || a.primaryRegion === 'adductor_groin' || a.primaryRegion === 'abdomen')) copy.cue += ' Kicking stays submax until resisted tests are quiet.';
  return copy;
}

function calculateProgress(plan = []) {
  const totalPhases = plan.length;
  const completedPhases = plan.filter((p) => p.weeks.every((w) => w.days.every((d) => d.completed))).length;
  const allWeeks = plan.flatMap((p) => p.weeks);
  const totalWeeks = allWeeks.length;
  const completedWeeks = allWeeks.filter((w) => w.days.every((d) => d.completed)).length;
  const allDays = allWeeks.flatMap((w) => w.days);
  const totalDays = allDays.length || 1;
  const completedDays = allDays.filter((d) => d.completed).length;
  return { totalPhases, completedPhases, totalWeeks, completedWeeks, totalDays, completedDays, percent: Math.round((completedDays / totalDays) * 100) };
}

function findToday(plan) {
  for (const phase of plan) {
    for (const week of phase.weeks) {
      for (const day of week.days) {
        if (!day.completed) return { ...day, phaseLabel: phase.label };
      }
    }
  }
  return { title: 'Plan complete', summary: 'Keep maintenance work and gradually return to full performance.', phaseLabel: 'Maintenance' };
}

function getStatusMessage(status, profile) {
  if (status.pain > 5 || status.swelling === 'New swelling' || status.response === 'Worse than yesterday') return 'Today is a regression day. Repeat or reduce the previous session and avoid testing sport intensity.';
  if (status.pain <= 2 && status.confidence >= 70 && status.response !== 'Worse than yesterday') return 'This is a green response. You can progress one small variable next session, not everything at once.';
  return 'This is an amber response. Repeat the same level once more before progressing.';
}

function coachResponse(text, profile, assessment) {
  const lower = text.toLowerCase();
  if (!profile) return 'Complete the assessment first so I can answer based on your injury, grade, sport, and current phase.';
  if (/sprint|play|match|football|soccer|return|game|train/i.test(lower)) {
    return `Based on your ${profile.gradeName.toLowerCase()} ${profile.regionName.toLowerCase()} profile, do not jump straight to full sport. Your next step should match the current phase: ${profile.today?.phaseLabel}. You need low pain during the session, no next-day flare, no swelling, and clean movement before harder sport exposure.`;
  }
  if (/pain|worse|swelling|bruise|limp|sharp/i.test(lower)) {
    return 'That is a signal to hold or regress. Keep pain under 2–3/10, avoid movements that change your gait, and log a check-in. If swelling, instability, locking, severe bruising, calf warmth, or abdominal/groin bulge appears, seek medical review.';
  }
  if (/too easy|easy|progress|increase/i.test(lower)) {
    return 'Progress only one variable at a time: either range, load, reps, speed, or complexity. If tomorrow morning is still calm, the plan can move forward. If not, repeat the same level.';
  }
  return 'Keep the plan boring and consistent. The goal is not to prove you are healed today; it is to build enough capacity that the injury does not return when intensity rises.';
}

function buildPlanNote(a, highRisk) {
  if (highRisk) return 'This plan is conservative because your answers include high-risk signs or a severe grade. Use it only as early guidance until reviewed.';
  const multiple = a.secondaryRegions.length ? ` It also accounts for secondary areas: ${a.secondaryRegions.join(', ')}.` : '';
  return `Plan tailored to ${a.mechanism.toLowerCase()}, ${gradeLabels[a.grade].toLowerCase()}, selected equipment, pain levels, and sport demands.${multiple}`;
}

function weekFocus(phaseId, weekIndex, weeksCount, a) {
  const base = {
    protect: 'Calm symptoms, restore walking, keep gentle activation.',
    restore: 'Increase range, control, and submax strength.',
    capacity: 'Build strength and tissue tolerance with progressive loading.',
    speed: 'Introduce impact, running, landing, and sport-specific speed carefully.',
    return: 'Rehearse sport demands and maintain strength while returning.'
  }[phaseId];
  return weeksCount > 1 ? `${base} Week ${weekIndex + 1} of ${weeksCount}: progress only after green check-ins.` : base;
}

function sessionTitle(phaseId, dayIndex) {
  const titles = {
    protect: ['Pain-free activation', 'Mobility and circulation', 'Isometric control'],
    restore: ['Control strength', 'Range and balance', 'Submax loading'],
    capacity: ['Strength capacity', 'Eccentric control', 'Single-leg strength'],
    speed: ['Running and impact prep', 'Landing and deceleration', 'Sport mechanics'],
    return: ['Controlled sport exposure', 'Return-to-training rehearsal', 'Performance maintenance']
  };
  return titles[phaseId][dayIndex % 3];
}

function summaryFor(phaseId, a) {
  const s = {
    protect: 'Short and controlled. Nothing should feel aggressive.',
    restore: 'Build confidence through smooth movement and light strength.',
    capacity: 'Strength work becomes more meaningful while staying controlled.',
    speed: 'Add speed or impact carefully, only if the previous day stayed calm.',
    return: 'Rehearse your sport in layers before full intensity.'
  };
  return s[phaseId];
}

function ruleFor(phaseId, a) {
  if (a.grade === 'grade3') return 'Stop and seek review if symptoms are severe, unstable, or worsening. Do not progress to speed or heavy loading without clearance.';
  if (phaseId === 'speed' || phaseId === 'return') return 'Progress only if pain stays 0–2/10, no swelling or limp appears, and tomorrow morning is not worse.';
  return 'Green: pain 0–2/10 and next morning stable. Amber: repeat. Red: regress or seek review.';
}
