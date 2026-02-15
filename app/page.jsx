'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Lock, Copy, Check, RefreshCw, Video, Save, Edit2, User, Hash, Monitor, ChevronDown, Star, Play, Pause, X, Plus, Trash2 } from 'lucide-react';

export default function MarketingScriptGenerator() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [currentView, setCurrentView] = useState('generate'); // 'generate', 'saved', 'teleprompter'
  
  // Brand Profiles
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
    additionalInfo: ''
  });
  
  const [scriptPrefs, setScriptPrefs] = useState({
    numScripts: 3,
    length: '30s',
    platform: 'instagram',
    includeBroll: true
  });
  
  const [scripts, setScripts] = useState([]);
  const [savedScripts, setSavedScripts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [editingScript, setEditingScript] = useState(null);
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);
  
  // Teleprompter
  const [teleprompterScript, setTeleprompterScript] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedScripts');
    if (saved) setSavedScripts(JSON.parse(saved));
    
    const profiles = localStorage.getItem('brandProfiles');
    if (profiles) setBrandProfiles(JSON.parse(profiles));
  }, []);

  // Save to localStorage when savedScripts changes
  useEffect(() => {
    localStorage.setItem('savedScripts', JSON.stringify(savedScripts));
  }, [savedScripts]);

  // Save profiles to localStorage
  useEffect(() => {
    localStorage.setItem('brandProfiles', JSON.stringify(brandProfiles));
  }, [brandProfiles]);

  // Auto-scroll for teleprompter
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
    alert(`Profile "${newProfileName}" saved!`);
  };

  const loadProfile = (profile) => {
    setBusinessInfo({
      brandName: profile.brandName,
      niche: profile.niche,
      targetAudience: profile.targetAudience,
      offerings: profile.offerings,
      uniqueValue: profile.uniqueValue,
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

  const scriptTemplates = {
    problemSolution: {
      title: "Problem → Solution Format",
      getHook: (info) => `Struggling with ${info.niche.toLowerCase()}? You're not alone.`,
      getScript: (info, length) => {
        const scripts = {
          '10s': `Most ${info.targetAudience} face this exact problem. ${info.brandName} solves it in 3 steps. Ready?`,
          '15s': `Here's the truth: ${info.targetAudience} waste hours on ${info.niche.toLowerCase()}. ${info.brandName} changes that. We offer ${info.offerings}. Simple, effective, proven.`,
          '30s': `Let me guess - you're tired of struggling with ${info.niche.toLowerCase()}. Most ${info.targetAudience} are. That's exactly why we created ${info.brandName}. We offer ${info.offerings}, designed specifically for ${info.targetAudience}. What makes us different? ${info.uniqueValue}. No fluff, just results.`,
          '45s': `If you're a ${info.targetAudience} dealing with ${info.niche.toLowerCase()}, this is for you. The problem? Everyone's facing the same challenges, but no one has time for complicated solutions. Enter ${info.brandName}. We've developed ${info.offerings} that actually works for real people. Our secret? ${info.uniqueValue}. We've helped thousands transform their approach. The best part? It's easier than you think.`,
          '1min': `Real talk - being a ${info.targetAudience} in ${info.niche.toLowerCase()} isn't easy. You've probably tried everything, wasted money on solutions that don't work, and you're ready to give up. I get it. That's why ${info.brandName} exists. We created ${info.offerings} specifically for ${info.targetAudience} who are tired of the BS. What makes us different? ${info.uniqueValue}. We focus on real results, not empty promises. Our approach is simple: understand the problem, provide the solution, deliver results. That's it.`,
          '1min15s': `Let me tell you a story. ${info.targetAudience} everywhere are struggling with ${info.niche.toLowerCase()}. They're frustrated, overwhelmed, and ready for change. Sound familiar? Here's what most people don't tell you - the solution isn't more complicated. It's actually simpler. ${info.brandName} offers ${info.offerings} that cuts through the noise. We're not like other options because ${info.uniqueValue}. We've worked with hundreds of ${info.targetAudience} and learned exactly what works. The results speak for themselves. No gimmicks, no complicated processes, just straightforward solutions that deliver.`,
          '1min30s': `Stop me if you've heard this before: you're a ${info.targetAudience} trying to succeed in ${info.niche.toLowerCase()}, but every solution you try either doesn't work or is way too complicated. You're spending hours trying to figure it out, money on products that promise everything but deliver nothing, and you're about ready to quit. I've been there. That's exactly why we built ${info.brandName}. We offer ${info.offerings} that actually makes sense for real ${info.targetAudience}. Our approach is different because ${info.uniqueValue}. We don't believe in one-size-fits-all solutions. Instead, we focus on what actually works, backed by real results from real people. The best part? You can start seeing results immediately. No learning curve, no complicated setup, just straightforward solutions that work.`
        };
        return scripts[length] || scripts['30s'];
      },
      getCTA: (info) => `Ready to transform your ${info.niche.toLowerCase()}? Check the link in bio!`,
      getBrollKeywords: (info) => [`${info.niche} problem`, `frustrated ${info.targetAudience}`, `${info.niche} solution`, `happy customer success`]
    },
    
    valueProposition: {
      title: "Value Proposition Highlight",
      getHook: (info) => `What if I told you ${info.niche.toLowerCase()} could be 10x easier?`,
      getScript: (info, length) => {
        const scripts = {
          '10s': `${info.brandName} - ${info.offerings}. ${info.uniqueValue}. That's it. That's the difference.`,
          '15s': `${info.brandName} isn't just another ${info.niche.toLowerCase()} solution. ${info.uniqueValue}. We deliver ${info.offerings} that actually works for ${info.targetAudience}.`,
          '30s': `Everyone in ${info.niche.toLowerCase()} promises results. We deliver them. ${info.brandName} offers ${info.offerings} built specifically for ${info.targetAudience}. What sets us apart? ${info.uniqueValue}. We don't do gimmicks. We do results. Simple as that.`,
          '45s': `Let's cut to the chase. ${info.brandName} is built for ${info.targetAudience} who want real results in ${info.niche.toLowerCase()}. We provide ${info.offerings} that stands out because ${info.uniqueValue}. While others talk, we deliver. Our customers choose us because we understand their challenges and provide solutions that actually work. No BS, no empty promises, just proven results.`,
          '1min': `Here's what makes ${info.brandName} different in the ${info.niche.toLowerCase()} space. First, we actually understand ${info.targetAudience}. Second, we offer ${info.offerings} that's designed with you in mind. Third, ${info.uniqueValue} - and that's not marketing speak, it's reality. We've built something that solves real problems for real people. Every feature, every aspect of what we do is focused on delivering value. Not just saying we do, actually doing it.`,
          '1min15s': `Question: what do ${info.targetAudience} really want from ${info.niche.toLowerCase()}? Real results. Actual solutions. No fluff. That's ${info.brandName}. We've created ${info.offerings} that delivers on that promise. Our unique advantage? ${info.uniqueValue}. But here's the thing - we don't just claim to be different. We prove it every day with customer results. Our approach is straightforward: listen to what ${info.targetAudience} needs, build solutions that work, deliver consistent results. No shortcuts, no gimmicks, just quality you can count on.`,
          '1min30s': `In a world full of ${info.niche.toLowerCase()} options, why choose ${info.brandName}? Let me break it down. We're built exclusively for ${info.targetAudience} who are serious about results. Our offering - ${info.offerings} - isn't just another product. It's a complete solution designed around your needs. What makes us truly different? ${info.uniqueValue}. But beyond features and benefits, here's what really matters: we're committed to your success. Every decision we make, every feature we add, every update we release is focused on delivering more value to you. We measure our success by your results, not our revenue. That's the ${info.brandName} difference, and that's why ${info.targetAudience} trust us to deliver.`
        };
        return scripts[length] || scripts['30s'];
      },
      getCTA: (info) => `Experience the ${info.brandName} difference. Link in bio.`,
      getBrollKeywords: (info) => [`${info.niche} product`, `${info.brandName} features`, `quality ${info.niche}`, `premium product`]
    },

    socialProof: {
      title: "Social Proof & Testimonial",
      getHook: (info) => `${info.targetAudience} are switching to ${info.brandName}. Here's why.`,
      getScript: (info, length) => {
        const scripts = {
          '10s': `Thousands of ${info.targetAudience} trust ${info.brandName}. ${info.uniqueValue}. Join them.`,
          '15s': `Real ${info.targetAudience}, real results. ${info.brandName} delivers ${info.offerings} that works. Our customers say it best: life-changing.`,
          '30s': `Why are so many ${info.targetAudience} choosing ${info.brandName}? Because ${info.uniqueValue}. We offer ${info.offerings} that delivers real results. Don't just take our word for it - our community speaks for itself. Join thousands who've already made the switch.`,
          '45s': `Here's what ${info.targetAudience} are saying about ${info.brandName}: "Game changer." "Exactly what I needed." "Best investment I've made." Why? Because we deliver ${info.offerings} with ${info.uniqueValue}. Our track record speaks for itself. Thousands of satisfied customers, countless success stories, and results that speak louder than any marketing ever could.`,
          '1min': `Let me share what our customers say. ${info.targetAudience} from all backgrounds are using ${info.brandName} to transform their ${info.niche.toLowerCase()}. One customer said it best: "I wish I found this sooner." Another: "This is exactly what I needed." Why are they so happy? Because ${info.offerings} actually delivers. Because ${info.uniqueValue} isn't just a tagline - it's a reality they experience every day. Our community is growing because word spreads when something actually works.`,
          '1min15s': `Social proof matters. That's why I want to share what real ${info.targetAudience} are experiencing with ${info.brandName}. Customer after customer tells us the same thing: this is different. This actually works. Why? Our ${info.offerings} is built on ${info.uniqueValue}, which means every ${info.targetAudience} gets real, measurable results. We're not the biggest name in ${info.niche.toLowerCase()}, but we're building the most loyal community. Why? Because when you deliver on your promises, people notice. When you prioritize results over revenue, people talk. And that's exactly what's happening.`,
          '1min30s': `I'm going to be straight with you. The ${info.niche.toLowerCase()} space is crowded. Everyone's making big promises. So why are ${info.targetAudience} choosing ${info.brandName} over all the other options? Let me show you. Sarah, a ${info.targetAudience}, switched to us six months ago. Her words: "I've tried everything. This is the only thing that worked." Mike, another ${info.targetAudience}: "I was skeptical. Now I'm a believer." What changed for them? Our ${info.offerings} combined with ${info.uniqueValue} delivered results they could actually see and measure. We're not just collecting testimonials - we're building a community of ${info.targetAudience} who've found something that actually works. The proof isn't in our marketing. It's in their results.`
        };
        return scripts[length] || scripts['30s'];
      },
      getCTA: (info) => `Join our community. See results yourself. Link in bio.`,
      getBrollKeywords: (info) => [`happy customers`, `testimonial ${info.niche}`, `community celebration`, `success stories`]
    },

    behindTheScenes: {
      title: "Behind the Scenes Story",
      getHook: (info) => `How we built ${info.brandName} for ${info.targetAudience} like you.`,
      getScript: (info, length) => {
        const scripts = {
          '10s': `We saw a problem. We built a solution. ${info.brandName} - ${info.offerings} for real ${info.targetAudience}.`,
          '15s': `${info.brandName} started with a simple idea: ${info.targetAudience} deserve better. So we created ${info.offerings} with ${info.uniqueValue}.`,
          '30s': `We created ${info.brandName} because we were frustrated too. As ${info.targetAudience} ourselves, we knew there had to be a better way. That's why we built ${info.offerings} focused on ${info.uniqueValue}. Every feature exists because someone like you needed it. That's our story.`,
          '45s': `${info.brandName} wasn't built in a boardroom. It was built by ${info.targetAudience}, for ${info.targetAudience}. We experienced the same frustrations you face in ${info.niche.toLowerCase()}. We tried the same solutions that didn't work. So we built something different: ${info.offerings} that prioritizes ${info.uniqueValue}. Every decision we make comes from understanding your real needs, not what we think you need.`,
          '1min': `Let me tell you how ${info.brandName} started. We were ${info.targetAudience} facing the same problems you face. We tried every solution in ${info.niche.toLowerCase()}. Nothing worked the way we needed. So we asked: what if we built something ourselves? Something focused on what ${info.targetAudience} actually need? That's how ${info.offerings} was born. We designed it around ${info.uniqueValue} because that's what we wished existed. Now thousands of ${info.targetAudience} use it every day. And we're just getting started.`,
          '1min15s': `The story of ${info.brandName} starts with frustration. We were ${info.targetAudience} struggling in ${info.niche.toLowerCase()}, trying solution after solution, wasting time and money. Nothing delivered what it promised. So we made a decision: build what we wished existed. We started with one goal: create ${info.offerings} that actually solves real problems. We focused on ${info.uniqueValue} because that's what we couldn't find anywhere else. We tested everything with real ${info.targetAudience}. We listened to feedback. We iterated constantly. The result? Something we're proud of, something that actually works, something that's helping thousands of people just like us.`,
          '1min30s': `Every company has an origin story. Here's ours, and it's probably different than you think. ${info.brandName} wasn't created by marketers in a conference room trying to find a gap in the market. It was created by frustrated ${info.targetAudience} who couldn't find what they needed in ${info.niche.toLowerCase()}. We tried everything available. We spent money, wasted time, got frustrated. Sound familiar? That frustration became our fuel. We decided to build ${info.offerings} that we wished existed - something focused on ${info.uniqueValue}, something that actually solves real problems. We tested every feature with real ${info.targetAudience}. We threw out anything that didn't add value. We focused obsessively on results. Today, thousands of ${info.targetAudience} use ${info.brandName}. Not because we have the biggest marketing budget, but because we solve real problems with real solutions. That's our story, and we're still writing it every day with our community.`
        };
        return scripts[length] || scripts['30s'];
      },
      getCTA: (info) => `Be part of our story. Learn more in bio.`,
      getBrollKeywords: (info) => [`office workspace`, `team meeting`, `product development`, `behind the scenes work`]
    },

    howItWorks: {
      title: "How It Works / Tutorial",
      getHook: (info) => `Here's how ${info.brandName} works in 3 simple steps.`,
      getScript: (info, length) => {
        const scripts = {
          '10s': `Step 1: Sign up. Step 2: ${info.offerings}. Step 3: Results. That's ${info.brandName}.`,
          '15s': `Getting started is easy. Sign up, access ${info.offerings}, start seeing results. ${info.uniqueValue} makes it simple for ${info.targetAudience}.`,
          '30s': `Let me walk you through ${info.brandName}. First, you sign up - takes 60 seconds. Second, you access ${info.offerings} designed for ${info.targetAudience}. Third, you start seeing results because ${info.uniqueValue}. No complicated setup, no learning curve, just results. That's how it works.`,
          '45s': `Using ${info.brandName} is straightforward. Step one: create your account in under a minute. Step two: explore our ${info.offerings} built specifically for ${info.targetAudience}. Step three: implement what you learn. ${info.uniqueValue} means you don't need to be an expert. Everything is designed to be intuitive and effective. Start to finish, you're looking at minutes, not hours. That's the power of simplicity done right.`,
          '1min': `I'll show you exactly how ${info.brandName} works. First step: sign up. It's quick, no complicated forms, no unnecessary questions. Just the basics. Second step: you get immediate access to ${info.offerings}. Everything is organized for ${info.targetAudience} - no hunting for what you need. Third step: start using it. Thanks to ${info.uniqueValue}, there's no steep learning curve. Fourth step: see results. Most ${info.targetAudience} see progress within the first week. That's it. Four simple steps from signup to results.`,
          '1min15s': `Let me break down exactly how ${info.brandName} works, step by step. When you first sign up, we keep it simple - basic info, no complicated onboarding. You're in within 60 seconds. Once inside, you get instant access to ${info.offerings}. Everything's designed specifically for ${info.targetAudience}, so navigation is intuitive. Here's where ${info.uniqueValue} comes in - you don't need prior experience or expertise. We've made everything straightforward and actionable. As you start using it, you'll notice results quickly. Most users see progress within days, not weeks. And if you need help? Our support team is always ready. That's the ${info.brandName} experience: simple, effective, supportive.`,
          '1min30s': `I want to show you exactly how ${info.brandName} works, from start to finish. Because transparency matters. When you first visit, you can sign up in under a minute. We only ask for what we actually need - no invasive questions, no data harvesting. Once you're in, you immediately see ${info.offerings} laid out clearly. Everything is designed with ${info.targetAudience} in mind, so it feels intuitive from day one. Here's what makes us different: ${info.uniqueValue}. That means whether you're a beginner or experienced in ${info.niche.toLowerCase()}, you can jump in and start getting value immediately. No tutorials to watch, no manuals to read, just straightforward functionality that works. As you use it, you'll start seeing results. For most users, that happens within the first week. And throughout your journey, our team is here to help. Have a question? Get a real answer from a real person. Need support? We've got you. That's how ${info.brandName} works - simple, transparent, effective.`
        };
        return scripts[length] || scripts['30s'];
      },
      getCTA: (info) => `Try ${info.brandName} today. Link in bio.`,
      getBrollKeywords: (info) => [`tutorial screen recording`, `step by step process`, `easy setup`, `user dashboard`]
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
      valueProposition: [
        `${info.brandName} logo or branding`,
        `Happy ${info.targetAudience} using product`,
        `Before/after comparison shots`,
        `Product features close-up`
      ],
      socialProof: [
        `Customer testimonial clips`,
        `Group of diverse ${info.targetAudience}`,
        `Success metrics or results dashboard`,
        `Community using ${info.brandName}`
      ],
      behindTheScenes: [
        `Team working on product`,
        `Product development process`,
        `Office or workspace shots`,
        `Founder story moments`
      ],
      howItWorks: [
        `Screen recording of signup process`,
        `User navigating ${info.brandName} interface`,
        `Step-by-step process visuals`,
        `Results dashboard or analytics`
      ]
    };
    
    return suggestions[scriptType] || suggestions.valueProposition;
  };

  const enhanceBusinessInfo = (info) => {
    // Enhance brand name with power words
    const brandEnhanced = info.brandName;
    
    // Enhance niche with professional terminology
    const nicheMap = {
      'fitness': 'health and fitness transformation',
      'tech': 'cutting-edge technology solutions',
      'beauty': 'premium beauty and skincare',
      'food': 'culinary excellence and gourmet experiences',
      'business': 'entrepreneurial success and business growth',
      'fashion': 'style innovation and fashion-forward design',
      'marketing': 'digital marketing mastery and brand growth',
      'coaching': 'transformational coaching and personal development',
      'education': 'educational excellence and skill development',
      'real estate': 'property investment and real estate success',
      'finance': 'financial freedom and wealth building',
      'travel': 'luxury travel and unforgettable experiences',
      'photography': 'professional photography and visual storytelling',
      'music': 'musical excellence and creative artistry',
      'art': 'creative expression and artistic innovation'
    };
    
    let nicheEnhanced = info.niche;
    for (const [key, value] of Object.entries(nicheMap)) {
      if (info.niche.toLowerCase().includes(key)) {
        nicheEnhanced = value;
        break;
      }
    }
    
    // Enhance target audience with specificity
    const audienceEnhanced = info.targetAudience.toLowerCase().includes('entrepreneur') 
      ? 'ambitious entrepreneurs and business visionaries'
      : info.targetAudience.toLowerCase().includes('professional')
      ? 'forward-thinking professionals and industry leaders'
      : info.targetAudience.toLowerCase().includes('creator')
      ? 'passionate content creators and influencers'
      : info.targetAudience.toLowerCase().includes('women') || info.targetAudience.toLowerCase().includes('men')
      ? `driven ${info.targetAudience} seeking excellence`
      : `motivated ${info.targetAudience}`;
    
    // Enhance offerings with benefit-focused language
    const offeringsEnhanced = info.offerings.length > 100 
      ? info.offerings 
      : `premium ${info.offerings} designed to deliver measurable results`;
    
    // Enhance unique value with power language
    const uniqueValueEnhanced = info.uniqueValue.length > 80
      ? info.uniqueValue
      : `${info.uniqueValue}, backed by proven strategies and real-world success`;
    
    return {
      brandName: brandEnhanced,
      niche: nicheEnhanced,
      targetAudience: audienceEnhanced,
      offerings: offeringsEnhanced,
      uniqueValue: uniqueValueEnhanced,
      additionalInfo: info.additionalInfo
    };
  };

  const generateScripts = async () => {
    setIsGenerating(true);
    setScripts([]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Enhance the business info before generating scripts
      const enhancedInfo = enhanceBusinessInfo(businessInfo);
      
      const templateKeys = Object.keys(scriptTemplates);
      const selectedTemplates = [];
      
      for (let i = 0; i < scriptPrefs.numScripts; i++) {
        const randomKey = templateKeys[i % templateKeys.length];
        selectedTemplates.push({ key: randomKey, template: scriptTemplates[randomKey] });
      }

      const generatedScripts = await Promise.all(selectedTemplates.map(async (item, index) => {
        const template = item.template;
        
        let brollSuggestions = [];
        let pexelsVideos = null;

        if (scriptPrefs.includeBroll) {
          brollSuggestions = generateBrollSuggestions(enhancedInfo, item.key);
          
          const keywords = template.getBrollKeywords(enhancedInfo);
          pexelsVideos = await fetchPexelsVideos(keywords);
        }

        const hashtags = generateHashtags(businessInfo, scriptPrefs.platform);

        return {
          title: template.title,
          hook: template.getHook(enhancedInfo),
          mainScript: template.getScript(enhancedInfo, scriptPrefs.length),
          brollSuggestions: brollSuggestions,
          pexelsVideos: pexelsVideos,
          caption: `${enhancedInfo.brandName} - ${enhancedInfo.uniqueValue} 🚀 Perfect for ${enhancedInfo.targetAudience} in ${enhancedInfo.niche}.`,
          hashtags: hashtags,
          cta: template.getCTA(enhancedInfo)
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
${script.cta}`;

    return formatted;
  };

  const updateEditingScript = (field, value) => {
    setEditingScript({
      ...editingScript,
      [field]: value
    });
  };

  const saveEditedScript = () => {
    const index = scripts.findIndex(s => s === editingScript);
    if (index !== -1) {
      const newScripts = [...scripts];
      newScripts[index] = editingScript;
      setScripts(newScripts);
    }
    setEditingScript(null);
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

  // Teleprompter View
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
                      rows="3"
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
                      rows="2"
                    />
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
                      rows="2"
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
                      {editingScript === script ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-purple-600">Editing: {script.title}</h3>
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
                              rows="6"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Caption</label>
                            <textarea
                              value={editingScript.caption}
                              onChange={(e) => updateEditingScript('caption', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                              rows="2"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CTA</label>
                            <input
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
                                onClick={() => setEditingScript(script)}
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
