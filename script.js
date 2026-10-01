// =========================
// ELEMENTS
// =========================
const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");
const sessionInput = document.getElementById("sessionInput");
const sessionNumberDisplay = document.getElementById("sessionNumber");
const totalSessionsDisplay = document.getElementById("totalSessions");
const dotsContainer = document.getElementById("dots");

let timerInterval = null;
let isRunning = false;
let mode = "focus";
let currentSession = 1;
let totalSessions = 4;
let remainingSeconds = 25 * 60;

// =========================
// DISPLAY
// =========================
function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateSessionDisplay() {
    sessionNumberDisplay.textContent = currentSession;
    totalSessionsDisplay.textContent = totalSessions;
    updateDots();
}

function updateDots() {
    dotsContainer.innerHTML = "";

    for (let i = 1; i <= totalSessions; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");

        if (i <= currentSession) {
            dot.classList.add("active");
        }

        dotsContainer.appendChild(dot);
    }
}

// =========================
// SOUND
// =========================
let audioContext = null;

const timerSound = new Audio("chime.mp3");

function playTimerSound() {
    return new Promise((resolve) => {
        let count = 0;

        function playAgain() {
            count++;
            timerSound.currentTime = 0;

            timerSound.onended = () => {
                if (count < 3) {
                    playAgain();
                } else {
                    resolve();
                }
            };

            timerSound.play();
        }

        playAgain();
    });
}

// =========================
// START TIMER
// =========================
function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startButton.textContent = "PAUSE";

    // Aktifkan audio setelah user menekan START
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    timerInterval = setInterval(() => {
        remainingSeconds--;

        if (remainingSeconds <= 0) {
            remainingSeconds = 0;
            updateTimerDisplay();

            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;

            playTimerSound().then(() => {
            switchMode();
            return;
    });

    return;
}

        updateTimerDisplay();
    }, 1000);
}

// =========================
// PAUSE
// =========================
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startButton.textContent = "START";
}

// =========================
// SWITCH MODE
// =========================
function switchMode() {
    if (mode === "focus") {
        if (currentSession < totalSessions) {
            mode = "break";
            remainingSeconds = Number(breakInput.value) * 60;
            modeDisplay.textContent = "BREAK";
        } else {
            finishTimer();
            return;
        }
    } else {
        currentSession++;
        mode = "focus";
        remainingSeconds = Number(focusInput.value) * 60;
        modeDisplay.textContent = "FOCUS";
        updateSessionDisplay();
    }

    updateTimerDisplay();

    // Otomatis lanjut ke mode berikutnya
    startTimer();
}

// =========================
// FINISH
// =========================
function finishTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;

    modeDisplay.textContent = "DONE";
    timerDisplay.textContent = "00:00";
    startButton.textContent = "START";
}

// =========================
// RESET
// =========================
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;

    mode = "focus";
    currentSession = 1;
    totalSessions = Number(sessionInput.value);
    remainingSeconds = Number(focusInput.value) * 60;

    modeDisplay.textContent = "FOCUS";
    startButton.textContent = "START";

    updateTimerDisplay();
    updateSessionDisplay();
}

// =========================
// BUTTON EVENTS
// =========================
startButton.addEventListener("click", () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetButton.addEventListener("click", resetTimer);

// =========================
// SETTINGS
// =========================
focusInput.addEventListener("change", () => {
    if (!isRunning && mode === "focus") {
        remainingSeconds = Number(focusInput.value) * 60;
        updateTimerDisplay();
    }
});

breakInput.addEventListener("change", () => {
    if (!isRunning && mode === "break") {
        remainingSeconds = Number(breakInput.value) * 60;
        updateTimerDisplay();
    }
});

sessionInput.addEventListener("change", () => {
    totalSessions = Number(sessionInput.value);
    updateSessionDisplay();
});

// =========================
// INITIALIZE
// =========================
updateTimerDisplay();
updateSessionDisplay();

// =========================
// CUSTOM BACKGROUND
// =========================
const customizeButton = document.getElementById("customizeButton");
const customizePanel = document.getElementById("customizePanel");
const backgroundInput = document.getElementById("backgroundInput");
const overlayInput = document.getElementById("overlayInput");
const removeBackgroundButton = document.getElementById("removeBackgroundButton");
const background = document.getElementById("background");
const overlay = document.getElementById("overlay");

customizeButton.addEventListener("click", () => {
    customizePanel.classList.toggle("open");
});

backgroundInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        const imageURL = reader.result;
        background.style.backgroundImage = `url("${imageURL}")`;
        localStorage.setItem("pomodoriBackground", imageURL);
    };

    reader.readAsDataURL(file);
});

overlayInput.addEventListener("input", () => {
    const opacity = overlayInput.value;

    overlay.style.background = `rgba(0, 0, 0, ${opacity})`;
    localStorage.setItem("pomodoriOverlay", opacity);
});

removeBackgroundButton.addEventListener("click", () => {
    background.style.backgroundImage = "none";
    localStorage.removeItem("pomodoriBackground");
});

const savedBackground = localStorage.getItem("pomodoriBackground");

if (savedBackground) {
    background.style.backgroundImage = `url("${savedBackground}")`;
}

const savedOverlay = localStorage.getItem("pomodoriOverlay");

if (savedOverlay !== null) {
    overlayInput.value = savedOverlay;
    overlay.style.background = `rgba(0, 0, 0, ${savedOverlay})`;
}

// =========================
// THEME PICKER
// =========================
const themeOptions = document.querySelectorAll(".theme-option");

function applyTheme(theme) {
    document.body.classList.remove(
        "theme-cozy",
        "theme-cute",
        "theme-glass",
        "theme-clean"
    );

    document.body.classList.add(`theme-${theme}`);

    themeOptions.forEach((button) => {
        button.classList.remove("active");

        if (button.dataset.theme === theme) {
            button.classList.add("active");
        }
    });

    localStorage.setItem("pomodoriTheme", theme);
}

themeOptions.forEach((button) => {
    button.addEventListener("click", () => {
        applyTheme(button.dataset.theme);
    });
});

const savedTheme = localStorage.getItem("pomodoriTheme");

if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme("cozy");
}