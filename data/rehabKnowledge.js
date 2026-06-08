export const injuryRegions = [
  { id: 'hamstring', name: 'Hamstring', pictogram: 'posterior-thigh', returnRanges: { overload: '3–10 days', grade1: '1–3 weeks', grade2: '3–8 weeks', grade3: '8–16+ weeks' } },
  { id: 'quadriceps', name: 'Quadriceps / anterior thigh', pictogram: 'anterior-thigh', returnRanges: { overload: '3–10 days', grade1: '1–3 weeks', grade2: '3–7 weeks', grade3: '8–14+ weeks' } },
  { id: 'calf_shin', name: 'Calf / shin', pictogram: 'lower-leg', returnRanges: { overload: '5–14 days', grade1: '1–3 weeks', grade2: '3–8 weeks', grade3: '8–16+ weeks' } },
  { id: 'adductor_groin', name: 'Adductor / groin', pictogram: 'groin', returnRanges: { overload: '5–14 days', grade1: '1–3 weeks', grade2: '3–8 weeks', grade3: '8–12+ weeks' } },
  { id: 'it_band', name: 'IT band / lateral chain', pictogram: 'lateral-thigh', returnRanges: { overload: '1–3 weeks', grade1: '2–4 weeks', grade2: '4–8 weeks', grade3: 'specialist review' } },
  { id: 'abdomen', name: 'Abdomen / core / hernia-risk', pictogram: 'core', returnRanges: { overload: '1–3 weeks', grade1: '2–5 weeks', grade2: '4–10 weeks', grade3: 'specialist review' } },
  { id: 'ankle', name: 'Ankle', pictogram: 'ankle', returnRanges: { overload: '3–10 days', grade1: '1–2 weeks', grade2: '3–6 weeks', grade3: '6–12+ weeks' } },
  { id: 'knee', name: 'Knee', pictogram: 'knee', returnRanges: { overload: '1–3 weeks', grade1: '2–4 weeks', grade2: '4–10 weeks', grade3: 'medical-first' } }
];

export const grades = [
  { id: 'overload', name: 'Overload / soreness', multiplier: 0.7, caution: 'Symptoms are usually load-sensitive. The plan emphasizes control and gradual exposure.' },
  { id: 'grade1', name: 'Grade I / mild', multiplier: 1, caution: 'Mild tissue irritation or small strain pattern. Progression is allowed only if next-day response stays calm.' },
  { id: 'grade2', name: 'Grade II / moderate', multiplier: 1.5, caution: 'Moderate injury pattern. The app will hold phases longer and delay speed, jumping, and sport exposure.' },
  { id: 'grade3', name: 'Grade III / severe or suspected tear', multiplier: 2.2, caution: 'High-risk pattern. The app will recommend medical review and only show conservative early-care guidance.' },
  { id: 'unknown', name: 'Unknown', multiplier: 1.3, caution: 'Because the grade is unclear, the plan starts conservatively until repeated check-ins are green.' }
];

export const sports = [
  'Football / soccer', 'Running', 'Basketball', 'Volleyball', 'Tennis / padel', 'Weight training', 'Cycling', 'Swimming', 'CrossFit', 'Martial arts', 'Dance', 'General fitness'
];

export const movements = [
  'High-speed running', 'Kicking', 'Jumping / landing', 'Cutting / change of direction', 'Hills', 'Long-duration running', 'Heavy lifting', 'Contact', 'Uneven surfaces', 'Deep squatting'
];

export const equipmentOptions = [
  'Bodyweight', 'Resistance bands', 'Dumbbells', 'Barbell', 'Gym machines', 'Cable machine', 'Bike', 'Treadmill', 'Pool', 'Cones / markers', 'Foam roller', 'Step / box'
];

export const mechanisms = [
  'Sudden sprint', 'Kicking or shooting', 'Cutting or twisting', 'Jump / landing', 'Heavy lift', 'Long run', 'Hill running', 'Direct impact', 'Gradual overload', 'Unknown'
];

export const symptomTypes = [
  'Sharp pain', 'Dull ache', 'Tightness', 'Pulling sensation', 'Deep ache', 'Burning / nerve-like', 'Instability / giving way', 'Swelling', 'Bruising', 'Locking / catching'
];

export const phases = [
  {
    id: 'protect',
    name: 'Phase 1',
    label: 'Protect and settle',
    goal: 'Calm the injury and move normally again.',
    description: 'Short sessions with gentle mobility, isometrics, easy circulation, and pain-free daily movement.',
    baseWeeks: { overload: 1, grade1: 1, grade2: 1, grade3: 2, unknown: 1 },
    intensity: 'RPE 2–4',
    accent: 'phase-blue'
  },
  {
    id: 'restore',
    name: 'Phase 2',
    label: 'Restore motion and control',
    goal: 'Rebuild comfortable range, balance, and light strength.',
    description: 'Controlled strength, mobility, balance, and low-impact conditioning without next-day flare-ups.',
    baseWeeks: { overload: 1, grade1: 1, grade2: 2, grade3: 2, unknown: 2 },
    intensity: 'RPE 4–6',
    accent: 'phase-teal'
  },
  {
    id: 'capacity',
    name: 'Phase 3',
    label: 'Build strength capacity',
    goal: 'Make the injured area strong enough for harder training.',
    description: 'Progressive strength, longer-lever work, controlled eccentrics, and heavier tissue loading.',
    baseWeeks: { overload: 1, grade1: 1, grade2: 2, grade3: 3, unknown: 2 },
    intensity: 'RPE 5–8',
    accent: 'phase-violet'
  },
  {
    id: 'speed',
    name: 'Phase 4',
    label: 'Speed, power, and sport prep',
    goal: 'Prepare the body for speed, impact, direction changes, and sport-specific demands.',
    description: 'Running progressions, landing drills, acceleration, change of direction, and controlled skill work.',
    baseWeeks: { overload: 1, grade1: 1, grade2: 2, grade3: 3, unknown: 2 },
    intensity: 'RPE 6–8',
    accent: 'phase-orange'
  },
  {
    id: 'return',
    name: 'Phase 5',
    label: 'Return to train, play, and perform',
    goal: 'Return safely without rushing the final step.',
    description: 'Controlled sport sessions, full-intensity rehearsals, and maintenance strength to reduce reinjury risk.',
    baseWeeks: { overload: 1, grade1: 1, grade2: 2, grade3: 3, unknown: 2 },
    intensity: 'RPE 6–9',
    accent: 'phase-green'
  }
];

const videoPlaceholder = 'Add your own video URL here';

export const exerciseBank = {
  hamstring: {
    protect: [
      e('Heel-dig hamstring isometric', '5 x 20 sec', 'Bodyweight', 'RPE 2–4', 'Press heel gently into the floor. No cramping or pulling.', 'Shorter 10-second holds', 'Bend the knee less and use lighter pressure.'),
      e('Glute bridge hold', '4 x 20 sec', 'Bodyweight', 'RPE 3', 'Ribs down, hips level, pressure through heels.', 'Double-leg bridge reps', 'Do 2 x 8 slow reps instead of holds.'),
      e('Dead bug heel tap', '3 x 6/side', 'Bodyweight', 'Easy', 'Keep pelvis quiet and avoid arching.', 'Marching dead bug', 'Move one leg at a time with shorter range.')
    ],
    restore: [
      e('Long-lever bridge', '3 x 8', 'Bodyweight', 'RPE 4–5', 'Move slow. Stop if the hamstring grabs.', 'Short-lever bridge', 'Bring heels closer to reduce hamstring demand.'),
      e('Assisted hamstring slider', '3 x 5–6', 'Towel / sliders', 'RPE 4–6', 'Slide out slowly, assist the return.', 'Bridge walkout', 'Walk the heels out only a small distance.'),
      e('Hip hinge patterning', '3 x 8', 'Dumbbell optional', 'RPE 4', 'Soft knees, hips back, spine long.', 'Wall hip hinge', 'Use the wall as a target and no weight.')
    ],
    capacity: [
      e('DB Romanian deadlift', '4 x 6–8', 'Dumbbells / barbell', 'RPE 6–8', 'Slow lower, strong hip drive, no sharp stretch.', 'Bodyweight RDL', 'Use no weight and shorten the range.'),
      e('Hip thrust', '4 x 6–8', 'Bench + weight optional', 'RPE 6–7', 'Pause at the top without arching.', 'Glute bridge', 'Stay on the floor and use bodyweight.'),
      e('Assisted Nordic lower', '2–3 x 3–5', 'Partner / anchor', 'RPE 6–8', 'Only if pain-free. Control the lower.', 'Slider curl', 'Use sliders instead of Nordics.')
    ],
    speed: [
      e('A-march to A-skip', '3 x 15 m', 'Cones optional', 'RPE 5–6', 'Tall posture, crisp contacts.', 'March only', 'Remove the skip and keep it slow.'),
      e('Build-up runs', '6 x 40 m at 60–80%', 'Open space / treadmill', 'RPE 6–7', 'Smooth acceleration. No sprinting if tightness rises.', 'Fast walk intervals', 'Use brisk walk instead of runs.'),
      e('Low pogo hops', '3 x 15 sec', 'Bodyweight', 'RPE 5–6', 'Quiet contacts, minimal knee bend.', 'Calf raise rhythm', 'Replace hops with quick double-leg calf raises.')
    ],
    return: [
      e('Progressive sprint exposure', '6–8 runs: 70–95%', 'Field / track', 'RPE 7–9', 'Increase one variable only: speed or volume.', 'Tempo runs', 'Keep runs at 60–70% speed.'),
      e('Planned change of direction', '4 x 4 reps', 'Cones', 'RPE 7–8', 'Cut cleanly without protecting the leg.', 'Curved runs', 'Use gentle arcs instead of cuts.'),
      e('Maintenance eccentric hamstring work', '2 x 5', 'Anchor / sliders', 'RPE 6–7', 'Keep this twice weekly after return.', 'Bridge walkouts', 'Use a lower-intensity eccentric option.')
    ]
  },
  quadriceps: {
    protect: [e('Quad set', '5 x 10 sec', 'Bodyweight', 'Easy', 'Tighten thigh without pain.', 'Towel squeeze quad set', 'Place towel under knee and press down.'), e('Heel slide', '2 x 10', 'Bodyweight', 'Easy', 'Bend only to comfortable range.', 'Assisted heel slide', 'Use hands or towel to assist.'), e('Standing hip-flexor isometric', '4 x 15 sec/side', 'Wall', 'RPE 2–3', 'Knee lifted low. No sharp anterior thigh pain.', 'Seated march hold', 'Perform seated with shorter hold.')],
    restore: [e('Step-up', '3 x 8/side', 'Step / box', 'RPE 4–5', 'Knee tracks over toes. Slow lower.', 'Lower step-up', 'Use a smaller step.'), e('Split squat short range', '3 x 6/side', 'Bodyweight / DB', 'RPE 4–6', 'Stay tall, shallow range first.', 'Supported split squat', 'Hold a wall or chair.'), e('Banded knee extension', '3 x 12', 'Band', 'RPE 4–5', 'Control lockout and return.', 'Quad set', 'Return to isometric quad sets.')],
    capacity: [e('Leg press or goblet squat', '4 x 6–8', 'Machine / DB', 'RPE 6–8', 'Controlled depth. No sharp pain.', 'Box squat', 'Squat to a higher box.'), e('Reverse Nordic regression', '3 x 4–6', 'Bodyweight', 'RPE 6', 'Keep hips extended and range small.', 'Tall-kneeling lean', 'Lean back only a few degrees.'), e('DB step-up', '3 x 6/side', 'Dumbbells', 'RPE 6–7', 'Drive through whole foot.', 'Bodyweight step-up', 'Remove the weight.')],
    speed: [e('High-knee drill', '3 x 15 m', 'Open space', 'RPE 5–6', 'Quick but smooth. No kicking pain.', 'Marching high-knees', 'Slow the drill down.'), e('Submax strides', '6 x 40 m at 60–80%', 'Field / treadmill', 'RPE 6–7', 'Gradual build, upright posture.', 'Incline walk', 'Replace running with brisk walking.'), e('Low squat jump', '3 x 5', 'Bodyweight', 'RPE 6', 'Soft landing, low height.', 'Fast calf raise', 'Remove the jump.')],
    return: [e('Progressive kicking pattern', '3 x 8 submax kicks', 'Ball optional', 'RPE 6–8', 'Start short passing before long strikes.', 'Air swings', 'Perform slow unloaded swing pattern.'), e('Sprint and deceleration exposure', '5 x 30 m', 'Open space', 'RPE 7–8', 'Decelerate gradually at first.', 'Build-up walk-run', 'Reduce speed to 60%.'), e('Heavy quad maintenance', '3 x 5', 'Gym / DB', 'RPE 7–8', 'Keep strength twice weekly.', 'Goblet squat', 'Use lighter load and higher box.')]
  },
  calf_shin: {
    protect: [e('Seated calf isometric', '5 x 20 sec', 'Bodyweight / DB', 'RPE 2–4', 'Push through big toe and second toe.', 'Two-leg floor press', 'Keep both feet down and lighter pressure.'), e('Ankle alphabet', '2 rounds', 'Bodyweight', 'Easy', 'Move slowly without forcing range.', 'Ankle circles', 'Use smaller circles.'), e('Toe yoga', '2 x 8', 'Bodyweight', 'Easy', 'Separate big toe from smaller toes.', 'Short-foot hold', 'Gently raise the arch without toe gripping.')],
    restore: [e('Double-leg calf raise', '3 x 10–12', 'Bodyweight', 'RPE 4–5', 'Three-second lower.', 'Seated calf raise', 'Keep it seated and lighter.'), e('Bent-knee soleus raise', '3 x 10', 'Bodyweight / DB', 'RPE 4–6', 'Knee stays bent to bias soleus.', 'Isometric soleus hold', 'Hold mid-range instead of reps.'), e('Tibialis raise', '3 x 12', 'Wall', 'RPE 4', 'Lift toes without leaning too much.', 'Toe lift seated', 'Perform seated.')],
    capacity: [e('Single-leg calf raise', '4 x 6–8', 'Bodyweight / DB', 'RPE 6–8', 'Full height, slow lower.', 'Supported two-up one-down', 'Use both legs up and one leg down.'), e('Heavy seated soleus raise', '4 x 6–8', 'DB / machine', 'RPE 6–8', 'Pause at the top.', 'Bodyweight bent-knee raise', 'Remove external load.'), e('Low pogo series', '3 x 20 sec', 'Bodyweight', 'RPE 6', 'Elastic but quiet contacts.', 'Fast double-leg calf raise', 'No jumping.')],
    speed: [e('Walk-run intervals', '8 x 1 min run / 1 min walk', 'Treadmill / flat route', 'RPE 5–6', 'Flat surface first. No hill work.', 'Brisk walk intervals', 'Use fast walking only.'), e('Line hops', '3 x 15 sec', 'Bodyweight', 'RPE 6–7', 'Small amplitude, even contact.', 'Pogo hold rhythm', 'Use rhythmic calf raises.'), e('Acceleration build-ups', '5 x 20 m at 60–75%', 'Open space', 'RPE 6–7', 'Smooth push-off, no calf grab.', 'Incline walk', 'Replace with low-impact conditioning.')],
    return: [e('Full running progression', '20–35 min total', 'Flat route / treadmill', 'RPE 6–8', 'Increase distance or speed, not both.', 'Run-walk', 'Stay with intervals.'), e('Sport-specific footwork', '5 x 30 sec', 'Cones', 'RPE 7', 'Stay light and balanced.', 'Marching footwork', 'Remove hops and speed.'), e('Calf maintenance strength', '3 x 6–8', 'DB / machine', 'RPE 7–8', 'Keep two sessions weekly for four weeks.', 'Bodyweight calf raises', 'Reduce load.')]
  },
  adductor_groin: {
    protect: [e('Short-lever adductor squeeze', '5 x 20 sec', 'Ball / pillow', 'RPE 2–4', 'Squeeze gently. Pain must stay low.', 'Very light pillow squeeze', 'Use less pressure and shorter holds.'), e('Dead bug brace', '3 x 6/side', 'Bodyweight', 'Easy', 'Exhale, brace, move slowly.', 'Heel slide brace', 'Slide heel instead of lifting leg.'), e('Glute bridge', '3 x 8', 'Bodyweight', 'RPE 3–4', 'Even pressure through both feet.', 'Bridge hold', 'Hold for 10 seconds instead of reps.')],
    restore: [e('Long-lever adductor squeeze', '4 x 15 sec', 'Ball / pillow', 'RPE 4–5', 'Longer lever only if short lever is calm.', 'Short-lever squeeze', 'Return to knees bent.'), e('Banded adduction', '3 x 12/side', 'Band / cable', 'RPE 4–6', 'Slow inward pull and slow return.', 'Standing weight-shift', 'No band; shift weight side to side.'), e('Supported lateral lunge', '3 x 6/side', 'Bodyweight', 'RPE 4–5', 'Small range, hips back.', 'Side step squat', 'Make it shallower.')],
    capacity: [e('Assisted Copenhagen plank', '3 x 5–6/side', 'Bench', 'RPE 6–7', 'Start with knee supported.', 'Side plank knees', 'Remove adductor load.'), e('Cable or band adduction', '4 x 8', 'Cable / band', 'RPE 6–7', 'Strong but controlled.', 'Long-lever squeeze', 'Use isometrics instead.'), e('Cossack squat partial range', '3 x 6/side', 'Bodyweight / DB', 'RPE 5–7', 'Only move through pain-free range.', 'Supported lateral lunge', 'Hold support and reduce depth.')],
    speed: [e('Lateral shuffle progression', '5 x 15 m', 'Cones', 'RPE 6–7', 'No groin pull during push-off.', 'Side steps', 'Slow it down and shorten distance.'), e('Planned cutting drill', '4 x 4 reps', 'Cones', 'RPE 7', 'Controlled angles before sharper cuts.', 'Curved jog', 'Use curves instead of cuts.'), e('Submax acceleration', '6 x 20 m at 60–80%', 'Open space', 'RPE 6–7', 'Gradual build. No sudden first step.', 'Fast walk', 'No running.')],
    return: [e('Sport-specific cutting sequence', '5 x 30 sec', 'Cones / ball optional', 'RPE 7–8', 'Combine shuffle, decel, turn.', 'Planned low-speed cuts', 'Reduce speed and angles.'), e('Controlled kicking / passing', '3 x 8–10', 'Ball optional', 'RPE 6–8', 'Start short and submax.', 'No-ball swing pattern', 'Use slow unloaded swings.'), e('Copenhagen maintenance', '2 x 6/side', 'Bench', 'RPE 6–7', 'Keep it in weekly routine.', 'Side plank knees', 'Lower intensity.')]
  },
  it_band: {
    protect: [e('Side-lying hip abduction', '3 x 10/side', 'Bodyweight', 'RPE 3–4', 'Toe slightly down, lift from hip.', 'Clamshell', 'Bend knees and reduce lever length.'), e('Glute bridge', '3 x 10', 'Bodyweight', 'RPE 3–4', 'Even hips, slow reps.', 'Bridge hold', 'Hold 10 seconds.'), e('Pain-free step-down practice', '2 x 6/side', 'Low step', 'Easy', 'Only if lateral knee pain stays quiet.', 'Sit-to-stand', 'Use a chair instead.')],
    restore: [e('Banded lateral walk', '3 x 8 steps/side', 'Band', 'RPE 4–6', 'Small steps, pelvis level.', 'No-band side steps', 'Remove band.'), e('Single-leg bridge', '3 x 8/side', 'Bodyweight', 'RPE 4–5', 'Hips level.', 'Double-leg bridge', 'Use both legs.'), e('Supported split squat', '3 x 6/side', 'Bodyweight / DB', 'RPE 4–6', 'Knee tracks cleanly.', 'Sit-to-stand', 'Reduce demand.')],
    capacity: [e('Step-down', '4 x 6/side', 'Step / box', 'RPE 5–7', 'Control knee and pelvis.', 'Lower step-down', 'Use a shorter step.'), e('Single-leg RDL', '3 x 6/side', 'DB optional', 'RPE 5–7', 'Hips square, slow lower.', 'Kickstand RDL', 'Use back foot support.'), e('Lateral squat', '3 x 8/side', 'Bodyweight / DB', 'RPE 5–7', 'Hips back, knee aligned.', 'Side step squat', 'Make it shallow.')],
    speed: [e('Flat easy run intervals', '8–10 x 1 min', 'Treadmill / flat route', 'RPE 5–6', 'Flat before hills. Stop if lateral knee pain climbs.', 'Bike intervals', 'Use bike if running irritates.'), e('Cadence drill', '4 x 60 sec', 'Treadmill / route', 'RPE 5', 'Slightly quicker, lighter steps.', 'Marching cadence', 'Practice rhythm while walking.'), e('Low lateral bounds', '3 x 5/side', 'Bodyweight', 'RPE 6', 'Soft landing, small distance.', 'Lateral step-down', 'No jumping.')],
    return: [e('Progressive run build', '20–40 min', 'Flat route first', 'RPE 6–8', 'Increase volume before speed or hills.', 'Run-walk intervals', 'Keep breaks between runs.'), e('Hill reintroduction', '4 x 30 sec easy incline', 'Hill / treadmill', 'RPE 6', 'Only after flat runs are symptom-free.', 'Flat walk-run', 'Avoid hills.'), e('Hip control maintenance', '3 exercises x 2 sets', 'Band / bodyweight', 'RPE 5–7', 'Continue weekly.', 'One hip-control drill', 'Do only side-lying hip abduction.')]
  },
  abdomen: {
    protect: [e('Diaphragmatic breathing with brace', '3 x 6 breaths', 'Bodyweight', 'Easy', 'No breath holding or bulging.', 'Supine breathing only', 'Skip the brace.'), e('Heel slide brace', '3 x 6/side', 'Bodyweight', 'Easy', 'Keep symptoms under 2/10.', 'Breathing reset', 'Return to breathing only.'), e('Side plank from knees', '2 x 15–20 sec/side', 'Bodyweight', 'RPE 3–4', 'No sharp groin or lower-abdominal pain.', 'Supported side plank', 'Use a shorter hold.')],
    restore: [e('Dead bug', '3 x 6/side', 'Bodyweight', 'RPE 4', 'Exhale and keep pelvis quiet.', 'Heel tap only', 'Shorten range.'), e('Pallof press', '3 x 8/side', 'Band / cable', 'RPE 4–6', 'Resist rotation. No straining.', 'Isometric anti-rotation hold', 'Hold band at chest.'), e('Glute bridge march', '3 x 6/side', 'Bodyweight', 'RPE 4–5', 'Hips level.', 'Glute bridge', 'Do both legs.')],
    capacity: [e('Farmer carry', '4 x 20–30 m', 'DB / kettlebell', 'RPE 5–7', 'Walk tall, breathe normally.', 'Suitcase hold', 'Stand still with weight.'), e('Cable chop / lift', '3 x 8/side', 'Cable / band', 'RPE 5–7', 'Controlled rotation, no pain spike.', 'Pallof press', 'Stay anti-rotation.'), e('Split squat', '3 x 6/side', 'Bodyweight / DB', 'RPE 5–7', 'Brace gently, no Valsalva.', 'Supported split squat', 'Hold support and lighten load.')],
    speed: [e('Acceleration mechanics', '5 x 15 m', 'Open space', 'RPE 5–7', 'No abdominal tug or groin pressure.', 'Marching wall drill', 'No running.'), e('Controlled trunk rotation drill', '3 x 8/side', 'Band / ball optional', 'RPE 5–6', 'Rotate through hips and trunk smoothly.', 'Pallof press', 'Remove rotation.'), e('Lateral shuffle', '4 x 15 m', 'Cones', 'RPE 6', 'No pressure/bulge sensation.', 'Side steps', 'Slow down.')],
    return: [e('Sport movement circuit', '4 rounds x 45 sec', 'Cones / ball optional', 'RPE 7–8', 'Combine acceleration, turn, pass/strike only if symptom-free.', 'Controlled skill walk-through', 'Reduce speed and range.'), e('Loaded core maintenance', '3 x 6–8', 'Cable / DB', 'RPE 6–7', 'No breath holding.', 'Dead bug', 'Return to floor control.'), e('Full training rehearsal', '20–40 min controlled', 'Sport setting', 'RPE 7–8', 'Build exposure gradually, no max effort first day.', 'Technical-only session', 'No sprint or contact.')]
  },
  ankle: {
    protect: [e('Ankle alphabet', '2 rounds', 'Bodyweight', 'Easy', 'Move without forcing swelling.', 'Ankle pumps', 'Simpler up/down motion.'), e('Isometric ankle four-way', '4 x 15 sec each', 'Wall / hand resistance', 'RPE 2–4', 'Gentle pressure in each direction.', 'Two-way isometrics', 'Only do up/down directions.'), e('Supported double-leg calf raise', '2 x 10', 'Bodyweight', 'RPE 3–4', 'Only if weightbearing is safe.', 'Seated calf raise', 'Do seated instead.')],
    restore: [e('Banded ankle four-way', '3 x 12 each', 'Band', 'RPE 4–5', 'Slow control, full pain-free range.', 'Isometric four-way', 'Hold instead of moving.'), e('Single-leg balance', '3 x 20 sec/side', 'Bodyweight', 'RPE 4', 'Use support as needed.', 'Tandem balance', 'Place one foot in front of the other.'), e('Step-up', '3 x 8/side', 'Step', 'RPE 4–5', 'Quiet foot and knee alignment.', 'Weight shift', 'Shift side to side standing.')],
    capacity: [e('Single-leg calf raise', '4 x 6–8', 'Bodyweight / DB', 'RPE 6–7', 'Full height, slow lower.', 'Double-leg calf raise', 'Use both legs.'), e('Star reach balance', '3 x 4 reaches/side', 'Bodyweight', 'RPE 5–6', 'Reach without collapsing arch.', 'Single-leg balance', 'No reaching.'), e('Lateral step-down', '3 x 6/side', 'Step', 'RPE 5–7', 'Control knee and ankle.', 'Mini step-down', 'Use lower height.')],
    speed: [e('Jump-and-stick landing', '3 x 5', 'Bodyweight', 'RPE 5–6', 'Land quietly and hold two seconds.', 'Calf raise hold', 'No jump.'), e('Line hops', '3 x 15 sec', 'Bodyweight', 'RPE 6–7', 'Small and controlled.', 'Quick calf raises', 'Remove impact.'), e('Planned cutting walk-jog', '4 x 4 reps', 'Cones', 'RPE 6–7', 'Start wide angles.', 'Curved walking', 'No cutting.')],
    return: [e('Hop test rehearsal', '3 x 5/side', 'Bodyweight', 'RPE 7', 'Land stable. No giving way.', 'Jump-and-stick double-leg', 'Use both legs.'), e('Sport agility circuit', '5 x 30 sec', 'Cones', 'RPE 7–8', 'Shuffle, decel, turn, accelerate.', 'Planned low-speed footwork', 'Reduce speed.'), e('Balance and calf maintenance', '2–3 x 8', 'DB / bodyweight', 'RPE 6–7', 'Maintain twice weekly.', 'Supported calf raise', 'Lower load.')]
  },
  knee: {
    protect: [e('Quad set', '5 x 10 sec', 'Bodyweight', 'Easy', 'Restore quad signal. No swelling response.', 'Towel quad set', 'Use towel support.'), e('Heel slide', '2 x 10', 'Bodyweight', 'Easy', 'Pain-free flexion only.', 'Assisted heel slide', 'Use towel support.'), e('Straight-leg raise', '3 x 8', 'Bodyweight', 'RPE 3–4', 'Only if no lag and no sharp pain.', 'Short-arc quad', 'Reduce lever length.')],
    restore: [e('Sit-to-stand', '3 x 8', 'Chair', 'RPE 4–5', 'Even weight. No collapse inward.', 'Higher chair sit-to-stand', 'Use higher surface.'), e('Step-up', '3 x 8/side', 'Step', 'RPE 4–6', 'Knee tracks smoothly.', 'Weight shift', 'Reduce load.'), e('Spanish squat hold', '4 x 20 sec', 'Band / strap', 'RPE 4–6', 'Useful for tendon-type pain if tolerated.', 'Wall sit short hold', 'Shorter 10-sec hold.')],
    capacity: [e('Split squat', '4 x 6/side', 'Bodyweight / DB', 'RPE 6–8', 'Controlled depth and alignment.', 'Supported split squat', 'Hold support.'), e('Leg press or goblet squat', '4 x 6–8', 'Machine / DB', 'RPE 6–8', 'No swelling after session.', 'Box squat', 'Reduce range.'), e('Step-down', '3 x 6/side', 'Step', 'RPE 5–7', 'Slow lower, stable pelvis.', 'Lower step-down', 'Reduce height.')],
    speed: [e('Landing mechanics', '3 x 5', 'Bodyweight', 'RPE 5–6', 'Soft knee, quiet landing.', 'Squat to calf raise', 'No jump.'), e('Walk-jog intervals', '8 x 1 min', 'Treadmill / flat route', 'RPE 5–6', 'No swelling or limp later.', 'Bike intervals', 'Use low-impact option.'), e('Deceleration drill', '4 x 4 reps', 'Cones', 'RPE 6–7', 'Brake gradually first.', 'March-stop drill', 'Slow down.')],
    return: [e('Single-leg hop rehearsal', '3 x 4/side', 'Bodyweight', 'RPE 7', 'Stable landing, no fear.', 'Double-leg hop', 'Use both legs.'), e('Change-of-direction circuit', '5 x 30 sec', 'Cones', 'RPE 7–8', 'Only if no swelling/instability.', 'Low-speed planned turns', 'Reduce speed and angle.'), e('Heavy strength maintenance', '3 x 5', 'Gym / DB', 'RPE 7–8', 'Continue beyond return.', 'Goblet squat', 'Lighter and controlled.')]
  }
};

export const redFlagQuestions = [
  'I cannot bear weight or walk four steps.',
  'I have severe swelling, deformity, or a large bruise that appeared quickly.',
  'I heard/felt a major pop and now the area feels unstable.',
  'My knee locks, catches, gives way, or cannot fully straighten.',
  'I have numbness, tingling, weakness, or pain that travels down the leg.',
  'I have calf swelling, warmth, redness, or shortness of breath.',
  'I have a visible groin/abdominal bulge, testicular pain, or pain when coughing/sneezing.',
  'Pain is constant at rest, worsening at night, or I feel feverish/unwell.'
];

function e(name, prescription, equipment, intensity, cue, altName, altCue) {
  return {
    name,
    prescription,
    equipment,
    intensity,
    cue,
    video: videoPlaceholder,
    alternative: { name: altName, cue: altCue, prescription: '2–3 sets at easier intensity' }
  };
}
