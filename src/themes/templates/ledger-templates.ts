import type { ThemeTemplates } from '../types.js';
import type { Bell, RuneArchetype, ContradictionType } from '../../types/index.js';

/**
 * Ledger (Fantasy) — 100 alibi templates + expanded interrogation banks.
 *
 * Voice: Archaic-but-readable English. Oaths, runes, stone, wind, duty, the Watch.
 * Characters speak as if giving testimony before an elder council.
 *
 * Placeholder contract:
 *   alibiTemplates:       {loc1} {loc2} {bell1} {bell2}
 *   hornTemplates:        {loc} {bell}
 *   relicTemplates:       {relic} {Relic}
 *   scentTemplates:       {loc} {scent}
 *   bellTemplates:        {bell} {loc}
 *   routeTemplates:       {loc1} {loc2} {bell1} {bell2}
 *   anchorTemplates:      {loc} {bell}
 *   objectTemplates:      {relic}
 *   senseTemplates:       {loc} {scent}
 *   witnessTemplates:     {witness} {loc}
 *   environmentDescriptors: {loc} {scent}
 *   openingTemplates:     {loc}
 */

const ledgerTemplates: ThemeTemplates = {
  // ─── Display names ─────────────────────────────────────────
  runeNames: {
    oaths: { name: 'Rune of Oaths', description: 'Bell tolls, witness-stones, chronicles' },
    roads: { name: 'Rune of Roads', description: 'Paths, gates, crossings, patrol routes' },
    relics: { name: 'Rune of Relics', description: 'Signet rings, keys, shards, heirlooms' },
    skies: { name: 'Rune of Skies', description: 'Mist, wind, scent, ashfall' },
  } satisfies Record<RuneArchetype, { name: string; description: string }>,

  bellNames: {
    0: '8 AM',
    1: '9 AM',
    2: '10 AM',
    3: '11 AM',
    4: '12 PM',
    5: '1 PM',
  } satisfies Record<Bell, string>,

  bellLabelsShort: {
    0: 'I', 1: 'II', 2: 'III', 3: 'IV', 4: 'V', 5: 'VI',
  } satisfies Record<Bell, string>,

  contradictionLabels: {
    time: 'Bell contradiction',
    movement: 'Travel impossible',
    object: 'Relic mismatch',
    environment: 'Sense contradiction',
  } satisfies Record<ContradictionType, string>,

  // ─── 100 Alibi Templates ──────────────────────────────────
  alibiTemplates: [
    // --- Terse / Direct (1–10) ---
    '{loc1}. {bell1} through {bell2}. I was there. My oath holds.',
    'I stood at {loc1} from {bell1} until {bell2}. None approached me. The stones bore witness enough.',
    'From {bell1} to {bell2}, I remained at {loc1}. There is nothing more to say.',
    '{bell1} found me at {loc1}. I did not leave until {bell2}. That is the whole of it.',
    'I was within {loc1}. The hour was {bell1} when I arrived, {bell2} when I departed. Ask the stones.',
    '{loc1}, {bell1} to {bell2}. I kept still. The Watch does not require embellishment.',
    'My post was {loc1}. I held it from {bell1} through {bell2}. The cold was my only company.',
    'I occupied {loc1} from {bell1} until past {bell2}. If someone says otherwise, they lie.',
    'At {bell1} I entered {loc1}. At {bell2} I was still there. That is all.',
    '{bell1}. {loc1}. I stayed until {bell2}. Duty does not require poetry.',

    // --- Chronological Narrative (11–20) ---
    'The day began at {loc1}. By {bell1}, I had taken my position. I did not stir until {bell2}, when the changing of the guard released me.',
    'I arrived at {loc1} before {bell1}. The hours passed slowly — the wind, the silence, the weight of waiting. {bell2} came, and my watch ended.',
    'First I made my way to {loc1}. {bell1} had already sounded when I arrived. I remained there, seeing to the records, well beyond {bell2}.',
    'When {bell1} rang, I was crossing the threshold of {loc1}. The work within consumed me until {bell2} brought word of other matters.',
    'I reached {loc1} just as {bell1} struck. The candles were low. I tended them, swept the floor, arranged the tablets. {bell2} arrived before I was finished.',
    'The morning found me walking toward {loc1}. By {bell1} I was inside. I catalogued the stores, checked the seals, and did not emerge until {bell2}.',
    'I left my quarters early. By {bell1}, I stood at {loc1}. The hours ground on — silent, heavy. When {bell2} came, I finally sat.',
    'At {bell1}, the world was quiet and I was at {loc1}. I read the old inscriptions until my eyes ached. {bell2} came and I was still reading.',
    '{bell1} saw me enter {loc1}. I spoke to no one, touched nothing that was not mine. When {bell2} sounded, I was sitting where I had begun.',
    'I began the day at {loc1}. The bell struck {bell1} as I settled in. The next I heard was {bell2}. I had not moved.',

    // --- Defensive / Pre-emptive (21–30) ---
    'Before you accuse me — I was at {loc1}. From {bell1}. Until {bell2}. My hands are clean.',
    'I know suspicion follows me, but I swear by the old stone: I was at {loc1} from {bell1} through {bell2}. I have nothing to hide.',
    'You may doubt me if you wish, but the truth is plain. {loc1}. {bell1} to {bell2}. I was there and nowhere else.',
    'I have heard the whispers. Let me be clear: {loc1} was my station from {bell1} until {bell2}. Any who say otherwise speak from ignorance.',
    'Do not look at me that way. I was at {loc1}, {bell1} to {bell2}. I did what was asked of me and nothing more.',
    'If my word means anything in this council, I give it: {loc1}, from {bell1} through {bell2}. I stirred not once.',
    'I will say this once, and I will not repeat it. {loc1}. From {bell1} to {bell2}. My oath is my proof.',
    'Whatever the others have said, I was at {loc1} the entire time. {bell1} to {bell2}. No side-paths, no detours.',
    'You seem to have made up your mind already. But the facts are stubborn things. {loc1}. {bell1} to {bell2}.',
    'I do not need to defend myself, but since you ask: {loc1}, from {bell1} until past {bell2}. Check the ward-stone if you doubt me.',

    // --- Atmospheric / Setting-driven (31–42) ---
    'There is a silence that falls over {loc1} when the mist settles — thick enough to taste. I was standing in it at {bell1}. By {bell2}, the wind had torn it away, but I had not moved.',
    'The mist was thick as burial cloth when I reached {loc1} at {bell1}. I did not stir from the place until the air cleared past {bell2}.',
    'Rain pattered against the stones of {loc1} all morning. I arrived at {bell1}, and the sound had not stopped by {bell2}. Neither had I moved.',
    'The frost on the walls of {loc1} was beautiful in a bleak way. I traced patterns in it from {bell1} to {bell2}, waiting for word that never came.',
    'A cold wind swept through {loc1} that day. I felt it on my face from {bell1} onward. By {bell2}, my fingers were numb, but I held my post.',
    'Ashfall covered {loc1} like a grey shroud. I arrived at {bell1} and spent until {bell2} watching the ash settle on the old carvings.',
    'The shadows at {loc1} were long and strange that morning. I stood among them from {bell1}, unmoving, until {bell2} brought a change in the light.',
    'The old stones at {loc1} groan when the temperature drops. I listened to them from {bell1} to {bell2}. They had much to say.',
    'There was a haze over {loc1} — not fog, not smoke, something older. I breathed it from {bell1} to {bell2}. My throat still remembers.',
    'Ice had formed on the gate of {loc1} by {bell1}. I chipped at it until {bell2}, more to keep my hands busy than from any duty.',
    'The torchlight at {loc1} flickered all morning, as if the wind could not decide its mind. I watched it from {bell1} through {bell2}.',
    'The moss at {loc1} was thick with dew. I knelt in it at {bell1} to inspect the foundation stones. I was still kneeling at {bell2}.',

    // --- Duty / Task Frame (43–52) ---
    'The Warden bade me inspect the wards at {loc1}. I obeyed. My boots touched the threshold at {bell1}; I reported back only after {bell2}.',
    'My assignment was {loc1}, from {bell1} to {bell2}. I catalogued the remaining provisions. The work was tedious but necessary.',
    'Orders came before dawn: hold {loc1} from {bell1} until relieved. Relief came at {bell2}. I did not question the delay.',
    'I was tasked with sweeping {loc1} for signs of decay. I began at {bell1} and the inspection was not complete until {bell2}.',
    'Patrol duty. {loc1}. {bell1} to {bell2}. The perimeter was secure. I logged it as such.',
    'I took the inventory at {loc1} as ordered. {bell1} to {bell2}. Thirty-seven crates, twelve sealed, the rest empty. That was my day.',
    'The elder-scribe sent me to {loc1} at {bell1} to transcribe the wall-runes. I finished only at {bell2}. My hand still aches.',
    'Ward maintenance at {loc1}. I arrived at {bell1}, replaced two cracked sealing-stones, and did not leave until {bell2}. The wards hold.',
    'The bridge required mending at {loc1}. I was there from {bell1}, hammer in hand. By {bell2}, the boards were sound.',
    'I was set to guard the eastern face of {loc1}. From {bell1} to {bell2}, I watched. Nothing stirred. Nothing came.',

    // --- Journey / Movement Focus (53–64) ---
    'The road from {loc1} to {loc2} is not kind to weary feet. I set out at {bell1} and the gates did not greet me until {bell2}.',
    'I departed {loc1} at {bell1}, the old path stretching ahead like a scar. {loc2} appeared through the fog only as {bell2} was fading.',
    'I walked from {loc1} to {loc2}. The path was slick with frost. I left at {bell1} and arrived, cold and stiff, at {bell2}.',
    'From {loc1} to {loc2}, on foot, beginning at {bell1}. The way was longer than I remembered. I reached my destination at {bell2}.',
    'The journey from {loc1} to {loc2} began at {bell1}. I followed the ridge path. By {bell2}, the walls of {loc2} rose before me.',
    'I took the old traders\' road from {loc1} at {bell1}. The mud was ankle-deep. {loc2} received me at {bell2}, caked in filth.',
    'Between {loc1} and {loc2}, the path narrows to a thread. I walked it from {bell1} to {bell2}, watching every step.',
    'I left {loc1} behind at {bell1}. The walk to {loc2} was quiet — only birdsong and the crunch of gravel. I arrived at {bell2}.',
    'The crossing from {loc1} to {loc2} took from {bell1} until {bell2}. I stopped once to catch my breath. The air was thin.',
    'I was on the road between {loc1} and {loc2}. Set off at {bell1}. My shadow reached {loc2} before I did, but I followed at {bell2}.',
    '{bell1} saw me leave {loc1}. {bell2} saw me reach {loc2}. Between those bells, I had nothing for company but the wind.',
    'I traveled from {loc1} to {loc2}, departing at {bell1}. The route wound uphill the whole way. I arrived at {bell2}, breathing hard.',

    // --- Social / Companion Reference (65–74) ---
    'I met the bridge-keeper at {loc1} not long after {bell1}. We spoke of the cold. When {bell2} struck, I was still explaining why the north wind matters.',
    'A ferryman hailed me at {loc1} just past {bell1}. We shared a pipe. I was still there at {bell2}, and so was he.',
    'I spoke with the ash gatherer at {loc1} from {bell1}. The conversation wandered. By {bell2}, we had solved nothing but confirmed much.',
    'There was a monk at {loc1} when I arrived at {bell1}. We sat in silence together until {bell2}. Sometimes silence is company enough.',
    'The stone-cutter was already at {loc1} when I arrived at {bell1}. We worked side by side, without speaking, until {bell2}.',
    'I found the watchman asleep at {loc1} at {bell1}. I did not wake him. I stood guard in his place until {bell2}.',
    'A traveler had stopped at {loc1}. I joined them at {bell1}. We spoke of roads and weather until {bell2}. I do not recall their name.',
    'The keeper of {loc1} admitted me at {bell1}. I waited in the anteroom until {bell2}. We exchanged not ten words.',
    'I crossed paths with a patrol at {loc1} around {bell1}. I fell in with them until {bell2}, when our routes diverged.',
    'A child was lost near {loc1} at {bell1}. I helped search. By {bell2}, the child was found, and I had not left the area.',

    // --- Time-Anchored (75–84) ---
    '{bell1} struck and I was at {loc1}. The echo had barely faded. I stayed until {bell2}, counting the silence between.',
    'I know the hour exactly. {bell1}. I was at {loc1}. The sundial does not lie, and neither do I. I left at {bell2}.',
    'The bell tower rang {bell1} while I stood at {loc1}. I did not move until it rang {bell2}. That is two bells of stillness.',
    'Between {bell1} and {bell2}, the stones of {loc1} kept my shadow. Whether they remember me better than I remember them, I cannot say.',
    'When {bell1} tolled, I was already at {loc1}. I counted every beat until {bell2}. Twelve hundred heartbeats, give or take.',
    'I arrived at {loc1} before {bell1} — but not by much. A quarter-hour, perhaps. I was still there long after {bell2}.',
    '{bell1} came and went at {loc1}. So did {bell2}. In between, I tended to the fire and thought about nothing.',
    'The hour was {bell1}. The place was {loc1}. I remained until {bell2}. Time moved slowly, as it always does at that post.',
    'I remember {bell1} clearly because the light was changing at {loc1}. By {bell2}, the shadows had reversed entirely.',
    'At precisely {bell1}, I entered {loc1}. I departed at {bell2}. I am meticulous about these things.',

    // --- Reluctant / Evasive (85–92) ---
    'Must I account for every hour? Very well. {loc1}. From {bell1}. Until {bell2}. I stood by the wall and counted cracks in the mortar. Satisfied?',
    'I was... somewhere near {loc1}. The day blurs, you understand. But I know the bell struck {bell1} when I arrived, and I was still there at {bell2}. That much I am certain of.',
    'I do not enjoy this questioning. But yes — {loc1}. From {bell1} to {bell2}. I did nothing worthy of suspicion.',
    'If you must write it down: {loc1}. {bell1}. {bell2}. I have no talent for testimony. The facts are the facts.',
    'I would rather not speak of it, but I suppose I must. {loc1}, from {bell1} through {bell2}. The reason was my own.',
    'Why does it matter where I was? But fine: {loc1}. {bell1} to {bell2}. I was alone. I preferred it that way.',
    'I was at {loc1}. From {bell1} — or thereabouts — until {bell2}. I did not keep careful track. The day was not a remarkable one.',
    'You will find nothing useful in my account. {loc1}, {bell1} through {bell2}. I went there, I stayed, I left. The end.',

    // --- Reflective / Memory (93–100) ---
    'Looking back, I spent more time at {loc1} than I intended. {bell1} passed without notice. When I finally glanced at the sundial, it read past {bell2}.',
    'The hours at {loc1} have a way of folding into one another. I arrived at {bell1} and when I next looked up, {bell2} had come and gone.',
    'I recall the quiet most of all. {loc1}, from {bell1} to {bell2}. The silence was so complete I could hear the moss growing.',
    'Memory is imprecise, but some things I know: {loc1}. {bell1}. {bell2}. The rest is fog and stone and the smell of damp earth.',
    'I think of {loc1} and I think of stillness. I was there from {bell1}, seated on the low wall, until {bell2} roused me with its chime.',
    'That day at {loc1} — it stays with me. {bell1} to {bell2}. The light through the archway was the color of old bone.',
    'I was at {loc1}. {bell1} came, and I thought of nothing. {bell2} came, and I was still thinking of nothing. Some days are like that.',
    'The stones remember even when we do not. But I remember this: {loc1}, from {bell1} to {bell2}. I sat and I watched and I waited.',
  ],

  // ─── Horn/Anchor Templates (15) ───────────────────────────
  hornTemplates: [
    'I heard the watch-horn sound from {loc} at {bell}.',
    'The horn echoed from {loc} — it was {bell}, I am certain.',
    'At {bell}, the horn from {loc} reached my ears.',
    'The watch-horn from {loc} split the silence at {bell}. Unmistakable.',
    'I heard it clearly — the horn from {loc}, at {bell}. The sound carries far.',
    '{bell}. The horn from {loc}. Even the stones seemed to shudder.',
    'There was no mistaking the horn from {loc} at {bell}. I have heard it a thousand times.',
    'At {bell}, a blast from {loc}. The watch-horn. It echoed off the valley walls.',
    'The horn sounded from {loc} just as {bell} struck. I paused to listen.',
    'I was aware of the horn from {loc} at {bell}. It is part of the rhythm of these lands.',
    'From {loc}, the horn. At {bell}. A single long note, then silence.',
    '{bell} brought the horn-call from {loc}. I noted it and continued my work.',
    'The sound of the horn from {loc} reached me at {bell}. Clear as water over stone.',
    'At {bell}, I heard the horn. It came from {loc}. I remember because it startled the crows.',
    'The watch-horn from {loc} blew at {bell}. A deep note. It hung in the air for a long moment.',
  ],

  // ─── Relic / Object Templates (15) ─────────────────────────
  relicTemplates: [
    'I carried {relic} with me throughout the day.',
    '{Relic} was in my keeping — I had not let it from my sight.',
    'Throughout the day, {relic} remained upon my person, as sworn.',
    '{Relic} was in my coat pocket. I checked it three times.',
    'I bore {relic} as duty required. It did not leave my hands.',
    '{Relic} hung at my belt. I could feel its weight with every step.',
    'Yes, {relic} was mine to carry that day. I guard what is entrusted to me.',
    'I had {relic}. It was heavy, but I did not set it down. Not once.',
    '{Relic} was with me from dawn onward. I can produce it if you wish.',
    'I was entrusted with {relic}. It remained on my person at all times.',
    '{Relic} — yes, I had it. The Warden gave it to me at first light.',
    'The weight of {relic} was a constant companion that day.',
    'I kept {relic} close. These things are not to be left unattended.',
    '{Relic} was in my satchel, bound and sealed. I checked the binding twice.',
    'All day, {relic} was mine to ward. I do not take such charges lightly.',
  ],

  // ─── Scent / Environment Templates (15) ────────────────────
  scentTemplates: [
    'The air at {loc} carried the scent of {scent} — unmistakable.',
    'I recall {scent} hanging thick at {loc}.',
    'At {loc}, the tang of {scent} lingered in the air.',
    '{scent} at {loc}. You could not escape it.',
    'The smell of {scent} was heavy at {loc}. It clung to everything.',
    'I noticed {scent} the moment I entered {loc}. Strong and sharp.',
    '{loc} reeked of {scent}. Not unpleasant, but impossible to ignore.',
    'There was {scent} in the air at {loc}. Faint at first, then overwhelming.',
    'At {loc}, I breathed in {scent}. It brought back old memories.',
    'The odor of {scent} pervaded {loc}. Even the walls seemed to carry it.',
    'Yes, {scent} was in the air at {loc}. I remember because it made me cough.',
    '{loc} had a strong presence of {scent} that day. Thick and lingering.',
    'I could taste {scent} on my tongue at {loc}. The air was saturated.',
    'The scent of {scent} at {loc} was so strong it seemed almost solid.',
    'At {loc}, the air was thick with {scent}. I breathed through my sleeve.',
  ],

  // ─── Environment Descriptors (20) ─────────────────────────
  environmentDescriptors: [
    'Mist blanketed {loc} through the early bells',
    'A cold wind swept {loc} without pause',
    'Ashfall drifted over {loc} like grey snow',
    'The air at {loc} carried the tang of {scent}',
    'Rain pooled in the cracks of {loc} all morning',
    'Frost crept along the walls of {loc} before dawn',
    'The torches at {loc} guttered in the draft',
    'A thin haze hung over {loc}, smelling faintly of {scent}',
    'Silence lay over {loc} like a held breath',
    'The stones of {loc} wept condensation all day',
    'A chill seeped from the ground at {loc}',
    'The air at {loc} tasted of {scent} and old dust',
    'Fog pressed against the windows of {loc}',
    'The moss at {loc} glistened with morning ice',
    'A low wind moaned through the eaves of {loc}',
    'The light at {loc} was grey and flat, as if the sun had given up',
    'Dampness hung in {loc} like a second skin',
    'The smell of {scent} drifted through {loc} on the evening breeze',
    'Snow dusted the threshold of {loc} but did not melt',
    'The air at {loc} was heavy with {scent} and woodsmoke',
  ],

  // ─── Opening Templates (25) ───────────────────────────────
  openingTemplates: [
    'I went about my duties as always. I was near {loc} for much of the day.',
    'The day was uneventful. I spent my time around {loc}.',
    'I tended to matters at {loc}. Nothing unusual occurred.',
    'My oath holds. I was at {loc} and did what was asked of me.',
    'A quiet day. I was at {loc}, minding my charge.',
    'I have nothing to hide. {loc} was where I spent my hours.',
    'The Warden knows where I was. {loc}. As always.',
    'I was about my business at {loc}. The day was like any other.',
    'My duties took me to {loc}. I carried them out without incident.',
    'I make no apologies. {loc} was my post, and I held it.',
    'If you want the simple truth: I was at {loc}.',
    'Another day in service. {loc} was my station.',
    'I reported to {loc} as ordered. Nothing more.',
    'The Watch placed me at {loc}. I did not argue.',
    'I was at {loc}. The stones can confirm it, if they could speak.',
    'A day like many others. {loc}. Duty. Silence.',
    'I spent the better part of the day at {loc}. Ask anyone.',
    'My account is simple. I was at {loc}, attending to my work.',
    'The morning found me at {loc}. The afternoon did not move me elsewhere.',
    'I was near {loc} for most of the day. The cold kept me close.',
    '{loc} was where you would have found me, had you looked.',
    'I do not wander without purpose. {loc} was my assignment.',
    'The day was grey and I was at {loc}. Not much else to tell.',
    'You will find no mystery in my whereabouts. {loc}. All day.',
    'I keep to my assignments. {loc} was mine that day.',
  ],

  // ─── Bell Probe Templates (25) ────────────────────────────
  bellTemplates: [
    'At {bell}, I was at {loc}. I recall the stones beneath my feet.',
    'When {bell} rang, I stood at {loc}. The hour was not lost on me.',
    '{bell} found me at {loc}, attending to my duties.',
    'I was within {loc} at {bell}. The shadows were long.',
    'At {bell}, I was at {loc}. The sundial confirmed it.',
    'When {bell} struck, I was checking the ward-stones at {loc}.',
    '{bell} — yes, I recall the cold deepening at {loc}.',
    'If you must know, {bell} found me at {loc}. I was not hiding.',
    'Around {bell}? Somewhere in {loc}, I suppose. The hours blur.',
    'I was at {loc} at {bell}. I have said this. Must I repeat myself?',
    '{bell} passed quietly at {loc}. I watched the birds settle.',
    'At {bell}, I was where duty placed me: {loc}.',
    'When {bell} sounded, {loc} was my station. I remember clearly.',
    '{bell}. {loc}. The air was cold and the silence was thick.',
    'I can tell you exactly: at {bell}, I was at {loc}. The frost was forming.',
    'The bells do not lie. At {bell}, I was at {loc}.',
    '{bell} arrived and I was still at {loc}. I had not stirred.',
    'At {bell}, I was at {loc}, watching the light change on the walls.',
    'I was within {loc} when {bell} tolled. The sound echoed in the stone.',
    'Yes, {bell}. Yes, {loc}. I grow tired of repeating what is plain.',
    '{bell} found me at {loc}. I was counting inventory.',
    'When the bell struck {bell}, I was at {loc}. I looked up from my work.',
    'At {bell}, the air at {loc} was still. And so was I.',
    'I was seated at {loc} when {bell} rang. I did not rise.',
    '{bell} — I was at {loc}. The torch was burning low.',
  ],

  bellDeflection: 'I have accounted for my bells.',

  // ─── Route Probe Templates (20) ───────────────────────────
  routeTemplates: [
    'I walked from {loc1} to {loc2}, departing at {bell1} and arriving by {bell2}.',
    'The road from {loc1} to {loc2} — I took it from {bell1} through {bell2}.',
    'Between {loc1} and {loc2}, from {bell1} to {bell2}. The way was clear.',
    'I left {loc1} at {bell1} and reached {loc2} at {bell2}. The path was muddy.',
    'From {loc1} to {loc2}. {bell1} to {bell2}. I followed the ridge trail.',
    'I departed {loc1} at {bell1}. {loc2} received me at {bell2}.',
    '{bell1} saw me leave {loc1}. {bell2} saw me arrive at {loc2}.',
    'I traveled from {loc1} at {bell1}. The crossing to {loc2} took until {bell2}.',
    'The route from {loc1} to {loc2} occupied me from {bell1} through {bell2}.',
    'I made the journey from {loc1} to {loc2}, {bell1} to {bell2}. Uneventful.',
    '{loc1} to {loc2}. I set out at {bell1} and arrived at {bell2}. Nothing more.',
    'I walked between {loc1} and {loc2}. Left at {bell1}, arrived at {bell2}.',
    'From {loc1}, I traveled toward {loc2}. Departed {bell1}, reached it at {bell2}.',
    'The path from {loc1} to {loc2} took me from {bell1} until {bell2}. The fog was thick.',
    'I was in transit from {loc1} to {loc2}. {bell1} departure, {bell2} arrival.',
    'My route took me from {loc1} at {bell1} to {loc2} by {bell2}.',
    '{bell1}: I left {loc1}. {bell2}: I reached {loc2}. The road was quiet.',
    'I crossed from {loc1} to {loc2} between {bell1} and {bell2}. My boots were soaked.',
    'The walk from {loc1} to {loc2} began at {bell1}. I reached the gates at {bell2}.',
    'From {loc1} I went to {loc2}. I departed at {bell1} and the journey ended at {bell2}.',
  ],

  // ─── Anchor Probe Templates (15) ──────────────────────────
  anchorTemplates: [
    'I heard the watch-horn from {loc} at {bell}. It echoed across the valley.',
    'The horn sounded at {bell} from {loc}. I am certain of it.',
    'At {bell}, the horn from {loc} reached my ears.',
    'Yes, the horn. From {loc}. At {bell}. I heard it clearly.',
    'The watch-horn — it came from {loc} at {bell}. Unmistakable.',
    'At {bell}, I heard the horn sound from {loc}. The whole valley heard it.',
    'From {loc}, at {bell}, the horn. A single blast. I looked up.',
    'I was aware of the horn from {loc} at {bell}. It interrupted my thoughts.',
    'The horn at {bell} from {loc} — yes, I heard it. Who could miss it?',
    'At {bell}, the horn from {loc} cut through the fog. Clear and sharp.',
    '{bell}. The horn from {loc}. I stopped what I was doing to listen.',
    'I recall the horn from {loc} at {bell}. It was louder than usual.',
    'The horn sounded from {loc} at {bell}. I counted the echoes. Three.',
    'Yes, at {bell}, from {loc}. The horn. I was expecting it.',
    'From {loc}, at {bell}, came the horn-blast. It startled the crows.',
  ],

  anchorNone: 'I did not hear the horn clearly.',

  // ─── Object Probe Templates (15) ──────────────────────────
  objectTemplates: [
    'I carried {relic} throughout the day. It did not leave my person.',
    '{relic} was in my keeping, as sworn.',
    'Yes, {relic} was with me. I do not let such things out of sight.',
    '{relic} hung at my side all day. You may inspect it if you wish.',
    'I had {relic}. It was entrusted to me and I held it close.',
    '{relic} — I bore it as instructed. It is heavier than it looks.',
    'All day, {relic} was in my possession. I take my duties seriously.',
    '{relic} was on my person. Where else would it be?',
    'I kept {relic} in my satchel. I checked it regularly.',
    'Yes, I had {relic}. The Warden assigned it to me. I did not question why.',
    '{relic} never left my side. I am not careless with such things.',
    'I was carrying {relic}. It remained with me from dawn until this moment.',
    '{relic} was mine to guard. I guarded it.',
    'I can account for {relic}. It was with me. All day.',
    '{relic} was in my coat. I felt it there with every step.',
  ],

  objectNone: 'I bore nothing of note.',

  // ─── Sense Probe Templates (15) ───────────────────────────
  senseTemplates: [
    'The air at {loc} carried {scent}. Unmistakable.',
    'I recall {scent} at {loc}. It lingered.',
    'At {loc}, there was {scent} in the air. Strong and clear.',
    '{scent} at {loc} — yes, I noticed it. Hard to miss.',
    'The odor of {scent} was thick at {loc}. It stuck to my clothes.',
    'I smelled {scent} at {loc}. The air was heavy with it.',
    '{loc} carried the scent of {scent}. It made my eyes water.',
    'Yes, {scent}. At {loc}. The smell was everywhere.',
    'At {loc}, {scent} was unmistakable. I noticed it at once.',
    'The air at {loc} had a strong note of {scent}. I recall it well.',
    'I could not escape {scent} at {loc}. It filled every breath.',
    '{scent} hung in the air at {loc}. Sharp and persistent.',
    'At {loc}, I noticed {scent} immediately. It was quite distinct.',
    'The scent of {scent} at {loc} was one of the strongest I have encountered.',
    '{loc} smelled of {scent}. I will not forget it soon.',
  ],

  senseNone: 'I noticed nothing unusual.',

  // ─── Witness Pool (20) ────────────────────────────────────
  witnessPool: [
    'a watchman', 'a ferryman', 'the bridge-keeper', 'a passing monk',
    'an ash gatherer', 'a stone-cutter', 'a patrol guard', 'the bell-ringer',
    'a young apprentice', 'an old shepherd', 'the gate-keeper', 'a courier',
    'a healer', 'the water-bearer', 'a wandering trader', 'the torch-lighter',
    'a stablehand', 'the record-keeper', 'a pilgrim', 'a mason\'s helper',
  ],

  // ─── Witness Probe Templates (15) ─────────────────────────
  witnessTemplates: [
    'I was seen by {witness} near {loc}.',
    '{witness} passed me at {loc}. They can attest.',
    'Ask {witness} — they saw me at {loc}.',
    '{witness} was nearby when I was at {loc}. They will confirm.',
    'I crossed paths with {witness} at {loc}. They nodded as they passed.',
    '{witness} can vouch for my presence at {loc}.',
    'There was {witness} at {loc}. We exchanged a glance.',
    '{witness} would have seen me at {loc}. I am sure of it.',
    'I recall {witness} being near {loc} when I was there.',
    '{witness} was working at {loc}. They saw me arrive.',
    'If you doubt me, ask {witness}. I was at {loc}.',
    '{witness} and I were both at {loc}. They can speak to it.',
    'I believe {witness} noticed me at {loc}.',
    '{witness} passed through {loc} while I was there. We did not speak.',
    'I am certain {witness} saw me at {loc}. We were not far apart.',
  ],

  // ─── Consistency Templates (15) ───────────────────────────
  consistencyTemplates: [
    'You twist my words, Watcher. I said what I said \u2014 but perhaps you should ask the others if their stories hold as firm.',
    'My account has not changed. Can you say the same of the one who stands most accused?',
    'I spoke truthfully. But I wonder \u2014 have you noticed how quickly some others change their tales when pressed?',
    'Press me all you like. My story holds. Though I cannot say the same for everyone in this Watch.',
    'You question me again? Fine. But while you waste time here, the real Oathbreaker breathes easy.',
    'I have been nothing but honest. More than I can say for at least one person you have spoken to.',
    'Consistent? Of course \u2014 the truth does not need rehearsal. Lies, on the other hand...',
    'Ask me a thousand times. Same answer. Not everyone here can promise that.',
    'My oath is unbroken. But I have my doubts about certain colleagues.',
    'You keep circling back to me. Have you pressed the others this hard? I wonder.',
    'I do not change my story because I have no reason to. The guilty rehearse. I do not.',
    'The stones remember what I said. Do they remember what the others said?',
    'Consistent as the dawn. Press the others equally and see who wavers.',
    'You seem determined to find a crack in my account. I assure you \u2014 the cracks are elsewhere.',
    'You want inconsistency? Look elsewhere. I have none to offer \u2014 but others might.',
  ],

  // ─── Detail / Trap Probe Templates (20) ───────────────────
  detailPublicFlavor: [
    'Stone sweats in the cold. It makes every footstep sound guilty.',
    'Ash clings to everything near that grove. You leave wearing it.',
    'At the gate, voices carry. Whispering is pointless.',
    'The torchlight there never holds steady. The drafts see to that.',
    'Cold stone. Damp air. The kind of place that swallows sound.',
    'The moss grows thick on the north side. You learn not to lean.',
    'Echoes can fool you into thinking you\'re not alone.',
    'The braziers give more smoke than heat. Your eyes water before you thaw.',
    'Old iron smells different from new. That place smells old.',
    'The flagstones there are uneven. You watch your feet, not the path.',
    'Sound travels through the stone. A whisper at one end carries to the other.',
    'The light is always poor there. Even at midday, you squint.',
    'Damp. Always damp. The stones never fully dry.',
    'The wind finds every gap in those walls. You feel it in your teeth.',
    'Shadows collect in the corners there. They have for as long as anyone remembers.',
    'The wards creak when the temperature drops. It sounds almost human.',
    'Silence sits differently there. Heavier. Like it has weight.',
    'The air carries the memory of every fire ever lit in that place.',
    'Dust settles thick on the higher shelves. Nobody reaches them anymore.',
    'The walls are scored with old gouges and wear, the kind that accumulates over decades.',
  ],

  // ─── Filler / Neutral (25) ────────────────────────────────
  fillerNeutral: [
    'The silence between the bells felt\u2026 attentive.',
    'I remember choosing my words more carefully than usual.',
    'The air tasted like old iron, and I hated that I noticed.',
    'Something felt different that day. Not wrong, exactly. Just heavier.',
    'I found myself glancing over my shoulder more than once.',
    'The Watch felt smaller that morning. As though trust had shrunk.',
    'I kept my thoughts to myself. It seemed wiser.',
    'There was a weight on everyone that day. You could see it in their eyes.',
    'I cannot explain it, but I felt watched. Not by you \u2014 by the stones themselves.',
    'Duty sat heavier than usual on my shoulders.',
    'I remember thinking: be careful what you say today.',
    'The cold gets into your bones at that post. Into your judgment, too.',
    'I was uneasy, though I could not tell you why.',
    'Everyone seemed to be moving with purpose. As if they all had somewhere to be.',
    'I held my tongue more than once. Some instincts are worth trusting.',
    'The mist makes everything feel closer than it is. People included.',
    'I have learned that silence reveals more than speech.',
    'There are days when even the familiar feels foreign. This was one.',
    'I caught myself listening for things I could not name.',
    'The Watch changes a person. You start seeing guilt everywhere.',
    'I said less than I might have. Caution seemed prudent.',
    'My hands were cold. They are always cold at that post.',
    'I noticed nothing unusual. But then, I was trying not to.',
    'Oath-keeping is lonely work. You learn to keep your own counsel.',
    'The stones do not care who is guilty. I envy them that.',
  ],

  // ─── Refusals (per temperament) ───────────────────────────
  refusals: {
    timid: 'Please... there are things that happened that day I dare not speak of. Not here, where the stones listen.',
    arrogant: 'You dare press me? I have served this Watch longer than you have drawn breath. But some oaths bind the tongue.',
    annoyed: 'Again with this! I was there, I did my duty. Ask what I did, not what I know.',
    talkative: 'Oh, well \u2014 the thing is, I promised someone I would not \u2014 no, forget I said that. Ask me something else. Quickly.',
    clipped: 'That question has teeth. Choose another.',
    poetic: 'There are truths that burn, Watcher. This one would scorch us both.',
  },
  partialRefusalSuffix: 'But I will say this much: I was at {loc} when {bell} sounded. That is all you shall have.',

  // ─── Rune Fact Phrasing ───────────────────────────────────
  anchorDescription: 'The watch-horn sounded at {bell} from {loc}',
  roadFactTemplate: 'The road from {from} to {to} requires no fewer than {bells} bell{s} of travel.',
  roadFactNoShorter: 'The path from {from} to {to} spans {bells} bell{s}. No shorter crossing exists.',
  relicHolderDesc: 'was borne by one alone',
  relicLocationDesc: 'was seen at a single location',
  relicLocationFact: 'The relic was last seen within {loc}.',
  envFactTemplate: 'The air at {loc} carried the tang of {scent} from {fromBell} through {toBell}.',
  hintPrefix: 'A Law of Stone:',
  movementFactGate: 'From {from}, the gate to {to} stands {bells} bell{s} distant.',

  // ─── Speaker map for TTS ──────────────────────────────────
  blameTemplates: {
    timid: [
      'I... perhaps you should speak with {name}. They seemed uneasy that day.',
      'I dare not accuse, but {name} avoided my gaze when we crossed paths.',
      'Forgive me, but {name} was not where they claimed. I am sure of it.',
    ],
    arrogant: [
      'If an oath is broken here, look to {name} — not to me.',
      'I have spoken my truth. {name}, however, has much to explain.',
      'You waste the Council\'s time with me. {name} is the one you want.',
    ],
    annoyed: [
      'Why press me? Go hound {name} — they have far more to answer for.',
      'I tire of this. Ask {name} where they truly were.',
      'Enough. {name} is the one shifting in their seat, not I.',
    ],
    talkative: [
      'You know, {name} was acting strangely that day. I shouldn\'t say more, but... well.',
      'Between us? I saw {name} near the crossing at an odd hour. Make of that what you will.',
      'I would never point fingers, but {name} left in quite the hurry, didn\'t they?',
    ],
    clipped: [
      '{name}. Ask them.',
      'Not me. {name}.',
      'Look to {name}. I\'ve said my piece.',
    ],
    poetic: [
      'The shadow does not fall upon me, but perhaps it rests upon {name}.',
      'Truth rings clear as a bell — and {name}\'s testimony rings hollow.',
      'If there is a serpent among us, its trail leads to {name}, not to my door.',
    ],
  },

  innocenceLines: [
    'My oath stands before the Elder Council. I do not waver.',
    'I swear upon the runes — every word I have spoken is true.',
    'The stones themselves would vouch for me if they had tongues.',
    'I have nothing to hide. My ledger is clean.',
    'Test me as you wish. My account will not change.',
    'I am no oathbreaker. The truth is my shield.',
  ],

  speakerMap: {
    Mordecai: 'kabir',
    Isolde: 'simran',
    Theron: 'advait',
    Vesper: 'priya',
    Rowena: 'neha',
    Aldric: 'varun',
  },
};

export default ledgerTemplates;
