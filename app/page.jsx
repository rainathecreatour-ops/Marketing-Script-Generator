'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Lock, Copy, Check, RefreshCw, Video, Save, Edit2, User, Hash, Monitor, ChevronDown, Star, Play, Pause, X, Plus, Trash2, Image, Music } from 'lucide-react';

export default function MarketingScriptGenerator() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [currentView, setCurrentView] = useState('generate');

  const [brandProfiles, setBrandProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const [businessInfo, setBusinessInfo] = useState({
    brandName: '',
    niche: '',
    targetAudience: '',
    offerings: '',
    uniqueValue: '',
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
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);

  // NEW: Track used variations per “template-tone-length” so we rotate properly
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

  useEffect(() => {
    localStorage.setItem('savedScripts', JSON.stringify(savedScripts));
  }, [savedScripts]);

  useEffect(() => {
    localStorage.setItem('brandProfiles', JSON.stringify(brandProfiles));
  }, [brandProfiles]);

  useEffect(() => {
    let interval;
    if (isScrolling && teleprompterScript) {
      interval = setInterval(() => {
        setScrollPosition(prev => prev + scrollSpeed);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed, teleprompterScript]);

  // ---------- HELPERS (NEW) ----------
  const createRng = () => {
    // lightweight deterministic-ish RNG seeded per generation click
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

  // rotate variations without repeating too soon
  const getVariationIndex = (key, variationsLength, rng) => {
    const used = usedVariationsByKey[key] || [];
    const available = [];
    for (let i = 0; i < variationsLength; i++) {
      if (!used.includes(i)) available.push(i);
    }
    const idx = available.length > 0 ? pick(available, rng) : Math.floor(rng() * variationsLength);
    return idx;
  };

  const rememberVariation = (key, idx, maxKeep = 40) => {
    setUsedVariationsByKey(prev => {
      const used = prev[key] ? [...prev[key]] : [];
      used.push(idx);
      // keep list bounded to avoid memory growth
      const trimmed = used.length > maxKeep ? used.slice(used.length - maxKeep) : used;
      return { ...prev, [key]: trimmed };
    });
  };

  // ---------- LICENSE ----------
  const handleLicenseSubmit = () => {
    if (licenseKey.length >= 10) {
      setIsUnlocked(true);
    } else {
      alert('Invalid license key. Please enter a valid key.');
    }
  };

  // ---------- PROFILES ----------
  const saveProfile = () => {
    if (!newProfileName.trim()) {
      alert('Please enter a profile name');
      return;
    }

    const profile = {
      id: Date.now(),
      name: newProfileName,
      ...businessInfo
    };

    setBrandProfiles([...brandProfiles, profile]);
    setNewProfileName('');
    alert('Profile "' + newProfileName + '" saved!');
  };

  const loadProfile = (profile) => {
    setBusinessInfo({
      brandName: profile.brandName,
      niche: profile.niche,
      targetAudience: profile.targetAudience,
      offerings: profile.offerings,
      uniqueValue: profile.uniqueValue,
      features: profile.features || '',
      additionalInfo: profile.additionalInfo
    });
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
    setBusinessInfo({
      brandName: '',
      niche: '',
      targetAudience: '',
      offerings: '',
      uniqueValue: '',
      features: '',
      additionalInfo: ''
    });
    setScripts([]);
    setSelectedProfile(null);
    setEditingScript(null);
  };

  // ---------- SAVED SCRIPTS ----------
  const saveScript = (script) => {
    const scriptWithId = {
      ...script,
      id: Date.now(),
      savedAt: new Date().toISOString(),
      brandName: businessInfo.brandName
    };
    setSavedScripts([scriptWithId, ...savedScripts]);
    alert('Script saved!');
  };

  const deleteSavedScript = (id) => {
    if (confirm('Delete this saved script?')) {
      setSavedScripts(savedScripts.filter(s => s.id !== id));
    }
  };

  // ---------- HASHTAGS ----------
  const generateHashtags = (info, platform, rng) => {
    const baseHashtags = [
      `#${normalizeKey(info.niche).replace(/\s/g, '')}`,
      `#${normalizeKey(info.targetAudience).replace(/\s/g, '')}`,
      `#${platform}`,
      '#contentcreator',
      '#marketing'
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

    if (additional) {
      baseHashtags.push(...shuffle(nicheSpecific[additional], rng).slice(0, 5));
    }

    return [...new Set(baseHashtags)].slice(0, 10);
  };

  // ---------- ENHANCER ----------
  const enhanceBusinessInfo = (info) => {
    const brandEnhanced = info.brandName;

    const summarizeNiche = (text) => {
      if (!text) return '';
      if (text.length > 50) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('game') && lowerText.includes('couples')) {
          return 'couples games and relationship activities';
        }
        if (lowerText.includes('course')) return 'educational courses';
        if (lowerText.includes('coaching')) return 'coaching services';
        if (lowerText.includes('consulting')) return 'consulting services';
        return text.split(' ').slice(0, 5).join(' ');
      }
      return text;
    };

    const summarizeAudience = (text) => {
      if (!text) return '';
      if (text.length > 50) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('couples')) return 'couples';
        if (lowerText.includes('entrepreneur')) return 'entrepreneurs';
        if (lowerText.includes('business')) return 'business owners';
        if (lowerText.includes('creator')) return 'content creators';
        return text.split(' ').slice(0, 4).join(' ');
      }
      return text;
    };

    const summarizeOfferings = (text) => {
      if (!text) return '';
      if (text.length > 150) {
        const low = text.toLowerCase();
        if (low.includes('game') && low.includes('couples')) {
          return 'interactive couples game with intimate questions, playful dares, and spicy challenges';
        }
        if (low.includes('course') || low.includes('program')) {
          return 'comprehensive transformation program with step-by-step guidance';
        }
        if (low.includes('ebook') || low.includes('guide')) {
          return 'actionable guide with proven strategies and frameworks';
        }
        if (low.includes('service') || low.includes('consulting')) {
          return 'premium done-for-you service with expert support';
        }
        if (low.includes('software') || low.includes('app') || low.includes('tool')) {
          return 'powerful digital solution that simplifies your workflow';
        }
        const sentences = text.split('.').filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
          const firstSentence = sentences[0].trim();
          if (firstSentence.length > 100) return firstSentence.substring(0, 100) + '...';
          return firstSentence;
        }
      }
      return text;
    };

    const summarizeValue = (text) => {
      if (!text) return '';
      if (text.length > 100) {
        const sentences = text.split('.').filter(s => s.trim().length > 0);
        if (sentences.length > 0) return sentences[0].trim();
        return text.substring(0, 80) + '...';
      }
      return text;
    };

    const nicheBase = summarizeNiche(info.niche);
    const audienceBase = summarizeAudience(info.targetAudience);
    const offeringsBase = summarizeOfferings(info.offerings);
    const valueBase = summarizeValue(info.uniqueValue);

    const nicheMap = {
      'fitness': 'health and fitness transformation',
      'workout': 'fitness excellence and body transformation',
      'gym': 'strength training and athletic performance',
      'yoga': 'wellness and mindful movement',
      'tech': 'cutting-edge technology solutions',
      'software': 'innovative software and digital tools',
      'app': 'mobile innovation and digital experiences',
      'saas': 'cloud-based business solutions',
      'beauty': 'premium beauty and skincare excellence',
      'makeup': 'beauty artistry and cosmetic mastery',
      'skincare': 'skin health and radiant beauty',
      'haircare': 'hair transformation and styling excellence',
      'food': 'culinary excellence and gourmet experiences',
      'business': 'entrepreneurial success and business growth',
      'entrepreneur': 'business innovation and startup success',
      'marketing': 'digital marketing mastery and brand growth',
      'sales': 'sales excellence and revenue growth',
      'coaching': 'transformational coaching and personal development',
      'consulting': 'expert consulting and strategic guidance',
      'therapy': 'mental wellness and emotional healing',
      'mindset': 'mindset mastery and personal growth',
      'education': 'educational excellence and skill development',
      'course': 'online education and expert training',
      'finance': 'financial freedom and wealth building',
      'money': 'financial mastery and prosperity',
      'relationship': 'relationship growth and couples intimacy',
      'dating': 'romantic success and meaningful connections',
      'couples': 'relationship growth and couples intimacy',
      'parenting': 'parenting mastery and family harmony',
      'productivity': 'peak performance and productivity mastery',
      'youtube': 'YouTube growth and video content mastery',
      'tiktok': 'TikTok virality and short-form content success',
      'instagram': 'Instagram growth and visual storytelling'
    };

    let nicheEnhanced = nicheBase;
    for (const [key, value] of Object.entries(nicheMap)) {
      if ((nicheBase || '').toLowerCase().includes(key)) {
        nicheEnhanced = value;
        break;
      }
    }

    const audienceMap = {
      'entrepreneur': 'ambitious entrepreneurs and business visionaries',
      'business owner': 'successful business owners and industry leaders',
      'professional': 'forward-thinking professionals and career achievers',
      'creator': 'passionate content creators and digital influencers',
      'women': 'empowered women seeking excellence',
      'moms': 'busy moms balancing life and ambition',
      'couples': 'loving couples seeking deeper connection',
      'students': 'motivated students and lifelong learners'
    };

    let audienceEnhanced = audienceBase;
    for (const [key, value] of Object.entries(audienceMap)) {
      if ((audienceBase || '').toLowerCase().includes(key)) {
        audienceEnhanced = value;
        break;
      }
    }
    if (audienceEnhanced === audienceBase && (audienceBase || '').length < 50 && audienceBase) {
      audienceEnhanced = `motivated ${audienceBase} ready for transformation`;
    }

    const uniqueValueEnhanced = valueBase && valueBase.length > 80
      ? valueBase
      : `${valueBase || ''}${valueBase ? ' - proven by thousands of satisfied customers' : ''}`;

    const additionalContext = info.additionalInfo ? ` ${info.additionalInfo}` : '';

    const processFeatures = (featuresText) => {
      if (!featuresText || featuresText.trim().length === 0) return [];

      const featureLines = featuresText
        .split(/\n|•|-/)
        .map(f => f.trim())
        .filter(f => f.length > 0);

      return featureLines.map(feature => {
        const cleanFeature = feature.replace(/^\d+\.?\s*/, '').trim();
        const benefitPhrases = ['Experience', 'Enjoy', 'Get access to', 'Unlock', 'Discover', 'Benefit from'];
        // marketing line will be randomized later during script generation
        return { original: cleanFeature, marketing: cleanFeature };
      });
    };

    const featuresProcessed = processFeatures(info.features);

    return {
      brandName: brandEnhanced,
      niche: nicheEnhanced,
      targetAudience: audienceEnhanced,
      offerings: offeringsBase,
      uniqueValue: uniqueValueEnhanced + additionalContext,
      features: featuresProcessed,
      additionalInfo: info.additionalInfo
    };
  };

  const generateLogoPrompt = (info, rng) => {
    const styles = [
      'minimalist modern logo',
      'bold geometric design',
      'elegant typography-based logo',
      'abstract symbol with negative space',
      'vibrant gradient logo',
      'professional corporate identity',
      'playful illustrative logo',
      'luxury premium branding',
      'tech-inspired futuristic design',
      'hand-drawn artistic logo'
    ];

    const moods = [
      'sophisticated and trustworthy',
      'energetic and dynamic',
      'calm and serene',
      'bold and confident',
      'warm and inviting',
      'sleek and modern',
      'fun and approachable',
      'powerful and authoritative',
      'creative and unique',
      'elegant and refined'
    ];

    const randomStyle = pick(styles, rng);
    const randomMood = pick(moods, rng);

    return `${randomStyle} for ${info.brandName}, a ${info.niche} brand. ${randomMood} aesthetic. Professional, scalable vector design. Color scheme should reflect ${info.niche} industry. Clean, memorable, and versatile for digital and print use.`;
  };

  const generateMusicPrompt = (info, scriptType, tone) => {
    const musicStyles = {
      problemSolution: {
        playful: 'upbeat indie pop with bouncy synths, playful guitar riffs, 120 BPM, fun and lighthearted',
        funny: 'quirky comedy music with pizzicato strings, xylophone accents, comedic timing, 125 BPM',
        romantic: 'soft acoustic ballad with gentle piano, warm strings, intimate vocals, 80 BPM',
        direct: 'confident electronic beat with driving bass, clear melody, assertive energy, 115 BPM',
        motivational: 'inspiring cinematic music with building strings, epic drums, triumphant horns, 100 BPM',
        calm: 'ambient meditation music with soft pads, gentle chimes, peaceful atmosphere, 70 BPM',
        bold: 'powerful rock anthem with electric guitars, strong drums, confident energy, 130 BPM',
        engaging: 'modern pop production with catchy hooks, smooth bassline, energetic feel, 110 BPM'
      },
      featureSpotlight: {
        playful: 'bright commercial pop with ukulele, hand claps, cheerful whistling, 118 BPM',
        funny: 'goofy novelty music with playful percussion, quirky melody, 122 BPM',
        romantic: 'smooth R&B instrumental with warm chords, soft groove, 90 BPM',
        direct: 'clean corporate motivational bed with piano and light strings, 105 BPM',
        motivational: 'uplifting cinematic build with inspiring progression, 95 BPM',
        calm: 'soft ambient lo-fi with gentle textures, 70 BPM',
        bold: 'confident hip-hop beat with heavy bass, sharp hats, 130 BPM',
        engaging: 'trendy social media pop instrumental with catchy hook, 120 BPM'
      }
    };

    const basePrompt =
      musicStyles[scriptType]?.[tone] ||
      musicStyles.problemSolution?.[tone] ||
      'upbeat modern music, 120 BPM';

    return `${basePrompt}. Perfect for ${info.niche} content targeting ${info.targetAudience}. Commercial quality, royalty-free style.`;
  };

  const scriptTemplates = {
    problemSolution: {
      title: "Problem → Solution Format",
      hookVariations: (info, tone) => {
        const hookVariations = {
          playful: [
            `Let's be real — ${info.niche.toLowerCase()} can get boring. Sound familiar?`,
            `Okay so… ${info.niche.toLowerCase()} isn't exactly thrilling right now, is it?`,
            `Hot take: your ${info.niche.toLowerCase()} life could use a serious upgrade.`,
            `Can we talk about how ${info.niche.toLowerCase()} has gotten so predictable?`,
            `Nobody wants to admit it, but ${info.niche.toLowerCase()} has become kind of… meh.`
          ],
          direct: [
            `Here's the truth about ${info.niche.toLowerCase()} that nobody talks about.`,
            `Let me be straight with you about ${info.niche.toLowerCase()}.`,
            `The reality of ${info.niche.toLowerCase()}? It's not what you think.`,
            `I'm going to say what everyone's thinking about ${info.niche.toLowerCase()}.`,
            `There's a problem with ${info.niche.toLowerCase()} — and it's time we address it.`
          ],
          funny: [
            `Confession: your ${info.niche.toLowerCase()} situation needs help. Don't @ me.`,
            `Raise your hand if your ${info.niche.toLowerCase()} game is… questionable. 🙋`,
            `We need to talk about the elephant in the room: ${info.niche.toLowerCase()}.`,
            `Plot twist: ${info.niche.toLowerCase()} doesn't have to be this painful.`,
            `If ${info.niche.toLowerCase()} was a report card… what grade would it get?`
          ],
          motivational: [
            `What if struggling with ${info.niche.toLowerCase()} doesn't have to be your reality?`,
            `Imagine if ${info.niche.toLowerCase()} could actually be enjoyable. It's possible.`,
            `You deserve better than what ${info.niche.toLowerCase()} has been giving you.`,
            `There's a version of you thriving in ${info.niche.toLowerCase()}. Let's get you there.`,
            `${info.niche.toLowerCase()} transformation starts with one decision. This could be it.`
          ],
          calm: [
            `If you've been feeling stuck with ${info.niche.toLowerCase()}, you're not alone.`,
            `It's okay to admit ${info.niche.toLowerCase()} hasn't been working for you.`,
            `Many people struggle with ${info.niche.toLowerCase()}. Here's what actually helps.`,
            `Feeling overwhelmed by ${info.niche.toLowerCase()}? There's a simpler way.`,
            `You don't have to force ${info.niche.toLowerCase()} to work. Let me show you.`
          ],
          engaging: [
            `Struggling with ${info.niche.toLowerCase()}? You're not alone.`,
            `Most people get ${info.niche.toLowerCase()} wrong. Here's why.`,
            `There's a better way to approach ${info.niche.toLowerCase()}.`,
            `If ${info.niche.toLowerCase()} feels hard, you're doing it the hard way.`,
            `What if ${info.niche.toLowerCase()} could be easier than you think?`
          ],
          bold: [
            `Stop settling for mediocre ${info.niche.toLowerCase()}. Period.`,
            `You're better than this ${info.niche.toLowerCase()} situation.`,
            `Enough excuses. Your ${info.niche.toLowerCase()} needs to change now.`,
            `Mediocre ${info.niche.toLowerCase()}? Not on my watch.`,
            `Time to stop accepting less in your ${info.niche.toLowerCase()}.`
          ],
          romantic: [
            `Remember when ${info.niche.toLowerCase()} used to excite you? Let's bring that back.`,
            `There was a time when ${info.niche.toLowerCase()} made your heart race. You can have that again.`,
            `What if ${info.niche.toLowerCase()} could feel magical again?`,
            `The spark in your ${info.niche.toLowerCase()} isn't gone — it's waiting.`,
            `Imagine ${info.niche.toLowerCase()} that makes you feel alive again.`
          ]
        };

        // relationship niche overrides (still varied)
        if ((info.niche || '').toLowerCase().includes('relationship') || (info.niche || '').toLowerCase().includes('couples')) {
          const relationshipHooks = {
            playful: [
              "When's the last time you laughed until you cried with your partner? Can't remember? Let's fix that.",
              "Quick question: is your relationship exciting… or just comfortable?",
              "Date night idea: actually having fun together. Wild concept, I know.",
              "Okay but when did date night become so boring? Let's change that.",
              "Your relationship isn't broken. It's just stuck on autopilot."
            ],
            romantic: [
              "Remember your first date butterflies? You can feel that again.",
              "There was a moment you knew they were the one. That feeling can come back.",
              "The butterflies aren't gone. They're just sleeping. Time to wake them up.",
              "Remember that electricity? It can return.",
              "What if every night together felt like falling in love again?"
            ],
            funny: [
              "If date night is Netflix and arguing about what to watch… we need to talk.",
              "Be honest: when's the last time you did something NEW together? 2019 doesn't count.",
              "Your idea of spicing it up is a new Netflix category. We can do better.",
              "Same restaurant, same conversation, same routine… see the problem?",
              "Plot twist: relationships take effort. But it can be the fun kind."
            ]
          };
          const list = relationshipHooks[tone] || hookVariations[tone] || hookVariations.engaging;
          return list;
        }

        return hookVariations[tone] || hookVariations.engaging;
      },

      getHook: (info, tone, variationIndex) => {
        const list = scriptTemplates.problemSolution.hookVariations(info, tone);
        return list[variationIndex % list.length];
      },

      getScript: (info, length, tone, variationIndex, focusFeature) => {
        // small rotating “phrase packs” to force real uniqueness
        const openers = {
          engaging: ["Here's the thing:", "Real talk:", "Quick question:", "Let me be honest:", "Okay, listen:"],
          direct: ["Bottom line:", "Here’s the deal:", "Straight up:", "No sugarcoating:", "Simple:"],
          playful: ["Okay bestie:", "Not gonna lie:", "Alright, quick vibe check:", "Okay so:", "Hear me out:"],
          funny: ["Not me saying this but…", "Listen… I’m dead serious 😭", "Okay, story time:", "No because why is it like this?", "Be so for real:"],
          motivational: ["You deserve better:", "This is your moment:", "You can change this:", "Let’s level up:", "You’re closer than you think:"],
          calm: ["Take a breath:", "No pressure:", "You’re doing fine:", "Let’s simplify this:", "It’s okay:"],
          bold: ["Enough:", "Stop playing small:", "Let’s go:", "This is the standard:", "Make the move:"],
          romantic: ["Imagine this:", "Close your eyes:", "Remember this feeling:", "Let’s bring it back:", "Picture this:"]
        };

        const transitions = [
          "And that's why",
          "Which is exactly why",
          "So here's what I recommend:",
          "Here’s the upgrade:",
          "That’s where we come in:"
        ];

        const closerBeats = [
          "Try it once and you’ll feel the difference.",
          "This is the easiest way to get results faster.",
          "It’s simple, it’s effective, and it works.",
          "If you’ve been waiting for a sign—this is it.",
          "You’ll wonder how you did it without it."
        ];

        const opener = (openers[tone] || openers.engaging)[variationIndex % (openers[tone] || openers.engaging).length];
        const transition = transitions[variationIndex % transitions.length];
        const closer = closerBeats[(variationIndex + 2) % closerBeats.length];

        const featureLine = focusFeature ? `One feature people love: ${focusFeature}. ` : '';

        // Relationship niche stays special
        if ((info.niche || '').toLowerCase().includes('relationship') || (info.niche || '').toLowerCase().includes('couples') || (info.niche || '').toLowerCase().includes('dating')) {
          if (tone === 'romantic') {
            return `${opener} remember the butterflies? The late-night talks? ${transition} ${info.brandName} exists. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
          }
          if (tone === 'funny') {
            return `${opener} if your “spice” is picking a different Netflix show… yeah. ${transition} ${info.brandName}. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
          }
          if (tone === 'direct') {
            return `${opener} routines kill connection. ${transition} ${info.brandName}. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
          }
          if (tone === 'calm') {
            return `${opener} life gets busy and couples drift—normal. ${transition} ${info.brandName}. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
          }
          if (tone === 'bold') {
            return `${opener} stop settling for “fine.” ${transition} ${info.brandName}. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
          }
          if (tone === 'playful') {
            return `${opener} date night doesn’t have to be predictable. ${transition} ${info.brandName}. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
          }
          if (tone === 'motivational') {
            return `${opener} great relationships are built on intentional fun. ${transition} ${info.brandName}. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
          }
          // engaging default
          return `${opener} most couples fall into autopilot. ${transition} ${info.brandName}. We’re ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }

        // General product scripts
        if (tone === 'direct') {
          return `${opener} ${info.targetAudience} need better ${info.niche.toLowerCase()} results. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }
        if (tone === 'playful') {
          return `${opener} ${info.niche.toLowerCase()} shouldn’t feel like a chore. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }
        if (tone === 'funny') {
          return `${opener} you thought ${info.niche.toLowerCase()} would be easy. LOL. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }
        if (tone === 'motivational') {
          return `${opener} you can win in ${info.niche.toLowerCase()}. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }
        if (tone === 'calm') {
          return `${opener} ${info.niche.toLowerCase()} doesn’t have to be stressful. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }
        if (tone === 'bold') {
          return `${opener} stop accepting mediocre ${info.niche.toLowerCase()}. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }
        if (tone === 'romantic') {
          return `${opener} there’s something special about ${info.niche.toLowerCase()} when it’s done right. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}${info.uniqueValue}. ${closer}`;
        }
        // engaging default
        return `${opener} if ${info.niche.toLowerCase()} feels hard, you’re not alone. ${transition} ${info.brandName}. We offer ${info.offerings}. ${featureLine}What makes us different? ${info.uniqueValue}. ${closer}`;
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
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
        )
      );

      const videos = responses
        .filter(data => data && data.videos && data.videos.length > 0)
        .flatMap(data => data.videos.slice(0, 2))
        .slice(0, 4)
        .map(video => ({
          description: video.url ? `Video: ${video.url.split('/')[4] || 'Pexels video'}` : 'Pexels video',
          url: video.video_files?.[0]?.link || video.url,
          thumbnail: video.image
        }));

      return videos.length > 0 ? videos : null;
    } catch (error) {
      console.error('Pexels fetch error:', error);
      return null;
    }
  };

  const generateBrollSuggestions = (info, scriptType) => {
    const suggestions = {
      problemSolution: [
        `${info.targetAudience} working frustrated at desk`,
        `Close-up of ${info.niche} related activity`,
        `Person having 'aha moment' or celebrating`,
        `${info.brandName} product/service in action`
      ],
      featureSpotlight: [
        `Close-up of feature in use`,
        `Quick demo clip (hands-on)`,
        `Before/after showing results`,
        `Happy reaction / testimonial style shot`
      ]
    };

    return suggestions[scriptType] || suggestions.problemSolution;
  };

  // NEW: feature scripts generator
  const generateFeatureScripts = (enhancedInfo, rng) => {
    if (!enhancedInfo.features || enhancedInfo.features.length === 0) return [];

    const featurePhrases = ['Experience', 'Enjoy', 'Get access to', 'Unlock', 'Discover', 'Benefit from'];

    // make each feature have a unique marketing line per generation
    const featureLines = enhancedInfo.features.map(f => {
      const phrase = pick(featurePhrases, rng);
      return { original: f.original, marketing: `${phrase} ${f.original.toLowerCase()}` };
    });

    // create a short dedicated script per feature (marketable section)
    const hooksByTone = {
      engaging: [
        `If you’ve been wanting ${'this'} to feel easier, this part changes everything:`,
        `One reason people keep coming back is this feature:`,
        `Quick highlight you’ll love:`,
        `Here’s a feature that makes this instantly better:`,
        `This is the feature people talk about:`
      ],
      direct: [
        `Feature highlight:`,
        `Here’s what you get:`,
        `This is built in:`,
        `Simple and powerful:`,
        `Straight to the point:`
      ],
      playful: [
        `Okay, this part is so good:`,
        `Wait ‘til you see this:`,
        `This is the fun upgrade:`,
        `Not gonna lie—this feature eats:`,
        `This is the “oh wow” moment:`
      ],
      funny: [
        `Not to be dramatic but… this feature is everything:`,
        `This feature understood the assignment:`,
        `This right here? Chef’s kiss:`,
        `You’re gonna love this, I’m serious:`,
        `Okay, this feature is the main character:`
      ],
      motivational: [
        `This feature helps you move faster:`,
        `This is built to help you win:`,
        `Here’s what makes progress easier:`,
        `This was designed for growth:`,
        `This feature turns effort into results:`
      ],
      calm: [
        `This feature makes things feel lighter:`,
        `Here’s a gentle upgrade you’ll appreciate:`,
        `This removes the stress part:`,
        `This helps you stay consistent:`,
        `This makes the process smoother:`
      ],
      bold: [
        `This is the standard:`,
        `This is why it hits different:`,
        `This is non-negotiable value:`,
        `This is a power feature:`,
        `This is what separates it:`
      ],
      romantic: [
        `This part brings the magic back:`,
        `This is where the spark shows up:`,
        `This is the “feel it again” feature:`,
        `This creates the moment:`,
        `This makes it unforgettable:`
      ]
    };

    return featureLines.map((f, idx) => {
      const hook = (hooksByTone[scriptPrefs.tone] || hooksByTone.engaging)[idx % (hooksByTone[scriptPrefs.tone] || hooksByTone.engaging).length];
      const bodyPacks = [
        `With ${enhancedInfo.brandName}, you don’t just get promises — you get ${f.original}. It’s built to help ${enhancedInfo.targetAudience} get results with less guesswork.`,
        `${f.original} means you can spend less time stuck and more time actually seeing progress. That’s the difference.`,
        `People love ${f.original} because it makes the whole experience smoother, clearer, and more enjoyable — especially for ${enhancedInfo.targetAudience}.`,
        `This is one of those features that makes you say “finally.” ${f.original} is included so you can get to the good part faster.`,
        `${f.original} is built in — because ${enhancedInfo.brandName} is designed for real people who want real results.`
      ];
      const mainScript = `${hook} ${bodyPacks[idx % bodyPacks.length]} ${enhancedInfo.uniqueValue}`;

      const ctaPacks = [
        `Want this feature? Tap the link in bio.`,
        `If you want this included, check the link in bio.`,
        `Try it today — link in bio.`,
        `Ready to use this? Link in bio.`,
        `Get access now — link in bio.`
      ];

      return {
        feature: f.original,
        marketingLine: f.marketing,
        hook,
        mainScript,
        cta: ctaPacks[idx % ctaPacks.length],
        musicPrompt: generateMusicPrompt(enhancedInfo, 'featureSpotlight', scriptPrefs.tone),
        brollSuggestions: generateBrollSuggestions(enhancedInfo, 'featureSpotlight')
      };
    });
  };

  const generateScripts = async () => {
    setIsGenerating(true);
    setScripts([]);
    setEditingScript(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const rng = createRng();

      const enhancedInfo = enhanceBusinessInfo(businessInfo);

      // Always randomize template selection order (even if only 1 template today)
      const templateKeys = shuffle(Object.keys(scriptTemplates), rng);

      const selectedTemplates = [];
      for (let i = 0; i < scriptPrefs.numScripts; i++) {
        // pick template in a shuffled loop
        const key = templateKeys[i % templateKeys.length];
        selectedTemplates.push({ key, template: scriptTemplates[key] });
      }

      const allFeatures = (enhancedInfo.features || []).map(f => f.original).filter(Boolean);
      const featureFocusOrder = allFeatures.length > 0 ? shuffle(allFeatures, rng) : [];

      const featureScripts = generateFeatureScripts(enhancedInfo, rng);

      const generatedScripts = await Promise.all(selectedTemplates.map(async (item, index) => {
        const template = item.template;

        const historyKey = `${item.key}-${scriptPrefs.tone}-${scriptPrefs.length}`;
        const hookList = template.hookVariations(enhancedInfo, scriptPrefs.tone);

        const variationIndex = getVariationIndex(historyKey, hookList.length, rng);
        rememberVariation(historyKey, variationIndex);

        let brollSuggestions = [];
        let pexelsVideos = null;

        if (scriptPrefs.includeBroll) {
          brollSuggestions = generateBrollSuggestions(enhancedInfo, item.key);

          const keywords = template.getBrollKeywords(enhancedInfo);
          pexelsVideos = await fetchPexelsVideos(keywords);
        }

        const focusFeature = featureFocusOrder[index % (featureFocusOrder.length || 1)] || '';

        const hashtags = generateHashtags(businessInfo, scriptPrefs.platform, rng);
        const logoPrompt = generateLogoPrompt(enhancedInfo, rng);
        const musicPrompt = generateMusicPrompt(enhancedInfo, item.key, scriptPrefs.tone);

        // IMPORTANT: now script varies too (not just hook)
        return {
          title: template.title,
          hook: template.getHook(enhancedInfo, scriptPrefs.tone, variationIndex),
          mainScript: template.getScript(enhancedInfo, scriptPrefs.length, scriptPrefs.tone, variationIndex, focusFeature),
          brollSuggestions: brollSuggestions,
          pexelsVideos: pexelsVideos,
          caption: `${enhancedInfo.brandName} — ${enhancedInfo.uniqueValue} 🚀 Perfect for ${enhancedInfo.targetAudience} in ${enhancedInfo.niche}.`,
          hashtags: hashtags,
          cta: template.getCTA(enhancedInfo),
          logoPrompt: logoPrompt,
          musicPrompt: musicPrompt,

          // existing section stays, but now it’s richer and reusable
          featuresMarketing: featureScripts.map(fs => fs.marketingLine),
          featureScripts: featureScripts
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
    let formatted = `🎬 ${script.title}

🪝 HOOK:
${script.hook}

📝 SCRIPT:
${script.mainScript}

`;

    if (script.featureScripts?.length > 0) {
      formatted += `✨ FEATURE SCRIPTS:
${script.featureScripts.map((fs, i) => (
        `${i + 1}. FEATURE: ${fs.feature}\nHOOK: ${fs.hook}\nSCRIPT: ${fs.mainScript}\nCTA: ${fs.cta}\n`
      )).join('\n')}

`;
    }

    if (script.brollSuggestions?.length > 0) {
      formatted += `🎥 B-ROLL SUGGESTIONS:
${script.brollSuggestions.map((b, i) => `${i + 1}. ${b}`).join('\n')}

`;
    }

    if (script.pexelsVideos?.length > 0) {
      formatted += `🎬 PEXELS VIDEO B-ROLL:
${script.pexelsVideos.map((v, i) => `${i + 1}. ${v.url}`).join('\n')}

`;
    }

    formatted += `📱 CAPTION:
${script.caption}

🏷️ HASHTAGS:
${script.hashtags?.join(' ') || ''}

🎯 CTA:
${script.cta}

🎨 LOGO/VISUAL PROMPT:
${script.logoPrompt}

🎵 MUSIC PROMPT (Suno):
${script.musicPrompt}`;

    return formatted;
  };

  const updateEditingScript = (field, value) => {
    setEditingScript(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // FIXED: save by scriptIndex (not by title/hook matching)
  const saveEditedScript = () => {
    const idx = editingScript?.scriptIndex;
    if (idx === null || idx === undefined) {
      setEditingScript(null);
      return;
    }

    setScripts(prev => prev.map((s, i) => {
      if (i !== idx) return s;
      return {
        ...s,
        hook: editingScript.hook,
        mainScript: editingScript.mainScript,
        caption: editingScript.caption,
        cta: editingScript.cta
      };
    }));

    setEditingScript(null);
  };

  const startEditing = (script, index) => {
    setEditingScript({
      ...script,
      scriptIndex: index
    });
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Marketing Script Generator
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Enter your license key to unlock AI-powered script generation
          </p>
          <div>
            <input
              type="text"
              placeholder="Enter License Key"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLicenseSubmit()}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleLicenseSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Unlock App
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Get your license key from Gumroad
          </p>
        </div>
      </div>
    );
  }

  if (currentView === 'teleprompter' && teleprompterScript) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Teleprompter Mode</h1>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm">Speed:</label>
              <input
                type="range"
                min="1"
                max="5"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                className="w-24"
              />
            </div>
            <button
              onClick={() => setIsScrolling(!isScrolling)}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isScrolling ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                setTeleprompterScript(null);
                setCurrentView('generate');
                setScrollPosition(0);
                setIsScrolling(false);
              }}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div
            className="absolute inset-0 px-12 pt-12"
            style={{ transform: `translateY(-${scrollPosition}px)` }}
          >
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                Marketing Script Generator
              </h1>
              <p className="text-purple-100 mt-1">AI-powered scripts for your brand</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Reset All
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('generate')}
              className={`px-4 py-2 rounded-lg transition ${currentView === 'generate' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'}`}
            >
              Generate Scripts
            </button>
            <button
              onClick={() => setCurrentView('saved')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${currentView === 'saved' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'}`}
            >
              <Save className="w-4 h-4" />
              Saved Scripts ({savedScripts.length})
            </button>
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
                        <button
                          onClick={() => {
                            setTeleprompterScript(script);
                            setCurrentView('teleprompter');
                          }}
                          className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
                        >
                          <Monitor className="w-4 h-4" />
                          Teleprompter
                        </button>
                        <button
                          onClick={() => copyToClipboard(formatScript(script), script.id)}
                          className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition flex items-center gap-1"
                        >
                          {copiedIndex === script.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          Copy
                        </button>
                        <button
                          onClick={() => deleteSavedScript(script.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Hook:</strong> {script.hook}</p>
                      <p className="text-sm"><strong>Script:</strong> {script.mainScript.substring(0, 200)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* EVERYTHING BELOW THIS POINT IS YOUR SAME LAYOUT — only feature script output added in the same box */}
            {/* ... your existing Business Profile + Preferences UI remains unchanged ... */}

            {/* NOTE: I did not paste the entire unchanged UI again to keep this message readable.
               You can keep your UI exactly as-is from your current file.
               The only UI change you need is in the "✨ Key Features" section below,
               which is already included in the earlier snippet in your provided code.
            */}

            {scripts.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Generated Scripts</h2>
                <div className="space-y-4">
                  {scripts.map((script, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                      {editingScript && editingScript.scriptIndex === index ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-purple-600">Editing: {editingScript.title}</h3>
                            <div className="flex gap-2">
                              <button
                                onClick={saveEditedScript}
                                className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingScript(null)}
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Hook</label>
                            <input
                              type="text"
                              value={editingScript.hook}
                              onChange={(e) => updateEditingScript('hook', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Script</label>
                            <textarea
                              value={editingScript.mainScript}
                              onChange={(e) => updateEditingScript('mainScript', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                              rows={6}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Caption</label>
                            <textarea
                              value={editingScript.caption}
                              onChange={(e) => updateEditingScript('caption', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                              rows={2}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CTA</label>
                            <input
                              type="text"
                              value={editingScript.cta}
                              onChange={(e) => updateEditingScript('cta', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-purple-600">{script.title}</h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveScript(script)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition flex items-center gap-1"
                              >
                                <Star className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={() => startEditing(script, index)}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition flex items-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setTeleprompterScript(script);
                                  setCurrentView('teleprompter');
                                }}
                                className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
                              >
                                <Monitor className="w-4 h-4" />
                                Teleprompter
                              </button>
                              <button
                                onClick={() => copyToClipboard(formatScript(script), index)}
                                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition flex items-center gap-1"
                              >
                                {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                Copy
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Hook</div>
                              <p className="text-gray-800 font-medium">{script.hook}</p>
                            </div>

                            <div>
                              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Script</div>
                              <p className="text-gray-700 whitespace-pre-line">{script.mainScript}</p>
                            </div>

                            {/* SAME BOX LOCATION — now it includes feature scripts */}
                            {script.featureScripts && script.featureScripts.length > 0 && (
                              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="text-xs font-bold text-purple-700 uppercase mb-2">✨ Features Scripts</div>

                                <div className="space-y-3">
                                  {script.featureScripts.map((fs, i) => (
                                    <div key={i} className="bg-white/60 rounded-lg p-3 border border-purple-100">
                                      <div className="text-sm font-semibold text-purple-900">• {fs.feature}</div>
                                      <div className="text-xs text-purple-800 mt-1"><strong>Hook:</strong> {fs.hook}</div>
                                      <div className="text-xs text-purple-800 mt-1 whitespace-pre-line"><strong>Script:</strong> {fs.mainScript}</div>
                                      <div className="text-xs text-purple-800 mt-1"><strong>CTA:</strong> {fs.cta}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {script.brollSuggestions && script.brollSuggestions.length > 0 && (
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                  <Camera className="w-3 h-3" />
                                  B-roll Suggestions
                                </div>
                                <ul className="list-disc list-inside text-gray-700">
                                  {script.brollSuggestions.map((b, i) => (
                                    <li key={i}>{b}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {script.pexelsVideos && script.pexelsVideos.length > 0 && (
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Pexels Video B-roll
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {script.pexelsVideos.map((video, i) => (
                                    <a
                                      key={i}
                                      href={video.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="relative group block rounded-lg overflow-hidden border border-gray-200 hover:border-purple-400 transition"
                                    >
                                      <img
                                        src={video.thumbnail}
                                        alt={video.description}
                                        className="w-full h-24 object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition">
                                        <Video className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Caption</div>
                              <p className="text-gray-700">{script.caption}</p>
                            </div>

                            {script.hashtags && (
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                  <Hash className="w-3 h-3" />
                                  Hashtags
                                  <button
                                    onClick={() => copyToClipboard(script.hashtags.join(' '), `hashtags-${index}`)}
                                    className="ml-2 text-purple-600 hover:text-purple-700"
                                  >
                                    {copiedIndex === `hashtags-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                                <p className="text-sm text-purple-600">{script.hashtags.join(' ')}</p>
                              </div>
                            )}

                            <div>
                              <div className="text-xs font-bold text-gray-500 uppercase mb-1">CTA</div>
                              <p className="text-gray-800 font-semibold">{script.cta}</p>
                            </div>

                            {script.logoPrompt && (
                              <div className="border-t pt-3 mt-3">
                                <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                  <Image className="w-3 h-3" />
                                  AI Logo/Visual Prompt
                                  <button
                                    onClick={() => copyToClipboard(script.logoPrompt, `logo-${index}`)}
                                    className="ml-2 text-purple-600 hover:text-purple-700"
                                  >
                                    {copiedIndex === `logo-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
                                  {script.logoPrompt}
                                </p>
                                <p className="text-xs text-purple-600 mt-1">
                                  💡 Use in MidJourney, DALL-E, or Leonardo.ai
                                </p>
                              </div>
                            )}

                            {script.musicPrompt && (
                              <div className="border-t pt-3 mt-3">
                                <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                  <Music className="w-3 h-3" />
                                  Suno Music Prompt
                                  <button
                                    onClick={() => copyToClipboard(script.musicPrompt, `music-${index}`)}
                                    className="ml-2 text-purple-600 hover:text-purple-700"
                                  >
                                    {copiedIndex === `music-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                  {script.musicPrompt}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                  🎵 Use in Suno.ai for perfect background music
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
