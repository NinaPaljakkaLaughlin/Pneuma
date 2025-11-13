// Configuration
const DEFAULT_STUDY_TIME = 25 * 60; // 25 minutes default
const BREAK_TIME = 5 * 60;  // 5 minutes
const TOTAL_SESSIONS = 2;   // Number of study sessions

// XP rewards based on mood difficulty
const MOOD_XP_REWARDS = {
  'unfocused': 5,
  'anxious': 4,
  'stressed': 4,
  'tired': 3,
  'calm': 2,
  'happy': 2,
  'confident': 2,
  'energetic': 1
};

// State
let studyTime = DEFAULT_STUDY_TIME;
let totalTime = studyTime;
let remaining = totalTime;
let timerRunning = false;
let interval;
let currentSession = 1;
let isBreak = false;
let sessionComplete = false;
let selectedMood = null;

// DOM Elements
const timerDisplay = document.getElementById("timer");
const tracker = document.getElementById("tracker");
const progressPath = document.getElementById("progressPath");
const startBtn = document.getElementById("startBtn");
const sessionHeader = document.querySelector(".session-header h2");

// Check if mood was selected
function checkMoodSelection() {
  selectedMood = localStorage.getItem('selectedMood');
  const storedTime = localStorage.getItem('studyTime');
  
  if (selectedMood && storedTime) {
    studyTime = parseInt(storedTime) * 60; // Convert minutes to seconds
    totalTime = studyTime;
    remaining = totalTime;
    return true;
  }
  return false;
}

function updateTimer() {
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  timerDisplay.textContent = `${m}:${s.toString().padStart(2, "0")}`;
}

function updateArc() {
  const progress = (totalTime - remaining) / totalTime;
  const dashOffset = 565 - 565 * progress;
  progressPath.style.strokeDashoffset = dashOffset;
  
  const radius = 180;
  const startX = 20;
  const startY = 180;
  const angle = Math.PI * progress;
  const x = startX + radius * (1 - Math.cos(angle));
  const y = startY - radius * Math.sin(angle);
  tracker.style.transform = `translate(${x}px, ${y}px)`;
}

function updateSessionHeader() {
  if (isBreak) {
    sessionHeader.textContent = `Break Time`;
  } else {
    sessionHeader.textContent = `Study Session ${currentSession}/${TOTAL_SESSIONS}`;
  }
}

function startNextPhase() {
  if (isBreak) {
    // Break is over, move to next study session or finish
    currentSession++;
    if (currentSession > TOTAL_SESSIONS) {
      // All sessions complete!
      sessionComplete = true;
      timerDisplay.textContent = "Complete!";
      startBtn.textContent = "Claim Your Prize!";
      sessionHeader.textContent = "🎉 Great Job!";
      
      // Calculate XP reward
      const xpEarned = MOOD_XP_REWARDS[selectedMood] || 2;
      
      // Store XP for the finished page
      let totalXP = parseInt(localStorage.getItem('totalXP') || '0');
      totalXP += xpEarned;
      localStorage.setItem('totalXP', totalXP.toString());
      localStorage.setItem('lastXPEarned', xpEarned.toString());
      
      return;
    }
    // Start next study session
    isBreak = false;
    totalTime = studyTime;
    remaining = totalTime;
    startBtn.textContent = "Start Study";
  } else {
    // Study session is over, start break
    isBreak = true;
    totalTime = BREAK_TIME;
    remaining = totalTime;
    startBtn.textContent = "Start Break";
  }
  
  updateSessionHeader();
  updateTimer();
  updateArc();
  timerRunning = false;
}

function startTimer() {
  // If session is complete, redirect to finished page
  if (sessionComplete) {
    window.location.href = "/finished";
    return;
  }
  
  // Check if mood is selected
  if (!selectedMood) {
    alert("Please select your mood first!");
    window.location.href = "/mood";
    return;
  }
  
  if (timerRunning) return;
  
  timerRunning = true;
  
  if (isBreak) {
    startBtn.textContent = "Break Running...";
  } else {
    startBtn.textContent = "Studying...";
  }
  
  interval = setInterval(() => {
    remaining--;
    updateTimer();
    updateArc();
    
    if (remaining <= 0) {
      clearInterval(interval);
      timerRunning = false;
      
      if (isBreak) {
        timerDisplay.textContent = "Break Done!";
      } else {
        timerDisplay.textContent = "Study Done!";
      }
      
      // Auto-start next phase after 2 seconds
      setTimeout(() => {
        startNextPhase();
      }, 2000);
    }
  }, 1000);
}

// Display selected mood
function displayMood() {
  const moodIndicator = document.getElementById('moodIndicator');
  if (selectedMood && moodIndicator) {
    const moodEmojis = {
      'unfocused': '😵‍💫',
      'stressed': '😰',
      'anxious': '😣',
      'calm': '😌',
      'tired': '😴',
      'energetic': '🤩',
      'happy': '😊',
      'confident': '😎'
    };
    moodIndicator.textContent = `${moodEmojis[selectedMood]} ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}`;
  }
}

// Sync localStorage with backend
async function syncWithBackend() {
  const selectedMood = localStorage.getItem('selectedMood');
  const studyTime = localStorage.getItem('studyTime');
  
  if (selectedMood && studyTime) {
    try {
      // Send to backend to sync Flask session
      const formData = new FormData();
      formData.append('emotion', selectedMood);
      
      await fetch('/mood', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  }
}

// Initialize
async function initialize() {
  // First sync with backend
  await syncWithBackend();
  
  if (checkMoodSelection()) {
    updateSessionHeader();
    updateTimer();
    updateArc();
    displayMood();
    startBtn.textContent = "Start Study";
  } else {
    sessionHeader.textContent = "Select Your Mood First";
    timerDisplay.textContent = "--:--";
    startBtn.textContent = "Choose Mood";
    const moodIndicator = document.getElementById('moodIndicator');
    if (moodIndicator) {
      moodIndicator.textContent = "No mood selected";
    }
  }
}

// Run initialization
initialize();

startBtn.addEventListener("click", startTimer);