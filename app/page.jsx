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
  const [generationHistory, setGenerationHistory] = useState([]);
  
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

  const handleLicenseSubmit = () => {
    if (licenseKey.length >= 10) {
      setIsUnlocked(true);
    } else {
      alert('Invalid license key. Please enter a valid key.');
    }
  };

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
  };

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

  const generateHashtags = (info, platform) => {
    const baseHashtags = [
      `#${info.niche.replace(/\s/g, '')}`,
      `#${info.targetAudience.replace(/\s/g, '')}`,
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

    const niche = info.niche.toLowerCase();
    const additional = Object.keys(nicheSpecific).find(key => niche.includes(key));
    
    if (additional) {
      baseHashtags.push(...nicheSpecific[additional].slice(0, 5));
    }

    return [...new Set(baseHashtags)].slice(0, 10);
  };

  const enhanceBusinessInfo = (info) => {
    const brandEnhanced = info.brandName;
    
    const summarizeNiche = (text) => {
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
      if (text.length > 150) {
        if (text.toLowerCase().includes('game') && text.toLowerCase().includes('couples')) {
          return 'interactive couples game with intimate questions, playful dares, and spicy challenges';
        }
        if (text.toLowerCase().includes('course') || text.toLowerCase().includes('program')) {
          return 'comprehensive transformation program with step-by-step guidance';
        }
        if (text.toLowerCase().includes('ebook') || text.toLowerCase().includes('guide')) {
          return 'actionable guide with proven strategies and frameworks';
        }
        if (text.toLowerCase().includes('service') || text.toLowerCase().includes('consulting')) {
          return 'premium done-for-you service with expert support';
        }
        if (text.toLowerCase().includes('software') || text.toLowerCase().includes('app') || text.toLowerCase().includes('tool')) {
          return 'powerful digital solution that simplifies your workflow';
        }
        const sentences = text.split('.').filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
          const firstSentence = sentences[0].trim();
          if (firstSentence.length > 100) {
            return firstSentence.substring(0, 100) + '...';
          }
          return firstSentence;
        }
      }
      return text;
    };
    
    const summarizeValue = (text) => {
      if (text.length > 100) {
        const sentences = text.split('.').filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
          return sentences[0].trim();
        }
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
      'cooking': 'culinary mastery and recipe innovation',
      'baking': 'artisan baking and pastry excellence',
      'recipe': 'food creation and cooking inspiration',
      'business': 'entrepreneurial success and business growth',
      'entrepreneur': 'business innovation and startup success',
      'marketing': 'digital marketing mastery and brand growth',
      'sales': 'sales excellence and revenue growth',
      'coaching': 'transformational coaching and personal development',
      'consulting': 'expert consulting and strategic guidance',
      'therapy': 'mental wellness and emotional healing',
      'mindset': 'mindset mastery and personal growth',
      'education': 'educational excellence and skill development',
      'learning': 'knowledge advancement and skill mastery',
      'teaching': 'educational impact and teaching excellence',
      'course': 'online education and expert training',
      'real estate': 'property investment and real estate success',
      'investing': 'wealth building and smart investing',
      'finance': 'financial freedom and wealth building',
      'money': 'financial mastery and prosperity',
      'travel': 'luxury travel and unforgettable experiences',
      'adventure': 'exploration and adventure experiences',
      'photography': 'professional photography and visual storytelling',
      'videography': 'video production and cinematic storytelling',
      'music': 'musical excellence and creative artistry',
      'audio': 'sound design and audio production',
      'art': 'creative expression and artistic innovation',
      'design': 'design excellence and creative solutions',
      'fashion': 'style innovation and fashion-forward design',
      'clothing': 'apparel excellence and personal style',
      'relationship': 'relationship enhancement and intimate connection',
      'dating': 'romantic success and meaningful connections',
      'couples': 'relationship growth and couples intimacy',
      'marriage': 'marital excellence and lasting love',
      'parenting': 'parenting mastery and family harmony',
      'family': 'family wellness and harmonious living',
      'productivity': 'peak performance and productivity mastery',
      'time management': 'time optimization and efficiency excellence',
      'organization': 'organizational mastery and clutter-free living',
      'ecommerce': 'online retail success and e-commerce growth',
      'dropshipping': 'profitable dropshipping and online sales',
      'amazon': 'Amazon FBA mastery and marketplace success',
      'podcast': 'podcasting excellence and audio content creation',
      'youtube': 'YouTube growth and video content mastery',
      'tiktok': 'TikTok virality and short-form content success',
      'instagram': 'Instagram growth and visual storytelling'
    };
    
    let nicheEnhanced = nicheBase;
    for (const [key, value] of Object.entries(nicheMap)) {
      if (nicheBase.toLowerCase().includes(key)) {
        nicheEnhanced = value;
        break;
      }
    }
    
    const audienceMap = {
      'entrepreneur': 'ambitious entrepreneurs and business visionaries',
      'business owner': 'successful business owners and industry leaders',
      'professional': 'forward-thinking professionals and career achievers',
      'creator': 'passionate content creators and digital influencers',
      'coach': 'transformational coaches and service providers',
      'consultant': 'expert consultants and advisors',
      'freelancer': 'independent freelancers and creative professionals',
      'marketer': 'savvy marketers and growth strategists',
      'women': 'empowered women seeking excellence',
      'men': 'driven men pursuing greatness',
      'moms': 'busy moms balancing life and ambition',
      'dads': 'dedicated dads building strong families',
      'couples': 'loving couples seeking deeper connection',
      'singles': 'ambitious singles ready for meaningful relationships',
      'students': 'motivated students and lifelong learners',
      'athlete': 'dedicated athletes and fitness enthusiasts',
      'beginner': 'motivated beginners ready to transform',
      'expert': 'seasoned experts and industry veterans',
      'leader': 'visionary leaders and change-makers',
      'manager': 'strategic managers and team builders',
      'parent': 'devoted parents and family champions',
      'teen': 'ambitious teens and young achievers',
      'senior': 'active seniors and wisdom-sharers',
      'millennial': 'forward-thinking millennials and digital natives',
      'gen z': 'innovative Gen Z pioneers and trend-setters'
    };
    
    let audienceEnhanced = audienceBase;
    for (const [key, value] of Object.entries(audienceMap)) {
      if (audienceBase.toLowerCase().includes(key)) {
        audienceEnhanced = value;
        break;
      }
    }
    
    if (audienceEnhanced === audienceBase && audienceBase.length < 50) {
      audienceEnhanced = `motivated ${audienceBase} ready for transformation`;
    }
    
    const offeringsEnhanced = offeringsBase;
    
    const uniqueValueEnhanced = valueBase.length > 80
      ? valueBase
      : `${valueBase} - proven by thousands of satisfied customers`;
    
    const additionalContext = info.additionalInfo ? ` ${info.additionalInfo}` : '';
    
    const processFeatures = (featuresText) => {
      if (!featuresText || featuresText.trim().length === 0) return [];
      
      const featureLines = featuresText
        .split(/\n|•|-/)
        .map(f => f.trim())
        .filter(f => f.length > 0);
      
      return featureLines.map(feature => {
        const cleanFeature = feature.replace(/^\d+\.?\s*/, '').trim();
        
        const benefitPhrases = [
          'Experience',
          'Enjoy',
          'Get access to',
          'Unlock',
          'Discover',
          'Benefit from'
        ];
        
        const randomPhrase = benefitPhrases[Math.floor(Math.random() * benefitPhrases.length)];
        
        return {
          original: cleanFeature,
          marketing: `${randomPhrase} ${cleanFeature.toLowerCase()}`
        };
      });
    };
    
    const featuresProcessed = processFeatures(info.features);
    
    return {
      brandName: brandEnhanced,
      niche: nicheEnhanced,
      targetAudience: audienceEnhanced,
      offerings: offeringsEnhanced,
      uniqueValue: uniqueValueEnhanced + additionalContext,
      features: featuresProcessed,
      additionalInfo: info.additionalInfo
    };
  };

  const generateLogoPrompt = (info) => {
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
    
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
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
      valueProposition: {
        playful: 'bright commercial pop with ukulele, hand claps, cheerful whistling, 118 BPM',
        funny: 'goofy novelty music with tuba, kazoo sounds, silly percussion, 122 BPM',
        romantic: 'sultry R&B with smooth saxophone, jazzy chords, sensual groove, 90 BPM',
        direct: 'corporate motivational music with piano, strings, professional polish, 105 BPM',
        motivational: 'uplifting orchestral piece with soaring melodies, powerful crescendos, 95 BPM',
        calm: 'spa music with nature sounds, soft harp, flowing water ambiance, 65 BPM',
        bold: 'aggressive hip-hop beat with heavy bass, sharp hi-hats, commanding presence, 140 BPM',
        engaging: 'trendy electronic pop with synth leads, punchy drums, radio-ready sound, 120 BPM'
      },
      socialProof: {
        playful: 'celebratory party music with horns, confetti sounds, festive energy, 128 BPM',
        funny: 'cartoon comedy music with slide whistle, boing sounds, whimsical feel, 135 BPM',
        romantic: 'emotional love song with acoustic guitar, strings, heartfelt vocals, 75 BPM',
        direct: 'news broadcast style music with authoritative brass, steady rhythm, 100 BPM',
        motivational: 'victory anthem with choir, drums, triumphant melody, epic scale, 110 BPM',
        calm: 'gentle acoustic with soft vocals, warm instrumentation, comforting vibe, 80 BPM',
        bold: 'stadium rock with crowd cheers, power chords, anthemic chorus, 135 BPM',
        engaging: 'social media viral sound with catchy hook, dance beat, shareable energy, 125 BPM'
      },
      behindTheScenes: {
        playful: 'behind-the-scenes vlog music with ukulele, light percussion, casual vibe, 115 BPM',
        funny: 'mockumentary style music with quirky woodwinds, offbeat timing, 105 BPM',
        romantic: 'intimate storytelling music with piano, strings, emotional depth, 70 BPM',
        direct: 'documentary score with subtle electronics, professional tone, 95 BPM',
        motivational: 'journey music with building intensity, inspirational crescendo, 100 BPM',
        calm: 'reflective ambient music with soft pads, contemplative mood, 60 BPM',
        bold: 'origin story epic with cinematic drums, powerful themes, 120 BPM',
        engaging: 'modern storytelling music with emotional beats, relatable sound, 108 BPM'
      },
      howItWorks: {
        playful: 'tutorial music with marimba, light synths, educational feel, 110 BPM',
        funny: 'instructional comedy music with silly accents, playful melody, 118 BPM',
        romantic: 'gentle guide music with soft piano, warm atmosphere, 85 BPM',
        direct: 'explainer video music with clear structure, professional sound, 105 BPM',
        motivational: 'empowering tutorial music with uplifting progression, 100 BPM',
        calm: 'instructional meditation music with gentle guidance feel, 75 BPM',
        bold: 'dynamic tutorial music with confident energy, clear sections, 125 BPM',
        engaging: 'how-to video music with friendly vibe, approachable sound, 112 BPM'
      }
    };
    
    const basePrompt = musicStyles[scriptType]?.[tone] || musicStyles[scriptType]?.engaging || 'upbeat modern music, 120 BPM';
    return `${basePrompt}. Perfect for ${info.niche} content targeting ${info.targetAudience}. Commercial quality, royalty-free style.`;
  };

  const getVariation = (variations, usedIndices) => {
    const availableIndices = variations
      .map((_, i) => i)
      .filter(i => !usedIndices.includes(i));
    
    if (availableIndices.length === 0) {
      return Math.floor(Math.random() * variations.length);
    }
    
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  };

  const scriptTemplates = {
    problemSolution: {
      title: "Problem → Solution Format",
      getHook: (info, tone, variation = 0) => {
        const hookVariations = {
          playful: [
            `Let's be real - ${info.niche.toLowerCase()} can get boring AF. Sound familiar?`,
            `Okay so... ${info.niche.toLowerCase()} isn't exactly thrilling right now, is it?`,
            `Hot take: your ${info.niche.toLowerCase()} life could use a serious upgrade.`,
            `Can we talk about how ${info.niche.toLowerCase()} has gotten so predictable?`,
            `Nobody wants to admit it, but ${info.niche.toLowerCase()} has become kind of... meh.`
          ],
          direct: [
            `Here's the truth about ${info.niche.toLowerCase()} that nobody talks about.`,
            `Let me be straight with you about ${info.niche.toLowerCase()}.`,
            `The reality of ${info.niche.toLowerCase()}? It's not what you think.`,
            `I'm going to say what everyone's thinking about ${info.niche.toLowerCase()}.`,
            `There's a problem with ${info.niche.toLowerCase()} - and it's time we address it.`
          ],
          funny: [
            `Okay, confession time: your ${info.niche.toLowerCase()} life needs help. Don't @ me.`,
            `Raise your hand if your ${info.niche.toLowerCase()} game is... questionable. 🙋`,
            `We need to talk about the elephant in the room: ${info.niche.toLowerCase()}.`,
            `Plot twist: ${info.niche.toLowerCase()} doesn't have to be this painful.`,
            `If ${info.niche.toLowerCase()} was a report card, what grade would you get? Yeah, that's what I thought.`
          ],
          motivational: [
            `What if I told you that struggling with ${info.niche.toLowerCase()} doesn't have to be your reality?`,
            `Imagine if ${info.niche.toLowerCase()} could actually be enjoyable. It's possible.`,
            `You deserve better than what ${info.niche.toLowerCase()} has been giving you.`,
            `There's a version of you who's thriving in ${info.niche.toLowerCase()}. Let's get you there.`,
            `${info.niche.toLowerCase()} transformation starts with one decision. This could be it.`
          ],
          calm: [
            `If you've been feeling stuck with ${info.niche.toLowerCase()}, you're not alone.`,
            `It's okay to admit that ${info.niche.toLowerCase()} hasn't been working for you.`,
            `Many people struggle with ${info.niche.toLowerCase()}. Here's what actually helps.`,
            `Feeling overwhelmed by ${info.niche.toLowerCase()}? There's a simpler way.`,
            `You don't have to force ${info.niche.toLowerCase()} to work. Let me show you.`
          ],
          engaging: [
            `Struggling with ${info.niche.toLowerCase()}? You're not alone.`,
            `Most people get ${info.niche.toLowerCase()} wrong. Here's why.`,
            `There's a better way to approach ${info.niche.toLowerCase()}.`,
            `If ${info.niche.toLowerCase()} feels hard, you're doing it wrong.`,
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
            `The spark in your ${info.niche.toLowerCase()} isn't gone. It's just waiting.`,
            `Imagine ${info.niche.toLowerCase()} that makes you feel alive again.`
          ]
        };
        
        if (info.niche.toLowerCase().includes('relationship') || info.niche.toLowerCase().includes('couples')) {
          const relationshipHooks = {
            playful: [
              "When's the last time you laughed until you cried with your partner? Can't remember? Yeah, we need to fix that.",
              "Quick question: is your relationship exciting or... comfortable? There's a difference.",
              "Date night idea: Actually having fun together. Wild concept, I know.",
              "Okay but when did date night become so boring? Let's change that.",
              "Your relationship isn't broken. It's just stuck in autopilot mode."
            ],
            romantic: [
              "Remember when you couldn't keep your hands off each other? When every conversation felt electric? Let's get that back.",
              "There was a moment when you knew they were the one. You can feel that intensity again.",
              "The butterflies aren't gone. They're just sleeping. Time to wake them up.",
              "Remember your first kiss? That electricity can come back.",
              "What if every night together felt like falling in love again?"
            ],
            funny: [
              "If your date nights consist of Netflix and arguing about what to watch... we need to talk.",
              "Be honest: when's the last time you did something NEW together? 2019 doesn't count.",
              "Your idea of spicing things up: trying a different Netflix category. We can do better.",
              "Date night checklist: Same restaurant ✓ Same conversation ✓ Same routine ✓ See the problem?",
              "Plot twist: relationships require effort. But like, the fun kind of effort."
            ]
          };
          
          const hooks = relationshipHooks[tone] || hookVariations[tone];
          return hooks ? hooks[variation % hooks.length] : hookVariations.engaging[0];
        }
        
        const hooks = hookVariations[tone] || hookVariations.engaging;
        return hooks[variation % hooks.length];
      },
      getScript: (info, length, tone) => {
        const formatFeatures = (features, length) => {
          if (!features || features.length === 0) return '';
          
          if (length === '10s' || length === '15s') {
            return features.length > 0 ? ` With ${features.length} game-changing features included.` : '';
          }
          
          if (length === '30s') {
            const topFeatures = features.slice(0, 2);
            return topFeatures.length > 0 
              ? ` Inside: ${topFeatures.map(f => f.original).join(', and ')}.`
              : '';
          }
          
          if (length === '45s' || length === '1min') {
            const topFeatures = features.slice(0, 3);
            return topFeatures.length > 0
              ? ` What you get: ${topFeatures.map(f => f.marketing).join('. ')}. `
              : '';
          }
          
          const allFeatures = features.slice(0, 5);
          return allFeatures.length > 0
            ? ` Here's what's inside: ${allFeatures.map((f, i) => `${i === 0 ? '' : ' '}${f.marketing}`).join('.')}. `
            : '';
        };
        
        if (info.niche.toLowerCase().includes('relationship') || info.niche.toLowerCase().includes('couples') || info.niche.toLowerCase().includes('dating')) {
          const featuresText = formatFeatures(info.features, length);
          
          const relationshipScripts = {
            '30s': tone === 'playful'
              ? `Look, we get it. Date nights have become predictable. Same restaurant, same conversations, same... everything. That's why we created ${info.brandName}. It's ${info.offerings} that brings back the fun, the laughter, and yeah - the heat.${featuresText} ${info.uniqueValue}. No boring dinners. Just pure connection.`
              : `Most ${info.targetAudience} fall into the routine trap. ${info.brandName} breaks that cycle. We offer ${info.offerings} specifically designed to reignite connection.${featuresText} ${info.uniqueValue}. Transform ordinary nights into unforgettable moments.`,
            '45s': tone === 'playful'
              ? `Honest question: when's the last time you and your partner did something NEW together? Not dinner at the usual spot. Not the same Netflix shows. Something actually exciting? If you can't remember, that's exactly why ${info.brandName} exists. We've created ${info.offerings} packed with experiences that'll make you think, laugh, and connect.${featuresText}${info.uniqueValue}. This isn't your grandma's date night. This is connection on a whole new level. Ready to stop being boring?`
              : `The routine is killing your relationship. You might not realize it yet, but those same conversations, same patterns, same everything - they're slowly draining the life from what you have. ${info.brandName} is the antidote. ${info.offerings} designed specifically for ${info.targetAudience} ready to break free from the mundane.${featuresText}${info.uniqueValue}. Every moment brings you closer. This is how great relationships stay great.`,
            '1min': tone === 'playful'
              ? `Alright, real talk time. Your relationship isn't broken. You're not in trouble. But if we're being honest? You're in a rut. Same dates. Same talks. Same routine. And here's the thing - you both feel it, but nobody's saying anything. That's where ${info.brandName} comes in. We've spent months creating ${info.offerings} that does what couples therapy wishes it could do - make connection FUN again.${formatFeatures(info.features, '1min')}${info.uniqueValue}. Picture this: you're both laughing so hard you can barely breathe. You're learning things about each other you never knew. You're feeling that electricity you thought was gone. All because you decided to try something different. ${info.targetAudience} everywhere are using this to transform their relationships. Not with boring exercises or awkward conversations. With genuine fun, real intimacy, and unforgettable moments.`
              : `Here's what nobody tells ${info.targetAudience}: maintaining passion takes effort. Not the boring kind - the fun kind. ${info.brandName} understands this. We've created ${info.offerings} that makes strengthening your relationship feel like the best part of your week.${formatFeatures(info.features, '1min')}${info.uniqueValue}. Inside, you'll discover experiences that spark real conversations, activities that create genuine intimacy, and moments that remind you why you chose each other. This isn't about fixing what's broken. It's about making what's good even better. Because the best relationships aren't accidents - they're cultivated through intentional connection and playful exploration. That's exactly what we've built here.`
          };
          return relationshipScripts[length] || relationshipScripts['30s'];
        }
        
        const featuresText = formatFeatures(info.features, length);
        
        const scripts = {
          '10s': `Most ${info.targetAudience} face this exact problem. ${info.brandName} solves it in 3 steps.${featuresText} Ready?`,
          '15s': `Here's the truth: ${info.targetAudience} waste hours on ${info.niche.toLowerCase()}. ${info.brandName} changes that. We offer ${info.offerings}.${featuresText} Simple, effective, proven.`,
          '30s': `Let me guess - you're tired of struggling with ${info.niche.toLowerCase()}. Most ${info.targetAudience} are. That's exactly why we created ${info.brandName}. We offer ${info.offerings}, designed specifically for ${info.targetAudience}.${featuresText} What makes us different? ${info.uniqueValue}. No fluff, just results.`
        };
        return scripts[length] || scripts['30s'];
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
      ]
    };
    
    return suggestions[scriptType] || suggestions.problemSolution;
  };

  const generateScripts = async () => {
    setIsGenerating(true);
    setScripts([]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const enhancedInfo = enhanceBusinessInfo(businessInfo);
      
      const templateKeys = Object.keys(scriptTemplates);
      const selectedTemplates = [];
      
      for (let i = 0; i < scriptPrefs.numScripts; i++) {
        const randomKey = templateKeys[i % templateKeys.length];
        selectedTemplates.push({ key: randomKey, template: scriptTemplates[randomKey] });
      }

      const generatedScripts = await Promise.all(selectedTemplates.map(async (item, index) => {
        const template = item.template;
        
        const historyKey = `${item.key}-${scriptPrefs.tone}-${scriptPrefs.length}`;
        const usedVariations = generationHistory.filter(h => h === historyKey).length;
        const variationIndex = usedVariations;
        
        let brollSuggestions = [];
        let pexelsVideos = null;

        if (scriptPrefs.includeBroll) {
          brollSuggestions = generateBrollSuggestions(enhancedInfo, item.key);
          
          const keywords = template.getBrollKeywords(enhancedInfo);
          pexelsVideos = await fetchPexelsVideos(keywords);
        }

        const hashtags = generateHashtags(businessInfo, scriptPrefs.platform);
        const logoPrompt = generateLogoPrompt(enhancedInfo);
        const musicPrompt = generateMusicPrompt(enhancedInfo, item.key, scriptPrefs.tone);

        return {
          title: template.title,
          hook: template.getHook(enhancedInfo, scriptPrefs.tone, variationIndex),
          mainScript: template.getScript(enhancedInfo, scriptPrefs.length, scriptPrefs.tone),
          brollSuggestions: brollSuggestions,
          pexelsVideos: pexelsVideos,
          caption: `${enhancedInfo.brandName} - ${enhancedInfo.uniqueValue} 🚀 Perfect for ${enhancedInfo.targetAudience} in ${enhancedInfo.niche}.`,
          hashtags: hashtags,
          cta: template.getCTA(enhancedInfo),
          logoPrompt: logoPrompt,
          musicPrompt: musicPrompt
        };
      }));

      setScripts(generatedScripts);
      
      const newHistory = [...generationHistory];
      selectedTemplates.forEach(item => {
        const historyKey = `${item.key}-${scriptPrefs.tone}-${scriptPrefs.length}`;
        newHistory.push(historyKey);
      });
      setGenerationHistory(newHistory);
      
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
    setEditingScript({
      ...editingScript,
      [field]: value
    });
  };

  const saveEditedScript = () => {
    const newScripts = scripts.map(s => {
      if (s.title === editingScript.title && s.hook === editingScript.originalHook) {
        return {
          ...s,
          hook: editingScript.hook,
          mainScript: editingScript.mainScript,
          caption: editingScript.caption,
          cta: editingScript.cta
        };
      }
      return s;
    });
    setScripts(newScripts);
    setEditingScript(null);
  };

  const startEditing = (script, index) => {
    setEditingScript({
      ...script,
      originalHook: script.hook,
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
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Business Profile</h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
                    >
                      <User className="w-4 h-4" />
                      Profiles
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                        <div className="p-3 border-b">
                          <input
                            type="text"
                            placeholder="Profile name..."
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            className="w-full px-2 py-1 border rounded mb-2 text-sm"
                          />
                          <button
                            onClick={saveProfile}
                            className="w-full px-2 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Save Current
                          </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {brandProfiles.length === 0 ? (
                            <p className="text-gray-500 text-sm p-3">No saved profiles</p>
                          ) : (
                            brandProfiles.map(profile => (
                              <div key={profile.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                                <button
                                  onClick={() => loadProfile(profile)}
                                  className="flex-1 text-left text-sm"
                                >
                                  {profile.name}
                                </button>
                                <button
                                  onClick={() => deleteProfile(profile.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedProfile && (
                  <div className="mb-4 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
                    Loaded: {selectedProfile.name}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      value={businessInfo.brandName}
                      onChange={(e) => setBusinessInfo({...businessInfo, brandName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="Your brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Niche *
                    </label>
                    <input
                      type="text"
                      value={businessInfo.niche}
                      onChange={(e) => setBusinessInfo({...businessInfo, niche: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Fitness, Tech, Beauty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Target Audience *
                    </label>
                    <input
                      type="text"
                      value={businessInfo.targetAudience}
                      onChange={(e) => setBusinessInfo({...businessInfo, targetAudience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="Who are you targeting?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      What You Offer *
                    </label>
                    <textarea
                      value={businessInfo.offerings}
                      onChange={(e) => setBusinessInfo({...businessInfo, offerings: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="Products, services, solutions..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Unique Value Proposition *
                    </label>
                    <textarea
                      value={businessInfo.uniqueValue}
                      onChange={(e) => setBusinessInfo({...businessInfo, uniqueValue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="What makes you different?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Key Features (one per line)
                    </label>
                    <textarea
                      value={businessInfo.features}
                      onChange={(e) => setBusinessInfo({...businessInfo, features: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="90 unique cards across 3 decks
30 intimate questions
30 playful dares
30 spicy challenges"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">💡 List your product's key features (one per line). Each will be marketed separately!</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Additional Info
                    </label>
                    <textarea
                      value={businessInfo.additionalInfo}
                      onChange={(e) => setBusinessInfo({...businessInfo, additionalInfo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      placeholder="Anything else we should know?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Script Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Scripts: {scriptPrefs.numScripts}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scriptPrefs.numScripts}
                      onChange={(e) => setScriptPrefs({...scriptPrefs, numScripts: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Video Length
                    </label>
                    <select
                      value={scriptPrefs.length}
                      onChange={(e) => setScriptPrefs({...scriptPrefs, length: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="10s">10 seconds</option>
                      <option value="15s">15 seconds</option>
                      <option value="30s">30 seconds</option>
                      <option value="45s">45 seconds</option>
                      <option value="1min">1 minute</option>
                      <option value="1min15s">1 minute 15 seconds</option>
                      <option value="1min30s">1 minute 30 seconds</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Platform
                    </label>
                    <select
                      value={scriptPrefs.platform}
                      onChange={(e) => setScriptPrefs({...scriptPrefs, platform: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Script Tone/Voice
                    </label>
                    <select
                      value={scriptPrefs.tone}
                      onChange={(e) => setScriptPrefs({...scriptPrefs, tone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="engaging">Engaging (Default)</option>
                      <option value="playful">Playful & Fun</option>
                      <option value="funny">Funny & Humorous</option>
                      <option value="romantic">Romantic & Intimate</option>
                      <option value="direct">Direct & Straightforward</option>
                      <option value="motivational">Motivational & Inspiring</option>
                      <option value="calm">Calm & Reassuring</option>
                      <option value="bold">Bold & Confident</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={scriptPrefs.includeBroll}
                      onChange={(e) => setScriptPrefs({...scriptPrefs, includeBroll: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <label className="ml-2 text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Camera className="w-4 h-4" />
                      Include B-roll Suggestions & Pexels Videos
                    </label>
                  </div>

                  <button
                    onClick={generateScripts}
                    disabled={isGenerating || !businessInfo.brandName || !businessInfo.niche}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Scripts
                      </>
                    )}
                  </button>

                  {businessInfo.brandName && businessInfo.niche && (
                    <button
                      onClick={() => setShowEnhancedPreview(!showEnhancedPreview)}
                      className="w-full mt-2 px-4 py-2 border-2 border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {showEnhancedPreview ? 'Hide' : 'Preview'} Enhanced Version
                    </button>
                  )}

                  {showEnhancedPreview && businessInfo.brandName && businessInfo.niche && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                      <h3 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        ✨ SEO-Enhanced Preview
                      </h3>
                      {(() => {
                        const enhanced = enhanceBusinessInfo(businessInfo);
                        return (
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold text-gray-600">Niche:</span>
                              <p className="text-purple-700 italic">{enhanced.niche}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">Audience:</span>
                              <p className="text-purple-700 italic">{enhanced.targetAudience}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">Offerings:</span>
                              <p className="text-purple-700 italic">{enhanced.offerings}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">Value:</span>
                              <p className="text-purple-700 italic">{enhanced.uniqueValue}</p>
                            </div>
                            {enhanced.features && enhanced.features.length > 0 && (
                              <div>
                                <span className="font-semibold text-gray-600">Features (with marketing):</span>
                                <ul className="text-purple-700 italic list-disc list-inside">
                                  {enhanced.features.map((f, i) => (
                                    <li key={i}>{f.marketing}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      <p className="text-xs text-purple-600 mt-3">
                        ℹ️ This is how your info will appear in scripts - professional & SEO-optimized!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

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

                            {script.featuresMarketing && script.featuresMarketing.length > 0 && (
                              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="text-xs font-bold text-purple-700 uppercase mb-2">✨ Key Features</div>
                                <div className="grid grid-cols-1 gap-2">
                                  {script.featuresMarketing.map((f, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <span className="text-purple-600 font-bold">•</span>
                                      <span className="text-sm text-purple-900">{f}</span>
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
