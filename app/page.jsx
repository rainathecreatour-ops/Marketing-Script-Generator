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

  // Features as an array of strings
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
  // editingScript: { scriptIndex, hook, mainScript, caption, cta, title, featureScripts }
  const [editingScript, setEditingScript] = useState(null);
  const editingRef = useRef(editingScript);
  useEffect(() => { editingRef.current = editingScript; }, [editingScript]);

  const [usedVariationsByKey, setUsedVariationsByKey] = useState({});

  const [teleprompterScript, setTeleprompterScript] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('savedScripts');
    if (saved) setSavedScripts(JSON.parse(saved));
    const profiles = localStorage.getItem('brandProfiles');
    if (profiles) setBrandProfiles(JSON.parse(profiles));
  }, []);

  useEffect(() => { localStorage.setItem('savedScripts', JSON.stringify(savedScripts)); }, [savedScripts]);
  useEffect(() => { localStorage.setItem('brandProfiles', JSON.stringify(brandProfiles)); }, [brandProfiles]);

  useEffect(() => {
    let interval;
    if (isScrolling && teleprompterScript) {
      interval = setInterval(() => {
        setScrollPosition(prev => prev + scrollSpeed);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed, teleprompterScript]);

  // ---------- RNG HELPERS ----------
  const createRng = () => {
    let seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
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

  const normalizeKey = (s) => (s || '').toString().trim();

  const getVariationIndex = (key, variationsLength, rng) => {
    const used = usedVariationsByKey[key] || [];
    const available = [];
    for (let i = 0; i < variationsLength; i++) {
      if (!used.includes(i)) available.push(i);
    }
    return available.length > 0 ? pick(available, rng) : Math.floor(rng() * variationsLength);
  };

  const rememberVariation = (key, idx) => {
    setUsedVariationsByKey(prev => {
      const used = prev[key] ? [...prev[key]] : [];
      used.push(idx);
      const trimmed = used.length > 40 ? used.slice(used.length - 40) : used;
      return { ...prev, [key]: trimmed };
    });
  };

  // ---------- FEATURES ----------
  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (idx, val) => {
    const updated = [...features];
    updated[idx] = val;
    setFeatures(updated);
  };
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
  const saveProfile = () => {
    if (!newProfileName.trim()) { alert('Please enter a profile name'); return; }
    const profile = { id: Date.now(), name: newProfileName, ...businessInfo, featuresArr: features };
    setBrandProfiles([...brandProfiles, profile]);
    setNewProfileName('');
    alert('Profile "' + newProfileName + '" saved!');
  };

  const loadProfile = (profile) => {
    setBusinessInfo({
      brandName: profile.brandName || '',
      niche: profile.niche || '',
      targetAudience: profile.targetAudience || '',
      offerings: profile.offerings || '',
      features: profile.features || '',
      additionalInfo: profile.additionalInfo || ''
    });
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

  // ---------- RESET ----------
  const handleReset = () => {
    setBusinessInfo({ brandName: '', niche: '', targetAudience: '', offerings: '', features: '', additionalInfo: '' });
    setFeatures(['']);
    setScripts([]);
    setSelectedProfile(null);
    setEditingScript(null);
  };

  // ---------- SAVED SCRIPTS ----------
  const saveScript = (script) => {
    const scriptWithId = { ...script, id: Date.now(), savedAt: new Date().toISOString(), brandName: businessInfo.brandName };
    setSavedScripts([scriptWithId, ...savedScripts]);
    alert('Script saved!');
  };

  const deleteSavedScript = (id) => {
    if (confirm('Delete this saved script?')) setSavedScripts(savedScripts.filter(s => s.id !== id));
  };

  // ---------- HASHTAGS ----------
  const generateHashtags = (info, platform, rng) => {
    const baseHashtags = [
      `#${normalizeKey(info.niche).replace(/\s/g, '')}`,
      `#${normalizeKey(info.targetAudience).replace(/\s/g, '')}`,
      `#${platform}`, '#contentcreator', '#marketing'
    ];
    const nicheSpecific = {
      'fitness': ['#fitnessmotivation', '#workout', '#healthylifestyle', '#fitfam'],
      'tech': ['#technology', '#innovation', '#digital', '#techlife'],
      'beauty': ['#beautytips', '#skincare', '#makeup', '#beautycommunity'],
      'food': ['#foodie', '#cooking', '#recipe', '#foodporn'],
      'business': ['#entrepreneur', '#businesstips', '#success', '#hustle'],
      'fashion': ['#fashionista', '#style', '#ootd', '#fashionblogger']
    };
    const niche = (info.niche || '').toLowerCase();
    const additional = Object.keys(nicheSpecific).find(key => niche.includes(key));
    if (additional) baseHashtags.push(...shuffle(nicheSpecific[additional], rng).slice(0, 5));
    return [...new Set(baseHashtags)].slice(0, 10);
  };

  // ---------- ENHANCE ----------
  const enhanceBusinessInfo = (info, featuresArr) => {
    const summarize = (text) => {
      return (text || '').trim();
    };

    const nicheMap = {
      'fitness': 'health and fitness transformation', 'tech': 'cutting-edge technology solutions',
      'beauty': 'premium beauty and skincare excellence', 'food': 'culinary excellence',
      'business': 'entrepreneurial success and business growth', 'coaching': 'transformational coaching',
      'relationship': 'relationship growth and couples intimacy', 'couples': 'relationship growth and couples intimacy',
      'marketing': 'digital marketing mastery'
    };

    let nicheEnhanced = info.niche || '';
    for (const [key, value] of Object.entries(nicheMap)) {
      if ((info.niche || '').toLowerCase().includes(key)) { nicheEnhanced = value; break; }
    }

    const audienceMap = {
      'entrepreneur': 'ambitious entrepreneurs', 'couples': 'loving couples seeking deeper connection',
      'creator': 'passionate content creators', 'women': 'empowered women'
    };
    let audienceEnhanced = info.targetAudience || '';
    for (const [key, value] of Object.entries(audienceMap)) {
      if ((info.targetAudience || '').toLowerCase().includes(key)) { audienceEnhanced = value; break; }
    }

    const cleanedFeatures = (featuresArr || []).map(f => f.trim()).filter(f => f.length > 0);

    return {
      brandName: info.brandName,
      niche: nicheEnhanced,
      targetAudience: audienceEnhanced,
      offerings: summarize(info.offerings),
      features: cleanedFeatures,
      additionalInfo: info.additionalInfo
    };
  };

  // ---------- FEATURE SCRIPTS GENERATOR ----------
  const generateFeatureScripts = (enhancedInfo, tone, rng) => {
    if (!enhancedInfo.features || enhancedInfo.features.length === 0) return [];

    const hooksByTone = {
      engaging: ["Here's a feature people love:", "One thing that makes this different:", "Quick highlight:", "This part changes everything:", "People keep talking about this:"],
      direct: ["Feature highlight:", "Here's what you get:", "Built in:", "Included:", "This is part of it:"],
      playful: ["Okay, this part is SO good:", "Wait 'til you see this:", "The fun upgrade:", "Not gonna lie — this feature eats:", "This is the 'oh wow' moment:"],
      funny: ["Not to be dramatic but… this feature is everything:", "This feature understood the assignment:", "Chef's kiss:", "You're gonna love this:", "This is the main character:"],
      motivational: ["This feature helps you move faster:", "Built to help you win:", "Here's what makes progress easier:", "Designed for growth:", "Turns effort into results:"],
      calm: ["This makes things feel lighter:", "A gentle upgrade you'll appreciate:", "This removes the stress:", "Helps you stay consistent:", "Makes the process smoother:"],
      bold: ["This is the standard:", "This is why it hits different:", "Non-negotiable value:", "Power feature:", "This is what separates it:"],
      romantic: ["This brings the magic back:", "This is where the spark shows up:", "The feel-it-again feature:", "This creates the moment:", "Makes it unforgettable:"]
    };

    const bodyPacks = [
      (f, info) => `With ${info.brandName}, you don't just get promises — you get ${f}. Built to help ${info.targetAudience} get results with less guesswork.`,
      (f, info) => `${f} means you spend less time stuck and more time seeing progress. That's the real difference.`,
      (f, info) => `People love ${f} because it makes the whole experience smoother and more enjoyable — especially for ${info.targetAudience}.`,
      (f, info) => `This is one of those "finally" moments. ${f} is included so you get to the good part faster.`,
      (f, info) => `${f} is built in — because ${info.brandName} is designed for real people who want real results.`
    ];

    const ctaPacks = [
      "Want this feature? Tap the link in bio.",
      "If you want this included, check the link in bio.",
      "Try it today — link in bio.",
      "Ready to use this? Link in bio.",
      "Get access now — link in bio."
    ];

    const hookList = hooksByTone[tone] || hooksByTone.engaging;

    return enhancedInfo.features.map((feature, idx) => {
      const hook = hookList[idx % hookList.length];
      const body = bodyPacks[idx % bodyPacks.length](feature, enhancedInfo);
      const cta = ctaPacks[idx % ctaPacks.length];
      return {
        feature,
        hook,
        mainScript: `${hook} ${body}`,
        cta,
        musicPrompt: generateMusicPrompt(enhancedInfo, 'featureSpotlight', tone)
      };
    });
  };

  const generateLogoPrompt = (info, rng) => {
    const styles = ['minimalist modern logo', 'bold geometric design', 'elegant typography-based logo', 'abstract symbol with negative space', 'vibrant gradient logo', 'professional corporate identity', 'playful illustrative logo', 'luxury premium branding', 'tech-inspired futuristic design', 'hand-drawn artistic logo'];
    const moods = ['sophisticated and trustworthy', 'energetic and dynamic', 'calm and serene', 'bold and confident', 'warm and inviting', 'sleek and modern', 'fun and approachable', 'powerful and authoritative', 'creative and unique', 'elegant and refined'];
    return `${pick(styles, rng)} for ${info.brandName}, a ${info.niche} brand. ${pick(moods, rng)} aesthetic. Professional, scalable vector design. Color scheme should reflect ${info.niche} industry. Clean, memorable, and versatile for digital and print use.`;
  };

  const generateMusicPrompt = (info, scriptType, tone) => {
    const musicStyles = {
      problemSolution: {
        playful: 'upbeat indie pop with bouncy synths, playful guitar riffs, 120 BPM',
        funny: 'quirky comedy music with pizzicato strings, xylophone accents, 125 BPM',
        romantic: 'soft acoustic ballad with gentle piano, warm strings, 80 BPM',
        direct: 'confident electronic beat with driving bass, assertive energy, 115 BPM',
        motivational: 'inspiring cinematic music with building strings, epic drums, 100 BPM',
        calm: 'ambient meditation music with soft pads, gentle chimes, 70 BPM',
        bold: 'powerful rock anthem with electric guitars, strong drums, 130 BPM',
        engaging: 'modern pop production with catchy hooks, smooth bassline, 110 BPM'
      },
      featureSpotlight: {
        playful: 'bright commercial pop with ukulele, hand claps, 118 BPM',
        funny: 'goofy novelty music with playful percussion, 122 BPM',
        direct: 'clean corporate motivational bed with piano, 105 BPM',
        motivational: 'uplifting cinematic build, 95 BPM',
        engaging: 'trendy social media pop instrumental, 120 BPM'
      }
    };
    const base = musicStyles[scriptType]?.[tone] || musicStyles.problemSolution?.[tone] || 'upbeat modern music, 120 BPM';
    return `${base}. Perfect for ${info.niche} content targeting ${info.targetAudience}. Commercial quality, royalty-free style.`;
  };

  // ---------- SCRIPT TEMPLATES ----------
  const scriptTemplates = {
    problemSolution: {
      title: "Problem → Solution Format",
      hookVariations: (info, tone) => {
        const hooks = {
          playful: [`Let's be real — ${info.niche.toLowerCase()} can get boring. Sound familiar?`, `Okay so… ${info.niche.toLowerCase()} isn't exactly thrilling right now, is it?`, `Hot take: your ${info.niche.toLowerCase()} life could use a serious upgrade.`, `Can we talk about how ${info.niche.toLowerCase()} has gotten so predictable?`, `Nobody wants to admit it, but ${info.niche.toLowerCase()} has become kind of… meh.`],
          direct: [`Here's the truth about ${info.niche.toLowerCase()} that nobody talks about.`, `Let me be straight with you about ${info.niche.toLowerCase()}.`, `The reality of ${info.niche.toLowerCase()}? It's not what you think.`, `I'm going to say what everyone's thinking about ${info.niche.toLowerCase()}.`, `There's a problem with ${info.niche.toLowerCase()} — and it's time we address it.`],
          funny: [`Confession: your ${info.niche.toLowerCase()} situation needs help. Don't @ me.`, `Raise your hand if your ${info.niche.toLowerCase()} game is… questionable. 🙋`, `We need to talk about the elephant in the room: ${info.niche.toLowerCase()}.`, `Plot twist: ${info.niche.toLowerCase()} doesn't have to be this painful.`, `If ${info.niche.toLowerCase()} was a report card… what grade would it get?`],
          motivational: [`What if struggling with ${info.niche.toLowerCase()} doesn't have to be your reality?`, `Imagine if ${info.niche.toLowerCase()} could actually be enjoyable. It's possible.`, `You deserve better than what ${info.niche.toLowerCase()} has been giving you.`, `There's a version of you thriving in ${info.niche.toLowerCase()}. Let's get you there.`, `${info.niche.toLowerCase()} transformation starts with one decision. This could be it.`],
          calm: [`If you've been feeling stuck with ${info.niche.toLowerCase()}, you're not alone.`, `It's okay to admit ${info.niche.toLowerCase()} hasn't been working for you.`, `Many people struggle with ${info.niche.toLowerCase()}. Here's what actually helps.`, `Feeling overwhelmed by ${info.niche.toLowerCase()}? There's a simpler way.`, `You don't have to force ${info.niche.toLowerCase()} to work. Let me show you.`],
          engaging: [`Struggling with ${info.niche.toLowerCase()}? You're not alone.`, `Most people get ${info.niche.toLowerCase()} wrong. Here's why.`, `There's a better way to approach ${info.niche.toLowerCase()}.`, `If ${info.niche.toLowerCase()} feels hard, you're doing it the hard way.`, `What if ${info.niche.toLowerCase()} could be easier than you think?`],
          bold: [`Stop settling for mediocre ${info.niche.toLowerCase()}. Period.`, `You're better than this ${info.niche.toLowerCase()} situation.`, `Enough excuses. Your ${info.niche.toLowerCase()} needs to change now.`, `Mediocre ${info.niche.toLowerCase()}? Not on my watch.`, `Time to stop accepting less in your ${info.niche.toLowerCase()}.`],
          romantic: [`Remember when ${info.niche.toLowerCase()} used to excite you? Let's bring that back.`, `There was a time when ${info.niche.toLowerCase()} made your heart race. You can have that again.`, `What if ${info.niche.toLowerCase()} could feel magical again?`, `The spark in your ${info.niche.toLowerCase()} isn't gone — it's waiting.`, `Imagine ${info.niche.toLowerCase()} that makes you feel alive again.`]
        };
        return hooks[tone] || hooks.engaging;
      },
      getHook: (info, tone, variationIndex) => {
        const list = scriptTemplates.problemSolution.hookVariations(info, tone);
        return list[variationIndex % list.length];
      },
      getScript: (info, length, tone, variationIndex) => {
        const openers = {
          engaging: ["Here's the thing:", "Real talk:", "Quick question:", "Let me be honest:", "Okay, listen:"],
          direct: ["Bottom line:", "Here's the deal:", "Straight up:", "No sugarcoating:", "Simple:"],
          playful: ["Okay bestie:", "Not gonna lie:", "Alright, quick vibe check:", "Okay so:", "Hear me out:"],
          funny: ["Not me saying this but…", "Listen… I'm dead serious 😭", "Okay, story time:", "No because why is it like this?", "Be so for real:"],
          motivational: ["You deserve better:", "This is your moment:", "You can change this:", "Let's level up:", "You're closer than you think:"],
          calm: ["Take a breath:", "No pressure:", "You're doing fine:", "Let's simplify this:", "It's okay:"],
          bold: ["Enough:", "Stop playing small:", "Let's go:", "This is the standard:", "Make the move:"],
          romantic: ["Imagine this:", "Close your eyes:", "Remember this feeling:", "Let's bring it back:", "Picture this:"]
        };
        const transitions = ["And that's why", "Which is exactly why", "So here's what I recommend:", "Here's the upgrade:", "That's where we come in:"];
        const closerBeats = ["Try it once and you'll feel the difference.", "This is the easiest way to get results faster.", "It's simple, it's effective, and it works.", "If you've been waiting for a sign—this is it.", "You'll wonder how you did it without it."];
        const opener = (openers[tone] || openers.engaging)[variationIndex % (openers[tone] || openers.engaging).length];
        const transition = transitions[variationIndex % transitions.length];
        const closer = closerBeats[(variationIndex + 2) % closerBeats.length];
        if (tone === 'direct') return `${opener} ${info.targetAudience} need better ${info.niche.toLowerCase()} results. ${transition} ${info.brandName}. We offer ${info.offerings}. ${closer}`;
        if (tone === 'playful') return `${opener} ${info.niche.toLowerCase()} shouldn't feel like a chore. ${transition} ${info.brandName}. We offer ${info.offerings}. ${closer}`;
        if (tone === 'funny') return `${opener} you thought ${info.niche.toLowerCase()} would be easy. LOL. ${transition} ${info.brandName}. We offer ${info.offerings}. ${closer}`;
        if (tone === 'motivational') return `${opener} you can win in ${info.niche.toLowerCase()}. ${transition} ${info.brandName}. We offer ${info.offerings}. ${closer}`;
        if (tone === 'calm') return `${opener} ${info.niche.toLowerCase()} doesn't have to be stressful. ${transition} ${info.brandName}. We offer ${info.offerings}. ${closer}`;
        if (tone === 'bold') return `${opener} stop accepting mediocre ${info.niche.toLowerCase()}. ${transition} ${info.brandName}. We offer ${info.offerings}. ${closer}`;
        if (tone === 'romantic') return `${opener} there's something special about ${info.niche.toLowerCase()} when done right. ${transition} ${info.brandName}. We offer ${info.offerings}. ${closer}`;
        return `${opener} if ${info.niche.toLowerCase()} feels hard, you're not alone. ${transition} ${info.brandName}. We offer ${info.offerings}. What makes us different? ${closer}`;
      },
      getCTA: (info) => `Ready to transform your ${info.niche.toLowerCase()}? Check the link in bio!`,
      getBrollKeywords: (info) => [`${info.niche} problem`, `frustrated ${info.targetAudience}`, `${info.niche} solution`, `happy customer success`]
    }
  };

  const fetchPexelsVideos = async (keywords) => {
    try {
      const responses = await Promise.all(
        keywords.map(keyword =>
          fetch(`/api/pexels?query=${encodeURIComponent(keyword)}`)
            .then(res => res.ok ? res.json() : null).catch(() => null)
        )
      );
      const videos = responses.filter(data => data?.videos?.length > 0)
        .flatMap(data => data.videos.slice(0, 2)).slice(0, 4)
        .map(video => ({ description: video.url ? `Video: ${video.url.split('/')[4] || 'Pexels video'}` : 'Pexels video', url: video.video_files?.[0]?.link || video.url, thumbnail: video.image }));
      return videos.length > 0 ? videos : null;
    } catch { return null; }
  };

  const generateBrollSuggestions = (info) => [
    `${info.targetAudience} working at desk, focused`,
    `Close-up of ${info.niche} related activity`,
    `Person having 'aha moment' or celebrating`,
    `${info.brandName} product/service in action`
  ];

  // ---------- GENERATE ----------
  const generateScripts = async () => {
    setIsGenerating(true);
    setScripts([]);
    setEditingScript(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const rng = createRng();
      const enhancedInfo = enhanceBusinessInfo(businessInfo, features);
      const templateKeys = shuffle(Object.keys(scriptTemplates), rng);
      const selectedTemplates = [];
      for (let i = 0; i < scriptPrefs.numScripts; i++) {
        const key = templateKeys[i % templateKeys.length];
        selectedTemplates.push({ key, template: scriptTemplates[key] });
      }

      const featureScripts = generateFeatureScripts(enhancedInfo, scriptPrefs.tone, rng);

      const generatedScripts = await Promise.all(selectedTemplates.map(async (item, index) => {
        const template = item.template;
        const historyKey = `${item.key}-${scriptPrefs.tone}-${scriptPrefs.length}`;
        const hookList = template.hookVariations(enhancedInfo, scriptPrefs.tone);
        const variationIndex = getVariationIndex(historyKey, hookList.length, rng);
        rememberVariation(historyKey, variationIndex);

        let brollSuggestions = [];
        let pexelsVideos = null;
        if (scriptPrefs.includeBroll) {
          brollSuggestions = generateBrollSuggestions(enhancedInfo);
          pexelsVideos = await fetchPexelsVideos(template.getBrollKeywords(enhancedInfo));
        }

        const hashtags = generateHashtags(businessInfo, scriptPrefs.platform, rng);
        const logoPrompt = generateLogoPrompt(enhancedInfo, rng);
        const musicPrompt = generateMusicPrompt(enhancedInfo, item.key, scriptPrefs.tone);

        return {
          title: template.title,
          hook: template.getHook(enhancedInfo, scriptPrefs.tone, variationIndex),
          mainScript: template.getScript(enhancedInfo, scriptPrefs.length, scriptPrefs.tone, variationIndex),
          brollSuggestions,
          pexelsVideos,
          caption: `${enhancedInfo.brandName} — Perfect for ${enhancedInfo.targetAudience} in ${enhancedInfo.niche}. 🚀`,
          hashtags,
          cta: template.getCTA(enhancedInfo),
          logoPrompt,
          musicPrompt,
          featureScripts
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
    let formatted = `🎬 ${script.title}\n\n🪝 HOOK:\n${script.hook}\n\n📝 SCRIPT:\n${script.mainScript}\n\n`;
    if (script.featureScripts?.length > 0) {
      formatted += `✨ FEATURE SCRIPTS:\n${script.featureScripts.map((fs, i) => `${i + 1}. FEATURE: ${fs.feature}\nHOOK: ${fs.hook}\nSCRIPT: ${fs.mainScript}\nCTA: ${fs.cta}\n`).join('\n')}\n\n`;
    }
    if (script.brollSuggestions?.length > 0) formatted += `🎥 B-ROLL SUGGESTIONS:\n${script.brollSuggestions.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\n`;
    formatted += `📱 CAPTION:\n${script.caption}\n\n🏷️ HASHTAGS:\n${script.hashtags?.join(' ') || ''}\n\n🎯 CTA:\n${script.cta}\n\n🎨 LOGO PROMPT:\n${script.logoPrompt}\n\n🎵 MUSIC PROMPT:\n${script.musicPrompt}`;
    return formatted;
  };

  // ---------- EDITING — FIXED ----------
  // We use a completely separate editing state that does NOT get cleared by re-renders
  const startEditing = (script, index) => {
    setEditingScript({ ...script, scriptIndex: index });
  };

  const updateEditingScript = (field, value) => {
    setEditingScript(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const updateEditingFeatureScript = (featureIdx, field, value) => {
    setEditingScript(prev => {
      if (!prev) return prev;
      const updatedFeatureScripts = prev.featureScripts.map((fs, i) =>
        i === featureIdx ? { ...fs, [field]: value } : fs
      );
      return { ...prev, featureScripts: updatedFeatureScripts };
    });
  };

  const saveEditedScript = () => {
    const current = editingRef.current;
    if (!current || current.scriptIndex === null || current.scriptIndex === undefined) {
      setEditingScript(null);
      return;
    }
    setScripts(prev => prev.map((s, i) => {
      if (i !== current.scriptIndex) return s;
      return {
        ...s,
        hook: current.hook,
        mainScript: current.mainScript,
        caption: current.caption,
        cta: current.cta,
        featureScripts: current.featureScripts
      };
    }));
    setEditingScript(null);
  };

  const cancelEditing = () => setEditingScript(null);

  // ---------- LICENSE SCREEN ----------
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
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
            <div className="flex items-center gap-2">
              <label className="text-sm">Speed:</label>
              <input type="range" min="1" max="5" value={scrollSpeed} onChange={(e) => setScrollSpeed(parseInt(e.target.value))} className="w-24" />
            </div>
            <button onClick={() => setIsScrolling(!isScrolling)} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
              {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isScrolling ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => { setTeleprompterScript(null); setCurrentView('generate'); setScrollPosition(0); setIsScrolling(false); }} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2">
              <X className="w-4 h-4" /> Exit
            </button>
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="w-8 h-8" />Marketing Script Generator</h1>
              <p className="text-purple-100 mt-1">AI-powered scripts for your brand</p>
            </div>
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"><RefreshCw className="w-4 h-4" />Reset All</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentView('generate')} className={`px-4 py-2 rounded-lg transition ${currentView === 'generate' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'}`}>Generate Scripts</button>
            <button onClick={() => setCurrentView('saved')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${currentView === 'saved' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'}`}><Save className="w-4 h-4" />Saved Scripts ({savedScripts.length})</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* SAVED VIEW */}
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
            {/* FORM */}
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

                {/* ✨ FEATURES SECTION */}
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Zap className="w-4 h-4 text-purple-500" />
                      Product Features
                      <span className="ml-1 text-xs font-normal text-gray-400">(each gets its own script)</span>
                    </label>
                    <button onClick={addFeature} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition text-sm">
                      <Plus className="w-3 h-3" />Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                        <input
                          type="text"
                          value={feature}
                          onChange={e => updateFeature(idx, e.target.value)}
                          placeholder={`Feature ${idx + 1} — e.g. "24/7 live chat support"`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                        />
                        <button onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
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
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Script{n > 1 ? 's' : ''}</option>)}
                    </select>
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
                  <button
                    onClick={generateScripts}
                    disabled={isGenerating || !businessInfo.brandName || !businessInfo.niche}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (<><RefreshCw className="w-5 h-5 animate-spin" />Generating...</>) : (<><Sparkles className="w-5 h-5" />Generate Scripts</>)}
                  </button>
                </div>
              </div>
            </div>

            {/* SCRIPTS OUTPUT */}
            {scripts.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Generated Scripts</h2>
                <div className="space-y-6">
                  {scripts.map((script, index) => {
                    const isEditing = editingScript && editingScript.scriptIndex === index;

                    return (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                        {isEditing ? (
                          /* ---- EDIT MODE ---- */
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
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">📱 Caption</label>
                              <textarea value={editingScript.caption} onChange={e => updateEditingScript('caption', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" rows={2} />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">🎯 CTA</label>
                              <input type="text" value={editingScript.cta} onChange={e => updateEditingScript('cta', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500" />
                            </div>

                            {/* Editable Feature Scripts */}
                            {editingScript.featureScripts && editingScript.featureScripts.length > 0 && (
                              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="text-xs font-bold text-purple-700 uppercase mb-3">✨ Feature Scripts (Editable)</div>
                                <div className="space-y-4">
                                  {editingScript.featureScripts.map((fs, fi) => (
                                    <div key={fi} className="bg-white rounded-lg p-3 border border-purple-100">
                                      <div className="text-sm font-bold text-purple-800 mb-2">Feature: {fs.feature}</div>
                                      <div className="space-y-2">
                                        <div>
                                          <label className="text-xs text-gray-500 font-semibold block mb-1">Hook</label>
                                          <input type="text" value={fs.hook} onChange={e => updateEditingFeatureScript(fi, 'hook', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-sm" />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-500 font-semibold block mb-1">Script</label>
                                          <textarea value={fs.mainScript} onChange={e => updateEditingFeatureScript(fi, 'mainScript', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-sm" rows={3} />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-500 font-semibold block mb-1">CTA</label>
                                          <input type="text" value={fs.cta} onChange={e => updateEditingFeatureScript(fi, 'cta', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-sm" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* ---- VIEW MODE ---- */
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

                              {/* Feature Scripts */}
                              {script.featureScripts && script.featureScripts.length > 0 && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                                  <div className="text-xs font-bold text-purple-700 uppercase mb-3 flex items-center gap-1">
                                    <Zap className="w-3 h-3" />Feature Scripts ({script.featureScripts.length})
                                  </div>
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

                              {script.pexelsVideos?.length > 0 && (
                                <div>
                                  <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Video className="w-3 h-3" />Pexels Video B-roll</div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {script.pexelsVideos.map((video, i) => (
                                      <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="relative group block rounded-lg overflow-hidden border border-gray-200 hover:border-purple-400 transition">
                                        <img src={video.thumbnail} alt={video.description} className="w-full h-24 object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition"><Video className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" /></div>
                                      </a>
                                    ))}
                                  </div>
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

                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-1">🎯 CTA</div>
                                <p className="text-gray-800 font-semibold">{script.cta}</p>
                              </div>

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
