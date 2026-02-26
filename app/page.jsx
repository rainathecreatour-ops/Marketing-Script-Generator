'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Sparkles, Lock, Copy, Check, RefreshCw, Video, Save, Edit2, User, Hash, Monitor, ChevronDown, Star, Play, Pause, X, Plus, Trash2, Image, Music, Zap } from 'lucide-react';

export default function MarketingScriptGenerator() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [currentView, setCurrentView] = useState('generate');

  const [brandProfiles, setBrandProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const [features, setFeatures] = useState(['']);

  const [businessInfo, setBusinessInfo] = useState({
    brandName: '',
    niche: '',
    targetAudience: '',
    offerings: '',
    features: '',
    additionalInfo: ''
  });

  const [scriptPrefs, setScriptPrefs] = useState({
    numScripts: 3,
    length: '30s',
    platform: 'instagram',
    includeBroll: true,
    tone: 'engaging'
  });

  const [scripts, setScripts] = useState([]);
  const [savedScripts, setSavedScripts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [editingScript, setEditingScript] = useState(null);
  const editingRef = useRef(editingScript);
  useEffect(() => { editingRef.current = editingScript; }, [editingScript]);

  const [generationCount, setGenerationCount] = useState(0);

  const [teleprompterScript, setTeleprompterScript] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [storageReady, setStorageReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // ---------- STORAGE HELPERS ----------
  const storageGet = async (key) => {
    try {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : null;
    } catch { return null; }
  };

  const storageSet = async (key, value) => {
    try {
      await window.storage.set(key, JSON.stringify(value));
      return true;
    } catch { return false; }
  };

  useEffect(() => {
    const loadData = async () => {
      const saved = await storageGet('savedScripts');
      if (saved) setSavedScripts(saved);
      const profiles = await storageGet('brandProfiles');
      if (profiles) setBrandProfiles(profiles);
      const gc = await storageGet('generationCount');
      if (gc) setGenerationCount(gc);
      setStorageReady(true);
    };
    loadData();
  }, []);

  useEffect(() => { if (!storageReady) return; storageSet('savedScripts', savedScripts); }, [savedScripts, storageReady]);
  useEffect(() => { if (!storageReady) return; storageSet('brandProfiles', brandProfiles); }, [brandProfiles, storageReady]);

  useEffect(() => {
    let interval;
    if (isScrolling && teleprompterScript) {
      interval = setInterval(() => { setScrollPosition(prev => prev + scrollSpeed); }, 50);
    }
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed, teleprompterScript]);

  // ---------- RNG ----------
  const createRng = (extraSeed = 0) => {
    let seed = ((Date.now() ^ Math.floor(Math.random() * 1e9)) + extraSeed * 999983) >>> 0;
    return () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  };

  const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];
  const shuffle = (arr, rng) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- REWORD ENGINE ----------
  // Rewrites user input so each generation sounds fresh while keeping the facts
  const rewordBrandName = (name, rng) => {
    const wrappers = [
      (n) => n,
      (n) => `the ${n} team`,
      (n) => `${n}'s approach`,
      (n) => `what ${n} does`,
      (n) => `the ${n} experience`,
      (n) => `${n}`
    ];
    return pick(wrappers, rng)(name);
  };

  const rewordNiche = (niche, rng) => {
    const transforms = [
      (n) => n.toLowerCase(),
      (n) => `the ${n.toLowerCase()} space`,
      (n) => `${n.toLowerCase()} results`,
      (n) => `your ${n.toLowerCase()} journey`,
      (n) => `${n.toLowerCase()} success`,
      (n) => `the world of ${n.toLowerCase()}`,
      (n) => `${n.toLowerCase()} transformation`,
      (n) => `${n.toLowerCase()} growth`
    ];
    return pick(transforms, rng)(niche);
  };

  const rewordAudience = (audience, rng) => {
    const transforms = [
      (a) => a.toLowerCase(),
      (a) => `people like you — ${a.toLowerCase()}`,
      (a) => `${a.toLowerCase()} who are ready for change`,
      (a) => `${a.toLowerCase()} who want real results`,
      (a) => `${a.toLowerCase()} who deserve better`,
      (a) => `${a.toLowerCase()} who've tried everything`,
      (a) => `${a.toLowerCase()} looking for something that works`,
      (a) => `${a.toLowerCase()} tired of guessing`
    ];
    return pick(transforms, rng)(audience);
  };

  const rewordOfferings = (offerings, rng) => {
    const transforms = [
      (o) => o,
      (o) => `a proven ${o.toLowerCase()}`,
      (o) => `an industry-leading ${o.toLowerCase()}`,
      (o) => `a done-for-you ${o.toLowerCase()}`,
      (o) => `a comprehensive ${o.toLowerCase()}`,
      (o) => `a results-focused ${o.toLowerCase()}`,
      (o) => `a step-by-step ${o.toLowerCase()}`,
      (o) => `a science-backed ${o.toLowerCase()}`
    ];
    return pick(transforms, rng)(offerings);
  };

  // ---------- FEATURES ----------
  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (idx, val) => { const u = [...features]; u[idx] = val; setFeatures(u); };
  const removeFeature = (idx) => {
    if (features.length === 1) { setFeatures(['']); return; }
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // ---------- LICENSE ----------
  const handleLicenseSubmit = () => {
    if (licenseKey.length >= 10) setIsUnlocked(true);
    else alert('Invalid license key. Please enter a valid key.');
  };

  // ---------- PROFILES ----------
  const saveProfile = async () => {
    if (!newProfileName.trim()) { alert('Please enter a profile name'); return; }
    const profile = { id: Date.now(), name: newProfileName, ...businessInfo, featuresArr: features };
    const updated = [...brandProfiles, profile];
    setBrandProfiles(updated);
    const ok = await storageSet('brandProfiles', updated);
    setNewProfileName('');
    if (ok) { setSaveStatus('profile'); setTimeout(() => setSaveStatus(''), 2000); }
    else alert('Profile saved to session (storage unavailable).');
  };

  const loadProfile = (profile) => {
    setBusinessInfo({ brandName: profile.brandName || '', niche: profile.niche || '', targetAudience: profile.targetAudience || '', offerings: profile.offerings || '', features: profile.features || '', additionalInfo: profile.additionalInfo || '' });
    if (profile.featuresArr) setFeatures(profile.featuresArr);
    setSelectedProfile(profile);
    setShowProfileDropdown(false);
  };

  const deleteProfile = (id) => {
    if (confirm('Delete this profile?')) {
      setBrandProfiles(brandProfiles.filter(p => p.id !== id));
      if (selectedProfile?.id === id) setSelectedProfile(null);
    }
  };

  const handleReset = () => {
    setBusinessInfo({ brandName: '', niche: '', targetAudience: '', offerings: '', features: '', additionalInfo: '' });
    setFeatures(['']);
    setScripts([]);
    setSelectedProfile(null);
    setEditingScript(null);
  };

  const saveScript = async (script) => {
    const scriptWithId = { ...script, id: Date.now(), savedAt: new Date().toISOString(), brandName: businessInfo.brandName };
    const updated = [scriptWithId, ...savedScripts];
    setSavedScripts(updated);
    const ok = await storageSet('savedScripts', updated);
    if (ok) { setSaveStatus('script'); setTimeout(() => setSaveStatus(''), 2000); }
    else alert('Script saved to session (storage unavailable).');
  };

  const deleteSavedScript = (id) => {
    if (confirm('Delete this saved script?')) setSavedScripts(savedScripts.filter(s => s.id !== id));
  };

  // ---------- HASHTAGS ----------
  const generateHashtags = (info, platform, rng) => {
    const base = [`#${(info.niche || '').replace(/\s/g, '')}`, `#${(info.targetAudience || '').split(' ')[0]}`, `#${platform}`];
    const pools = {
      fitness: ['#fitnessmotivation', '#workout', '#healthylifestyle', '#fitfam', '#gains', '#bodygoals', '#gymlife', '#healthcoach'],
      tech: ['#technology', '#innovation', '#digital', '#techlife', '#startup', '#futuretech', '#ai', '#softwaredev'],
      beauty: ['#beautytips', '#skincare', '#makeup', '#beautycommunity', '#glowup', '#selfcare', '#beautyinfluencer', '#skincareroutine'],
      food: ['#foodie', '#cooking', '#recipe', '#foodporn', '#eats', '#homecooking', '#cheflife', '#foodblogger'],
      business: ['#entrepreneur', '#businesstips', '#success', '#hustle', '#ceo', '#growthmindset', '#makemoney', '#sidehustle'],
      fashion: ['#fashionista', '#style', '#ootd', '#fashionblogger', '#streetstyle', '#outfitinspo', '#aesthetic', '#fashion'],
      coaching: ['#lifecoach', '#mindset', '#personaldevelopment', '#coaching', '#selfdevelopment', '#growthcoach', '#breakthroughs', '#levelup'],
      marketing: ['#digitalmarketing', '#contentmarketing', '#socialmedia', '#brandbuilding', '#marketingtips', '#growthhacking', '#contentcreator', '#branding'],
      relationship: ['#relationshipgoals', '#couples', '#love', '#coupleadvice', '#intimacy', '#marriageadvice', '#datingtips', '#connection']
    };
    const niche = (info.niche || '').toLowerCase();
    const matched = Object.keys(pools).find(k => niche.includes(k));
    const pool = matched ? pools[matched] : ['#contentcreator', '#marketing', '#brand', '#business', '#growth'];
    const selected = shuffle(pool, rng).slice(0, 6);
    return [...new Set([...base, ...selected])].slice(0, 10);
  };

  // ---------- MUSIC PROMPT ----------
  const generateMusicPrompt = (info, scriptType, tone) => {
    const map = {
      engaging: 'modern pop production with catchy hooks, smooth bassline, 110 BPM',
      direct: 'confident electronic beat with driving bass, assertive energy, 115 BPM',
      playful: 'upbeat indie pop with bouncy synths, playful guitar riffs, 120 BPM',
      funny: 'quirky comedy music with pizzicato strings, xylophone accents, 125 BPM',
      motivational: 'inspiring cinematic music with building strings, epic drums, 100 BPM',
      calm: 'ambient meditation music with soft pads, gentle chimes, 70 BPM',
      bold: 'powerful rock anthem with electric guitars, strong drums, 130 BPM',
      romantic: 'soft acoustic ballad with gentle piano, warm strings, 80 BPM'
    };
    const base = map[tone] || map.engaging;
    return `${base}. Perfect for ${info.niche} content targeting ${info.targetAudience}. Commercial quality, royalty-free style.`;
  };

  // ---------- LOGO PROMPT ----------
  const generateLogoPrompt = (info, rng) => {
    const styles = ['minimalist modern logo', 'bold geometric design', 'elegant typography-based logo', 'abstract symbol with negative space', 'vibrant gradient logo', 'professional corporate identity', 'playful illustrative logo', 'luxury premium branding', 'tech-inspired futuristic design', 'hand-drawn artistic logo'];
    const moods = ['sophisticated and trustworthy', 'energetic and dynamic', 'calm and serene', 'bold and confident', 'warm and inviting', 'sleek and modern', 'fun and approachable', 'powerful and authoritative', 'creative and unique', 'elegant and refined'];
    return `${pick(styles, rng)} for ${info.brandName}, a ${info.niche} brand. ${pick(moods, rng)} aesthetic. Professional, scalable vector design. Color scheme should reflect ${info.niche} industry. Clean, memorable, and versatile for digital and print use.`;
  };

  // ---------- B-ROLL SUGGESTIONS ----------
  const generateBrollSuggestions = (info, templateType) => {
    const maps = {
      problemSolution: [`${info.targetAudience} looking frustrated or overwhelmed`, `Close-up of the "${info.niche}" problem in action`, `Person experiencing the "aha" breakthrough moment`, `${info.brandName} solution being used with visible relief`],
      storytelling: [`${info.targetAudience} in their everyday environment`, `Before-and-after transformation visual`, `Candid moment of real emotion related to ${info.niche}`, `Testimonial-style shot of happy customer`],
      socialProof: [`Happy customers using ${info.brandName}`, `Scrolling through positive reviews on screen`, `Diverse group of ${info.targetAudience} succeeding`, `Numbers or stats on screen (results/growth)`],
      urgencyOffer: [`Clock or countdown timer visual`, `Limited stock / "last few spots" overlay graphic`, `Person making a confident purchase decision`, `Celebration of getting access / unboxing`],
      educational: [`Step-by-step process being demonstrated`, `${info.niche} tips displayed as text on screen`, `Expert pointing at key info`, `Before/after of the tip working in real life`]
    };
    return maps[templateType] || maps.problemSolution;
  };

  // ---------- FEATURE SCRIPTS ----------
  const generateFeatureScripts = (info, tone, rng, genSeed) => {
    if (!info.features || info.features.length === 0) return [];

    const hookPools = {
      engaging: ["Here's a feature that changes everything:", "One thing people always ask about:", "This part gets overlooked — but it's massive:", "Here's what makes ${brand} different:", "Most people don't talk about this feature:"],
      direct: ["Feature included:", "Here's what you get:", "Built-in capability:", "One of the key elements:", "This is part of the package:"],
      playful: ["Okay this feature? *Chef's kiss.*", "WAIT. You need to hear about this:", "The feature that made everyone go 'wait, really?'", "Not to be dramatic but… this changes things:", "This is the 'OMG that's included?' moment:"],
      funny: ["Not me obsessing over this feature:", "This feature understood the assignment 😭", "The feature that pays rent:", "Plot twist: this feature is actually *that* good:", "This feature walked so the rest could run:"],
      motivational: ["This feature was built for winners:", "Designed to help you move faster:", "The feature that removes every excuse:", "Built so nothing holds you back:", "This turns effort into momentum:"],
      calm: ["This feature makes things feel lighter:", "One less thing to worry about:", "Here's what simplifies the whole process:", "This quietly does the heavy lifting:", "A gentle but powerful addition:"],
      bold: ["This feature is non-negotiable:", "The standard, not the exception:", "This is where the difference is made:", "Most brands don't include this. We do.", "This is the feature that separates results from excuses:"],
      romantic: ["This is the feature that brings the magic:", "This is where the spark really shows:", "Designed to create moments that matter:", "This feature adds the feeling you've been missing:", "The touch that makes everything feel special:"]
    };

    const bodyBuilders = [
      (f, info, rng2) => `${rewordOfferings(info.offerings, rng2)} includes ${f}. For ${rewordAudience(info.targetAudience, rng2)}, that means spending less time stuck and more time seeing progress.`,
      (f, info, rng2) => `With ${rewordBrandName(info.brandName, rng2)}, you get ${f} built right in — because ${rewordAudience(info.targetAudience, rng2)} shouldn't have to work around the tool that's supposed to work for them.`,
      (f, info, rng2) => `${f} is one of the reasons ${rewordAudience(info.targetAudience, rng2)} keep coming back to ${rewordBrandName(info.brandName, rng2)}. It's the kind of detail that turns a good experience into a great one.`,
      (f, info, rng2) => `Here's what ${f} actually means for you: faster results, less friction, and a cleaner path through ${rewordNiche(info.niche, rng2)}.`,
      (f, info, rng2) => `This is for ${rewordAudience(info.targetAudience, rng2)} who want ${f} without the guesswork. ${rewordBrandName(info.brandName, rng2)} handles the heavy lifting.`
    ];

    const ctaPools = [
      "Ready to unlock this? Tap the link in bio.",
      "This feature is waiting for you — link in bio.",
      "Get access and use this today — link in bio.",
      "Want this? Start now — link in bio.",
      "Don't miss out — tap the link in bio.",
      "This is yours when you join — link in bio.",
      "It's all there — check the link in bio."
    ];

    const hooks = hookPools[tone] || hookPools.engaging;

    return info.features.map((feature, idx) => {
      const localRng = createRng(genSeed + idx * 137 + tone.length);
      const hookTemplate = pick(hooks, localRng);
      const hook = hookTemplate.replace('${brand}', info.brandName);
      const body = pick(bodyBuilders, localRng)(feature, info, localRng);
      const cta = pick(ctaPools, localRng);
      return {
        feature,
        hook,
        mainScript: `${hook} ${body}`,
        cta,
        musicPrompt: generateMusicPrompt(info, 'featureSpotlight', tone)
      };
    });
  };

  // ==========================================================
  // 5 DISTINCT SCRIPT TEMPLATES
  // ==========================================================
  const buildScriptTemplates = () => ({

    // TEMPLATE 1: Problem → Solution
    problemSolution: {
      title: "Problem → Solution",
      icon: "🔥",
      getBrollKeywords: (info) => [`${info.niche} problem`, `frustrated ${info.targetAudience}`, `${info.niche} solution`, `happy customer success`],
      generate: (info, tone, rng, genSeed) => {
        const rw = createRng(genSeed + 1);
        const problemHooks = {
          engaging: [`If ${rewordNiche(info.niche, rw)} has been harder than it should be — you're not alone.`, `Most ${rewordAudience(info.targetAudience, rw)} are doing ${rewordNiche(info.niche, rw)} the hard way.`, `There's a reason ${rewordNiche(info.niche, rw)} feels like a grind. And it's not your fault.`, `If you've been stuck in ${rewordNiche(info.niche, rw)}, here's what's actually going on.`, `The #1 mistake in ${rewordNiche(info.niche, rw)}? Doing it without the right support.`],
          direct: [`Here's the cold truth about ${rewordNiche(info.niche, rw)}.`, `Stop wasting time on ${rewordNiche(info.niche, rw)} the old way.`, `${rewordNiche(info.niche, rw)} doesn't have to be this slow.`, `The problem with most ${rewordNiche(info.niche, rw)} approaches? They're broken.`, `Let's be clear about what's not working in ${rewordNiche(info.niche, rw)}.`],
          playful: [`Okay so ${rewordNiche(info.niche, rw)} being hard? Totally valid. But also — fixable.`, `Hot take: ${rewordNiche(info.niche, rw)} should not feel like a part-time job.`, `Your ${rewordNiche(info.niche, rw)} era is struggling. Let's fix that.`, `The fact that ${rewordNiche(info.niche, rw)} stresses people out is a crime tbh.`, `Me looking at people grinding through ${rewordNiche(info.niche, rw)} alone: 👀`],
          funny: [`${rewordNiche(info.niche, rw)}: the struggle arc no one asked for.`, `POV: ${rewordNiche(info.niche, rw)} is eating you alive and you're just… accepting it.`, `Not me watching ${rewordAudience(info.targetAudience, rw)} struggle with ${rewordNiche(info.niche, rw)} unnecessarily 😭`, `The audacity of ${rewordNiche(info.niche, rw)} being this difficult.`, `Tell me you need help with ${rewordNiche(info.niche, rw)} without telling me…`],
          motivational: [`You were not built to stay stuck in ${rewordNiche(info.niche, rw)}.`, `The version of you that wins at ${rewordNiche(info.niche, rw)} is closer than you think.`, `What if the only thing between you and ${rewordNiche(info.niche, rw)} success… was the right system?`, `${rewordAudience(info.targetAudience, rw)}: you deserve results in ${rewordNiche(info.niche, rw)}. Not someday. Now.`, `Struggling in ${rewordNiche(info.niche, rw)} isn't your identity. It's just a chapter.`],
          calm: [`If ${rewordNiche(info.niche, rw)} has been feeling overwhelming — that's a signal, not a failure.`, `It's okay to admit ${rewordNiche(info.niche, rw)} hasn't been working the way you hoped.`, `Many people find ${rewordNiche(info.niche, rw)} difficult. There's a simpler way forward.`, `${rewordNiche(info.niche, rw)} doesn't have to be stressful. Here's a gentler path.`, `You're not behind. ${rewordNiche(info.niche, rw)} just needs the right approach.`],
          bold: [`Stop settling for mediocre ${rewordNiche(info.niche, rw)}.`, `${rewordNiche(info.niche, rw)} without results is just expensive noise.`, `You don't have a ${rewordNiche(info.niche, rw)} problem. You have a strategy problem.`, `The gap between you and ${rewordNiche(info.niche, rw)} success isn't effort — it's the right tool.`, `Tired of ${rewordNiche(info.niche, rw)} letting you down? Then stop using approaches that don't work.`],
          romantic: [`Remember when ${rewordNiche(info.niche, rw)} used to feel exciting? Let's bring that back.`, `There was a time when ${rewordNiche(info.niche, rw)} made you feel alive. You can have that again.`, `What if ${rewordNiche(info.niche, rw)} could feel like possibility again instead of pressure?`, `The spark in your ${rewordNiche(info.niche, rw)} journey isn't gone — it's just waiting.`, `${rewordNiche(info.niche, rw)} can feel beautiful again. Here's how.`]
        };

        const bodies = [
          () => `${rewordAudience(info.targetAudience, rw)} come to ${rewordBrandName(info.brandName, rw)} because they're tired of guessing. ${rewordOfferings(info.offerings, rw)} gives you a clear, tested path to real results — without the trial and error.`,
          () => `The difference ${rewordBrandName(info.brandName, rw)} makes is simple: instead of figuring out ${rewordNiche(info.niche, rw)} alone, you get ${rewordOfferings(info.offerings, rw)} — designed specifically for ${rewordAudience(info.targetAudience, rw)}.`,
          () => `What makes ${rewordBrandName(info.brandName, rw)} different? ${rewordOfferings(info.offerings, rw)} built around what ${rewordAudience(info.targetAudience, rw)} actually need. No fluff. Just results.`,
          () => `${rewordBrandName(info.brandName, rw)} exists because ${rewordAudience(info.targetAudience, rw)} deserve ${rewordNiche(info.niche, rw)} success without the overwhelm. The offer? ${rewordOfferings(info.offerings, rw)}.`,
          () => `The solution for ${rewordAudience(info.targetAudience, rw)} in ${rewordNiche(info.niche, rw)}? ${rewordBrandName(info.brandName, rw)} and ${rewordOfferings(info.offerings, rw)} — tested, refined, and built to work.`
        ];

        const ctas = [
          `Ready to change your ${rewordNiche(info.niche, rw)} story? Tap the link in bio.`,
          `${rewordAudience(info.targetAudience, rw)}: your next step is in the link in bio.`,
          `Stop guessing. Start winning. Link in bio.`,
          `The shift starts now — link in bio.`,
          `Don't stay stuck. The solution is one click away — link in bio.`
        ];

        const hookList = problemHooks[tone] || problemHooks.engaging;
        const hook = pick(hookList, rng);
        const body = pick(bodies, rng)();
        const cta = pick(ctas, rng);
        return { hook, mainScript: `${body}`, cta };
      }
    },

    // TEMPLATE 2: Storytelling / Transformation
    storytelling: {
      title: "Transformation Story",
      icon: "✨",
      getBrollKeywords: (info) => [`${info.targetAudience} before after`, `transformation journey`, `${info.niche} success`, `person celebrating achievement`],
      generate: (info, tone, rng, genSeed) => {
        const rw = createRng(genSeed + 2);
        const hooks = {
          engaging: [`Here's what changed everything for ${rewordAudience(info.targetAudience, rw)} in ${rewordNiche(info.niche, rw)}.`, `This is the story of how ${rewordAudience(info.targetAudience, rw)} stopped struggling in ${rewordNiche(info.niche, rw)}.`, `Imagine going from overwhelmed to thriving in ${rewordNiche(info.niche, rw)}.`, `The turning point in ${rewordNiche(info.niche, rw)} looked like this.`, `Not everyone gets this transformation. But with the right help, ${rewordAudience(info.targetAudience, rw)} do.`],
          direct: [`Before ${rewordBrandName(info.brandName, rw)}: stuck. After: results.`, `This is what changes when ${rewordAudience(info.targetAudience, rw)} get the right ${rewordNiche(info.niche, rw)} support.`, `Two phases: before ${rewordOfferings(info.offerings, rw)}, and after.`, `The before and after in ${rewordNiche(info.niche, rw)} is real. Here's the proof.`, `What transformation in ${rewordNiche(info.niche, rw)} actually looks like.`],
          playful: [`The glow-up arc in ${rewordNiche(info.niche, rw)}? Let me tell you.`, `${rewordAudience(info.targetAudience, rw)} to thriving in ${rewordNiche(info.niche, rw)}: a journey.`, `The plot twist in ${rewordNiche(info.niche, rw)} nobody expected.`, `From chaos to clarity in ${rewordNiche(info.niche, rw)} — with a little help.`, `Character development in ${rewordNiche(info.niche, rw)} when you find the right support:`],
          funny: [`${rewordNiche(info.niche, rw)} before vs. after finding ${rewordBrandName(info.brandName, rw)}: a dramatic retelling.`, `Act 1: struggling in ${rewordNiche(info.niche, rw)}. Act 2: figuring it out. Act 3: thriving.`, `The hero's journey but make it ${rewordNiche(info.niche, rw)}.`, `Me before ${rewordOfferings(info.offerings, rw)}: 💀 Me after: 💪`, `${rewordNiche(info.niche, rw)} character development speedrun:`],
          motivational: [`Every ${rewordAudience(info.targetAudience, rw)} has a before. ${rewordBrandName(info.brandName, rw)} is built for the after.`, `The transformation in ${rewordNiche(info.niche, rw)} starts the moment you decide to do it differently.`, `What winning at ${rewordNiche(info.niche, rw)} looks like — and how ${rewordAudience(info.targetAudience, rw)} get there.`, `Your ${rewordNiche(info.niche, rw)} success story is waiting to be written.`, `The breakthrough in ${rewordNiche(info.niche, rw)} starts with one decision.`],
          calm: [`There's a quiet turning point in ${rewordNiche(info.niche, rw)} when things just… start to click.`, `The shift in ${rewordNiche(info.niche, rw)} doesn't have to be dramatic. It just has to happen.`, `Here's what a gentle but powerful ${rewordNiche(info.niche, rw)} transformation looks like.`, `When ${rewordAudience(info.targetAudience, rw)} find the right support in ${rewordNiche(info.niche, rw)}, the change is real.`, `Transformation in ${rewordNiche(info.niche, rw)} isn't always a big moment. Sometimes it's just a better path.`],
          bold: [`${rewordAudience(info.targetAudience, rw)}: the old version of your ${rewordNiche(info.niche, rw)} story ends here.`, `Forget the struggle arc. ${rewordBrandName(info.brandName, rw)} is the plot twist.`, `The ${rewordNiche(info.niche, rw)} transformation? It's not optional. It's inevitable with the right system.`, `${rewordAudience(info.targetAudience, rw)}: stop living in the before. The after is waiting.`, `The story of winning in ${rewordNiche(info.niche, rw)} starts with a decision. Make it.`],
          romantic: [`There's a version of your ${rewordNiche(info.niche, rw)} story where everything clicks into place.`, `The most beautiful ${rewordNiche(info.niche, rw)} transformation begins with believing it's possible.`, `What if your ${rewordNiche(info.niche, rw)} journey could end in a love story — with the results you deserve?`, `Some transformations in ${rewordNiche(info.niche, rw)} are so good, they feel like magic.`, `Here's the ${rewordNiche(info.niche, rw)} transformation story ${rewordAudience(info.targetAudience, rw)} deserve.`]
        };

        const bodies = [
          () => `Before: ${rewordAudience(info.targetAudience, rw)} trying to navigate ${rewordNiche(info.niche, rw)} without direction. After: ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)} — and a completely different outcome. The process works. The results are real.`,
          () => `${rewordBrandName(info.brandName, rw)} was built on one observation: ${rewordAudience(info.targetAudience, rw)} don't lack effort in ${rewordNiche(info.niche, rw)} — they lack the right system. ${rewordOfferings(info.offerings, rw)} changes that. The transformation follows.`,
          () => `The shift happens fast when ${rewordAudience(info.targetAudience, rw)} use ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)}. What felt impossible in ${rewordNiche(info.niche, rw)} starts to feel achievable. That's not luck — that's the system working.`,
          () => `${rewordOfferings(info.offerings, rw)} doesn't just improve ${rewordNiche(info.niche, rw)} outcomes for ${rewordAudience(info.targetAudience, rw)} — it rewrites the whole story. ${rewordBrandName(info.brandName, rw)} has seen this transformation happen again and again.`,
          () => `It starts with ${rewordAudience(info.targetAudience, rw)} taking one step: choosing ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)}. From there, ${rewordNiche(info.niche, rw)} success becomes a process, not a hope.`
        ];

        const ctas = [
          `Your transformation story starts now — link in bio.`,
          `Join ${rewordAudience(info.targetAudience, rw)} who made the switch — link in bio.`,
          `Write your after. It starts with the link in bio.`,
          `Ready for your ${rewordNiche(info.niche, rw)} glow-up? Link in bio.`,
          `See the transformation for yourself — link in bio.`
        ];

        const hookList = hooks[tone] || hooks.engaging;
        const hook = pick(hookList, rng);
        const body = pick(bodies, rng)();
        const cta = pick(ctas, rng);
        return { hook, mainScript: body, cta };
      }
    },

    // TEMPLATE 3: Social Proof / Results
    socialProof: {
      title: "Results & Social Proof",
      icon: "🏆",
      getBrollKeywords: (info) => [`customer testimonial ${info.niche}`, `happy customer success`, `five star review`, `results proof`],
      generate: (info, tone, rng, genSeed) => {
        const rw = createRng(genSeed + 3);
        const hooks = {
          engaging: [`Here's what ${rewordAudience(info.targetAudience, rw)} are saying about ${rewordNiche(info.niche, rw)}.`, `The results from ${rewordBrandName(info.brandName, rw)} speak for themselves.`, `${rewordAudience(info.targetAudience, rw)} didn't expect these ${rewordNiche(info.niche, rw)} results.`, `Real people. Real ${rewordNiche(info.niche, rw)} results. Here's what's happening.`, `The feedback on ${rewordOfferings(info.offerings, rw)} is impossible to ignore.`],
          direct: [`${rewordBrandName(info.brandName, rw)} results, straight up:`, `Numbers don't lie. Here's what ${rewordOfferings(info.offerings, rw)} delivers.`, `This is what success in ${rewordNiche(info.niche, rw)} actually looks like.`, `Proof that ${rewordBrandName(info.brandName, rw)} works for ${rewordAudience(info.targetAudience, rw)}:`, `Track record in ${rewordNiche(info.niche, rw)}:`],
          playful: [`The comments section for ${rewordBrandName(info.brandName, rw)} is giving…`, `${rewordAudience(info.targetAudience, rw)} on ${rewordOfferings(info.offerings, rw)}: *obsessed*.`, `Not all hero arcs in ${rewordNiche(info.niche, rw)} start the same — but they end with ${rewordBrandName(info.brandName, rw)}.`, `If ${rewordBrandName(info.brandName, rw)} had a reviews section… here's a glimpse.`, `The energy when ${rewordAudience(info.targetAudience, rw)} discover ${rewordOfferings(info.offerings, rw)}:`],
          funny: [`The ${rewordNiche(info.niche, rw)} results are real and I will not be taking questions.`, `${rewordAudience(info.targetAudience, rw)} after ${rewordOfferings(info.offerings, rw)}: 😭🙏✨ (the good kind).`, `Not to be dramatic but ${rewordBrandName(info.brandName, rw)} is changing ${rewordNiche(info.niche, rw)} lives.`, `The unsolicited testimonials for ${rewordBrandName(info.brandName, rw)} are getting out of hand.`, `Me watching ${rewordAudience(info.targetAudience, rw)} get results from ${rewordOfferings(info.offerings, rw)}: 👏`],
          motivational: [`Every result in ${rewordNiche(info.niche, rw)} starts as a decision. For ${rewordAudience(info.targetAudience, rw)}, that decision led here.`, `${rewordBrandName(info.brandName, rw)} was built because ${rewordAudience(info.targetAudience, rw)} deserve ${rewordNiche(info.niche, rw)} wins. And they're getting them.`, `The wins are real. The transformation is real. And ${rewordAudience(info.targetAudience, rw)} keep proving it.`, `Proof that ${rewordNiche(info.niche, rw)} success is achievable — with the right system behind you.`, `This is what ${rewordAudience(info.targetAudience, rw)} look like when they stop settling in ${rewordNiche(info.niche, rw)}.`],
          calm: [`These ${rewordNiche(info.niche, rw)} wins didn't come overnight — but they came consistently.`, `${rewordAudience(info.targetAudience, rw)} using ${rewordOfferings(info.offerings, rw)} report one common thing: it just works.`, `Quiet progress in ${rewordNiche(info.niche, rw)} adds up. Here's what that looks like with ${rewordBrandName(info.brandName, rw)}.`, `Not overnight success — just steady, real ${rewordNiche(info.niche, rw)} progress.`, `The gentle power of ${rewordOfferings(info.offerings, rw)}: consistent results for ${rewordAudience(info.targetAudience, rw)}.`],
          bold: [`${rewordBrandName(info.brandName, rw)} delivers results in ${rewordNiche(info.niche, rw)}. Full stop.`, `The numbers on ${rewordOfferings(info.offerings, rw)} are not up for debate.`, `${rewordAudience(info.targetAudience, rw)} winning in ${rewordNiche(info.niche, rw)} with ${rewordBrandName(info.brandName, rw)}: expected.`, `Mediocre ${rewordNiche(info.niche, rw)} results are optional. ${rewordBrandName(info.brandName, rw)} users choose different.`, `${rewordOfferings(info.offerings, rw)}: built for ${rewordAudience(info.targetAudience, rw)} who demand results.`],
          romantic: [`Every success story in ${rewordNiche(info.niche, rw)} has a turning point. For ${rewordAudience(info.targetAudience, rw)}, it's ${rewordBrandName(info.brandName, rw)}.`, `The reviews for ${rewordOfferings(info.offerings, rw)} read like love letters to ${rewordNiche(info.niche, rw)} progress.`, `${rewordAudience(info.targetAudience, rw)} didn't just get results — they fell in love with the process.`, `The ${rewordNiche(info.niche, rw)} wins from ${rewordBrandName(info.brandName, rw)} are the kind that stick with you.`, `These ${rewordNiche(info.niche, rw)} transformations? They're personal. They're real. They're beautiful.`]
        };

        const bodies = [
          () => `${rewordAudience(info.targetAudience, rw)} who use ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)} consistently report one thing: it works. Not eventually — quickly, clearly, and in ways that actually matter for their ${rewordNiche(info.niche, rw)} goals.`,
          () => `${rewordBrandName(info.brandName, rw)} has helped ${rewordAudience(info.targetAudience, rw)} achieve ${rewordNiche(info.niche, rw)} results that seemed out of reach. The feedback is consistent: ${rewordOfferings(info.offerings, rw)} delivers.`,
          () => `When ${rewordAudience(info.targetAudience, rw)} try ${rewordOfferings(info.offerings, rw)}, the results follow. ${rewordBrandName(info.brandName, rw)}'s track record in ${rewordNiche(info.niche, rw)} comes from one thing: a system that actually works for real people.`,
          () => `The proof is in the results. ${rewordAudience(info.targetAudience, rw)} using ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)} aren't just satisfied — they're transformed in their approach to ${rewordNiche(info.niche, rw)}.`,
          () => `${rewordBrandName(info.brandName, rw)} users in ${rewordNiche(info.niche, rw)} aren't hoping for results — they're getting them. ${rewordOfferings(info.offerings, rw)} isn't a promise. It's a proven path for ${rewordAudience(info.targetAudience, rw)}.`
        ];

        const ctas = [`Join the ${rewordNiche(info.niche, rw)} winners — link in bio.`, `Get your results — link in bio.`, `Be the next success story — link in bio.`, `${rewordAudience(info.targetAudience, rw)}: your turn. Link in bio.`, `See results for yourself — tap the link in bio.`];

        const hookList = hooks[tone] || hooks.engaging;
        const hook = pick(hookList, rng);
        const body = pick(bodies, rng)();
        const cta = pick(ctas, rng);
        return { hook, mainScript: body, cta };
      }
    },

    // TEMPLATE 4: Urgency / Limited Offer
    urgencyOffer: {
      title: "Urgency & Limited Offer",
      icon: "⚡",
      getBrollKeywords: (info) => [`limited time offer`, `countdown timer`, `exclusive deal`, `${info.niche} opportunity`],
      generate: (info, tone, rng, genSeed) => {
        const rw = createRng(genSeed + 4);
        const hooks = {
          engaging: [`This window for ${rewordNiche(info.niche, rw)} doesn't stay open long.`, `What ${rewordAudience(info.targetAudience, rw)} are doing right now in ${rewordNiche(info.niche, rw)} — while this is still available.`, `If you've been thinking about ${rewordNiche(info.niche, rw)}, now is the time.`, `The ${rewordNiche(info.niche, rw)} opportunity here is time-sensitive.`, `For ${rewordAudience(info.targetAudience, rw)} who want in: here's the window.`],
          direct: [`Limited availability. Here's the deal.`, `${rewordOfferings(info.offerings, rw)}: available now. Not forever.`, `Time-sensitive ${rewordNiche(info.niche, rw)} offer — here's what you need to know.`, `For ${rewordAudience(info.targetAudience, rw)}: this won't be around long.`, `Act on ${rewordNiche(info.niche, rw)}. The moment is now.`],
          playful: [`Okay the ${rewordNiche(info.niche, rw)} deal is giving main character energy and it's almost over.`, `This ${rewordNiche(info.niche, rw)} opportunity won't wait for your "I'll start Monday."`, `Not to be dramatic but this ${rewordNiche(info.niche, rw)} offer is kinda urgent bestie.`, `The universe said now. The ${rewordNiche(info.niche, rw)} offer agreed.`, `When the ${rewordNiche(info.niche, rw)} window closes, it's closed 💅`],
          funny: [`Me watching ${rewordAudience(info.targetAudience, rw)} wait on this ${rewordNiche(info.niche, rw)} offer: 👀⏳`, `Procrastinating on ${rewordNiche(info.niche, rw)}? Cute. This offer doesn't.`, `Time: closing. This ${rewordNiche(info.niche, rw)} deal: not waiting.`, `This is the sign you've been waiting for. But the sign has a deadline.`, `The ${rewordNiche(info.niche, rw)} offer said "last call" and I said 👇`],
          motivational: [`The right time to invest in ${rewordNiche(info.niche, rw)} is now — especially with this on the table.`, `${rewordAudience(info.targetAudience, rw)}: the door to ${rewordNiche(info.niche, rw)} success is open. Walk through it while you can.`, `Every day without ${rewordOfferings(info.offerings, rw)} is a day of ${rewordNiche(info.niche, rw)} progress delayed.`, `Make the move in ${rewordNiche(info.niche, rw)} while the conditions are right.`, `The best moment for ${rewordAudience(info.targetAudience, rw)} to invest in ${rewordNiche(info.niche, rw)}? Right now.`],
          calm: [`When the right ${rewordNiche(info.niche, rw)} opportunity comes along, it's worth pausing for.`, `This ${rewordNiche(info.niche, rw)} offer is available now — and worth considering before it closes.`, `${rewordAudience(info.targetAudience, rw)}: the timing for this ${rewordNiche(info.niche, rw)} move is genuinely good right now.`, `A gentle heads-up: ${rewordOfferings(info.offerings, rw)} won't be at this availability forever.`, `If you've been waiting for the right moment in ${rewordNiche(info.niche, rw)} — this might be it.`],
          bold: [`The ${rewordNiche(info.niche, rw)} window is closing. Decide now or miss it.`, `Opportunities in ${rewordNiche(info.niche, rw)} don't wait. Neither should you.`, `Limited. Final. This ${rewordNiche(info.niche, rw)} offer isn't repeating.`, `${rewordAudience(info.targetAudience, rw)}: stop waiting. Start winning. This offer ends.`, `The cost of not acting on ${rewordNiche(info.niche, rw)} today is greater than the cost of acting.`],
          romantic: [`Some ${rewordNiche(info.niche, rw)} moments are rare. This offer is one of them.`, `This is the kind of ${rewordNiche(info.niche, rw)} opportunity that comes along and you feel it.`, `What if saying yes to this ${rewordNiche(info.niche, rw)} offer was the moment everything changed?`, `The timing in ${rewordNiche(info.niche, rw)} feels right — and this offer makes it even more so.`, `A once-in-a-season chance to invest in your ${rewordNiche(info.niche, rw)} growth.`]
        };

        const bodies = [
          () => `${rewordBrandName(info.brandName, rw)} is offering ${rewordOfferings(info.offerings, rw)} — and availability is limited. ${rewordAudience(info.targetAudience, rw)} who are serious about ${rewordNiche(info.niche, rw)} results know that waiting has a cost.`,
          () => `${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)} is currently available for ${rewordAudience(info.targetAudience, rw)} — but not for long. If ${rewordNiche(info.niche, rw)} growth matters to you, this is the moment.`,
          () => `For ${rewordAudience(info.targetAudience, rw)} ready to take ${rewordNiche(info.niche, rw)} seriously: ${rewordBrandName(info.brandName, rw)}'s ${rewordOfferings(info.offerings, rw)} has limited spots. Once they're gone, they're gone.`,
          () => `This is the time-sensitive offer: ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)} — available now for ${rewordAudience(info.targetAudience, rw)} who want ${rewordNiche(info.niche, rw)} results without delay.`,
          () => `${rewordAudience(info.targetAudience, rw)}: ${rewordBrandName(info.brandName, rw)} made ${rewordOfferings(info.offerings, rw)} available for a limited window. Don't let your ${rewordNiche(info.niche, rw)} goals wait another season.`
        ];

        const ctas = [`Claim your spot now — link in bio.`, `Before it closes: link in bio.`, `Don't miss this ${rewordNiche(info.niche, rw)} moment — link in bio.`, `Secure your access — link in bio.`, `Act now — link in bio before it's gone.`];

        const hookList = hooks[tone] || hooks.engaging;
        const hook = pick(hookList, rng);
        const body = pick(bodies, rng)();
        const cta = pick(ctas, rng);
        return { hook, mainScript: body, cta };
      }
    },

    // TEMPLATE 5: Educational / Value-First
    educational: {
      title: "Educational Value Drop",
      icon: "🎓",
      getBrollKeywords: (info) => [`${info.niche} tips tutorial`, `expert advice`, `how to ${info.niche}`, `educational content`],
      generate: (info, tone, rng, genSeed) => {
        const rw = createRng(genSeed + 5);
        const hooks = {
          engaging: [`3 things ${rewordAudience(info.targetAudience, rw)} wish they knew earlier about ${rewordNiche(info.niche, rw)}.`, `What most people get wrong about ${rewordNiche(info.niche, rw)}.`, `The quickest way to improve ${rewordNiche(info.niche, rw)} results? Stop doing this.`, `An honest breakdown of what works in ${rewordNiche(info.niche, rw)}.`, `The truth about ${rewordNiche(info.niche, rw)} that took years to figure out.`],
          direct: [`${rewordNiche(info.niche, rw)} tip that actually works:`, `Fast win for ${rewordAudience(info.targetAudience, rw)} in ${rewordNiche(info.niche, rw)}:`, `The most overlooked ${rewordNiche(info.niche, rw)} strategy:`, `Here's the ${rewordNiche(info.niche, rw)} advice that gets results:`, `Quick insight for ${rewordNiche(info.niche, rw)} success:`],
          playful: [`Hot take on ${rewordNiche(info.niche, rw)}: here's what the experts don't post about.`, `The ${rewordNiche(info.niche, rw)} tips nobody's talking about (but everyone needs).`, `Learning ${rewordNiche(info.niche, rw)} the fun way — and actually retaining it.`, `${rewordNiche(info.niche, rw)} pro-tip incoming and it's lowkey life-changing.`, `The ${rewordNiche(info.niche, rw)} lesson they don't teach: here it is.`],
          funny: [`Nobody in ${rewordNiche(info.niche, rw)} talks about this and it's genuinely criminal.`, `The ${rewordNiche(info.niche, rw)} advice I wish someone gave me instead of letting me flounder.`, `${rewordAudience(info.targetAudience, rw)} finding out this ${rewordNiche(info.niche, rw)} tip exists: 😭💀`, `Learning ${rewordNiche(info.niche, rw)} the hard way so you don't have to.`, `Me giving free ${rewordNiche(info.niche, rw)} game because someone has to:`],
          motivational: [`The ${rewordNiche(info.niche, rw)} knowledge that changes what's possible for ${rewordAudience(info.targetAudience, rw)}.`, `What the top 1% of ${rewordNiche(info.niche, rw)} performers know — and you can too.`, `This ${rewordNiche(info.niche, rw)} insight is the difference between spinning your wheels and flying.`, `The insight that shifts your entire ${rewordNiche(info.niche, rw)} trajectory.`, `Equip yourself. The right ${rewordNiche(info.niche, rw)} knowledge is the ultimate competitive edge.`],
          calm: [`A simple but powerful ${rewordNiche(info.niche, rw)} truth worth knowing.`, `What ${rewordAudience(info.targetAudience, rw)} find when they approach ${rewordNiche(info.niche, rw)} with the right information.`, `The gentle truth about ${rewordNiche(info.niche, rw)} that helps more than hustle ever could.`, `Understanding ${rewordNiche(info.niche, rw)} better — one honest insight at a time.`, `Here's what actually simplifies ${rewordNiche(info.niche, rw)} once you understand it.`],
          bold: [`The unfiltered truth about winning in ${rewordNiche(info.niche, rw)}.`, `Stop learning ${rewordNiche(info.niche, rw)} wrong. Here's the real insight.`, `This is the ${rewordNiche(info.niche, rw)} knowledge that separates results from excuses.`, `${rewordAudience(info.targetAudience, rw)}: this ${rewordNiche(info.niche, rw)} insight is not optional.`, `The education system failed ${rewordNiche(info.niche, rw)}. Here's what fills the gap.`],
          romantic: [`The most beautiful thing about ${rewordNiche(info.niche, rw)} is that once you understand it, it changes everything.`, `Here's the ${rewordNiche(info.niche, rw)} insight that makes the journey feel meaningful.`, `Falling in love with ${rewordNiche(info.niche, rw)} starts with understanding it — really understanding it.`, `The knowledge that turns ${rewordNiche(info.niche, rw)} from a struggle into something you can cherish.`, `Sometimes a single ${rewordNiche(info.niche, rw)} insight is all it takes to shift everything.`]
        };

        const bodies = [
          () => `${rewordBrandName(info.brandName, rw)} was built around this insight: ${rewordAudience(info.targetAudience, rw)} in ${rewordNiche(info.niche, rw)} don't need more information — they need the *right* information, structured into action. ${rewordOfferings(info.offerings, rw)} does exactly that.`,
          () => `In ${rewordNiche(info.niche, rw)}, the gap isn't effort — it's knowledge applied correctly. That's why ${rewordBrandName(info.brandName, rw)} built ${rewordOfferings(info.offerings, rw)}: to give ${rewordAudience(info.targetAudience, rw)} the clarity that converts learning into results.`,
          () => `Here's the insight: most ${rewordAudience(info.targetAudience, rw)} in ${rewordNiche(info.niche, rw)} are working hard but missing one strategic piece. ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)} fills that gap — efficiently, reliably, and with real impact.`,
          () => `${rewordBrandName(info.brandName, rw)} built ${rewordOfferings(info.offerings, rw)} because the best thing for ${rewordAudience(info.targetAudience, rw)} in ${rewordNiche(info.niche, rw)} isn't harder work — it's smarter decisions backed by solid knowledge.`,
          () => `The best-kept secret in ${rewordNiche(info.niche, rw)}? Access to the right system. ${rewordOfferings(info.offerings, rw)} from ${rewordBrandName(info.brandName, rw)} gives ${rewordAudience(info.targetAudience, rw)} the foundation they actually need.`
        ];

        const ctas = [
          `Go deeper — link in bio for the full resource.`,
          `Want the full ${rewordNiche(info.niche, rw)} playbook? Link in bio.`,
          `Learn more and apply it — link in bio.`,
          `${rewordAudience(info.targetAudience, rw)}: the full guide is in the bio.`,
          `Take this further — link in bio.`
        ];

        const hookList = hooks[tone] || hooks.engaging;
        const hook = pick(hookList, rng);
        const body = pick(bodies, rng)();
        const cta = pick(ctas, rng);
        return { hook, mainScript: body, cta };
      }
    }
  });

  // ---------- GENERATE ----------
  const generateScripts = async () => {
    setIsGenerating(true);
    setScripts([]);
    setEditingScript(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const newGenCount = generationCount + 1;
      setGenerationCount(newGenCount);
      storageSet('generationCount', newGenCount);

      // Use generation count + timestamp as seed so every run is different
      const genSeed = newGenCount * 99991 + Date.now() % 100000;
      const rng = createRng(genSeed);

      const templates = buildScriptTemplates();
      const templateKeys = Object.keys(templates);

      // Ensure all 5 templates are used if numScripts >= 5, otherwise pick unique ones
      const numToGen = scriptPrefs.numScripts;
      let selectedKeys = [];
      const shuffled = shuffle(templateKeys, rng);
      for (let i = 0; i < numToGen; i++) {
        selectedKeys.push(shuffled[i % shuffled.length]);
      }
      // If requesting 5+, force all unique templates
      if (numToGen >= 5) {
        selectedKeys = shuffle(templateKeys, createRng(genSeed + 7));
      }

      const enhancedInfo = {
        brandName: businessInfo.brandName,
        niche: businessInfo.niche,
        targetAudience: businessInfo.targetAudience,
        offerings: businessInfo.offerings,
        features: features.filter(f => f.trim()),
        additionalInfo: businessInfo.additionalInfo
      };

      const generatedScripts = await Promise.all(selectedKeys.map(async (key, index) => {
        const template = templates[key];
        const scriptRng = createRng(genSeed + index * 31337);
        const result = template.generate(enhancedInfo, scriptPrefs.tone, scriptRng, genSeed + index * 777);

        let brollSuggestions = [];
        if (scriptPrefs.includeBroll) {
          brollSuggestions = generateBrollSuggestions(enhancedInfo, key);
        }

        const hashRng = createRng(genSeed + index * 54321);
        const hashtags = generateHashtags(businessInfo, scriptPrefs.platform, hashRng);
        const logoRng = createRng(genSeed + index * 11111);
        const logoPrompt = generateLogoPrompt(enhancedInfo, logoRng);
        const musicPrompt = generateMusicPrompt(enhancedInfo, key, scriptPrefs.tone);
        const featureScripts = generateFeatureScripts(enhancedInfo, scriptPrefs.tone, scriptRng, genSeed + index * 42);
        const captionRng = createRng(genSeed + index * 22222);
        const captionVariants = [
          `${enhancedInfo.brandName} — built for ${enhancedInfo.targetAudience} who are serious about ${enhancedInfo.niche}. 🚀`,
          `${enhancedInfo.targetAudience}: this is your ${enhancedInfo.niche} era. ${enhancedInfo.brandName} is here. ✨`,
          `Real ${enhancedInfo.niche} results for ${enhancedInfo.targetAudience}. That's the ${enhancedInfo.brandName} promise. 💪`,
          `${enhancedInfo.brandName} | ${enhancedInfo.niche} for ${enhancedInfo.targetAudience} who want more. 🎯`,
          `The ${enhancedInfo.niche} solution ${enhancedInfo.targetAudience} didn't know they needed — until now. @${enhancedInfo.brandName.replace(/\s/g, '')} 🌟`
        ];
        const caption = pick(captionVariants, captionRng);

        return {
          title: `${template.icon} ${template.title}`,
          hook: result.hook,
          mainScript: result.mainScript,
          cta: result.cta,
          brollSuggestions,
          caption,
          hashtags,
          logoPrompt,
          musicPrompt,
          featureScripts,
          templateKey: key
        };
      }));

      setScripts(generatedScripts);
    } catch (err) {
      console.error("Error generating scripts:", err);
      alert("Failed to generate scripts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatScript = (script) => {
    let formatted = `🎬 ${script.title}\n\n🪝 HOOK:\n${script.hook}\n\n📝 SCRIPT:\n${script.mainScript}\n\n🎯 CTA:\n${script.cta}\n\n`;
    if (script.featureScripts?.length > 0) {
      formatted += `✨ FEATURE SCRIPTS:\n${script.featureScripts.map((fs, i) => `${i + 1}. FEATURE: ${fs.feature}\nHOOK: ${fs.hook}\nSCRIPT: ${fs.mainScript}\nCTA: ${fs.cta}\n`).join('\n')}\n\n`;
    }
    if (script.brollSuggestions?.length > 0) formatted += `🎥 B-ROLL SUGGESTIONS:\n${script.brollSuggestions.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\n`;
    formatted += `📱 CAPTION:\n${script.caption}\n\n🏷️ HASHTAGS:\n${script.hashtags?.join(' ') || ''}\n\n🎨 LOGO PROMPT:\n${script.logoPrompt}\n\n🎵 MUSIC PROMPT:\n${script.musicPrompt}`;
    return formatted;
  };

  // ---------- EDITING ----------
  const startEditing = (script, index) => setEditingScript({ ...script, scriptIndex: index });
  const updateEditingScript = (field, value) => setEditingScript(prev => prev ? { ...prev, [field]: value } : prev);
  const updateEditingFeatureScript = (featureIdx, field, value) => {
    setEditingScript(prev => {
      if (!prev) return prev;
      const updated = prev.featureScripts.map((fs, i) => i === featureIdx ? { ...fs, [field]: value } : fs);
      return { ...prev, featureScripts: updated };
    });
  };

  const saveEditedScript = () => {
    const current = editingRef.current;
    if (!current || current.scriptIndex == null) { setEditingScript(null); return; }
    setScripts(prev => prev.map((s, i) => i !== current.scriptIndex ? s : { ...s, hook: current.hook, mainScript: current.mainScript, caption: current.caption, cta: current.cta, featureScripts: current.featureScripts }));
    setEditingScript(null);
  };

  const cancelEditing = () => setEditingScript(null);

  // ---------- LICENSE SCREEN ----------
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full"><Lock className="w-8 h-8 text-white" /></div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Marketing Script Generator</h1>
          <p className="text-gray-600 text-center mb-6">Enter your license key to unlock AI-powered script generation</p>
          <input type="text" placeholder="Enter License Key" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLicenseSubmit()} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500" />
          <button onClick={handleLicenseSubmit} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition">Unlock App</button>
          <p className="text-xs text-gray-500 text-center mt-4">Get your license key from Gumroad</p>
        </div>
      </div>
    );
  }

  // ---------- TELEPROMPTER ----------
  if (currentView === 'teleprompter' && teleprompterScript) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Teleprompter Mode</h1>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2"><label className="text-sm">Speed:</label><input type="range" min="1" max="5" value={scrollSpeed} onChange={(e) => setScrollSpeed(parseInt(e.target.value))} className="w-24" /></div>
            <button onClick={() => setIsScrolling(!isScrolling)} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">{isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}{isScrolling ? 'Pause' : 'Play'}</button>
            <button onClick={() => { setTeleprompterScript(null); setCurrentView('generate'); setScrollPosition(0); setIsScrolling(false); }} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2"><X className="w-4 h-4" /> Exit</button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 px-12 pt-12" style={{ transform: `translateY(-${scrollPosition}px)` }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-8">{teleprompterScript.title}</h2>
              <p className="text-5xl leading-relaxed mb-12">{teleprompterScript.hook}</p>
              <p className="text-5xl leading-relaxed whitespace-pre-line">{teleprompterScript.mainScript}</p>
              <p className="text-5xl leading-relaxed mt-12 font-bold text-purple-400">{teleprompterScript.cta}</p>
            </div>
          </div>
          <div className="absolute inset-x-0 top-1/2 h-1 bg-purple-500 opacity-50"></div>
        </div>
      </div>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <div className="min-h-screen bg-gray-50">
      {saveStatus && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <Check className="w-4 h-4" />
          {saveStatus === 'script' ? 'Script saved successfully!' : 'Profile saved successfully!'}
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="w-8 h-8" />Marketing Script Generator</h1>
              <p className="text-purple-100 mt-1">5 unique script styles — different every generation</p>
            </div>
            <div className="flex items-center gap-3">
              {generationCount > 0 && <span className="text-purple-200 text-sm">Generation #{generationCount}</span>}
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"><RefreshCw className="w-4 h-4" />Reset All</button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentView('generate')} className={`px-4 py-2 rounded-lg transition ${currentView === 'generate' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'}`}>Generate Scripts</button>
            <button onClick={() => setCurrentView('saved')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${currentView === 'saved' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'}`}><Save className="w-4 h-4" />Saved Scripts ({savedScripts.length})</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {currentView === 'saved' ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Saved Scripts</h2>
            {savedScripts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved scripts yet. Generate some scripts and save your favorites!</p>
            ) : (
              <div className="space-y-4">
                {savedScripts.map((script) => (
                  <div key={script.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-purple-600">{script.title}</h3>
                        <p className="text-sm text-gray-500">{script.brandName} • {new Date(script.savedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setTeleprompterScript(script); setCurrentView('teleprompter'); }} className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition flex items-center gap-1"><Monitor className="w-4 h-4" />Teleprompter</button>
                        <button onClick={() => copyToClipboard(formatScript(script), script.id)} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition flex items-center gap-1">{copiedIndex === script.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}Copy</button>
                        <button onClick={() => deleteSavedScript(script.id)} className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="text-sm"><strong>Hook:</strong> {script.hook}</p>
                    <p className="text-sm"><strong>Script:</strong> {script.mainScript?.substring(0, 200)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Brand Info */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><User className="w-5 h-5 text-purple-600" />Brand Information</h2>
                  <div className="relative">
                    <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition text-sm">
                      <User className="w-4 h-4" />Profiles<ChevronDown className="w-3 h-3" />
                    </button>
                    {showProfileDropdown && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-56">
                        {brandProfiles.length === 0 ? <p className="p-3 text-sm text-gray-500">No profiles saved</p> : brandProfiles.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0">
                            <button onClick={() => loadProfile(p)} className="text-sm font-medium text-gray-700 flex-1 text-left">{p.name}</button>
                            <button onClick={() => deleteProfile(p.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Brand Name *</label>
                    <input type="text" value={businessInfo.brandName} onChange={e => setBusinessInfo({ ...businessInfo, brandName: e.target.value })} placeholder="e.g. FitPro Studio" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Niche / Industry *</label>
                    <input type="text" value={businessInfo.niche} onChange={e => setBusinessInfo({ ...businessInfo, niche: e.target.value })} placeholder="e.g. Fitness & Wellness" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Target Audience *</label>
                    <input type="text" value={businessInfo.targetAudience} onChange={e => setBusinessInfo({ ...businessInfo, targetAudience: e.target.value })} placeholder="e.g. Busy moms aged 25-45" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">What You Offer *</label>
                    <input type="text" value={businessInfo.offerings} onChange={e => setBusinessInfo({ ...businessInfo, offerings: e.target.value })} placeholder="e.g. 12-week online fitness program" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Info</label>
                    <textarea value={businessInfo.additionalInfo} onChange={e => setBusinessInfo({ ...businessInfo, additionalInfo: e.target.value })} placeholder="Any extra context, tone notes, promotions, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" rows={2} />
                  </div>
                </div>

                {/* Features */}
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Zap className="w-4 h-4 text-purple-500" />Product Features
                      <span className="ml-1 text-xs font-normal text-gray-400">(each gets its own script)</span>
                    </label>
                    <button onClick={addFeature} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition text-sm"><Plus className="w-3 h-3" />Add Feature</button>
                  </div>
                  <div className="space-y-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                        <input type="text" value={feature} onChange={e => updateFeature(idx, e.target.value)} placeholder={`Feature ${idx + 1} — e.g. "24/7 live chat support"`} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm" />
                        <button onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                  {features.filter(f => f.trim()).length > 0 && (
                    <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {features.filter(f => f.trim()).length} feature script{features.filter(f => f.trim()).length > 1 ? 's' : ''} will be generated
                    </p>
                  )}
                </div>

                {/* Save Profile */}
                <div className="mt-4 flex gap-2">
                  <input type="text" value={newProfileName} onChange={e => setNewProfileName(e.target.value)} placeholder="Profile name to save..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm" />
                  <button onClick={saveProfile} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm flex items-center gap-1"><Save className="w-4 h-4" />Save Profile</button>
                </div>
              </div>

              {/* Script Preferences */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Video className="w-5 h-5 text-purple-600" />Script Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Scripts</label>
                    <select value={scriptPrefs.numScripts} onChange={e => setScriptPrefs({ ...scriptPrefs, numScripts: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Script{n > 1 ? 's' : ''}{n === 5 ? ' (all styles)' : ''}</option>)}
                    </select>
                    {scriptPrefs.numScripts === 5 && <p className="text-xs text-purple-600 mt-1">✨ All 5 unique styles will be generated</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Video Length</label>
                    <select value={scriptPrefs.length} onChange={e => setScriptPrefs({ ...scriptPrefs, length: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                      <option value="15s">15 seconds</option>
                      <option value="30s">30 seconds</option>
                      <option value="60s">60 seconds</option>
                      <option value="90s">90 seconds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Platform</label>
                    <select value={scriptPrefs.platform} onChange={e => setScriptPrefs({ ...scriptPrefs, platform: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tone / Style</label>
                    <select value={scriptPrefs.tone} onChange={e => setScriptPrefs({ ...scriptPrefs, tone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                      <option value="engaging">Engaging</option>
                      <option value="direct">Direct</option>
                      <option value="playful">Playful</option>
                      <option value="funny">Funny</option>
                      <option value="motivational">Motivational</option>
                      <option value="calm">Calm</option>
                      <option value="bold">Bold</option>
                      <option value="romantic">Romantic</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">Include B-roll Suggestions</label>
                    <button onClick={() => setScriptPrefs({ ...scriptPrefs, includeBroll: !scriptPrefs.includeBroll })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${scriptPrefs.includeBroll ? 'bg-purple-600' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${scriptPrefs.includeBroll ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Template preview */}
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-semibold text-purple-700 mb-2">🎬 5 Distinct Script Styles:</p>
                    <div className="space-y-1">
                      {['🔥 Problem → Solution', '✨ Transformation Story', '🏆 Results & Social Proof', '⚡ Urgency & Limited Offer', '🎓 Educational Value Drop'].map((s, i) => (
                        <p key={i} className="text-xs text-purple-600">{s}</p>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={generateScripts}
                    disabled={isGenerating || !businessInfo.brandName || !businessInfo.niche}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (<><RefreshCw className="w-5 h-5 animate-spin" />Generating...</>) : (<><Sparkles className="w-5 h-5" />Generate Scripts</>)}
                  </button>
                  {scripts.length > 0 && !isGenerating && (
                    <p className="text-xs text-center text-gray-500">Hit Generate again for a completely different set ↑</p>
                  )}
                </div>
              </div>
            </div>

            {/* SCRIPTS OUTPUT */}
            {scripts.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Generated Scripts</h2>
                  <span className="text-sm text-gray-500">Generation #{generationCount} • {scripts.length} unique styles</span>
                </div>
                <div className="space-y-6">
                  {scripts.map((script, index) => {
                    const isEditing = editingScript && editingScript.scriptIndex === index;
                    return (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-xl font-bold text-purple-600">✏️ Editing: {editingScript.title}</h3>
                              <div className="flex gap-2">
                                <button onClick={saveEditedScript} className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition flex items-center gap-1"><Check className="w-4 h-4" />Save Changes</button>
                                <button onClick={cancelEditing} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">🪝 Hook</label>
                              <input type="text" value={editingScript.hook} onChange={e => updateEditingScript('hook', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">📝 Main Script</label>
                              <textarea value={editingScript.mainScript} onChange={e => updateEditingScript('mainScript', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" rows={5} />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">🎯 CTA</label>
                              <input type="text" value={editingScript.cta} onChange={e => updateEditingScript('cta', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">📱 Caption</label>
                              <textarea value={editingScript.caption} onChange={e => updateEditingScript('caption', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" rows={2} />
                            </div>
                            {editingScript.featureScripts?.length > 0 && (
                              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="text-xs font-bold text-purple-700 uppercase mb-3">✨ Feature Scripts (Editable)</div>
                                <div className="space-y-4">
                                  {editingScript.featureScripts.map((fs, fi) => (
                                    <div key={fi} className="bg-white rounded-lg p-3 border border-purple-100">
                                      <div className="text-sm font-bold text-purple-800 mb-2">Feature: {fs.feature}</div>
                                      <div className="space-y-2">
                                        <div><label className="text-xs text-gray-500 font-semibold block mb-1">Hook</label><input type="text" value={fs.hook} onChange={e => updateEditingFeatureScript(fi, 'hook', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-sm" /></div>
                                        <div><label className="text-xs text-gray-500 font-semibold block mb-1">Script</label><textarea value={fs.mainScript} onChange={e => updateEditingFeatureScript(fi, 'mainScript', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-sm" rows={3} /></div>
                                        <div><label className="text-xs text-gray-500 font-semibold block mb-1">CTA</label><input type="text" value={fs.cta} onChange={e => updateEditingFeatureScript(fi, 'cta', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-sm" /></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold text-purple-600">{script.title}</h3>
                              <div className="flex gap-2 flex-wrap justify-end">
                                <button onClick={() => saveScript(script)} className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition flex items-center gap-1"><Star className="w-4 h-4" />Save</button>
                                <button onClick={() => startEditing(script, index)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition flex items-center gap-1"><Edit2 className="w-4 h-4" />Edit</button>
                                <button onClick={() => { setTeleprompterScript(script); setCurrentView('teleprompter'); }} className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition flex items-center gap-1"><Monitor className="w-4 h-4" />Teleprompter</button>
                                <button onClick={() => copyToClipboard(formatScript(script), index)} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition flex items-center gap-1">{copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}Copy</button>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-1">🪝 Hook</div>
                                <p className="text-gray-800 font-medium">{script.hook}</p>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-1">📝 Script</div>
                                <p className="text-gray-700 whitespace-pre-line">{script.mainScript}</p>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-1">🎯 CTA</div>
                                <p className="text-gray-800 font-semibold">{script.cta}</p>
                              </div>

                              {script.featureScripts?.length > 0 && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                                  <div className="text-xs font-bold text-purple-700 uppercase mb-3 flex items-center gap-1"><Zap className="w-3 h-3" />Feature Scripts ({script.featureScripts.length})</div>
                                  <div className="space-y-3">
                                    {script.featureScripts.map((fs, fi) => (
                                      <div key={fi} className="bg-white/70 rounded-lg p-3 border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{fi + 1}</div>
                                          <div className="text-sm font-bold text-purple-900">{fs.feature}</div>
                                        </div>
                                        <div className="text-xs text-gray-600 mb-1"><span className="font-semibold text-purple-700">Hook:</span> {fs.hook}</div>
                                        <div className="text-xs text-gray-600 mb-1 whitespace-pre-line"><span className="font-semibold text-purple-700">Script:</span> {fs.mainScript}</div>
                                        <div className="text-xs text-gray-600"><span className="font-semibold text-purple-700">CTA:</span> {fs.cta}</div>
                                        <div className="flex justify-end mt-2">
                                          <button onClick={() => copyToClipboard(`HOOK: ${fs.hook}\nSCRIPT: ${fs.mainScript}\nCTA: ${fs.cta}`, `fs-${index}-${fi}`)} className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1">
                                            {copiedIndex === `fs-${index}-${fi}` ? <><Check className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {script.brollSuggestions?.length > 0 && (
                                <div>
                                  <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Camera className="w-3 h-3" />B-roll Suggestions</div>
                                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">{script.brollSuggestions.map((b, i) => <li key={i}>{b}</li>)}</ul>
                                </div>
                              )}

                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-1">📱 Caption</div>
                                <p className="text-gray-700 text-sm">{script.caption}</p>
                              </div>

                              {script.hashtags && (
                                <div>
                                  <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                    <Hash className="w-3 h-3" />Hashtags
                                    <button onClick={() => copyToClipboard(script.hashtags.join(' '), `hashtags-${index}`)} className="ml-2 text-purple-600 hover:text-purple-700">
                                      {copiedIndex === `hashtags-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                  <p className="text-sm text-purple-600">{script.hashtags.join(' ')}</p>
                                </div>
                              )}

                              {script.logoPrompt && (
                                <div className="border-t pt-3 mt-3">
                                  <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                    <Image className="w-3 h-3" />AI Logo/Visual Prompt
                                    <button onClick={() => copyToClipboard(script.logoPrompt, `logo-${index}`)} className="ml-2 text-purple-600 hover:text-purple-700">
                                      {copiedIndex === `logo-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100">{script.logoPrompt}</p>
                                  <p className="text-xs text-purple-600 mt-1">💡 Use in MidJourney, Google ImageFX, DALL-E, or Leonardo.ai</p>
                                </div>
                              )}

                              {script.musicPrompt && (
                                <div className="border-t pt-3 mt-3">
                                  <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                    <Music className="w-3 h-3" />Suno Music Prompt
                                    <button onClick={() => copyToClipboard(script.musicPrompt, `music-${index}`)} className="ml-2 text-purple-600 hover:text-purple-700">
                                      {copiedIndex === `music-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">{script.musicPrompt}</p>
                                  <p className="text-xs text-green-600 mt-1">🎵 Use in Suno.ai for perfect background music</p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
