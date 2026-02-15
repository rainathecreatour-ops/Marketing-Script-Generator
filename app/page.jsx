'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, Lock, Copy, Check } from 'lucide-react';

export default function MarketingScriptGenerator() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleLicenseSubmit = () => {
    if (licenseKey.length >= 10) {
      setIsUnlocked(true);
    } else {
      alert('Invalid license key. Please enter a valid key.');
    }
  };

const generateScripts = async () => {
  setIsGenerating(true);
  setScripts([]);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `You are a professional social media script writer. Generate ${scriptPrefs.numScripts} marketing video scripts based on the following:

BRAND INFO:
- Brand Name: ${businessInfo.brandName}
- Niche: ${businessInfo.niche}
- Target Audience: ${businessInfo.targetAudience}
- Offerings: ${businessInfo.offerings}
- Unique Value: ${businessInfo.uniqueValue}
- Additional Info: ${businessInfo.additionalInfo}

SCRIPT REQUIREMENTS:
- Video Length: ${scriptPrefs.length}
- Platform: ${scriptPrefs.platform}
- Include B-roll suggestions: ${scriptPrefs.includeBroll ? 'Yes' : 'No'}

For each script, provide:
1. A powerful hook (first 3 seconds)
2. Main script content optimized for ${scriptPrefs.platform}
3. B-roll suggestions (if applicable)
4. Caption text
5. Strong CTA (Call to Action)

Each script should focus on different aspects of the business (e.g., problem/solution, testimonial style, feature highlight, behind-the-scenes, value proposition, etc.).

CRITICAL: Respond ONLY with valid JSON in this exact format (no markdown, no backticks, no preamble):
{
  "scripts": [
    {
      "title": "Script title/focus",
      "hook": "Opening hook text",
      "mainScript": "Full script text",
      "brollSuggestions": ["suggestion1", "suggestion2"],
      "caption": "Caption text for post",
      "cta": "Call to action"
    }
  ]
}

Platform-specific optimization for ${scriptPrefs.platform}:
${scriptPrefs.platform === 'tiktok' ? '- Fast-paced, trendy, authentic tone\n- Use text overlays\n- Quick cuts' : ''}
${scriptPrefs.platform === 'instagram' ? '- Visual storytelling\n- Aesthetic focused\n- Strong first frame' : ''}
${scriptPrefs.platform === 'youtube' ? '- Longer form acceptable\n- Educational or entertainment value\n- Chapter markers if needed' : ''}
${scriptPrefs.platform === 'facebook' ? '- Community-focused\n- Shareable content\n- Value-driven' : ''}`
        }],
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.content || !Array.isArray(data.content)) {
      throw new Error('Invalid response format from API');
    }

    const text = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    console.log('Extracted text:', text);

    if (!text.trim()) {
      throw new Error('No text content in API response');
    }

    // Clean up the response - remove markdown code blocks if present
    let clean = text.trim();
    clean = clean.replace(/^```json\n?/i, '');
    clean = clean.replace(/\n?```$/i, '');
    clean = clean.trim();

    console.log('Cleaned text:', clean);

    const parsed = JSON.parse(clean);
    
    if (!parsed.scripts || !Array.isArray(parsed.scripts)) {
      throw new Error('Response does not contain scripts array');
    }

    setScripts(parsed.scripts);
    
  } catch (err) {
    console.error("Detailed error:", err);
    
    // More specific error messages
    let errorMessage = "Failed to generate scripts. ";
    
    if (err.message.includes('fetch')) {
      errorMessage += "Network error - please check your internet connection.";
    } else if (err.message.includes('JSON')) {
      errorMessage += "Invalid response format. Please try again.";
    } else if (err.message.includes('API request failed')) {
      errorMessage += "API error. The service might be temporarily unavailable.";
    } else {
      errorMessage += err.message || "Please try again.";
    }
    
    alert(errorMessage);
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
    return `🎬 ${script.title}

🪝 HOOK:
${script.hook}

📝 SCRIPT:
${script.mainScript}

${script.brollSuggestions?.length > 0 ? `🎥 B-ROLL:
${script.brollSuggestions.map(b => `- ${b}`).join('\n')}

` : ''}📱 CAPTION:
${script.caption}

🎯 CTA:
${script.cta}`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8" />
            Marketing Script Generator
          </h1>
          <p className="text-purple-100 mt-1">AI-powered scripts for your brand</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Business Profile</h2>
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
                  Include B-roll Suggestions
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
            </div>
          </div>
        </div>

        {scripts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Generated Scripts</h2>
            <div className="space-y-4">
              {scripts.map((script, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-purple-600">{script.title}</h3>
                    <button
                      onClick={() => copyToClipboard(formatScript(script), index)}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
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
                    
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">Caption</div>
                      <p className="text-gray-700">{script.caption}</p>
                    </div>
                    
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">CTA</div>
                      <p className="text-gray-800 font-semibold">{script.cta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
