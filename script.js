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

const sessionNumberDisplay =
    document.getElementById("sessionNumber");

const totalSessionsDisplay =
    document.getElementById("totalSessions");

const dotsContainer =
    document.getElementById("dots");

// =========================
// TIMER VARIABLES
// =========================
let timerInterval = null;
let isRunning = false;
let mode = "focus";
let currentSession = 1;
let totalSessions = 4;
let remainingSeconds = 25 * 60;

// =========================
// DISPLAY TIMER
// =========================
function updateTimerDisplay() {
    const minutes =
        Math.floor(remainingSeconds / 60);

    const seconds =
        remainingSeconds % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// =========================
// UPDATE SESSION DISPLAY
// =========================
function updateSessionDisplay() {
    sessionNumberDisplay.textContent =
        currentSession;

    totalSessionsDisplay.textContent =
        totalSessions;

    updateDots();
}

// =========================
// CREATE SESSION DOTS
// =========================
function updateDots() {
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= totalSessions; i++) {
        const dot =
            document.createElement("div");

        dot.classList.add("dot");

        if (i <= currentSession) {
            dot.classList.add("active");
        }

        dotsContainer.appendChild(dot);
    }
}

// =========================
// START TIMER
// =========================
function startTimer() {

    if (isRunning) {
        return;
    }
    isRunning = true;
    startButton.textContent = "PAUSE";
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();
        if (remainingSeconds <= 0) {
            playTimerSound();
            switchMode();

        }
    }, 1000);
}

// =========================
// PAUSE TIMER
// =========================
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "START";
}

// =========================
// SWITCH FOCUS / BREAK
// =========================
function switchMode() {
    clearInterval(timerInterval);
    isRunning = false;

    // =====================
    // FOCUS → BREAK
    // =====================
    if (mode === "focus") {
        // Kalau masih ada sesi berikutnya,
        // masuk break.
        if (currentSession < totalSessions) {
            mode = "break";
            remainingSeconds =
                Number(breakInput.value) * 60;
            modeDisplay.textContent = "BREAK";
        } else {
            // Semua sesi sudah selesai
            finishTimer();
            return;
        }
    }

    // =====================
    // BREAK → NEXT FOCUS
    // =====================
    else {
        currentSession++;
        mode = "focus";
        remainingSeconds =
            Number(focusInput.value) * 60;

        modeDisplay.textContent = "FOCUS";
        updateSessionDisplay();
    }

    updateTimerDisplay();
    startButton.textContent = "START";
    // otomatis lanjut
    startTimer();
}

// =========================
// FINISH
// =========================
function finishTimer() {
    clearInterval(timerInterval);
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
    isRunning = false;
    mode = "focus";
    currentSession = 1;
    totalSessions =
        Number(sessionInput.value);
    remainingSeconds =
        Number(focusInput.value) * 60;
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

resetButton.addEventListener("click", () => {
    resetTimer();
});

// =========================
// SETTINGS
// =========================
focusInput.addEventListener("change", () => {
    if (!isRunning && mode === "focus") {
        remainingSeconds =
            Number(focusInput.value) * 60;
        updateTimerDisplay();
    }
});

breakInput.addEventListener("change", () => {
    // Kalau sedang break dan timer belum berjalan, update durasi break.
    if (!isRunning && mode === "break") {
        remainingSeconds =
            Number(breakInput.value) * 60;
        updateTimerDisplay();
    }
});

sessionInput.addEventListener("change", () => {
    totalSessions =
        Number(sessionInput.value);
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
const customizeButton =
    document.getElementById("customizeButton");
const customizePanel =
    document.getElementById("customizePanel");
const backgroundInput =
    document.getElementById("backgroundInput");
const overlayInput =
    document.getElementById("overlayInput");
const removeBackgroundButton =
    document.getElementById("removeBackgroundButton");
const background =
    document.getElementById("background");
const overlay =
    document.getElementById("overlay");

// =========================
// OPEN / CLOSE CUSTOMIZE
// =========================
customizeButton.addEventListener("click", () => {
    customizePanel.classList.toggle("open");
});

// =========================
// CHANGE BACKGROUND
// =========================
backgroundInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();

    reader.onload = function () {
        const imageURL = reader.result;
        background.style.backgroundImage =
            `url("${imageURL}")`;
        // Save background
        localStorage.setItem(
            "pomodoriBackground",
            imageURL
        );
    };
    reader.readAsDataURL(file);
});

// =========================
// CHANGE OVERLAY
// =========================
overlayInput.addEventListener("input", () => {
    const opacity =
        overlayInput.value;
    overlay.style.background =
        `rgba(0, 0, 0, ${opacity})`;
    localStorage.setItem(
        "pomodoriOverlay",
        opacity
    );
});

// =========================
// REMOVE BACKGROUND
// =========================
removeBackgroundButton.addEventListener("click", () => {
    background.style.backgroundImage = "none";
    localStorage.removeItem(
        "pomodoriBackground"
    );
});

// =========================
// LOAD SAVED BACKGROUND
// =========================
const savedBackground =
    localStorage.getItem(
        "pomodoriBackground"
    );
if (savedBackground) {
    background.style.backgroundImage =
        `url("${savedBackground}")`;
}

// =========================
// LOAD SAVED OVERLAY
// =========================
const savedOverlay =
    localStorage.getItem(
        "pomodoriOverlay"
    );

if (savedOverlay !== null) {
    overlayInput.value =
        savedOverlay;

    overlay.style.background =
        `rgba(0, 0, 0, ${savedOverlay})`;
}

// =========================
// THEME PICKER
// =========================
const themeOptions =
    document.querySelectorAll(".theme-option");

// =========================
// APPLY THEME
// =========================
function applyTheme(theme) {
    // Remove previous themes
    document.body.classList.remove(
        "theme-cozy",
        "theme-cute",
        "theme-glass",
        "theme-clean"
    );
    // Add selected theme
    document.body.classList.add(
        `theme-${theme}`
    );
    // Update active button
    themeOptions.forEach((button) => {
        button.classList.remove("active");
        if (button.dataset.theme === theme) {
            button.classList.add("active");
        }
    });
    // Save theme
    localStorage.setItem(
        "pomodoriTheme",
        theme
    );
}

// =========================
// THEME BUTTON EVENTS
// =========================
themeOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTheme =
            button.dataset.theme;
        applyTheme(selectedTheme);
    });
});

// =========================
// LOAD SAVED THEME
// =========================
const savedTheme =
    localStorage.getItem(
        "pomodoriTheme"
    );
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    // Default theme
    applyTheme("cozy");
}