/**
 * src/components/GuidedVotingFlow.jsx
 * Mint Network - Guided Voting Flow Component
 * This component handles the guided voting flow for users, including iframe voting sites and bonus voting.
 * 
 * (c) 2025 RecursivePixels. All rights reserved. Used under license to Mint Network.
 * Modification and redistribution are not permitted without explicit permission.
 */
import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

// Debug flag - set to true to enable console logging
const DEBUG_VOTING = false;

// Voting sites with iframe compatibility (using real working URLs from our analysis)
const IFRAME_VOTING_SITES = [
  {
    id: 'minecraftservers-org',
    name: 'MinecraftServers.org',
    url: 'https://minecraftservers.org/vote/677258', // Hypixel's ID - working
    rewards: '500 Coins + Vote Key',
    estimatedTime: '30s',
    priority: 1
  },
  {
    id: 'minecraft-mp',
    name: 'Minecraft-MP.com', 
    url: 'https://minecraft-mp.com/server/347108/vote/', // Hypixel's ID - working
    rewards: '300 Coins + Vote Key',
    estimatedTime: '45s',
    priority: 2
  },
  {
    id: 'minecraftlist-org',
    name: 'MinecraftList.org',
    url: 'https://minecraftlist.org/vote/21507', // ManaCube's ID - working
    rewards: '400 Coins + Vote Key',
    estimatedTime: '30s',
    priority: 3
  },
  {
    id: 'top-minecraft-servers',
    name: 'Top Minecraft Servers',
    url: 'https://topminecraftservers.org/server/5516', // ManaCube's ID - working
    rewards: '350 Coins + Vote Key',
    estimatedTime: '40s',
    priority: 4
  },
  {
    id: 'mc-servers-top',
    name: 'MC Servers Top',
    url: 'https://mcservers.top/server/246', // InvadedLands ID - working
    rewards: '250 Coins + Vote Key',
    estimatedTime: '25s',
    priority: 5
  },
  {
    id: 'topg-minecraft',
    name: 'TopG Minecraft',
    url: 'https://topg.org/minecraft-servers/server-674826#vote', // Hypixel's ID - working
    rewards: '300 Coins + Vote Key',
    estimatedTime: '35s',
    priority: 6
  },
  {
    id: 'minecraft-best-servers',
    name: 'Minecraft Best Servers',
    url: 'https://minecraftbestservers.com/server-complex.4967/', // Complex Gaming - working
    rewards: '200 Coins + Vote Key',
    estimatedTime: '30s',
    priority: 7
  },
  {
    id: 'minecraft-co',
    name: 'Minecraft.co.com',
    url: 'https://minecraft.co.com/server/manacube/vote', // ManaCube - working
    rewards: '250 Coins + Vote Key',
    estimatedTime: '40s',
    priority: 8
  },
  {
    id: 'servers-minecraft-net',
    name: 'Servers-Minecraft.net',
    url: 'https://servers-minecraft.net/server-complex-gaming-1-21.58/vote', // Complex Gaming - working
    rewards: '300 Coins + Vote Key',
    estimatedTime: '35s',
    priority: 9
  }
];

// Bonus sites that require new tabs (using real URLs from our testing)
const NEW_TAB_SITES = [
  { 
    name: 'Planet Minecraft', 
    rewards: '150 Coins', 
    url: 'https://www.planetminecraft.com/server/mint-network/vote/'
  },
  { 
    name: 'Minecraft Server List', 
    rewards: '100 Coins', 
    url: 'https://minecraft-server-list.com/server/513843/vote/' // Hypixel
  },
  { 
    name: 'Minecraft Buzz', 
    rewards: '125 Coins', 
    url: 'https://minecraft.buzz/vote/4223' // Complex Gaming
  },
  { 
    name: 'Best Minecraft Servers', 
    rewards: '100 Coins', 
    url: 'https://best-minecraft-servers.co/server-hypixel.8612/vote'
  },
  { 
    name: 'Play Minecraft Servers', 
    rewards: '75 Coins', 
    url: 'https://play-minecraft-servers.com/minecraft-servers/complex-gaming/?tab=vote'
  },
  { 
    name: 'MC Server List', 
    rewards: '100 Coins', 
    url: 'https://mc-server-list.com/server/189-hypixel/vote/'
  }
];

const GuidedVotingFlow = ({ logoSrc }) => {
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [completedSites, setCompletedSites] = useState(() => {
    const saved = localStorage.getItem('mint-voting-completed');
    try {
      const sites = saved ? JSON.parse(saved) : [];
      if (DEBUG_VOTING) console.log('🔄 Initial completed sites loaded:', sites);
      return sites;
    } catch {
      if (DEBUG_VOTING) console.log('🔄 No valid completed sites data, starting fresh');
      return [];
    }
  });
  const [votingPhase, setVotingPhase] = useState('guided');
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isProcessingVote, setIsProcessingVote] = useState(false);
  const [showCooldownModal, setShowCooldownModal] = useState(false);
  const [timeUntilReady, setTimeUntilReady] = useState(0);
  const [sitesProcessed, setSitesProcessed] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  const currentSite = IFRAME_VOTING_SITES[currentSiteIndex];
  const totalGuidedSites = IFRAME_VOTING_SITES.length;
  const progressPercentage = Math.min((sitesProcessed / totalGuidedSites) * 100, 100);

  // Initial debug info
  if (DEBUG_VOTING) {
    console.log('🚀 GuidedVotingFlow component rendered');
    console.log('🚀 Current site index:', currentSiteIndex);
    console.log('🚀 Current site:', currentSite?.name);
    console.log('🚀 Completed sites:', completedSites);
    console.log('🚀 Sites processed:', sitesProcessed, '/', totalGuidedSites);
    console.log('🚀 Progress percentage:', progressPercentage.toFixed(1) + '%');
    console.log('🚀 Voting phase:', votingPhase);
    console.log('🚀 Has initialized:', hasInitialized);
  }

  // Save completed sites to localStorage
  useEffect(() => {
    if (DEBUG_VOTING) console.log('💾 Saving completed sites to localStorage:', completedSites);
    localStorage.setItem('mint-voting-completed', JSON.stringify(completedSites));
  }, [completedSites]);

  // Check if user has completed voting today and handle 24-hour cooldown
  useEffect(() => {
    if (DEBUG_VOTING) console.log('🕐 Running cooldown check effect');
    
    const lastVoteDate = localStorage.getItem('mint-last-vote-date');
    const lastVoteTimestamp = localStorage.getItem('mint-last-vote-timestamp');
    const today = new Date().toDateString();
    
    if (DEBUG_VOTING) {
      console.log('🕐 Last vote date:', lastVoteDate);
      console.log('🕐 Last vote timestamp:', lastVoteTimestamp);
      console.log('🕐 Today:', today);
    }
    
    if (lastVoteDate !== today) {
      if (DEBUG_VOTING) console.log('🕐 Different day detected');
      
      // Different day - check if 4+ hours have passed to show cooldown warning
      if (lastVoteTimestamp && lastVoteDate) { // Both must exist for proper comparison
        const lastVoteTime = parseInt(lastVoteTimestamp);
        const now = Date.now();
        const timeDiff = now - lastVoteTime;
        const fourHours = 4 * 60 * 60 * 1000;
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (DEBUG_VOTING) {
          console.log('🕐 Time since last vote:', Math.round(timeDiff / 1000 / 60), 'minutes');
          console.log('🕐 Four hours threshold:', timeDiff >= fourHours);
          console.log('🕐 Under 24 hours:', timeDiff < twentyFourHours);
        }
        
        // Only show cooldown modal if it's been 4+ hours but less than 24 hours
        if (timeDiff >= fourHours && timeDiff < twentyFourHours) {
          if (DEBUG_VOTING) console.log('🕐 Showing cooldown modal');
          setTimeUntilReady(twentyFourHours - timeDiff);
          setShowCooldownModal(true);
          return;
        }
      }
      
      // Reset for new day (either no previous vote or 24+ hours passed)
      if (DEBUG_VOTING) console.log('🕐 Resetting for new day - clearing all data');
      setCompletedSites([]);
      setSitesProcessed(0); // Reset progress when clearing completed sites
      localStorage.removeItem('mint-voting-completed');
      localStorage.setItem('mint-last-vote-date', today);
    } else {
      if (DEBUG_VOTING) console.log('🕐 Same day, no reset needed');
    }
  }, []);

  // Auto-skip to first unvoted site ONLY on initial load (not after each vote)
  useEffect(() => {
    if (hasInitialized) return; // Only run once
    
    if (DEBUG_VOTING) console.log('🎯 Running initial auto-skip effect, completed sites:', completedSites);
    
    // Find first site not in completed list
    let firstUnvotedIndex = IFRAME_VOTING_SITES.findIndex(site => !completedSites.includes(site.id));
    
    if (DEBUG_VOTING) {
      console.log('🎯 First unvoted site index:', firstUnvotedIndex);
      if (firstUnvotedIndex !== -1) {
        console.log('🎯 First unvoted site:', IFRAME_VOTING_SITES[firstUnvotedIndex].name);
      }
    }
    
    // If all sites are completed, go to bonus phase
    if (firstUnvotedIndex === -1) {
      if (DEBUG_VOTING) console.log('🎯 All sites completed, going to bonus phase');
      setVotingPhase('bonus');
      setSitesProcessed(totalGuidedSites);
      setHasInitialized(true);
      return;
    }
    
    // Set initial progress based on already completed sites (capped at total)
    const newProgress = Math.min(completedSites.length, totalGuidedSites);
    if (DEBUG_VOTING) console.log('🎯 Setting initial sites processed to:', newProgress, '(capped at', totalGuidedSites, ')');
    setSitesProcessed(newProgress);
    
    // Jump to first unvoted site if we need to
    if (firstUnvotedIndex !== currentSiteIndex) {
      if (DEBUG_VOTING) {
        console.log('🎯 Initial jump from site index', currentSiteIndex, 'to', firstUnvotedIndex);
        console.log('🎯 From:', IFRAME_VOTING_SITES[currentSiteIndex]?.name || 'none');
        console.log('🎯 To:', IFRAME_VOTING_SITES[firstUnvotedIndex].name);
      }
      setCurrentSiteIndex(firstUnvotedIndex);
      setIframeKey(prev => prev + 1);
    }
    
    setHasInitialized(true);
    if (DEBUG_VOTING) console.log('🎯 Initialization complete');
  }, [completedSites, totalGuidedSites, hasInitialized]);

  // Secret debug keybind: Ctrl+Shift+R to reset voting state
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        // Reset all voting state
        setCompletedSites([]);
        setCurrentSiteIndex(0);
        setSitesProcessed(0);
        setVotingPhase('guided');
        setIsProcessingVote(false);
        localStorage.removeItem('mint-voting-completed');
        localStorage.removeItem('mint-last-vote-date');
        localStorage.removeItem('mint-last-vote-timestamp');
        console.log('🔄 Voting state reset for debugging');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNext = () => {
    if (DEBUG_VOTING) console.log('➡️ handleNext called, current site:', currentSiteIndex, IFRAME_VOTING_SITES[currentSiteIndex]?.name);
    
    // Increment sites processed for visual feedback (capped at total)
    setSitesProcessed(prev => {
      const newValue = Math.min(prev + 1, totalGuidedSites);
      if (DEBUG_VOTING) console.log('➡️ Incrementing sites processed from', prev, 'to', newValue, '(capped at', totalGuidedSites, ')');
      return newValue;
    });
    
    // Find next site that is AFTER current index AND not already completed
    let nextSiteIndex = -1;
    for (let i = currentSiteIndex + 1; i < IFRAME_VOTING_SITES.length; i++) {
      if (!completedSites.includes(IFRAME_VOTING_SITES[i].id)) {
        nextSiteIndex = i;
        break;
      }
    }
    
    if (DEBUG_VOTING) {
      console.log('➡️ Looking for next unvoted site after index', currentSiteIndex);
      console.log('➡️ Next unvoted site index:', nextSiteIndex);
      if (nextSiteIndex !== -1) {
        console.log('➡️ Next unvoted site:', IFRAME_VOTING_SITES[nextSiteIndex].name);
      }
      
      // Show which sites we're skipping
      for (let i = currentSiteIndex + 1; i < IFRAME_VOTING_SITES.length; i++) {
        if (completedSites.includes(IFRAME_VOTING_SITES[i].id)) {
          console.log('➡️ Skipping already completed site:', IFRAME_VOTING_SITES[i].name);
        } else {
          break; // Stop at first unvoted site
        }
      }
    }
    
    if (nextSiteIndex !== -1) {
      if (DEBUG_VOTING) console.log('➡️ Moving to next unvoted site (skipping completed ones)');
      setCurrentSiteIndex(nextSiteIndex);
      setIframeKey(prev => prev + 1);
      setIframeLoading(true);
      setIsProcessingVote(false); // Reset processing state
    } else {
      // Reached end of all sites - go to bonus phase
      if (DEBUG_VOTING) console.log('➡️ No more unvoted sites ahead, going to bonus phase');
      setVotingPhase('bonus');
    }
  };

  const markAsCompleted = () => {
    if (DEBUG_VOTING) console.log('✅ markAsCompleted called for site:', currentSite.name, 'ID:', currentSite.id);
    
    // Immediate visual feedback
    setIsProcessingVote(true);
    
    if (!completedSites.includes(currentSite.id)) {
      if (DEBUG_VOTING) console.log('✅ Adding site to completed list');
      setCompletedSites([...completedSites, currentSite.id]);
      // Store both timestamp and date for 24-hour cooldown tracking
      const now = Date.now();
      const today = new Date().toDateString();
      localStorage.setItem('mint-last-vote-timestamp', now.toString());
      localStorage.setItem('mint-last-vote-date', today);
      if (DEBUG_VOTING) console.log('✅ Stored vote timestamp:', now, 'and date:', today);
    } else {
      if (DEBUG_VOTING) console.log('✅ Site already in completed list');
    }
    
    // Auto-advance after voting with reduced delay
    if (DEBUG_VOTING) console.log('✅ Auto-advancing in 800ms');
    setTimeout(handleNext, 800);
  };

  const handleSkip = () => {
    if (DEBUG_VOTING) console.log('⏭️ Skip button clicked for site:', currentSite.name);
    handleNext();
  };

  const handleProceedAnyway = () => {
    if (DEBUG_VOTING) console.log('🚀 Proceed anyway clicked, resetting all state');
    setShowCooldownModal(false);
    // Reset for new day
    setCompletedSites([]);
    setSitesProcessed(0);
    setCurrentSiteIndex(0);
    setHasInitialized(false);
    localStorage.removeItem('mint-voting-completed');
    localStorage.removeItem('mint-last-vote-timestamp'); // Clear timestamp too
    localStorage.setItem('mint-last-vote-date', new Date().toDateString());
    if (DEBUG_VOTING) console.log('🚀 Complete state reset - cleared timestamp and completed sites');
  };

  const handleGoBackToHub = () => {
    if (DEBUG_VOTING) console.log('🏠 Go back to hub clicked');
    window.location.href = '/';
  };

  // Cooldown Modal
  if (showCooldownModal) {
    return <CooldownModal 
      timeUntilReady={timeUntilReady} 
      onProceed={handleProceedAnyway}
      onGoBack={handleGoBackToHub}
    />;
  }

  if (votingPhase === 'bonus') {
    return (
      <BonusVotingPhase 
        completedCount={completedSites.length}
        onComplete={() => setVotingPhase('complete')}
        logoSrc={logoSrc}
      />
    );
  }

  if (votingPhase === 'complete') {
    return <VotingComplete completedCount={completedSites.length} />;
  }

  return (
    <div className="h-screen flex flex-col bg-dark-deepest">
      {/* Control Bar */}
      <div className="bg-dark-medium/20 backdrop-blur-md border-b border-royal-primary/20 shadow-lg">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          
          {/* Left Section - Logo & Title */}
          <div className="flex items-center gap-3 md:gap-4">
            <img 
              src={logoSrc} 
              alt="Mint Network" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg shadow-md"
            />
            {/* Title - Hidden on mobile */}
            <div className="relative hidden md:block">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-royal-primary via-accent-purple to-accent-cyan animate-pulse-slow">
                Daily Voting
              </h1>
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-royal-primary/30 via-accent-purple/30 to-accent-cyan/30 blur-lg -z-10 animate-pulse-slow"></div>
            </div>
          </div>

          {/* Center Section - Current Site Info (Hidden on mobile) */}
          <div className="text-center hidden md:block">
            <p className="text-text-primary font-medium">{currentSite.name}</p>
            <p className="text-text-muted text-sm">
              {currentSite.rewards} • ~{currentSite.estimatedTime}
            </p>
          </div>

          {/* Right Section - Navigation */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleSkip}
              disabled={isProcessingVote}
              className={`${
                isProcessingVote 
                  ? 'bg-transparent border-text-muted/50 text-text-muted/50 cursor-not-allowed'
                  : 'bg-transparent border-text-muted text-text-muted hover:bg-text-muted hover:text-dark-deepest hover:scale-105'
              } border-2 font-medium px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all duration-300 ease-in-out text-sm`}
            >
              Skip
            </button>
            <button
              onClick={markAsCompleted}
              disabled={isProcessingVote}
              className={`${
                isProcessingVote 
                  ? 'bg-status-success/40 border-status-success/60 text-status-success/80 cursor-not-allowed' 
                  : 'bg-status-success/20 border-status-success text-status-success hover:bg-status-success hover:text-dark-deepest hover:scale-105'
              } border-2 font-medium px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all duration-300 ease-in-out text-sm flex items-center gap-2`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Voted</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 md:px-6 pb-3 md:pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted text-sm">
              {currentSite.name}
            </span>
            <span className="text-text-muted text-sm">
              {sitesProcessed} of {totalGuidedSites} processed
            </span>
          </div>
          <div className="w-full bg-dark-light rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-royal-primary to-accent-purple h-2 rounded-full transition-all duration-500 ease-out glow-royal"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 relative">
        <iframe
          key={iframeKey}
          src={currentSite.url}
          className="w-full h-full border-0"
          title={`Vote on ${currentSite.name}`}
          onLoad={() => {
            if (DEBUG_VOTING) console.log('🌐 Iframe loaded for:', currentSite.name);
            setIframeLoading(false);
          }}
          onError={() => {
            if (DEBUG_VOTING) console.log('❌ Iframe failed to load:', currentSite.name);
            setIframeLoading(false);
          }}
        />
        
        {/* Loading Overlay */}
        {iframeLoading && (
          <div className="absolute inset-0 bg-dark-deepest flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-primary mx-auto mb-4"></div>
              <p className="text-text-muted">Loading {currentSite.name}...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BonusVotingPhase = ({ completedCount, onComplete, logoSrc }) => {
  const handleBonusVote = (siteUrl) => {
    if (DEBUG_VOTING) console.log('🎁 Opening bonus site:', siteUrl);
    window.open(siteUrl, '_blank');
  };

  const handleFinishVoting = () => {
    if (DEBUG_VOTING) console.log('🎁 Finish voting clicked');
    onComplete();
  };

  // Initialize particles
  useEffect(() => {
    const initParticles = async () => {
      // Wait for tsParticles to be available
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds max wait
      
      while (typeof window.tsParticles === 'undefined' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (typeof window.tsParticles !== 'undefined') {
        try {
          await window.tsParticles.load("bonus-particles", {
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              color: { value: "#9a0aab" },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                straight: false,
                outMode: "bounce"
              },
              number: {
                value: 60,
                density: { enable: true, value_area: 2000 }
              },
              opacity: {
                value: 0.7,
                random: true,
                anim: { enable: true, speed: 0.5, opacity_min: 0.2 }
              },
              shape: { type: "circle" },
              size: {
                value: 2,
                random: true,
                anim: { enable: true, speed: 1, size_min: 0.5 }
              }
            },
            interactivity: {
              events: { onhover: { enable: true, mode: "grab" } },
              modes: { grab: { distance: 120, line_linked: { opacity: 0.1 } } }
            },
            retina_detect: true
          });
        } catch (error) {
          console.warn('Failed to load particles:', error);
        }
      }
    };

    initParticles();
  }, []);

  return (
    <div className="min-h-screen bg-radial-dark space-bg relative overflow-hidden">
      {/* tsParticles background */}
      <div id="bonus-particles"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={logoSrc} 
                alt="Mint Network" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
              />
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
                Bonus Voting Sites
              </h1>
            </div>
            <p className="text-text-secondary text-base md:text-lg">
              Great job completing {completedCount} guided votes! Here are some bonus sites for extra rewards.
            </p>
            <div className="w-32 h-1 bg-gradient-royal mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Bonus Sites Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {NEW_TAB_SITES.map((site, index) => (
              <button
                key={index}
                onClick={() => handleBonusVote(site.url)}
                className="bg-dark-medium/20 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-dark-light/30 border border-royal-primary/20 hover:border-royal-primary/40 hover:shadow-2xl group w-full text-center"
              >
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-2 group-hover:text-royal-secondary transition-colors">
                  {site.name}
                </h3>
                <p className="text-sm text-accent-cyan mb-4">{site.rewards}</p>
                <div className="flex items-center justify-center gap-2 text-royal-primary group-hover:text-royal-secondary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">Vote Now</span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center">
            <button 
              className="bg-royal-primary hover:bg-royal-secondary active:bg-royal-dark text-text-primary font-medium px-8 py-3 rounded-lg transition-all duration-300 ease-in-out border border-royal-primary hover:border-royal-secondary shadow-lg hover:shadow-xl hover:scale-105"
              onClick={handleFinishVoting}
            >
              I've Finished Voting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VotingComplete = ({ completedCount }) => {
  const totalRewards = completedCount * 350;

  // Initialize particles
  useEffect(() => {
    const initParticles = async () => {
      // Wait for tsParticles to be available
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds max wait
      
      while (typeof window.tsParticles === 'undefined' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (typeof window.tsParticles !== 'undefined') {
        try {
          await window.tsParticles.load("complete-particles", {
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              color: { value: "#9a0aab" },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                straight: false,
                outMode: "bounce"
              },
              number: {
                value: 60,
                density: { enable: true, value_area: 2000 }
              },
              opacity: {
                value: 0.7,
                random: true,
                anim: { enable: true, speed: 0.5, opacity_min: 0.2 }
              },
              shape: { type: "circle" },
              size: {
                value: 2,
                random: true,
                anim: { enable: true, speed: 1, size_min: 0.5 }
              }
            },
            interactivity: {
              events: { onhover: { enable: true, mode: "grab" } },
              modes: { grab: { distance: 120, line_linked: { opacity: 0.1 } } }
            },
            retina_detect: true
          });
        } catch (error) {
          console.warn('Failed to load particles:', error);
        }
      }
    };

    initParticles();
  }, []);

  return (
    <div className="min-h-screen bg-radial-dark space-bg relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* tsParticles background */}
      <div id="complete-particles"></div>
      
      <div className="relative z-10 text-center max-w-2xl">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-status-success mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            Voting Complete!
          </h1>
          <p className="text-text-secondary text-base md:text-lg">
            Thank you for supporting Mint Network! Your estimated rewards based on indicated votes should be added to your account.
          </p>
        </div>

        <div className="bg-dark-medium/20 backdrop-blur-md rounded-2xl border border-royal-primary/20 p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-text-primary mb-4">
            Estimated Rewards
          </h2>
          <div className="space-y-2">
            <p className="text-accent-cyan text-lg md:text-xl">
              ~{completedCount} Vote Keys
            </p>
            <p className="text-accent-gold text-lg md:text-xl">
              ~{totalRewards.toLocaleString()} Coins
            </p>
          </div>
          <p className="text-text-muted text-sm mt-4">
            *Based on sites you indicated you voted on
          </p>
        </div>

        <button 
          className="bg-royal-primary hover:bg-royal-secondary active:bg-royal-dark text-text-primary font-medium px-8 py-3 rounded-lg transition-all duration-300 ease-in-out border border-royal-primary hover:border-royal-secondary shadow-lg hover:shadow-xl hover:scale-105"
          onClick={() => window.location.href = '/'}
        >
          Return to Hub
        </button>
      </div>
    </div>
  );
};

const CooldownModal = ({ timeUntilReady, onProceed, onGoBack }) => {
  const [countdown, setCountdown] = useState(timeUntilReady);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          onProceed(); // Auto-proceed when countdown reaches zero
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onProceed]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-radial-dark flex items-center justify-center p-4">
      <div className="bg-dark-medium/20 backdrop-blur-md rounded-2xl border border-royal-primary/20 p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
            Voting Cooldown
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            Some voting sites may not be ready for new votes yet. Full cooldown expires in:
          </p>
          <div className="bg-dark-deepest/50 rounded-lg p-4 mb-6">
            <div className="text-2xl font-mono font-bold text-accent-gold">
              {formatTime(countdown)}
            </div>
          </div>
          <p className="text-text-muted text-xs mb-6">
            You can proceed anyway, but some sites might reject your votes until the full 24-hour cooldown period has passed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onGoBack}
            className="bg-transparent border-2 border-text-muted text-text-muted hover:bg-text-muted hover:text-dark-deepest font-medium px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex-1"
          >
            Go Back to Hub
          </button>
          <button 
            onClick={onProceed}
            className="bg-royal-primary hover:bg-royal-secondary active:bg-royal-dark text-text-primary font-medium px-4 py-2 rounded-lg transition-all duration-300 ease-in-out border border-royal-primary hover:border-royal-secondary shadow-lg hover:shadow-xl flex-1"
          >
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedVotingFlow;
