let totalTime = 0.1 * 60; // 25 minutes
let remaining = totalTime;
let timerRunning = false;
let interval;

const timerDisplay = document.getElementById("timer");
const tracker = document.getElementById("tracker");
const progressPath = document.getElementById("progressPath");
const startBtn = document.getElementById("startBtn");

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

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  startBtn.textContent = "Running...";
  interval = setInterval(() => {
    remaining--;
    updateTimer();
    updateArc();
    if (remaining <= 0) {
      clearInterval(interval);
      timerDisplay.textContent = "Done!";
      startBtn.textContent = "Well Done!";
      timerRunning = false;
    }
  }, 1000);
}

startBtn.addEventListener("click", startTimer);
updateTimer();
updateArc();
