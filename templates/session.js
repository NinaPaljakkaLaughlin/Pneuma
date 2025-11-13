// Configuration
const STUDY_TIME = 0.2 * 60; // 25 minutes
const BREAK_TIME = 0.1 * 60;  // 5 minutes
const TOTAL_SESSIONS = 2;   // Number of study sessions

// State
let totalTime = STUDY_TIME;
let remaining = totalTime;
let timerRunning = false;
let interval;
let currentSession = 1;
let isBreak = false;
let sessionComplete = false;

// DOM Elements
const timerDisplay = document.getElementById("timer");
const tracker = document.getElementById("tracker");
const progressPath = document.getElementById("progressPath");
const startBtn = document.getElementById("startBtn");
const sessionHeader = document.querySelector(".session-header h2");

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
      startBtn.textContent = "Wooo hoo! you did it!";
      sessionHeader.textContent = "";
      return;
    }
    // Start next study session
    isBreak = false;
    totalTime = STUDY_TIME;
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
  // If session is complete, redirect to finished.html
  if (sessionComplete) {
    window.location.href = "finished.html";
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

// Initialize
updateSessionHeader();
updateTimer();
updateArc();
startBtn.textContent = "Start Study";

startBtn.addEventListener("click", startTimer);