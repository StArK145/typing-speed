 // Sample texts of varying difficulty
 const texts = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "All that glitters is not gold.",
        "Practice makes perfect.",
        "Actions speak louder than words."
    ],
    medium: [
        "The five boxing wizards jump quickly to catch the thief who stole their prized jewels.",
        "Coding is the process of creating instructions for computers using programming languages.",
        "The sun was setting behind the mountains, casting long shadows across the valley below.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
    ],
    hard: [
        "The physicist's hypothesis about quantum entanglement contradicted established paradigms in theoretical physics, requiring extensive experimental validation.",
        "In a parliamentary democracy, the executive branch derives its democratic legitimacy from its ability to command the confidence of the legislative branch.",
        "The complexity of global economic systems necessitates multifaceted approaches to regulation that balance market efficiency with social justice considerations.",
        "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that can later be released to fuel the organisms' activities."
    ]
};

// DOM Elements
const textDisplay = document.getElementById("text-display");
const userInput = document.getElementById("user-input");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const progressBar = document.getElementById("progress");
const restartBtn = document.getElementById("restart-btn");
const newTextBtn = document.getElementById("new-text-btn");
const resultsModal = document.getElementById("results-modal");
const closeModal = document.getElementById("close-modal");
const tryAgainBtn = document.getElementById("try-again-btn");
const resultWpm = document.getElementById("result-wpm");
const resultAccuracy = document.getElementById("result-accuracy");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const gradeDisplay = document.getElementById("grade-display");

// Variables
let timer = 0;
let timerInterval;
let started = false;
let currentText = "";
let currentDifficulty = "medium";

// Initialize the app
function init() {
    loadNewText();
    setupEventListeners();
    adjustForScreenSize();
    
    // Add resize listener for responsive adjustments
    window.addEventListener('resize', adjustForScreenSize);
}

// Make adjustments based on screen size
function adjustForScreenSize() {
    const width = window.innerWidth;
    const container = document.querySelector('.container');
    
    if (width <= 320) {
        container.style.padding = '0.6rem';
        textDisplay.style.fontSize = '0.85rem';
        textDisplay.style.padding = '0.7rem';
        userInput.style.height = '80px';
    } else if (width <= 375) {
        container.style.padding = '0.75rem';
        textDisplay.style.fontSize = '0.9rem';
        textDisplay.style.padding = '0.8rem';
        userInput.style.height = '90px';
    } else {
        container.style.padding = '';
        textDisplay.style.fontSize = '';
        textDisplay.style.padding = '';
        userInput.style.height = '';
    }
}

// Load a new text based on selected difficulty
function loadNewText() {
    const textsArray = texts[currentDifficulty];
    const randomIndex = Math.floor(Math.random() * textsArray.length);
    currentText = textsArray[randomIndex];
    
    // Display the text with character spans for highlighting
    textDisplay.innerHTML = currentText.split('').map(char => 
        `<span class="char">${char}</span>`
    ).join('');
    
    resetTest();
}

// Set up all event listeners
function setupEventListeners() {
    userInput.addEventListener("input", handleInput);
    restartBtn.addEventListener("click", resetTest);
    newTextBtn.addEventListener("click", loadNewText);
    closeModal.addEventListener("click", () => resultsModal.style.display = "none");
    tryAgainBtn.addEventListener("click", () => {
        resultsModal.style.display = "none";
        loadNewText();
    });
    
    // Close modal if clicking outside the content
    resultsModal.addEventListener("click", function(e) {
        if (e.target === this) {
            resultsModal.style.display = "none";
        }
    });
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            difficultyBtns.forEach(b => b.classList.remove("active"));
            // Add active class to clicked button
            btn.classList.add("active");
            currentDifficulty = btn.getAttribute("data-difficulty");
            loadNewText();
        });
    });
}

// Handle user input
function handleInput() {
    if (!started) {
        started = true;
        textDisplay.classList.add("active");
        startTimer();
    }
    
    let typedText = userInput.value;
    let textChars = textDisplay.querySelectorAll(".char");
    let correctChars = 0;
    
    // Check character by character for accuracy
    for (let i = 0; i < textChars.length; i++) {
        // Remove all highlight classes first
        textChars[i].className = "char";
        
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                textChars[i].classList.add("highlight-correct");
                correctChars++;
            } else {
                textChars[i].classList.add("highlight-incorrect");
            }
        }
        
        // Highlight the current character position
        if (i === typedText.length) {
            textChars[i].classList.add("highlight-current");
        }
    }
    
    // Calculate stats
    let accuracy = Math.floor((correctChars / Math.max(typedText.length, 1)) * 100);
    let progress = (typedText.length / currentText.length) * 100;
    let wpm = calculateWPM(typedText.length, timer);
    
    // Update displays
    wpmDisplay.innerText = wpm;
    accuracyDisplay.innerText = accuracy;
    progressBar.style.width = `${progress}%`;
    
    // Check if test is complete
    if (typedText.length === currentText.length) {
        completeTest();
    }
}

// Calculate WPM
function calculateWPM(charCount, seconds) {
    // Standard calculation: (characters / 5) / (time in minutes)
    // where 5 characters is considered an average word
    return Math.round((charCount / 5) / (seconds / 60)) || 0;
}

// Determine performance grade
function getPerformanceGrade(wpm, accuracy) {
    if (wpm >= 60 && accuracy >= 95) {
        return { grade: "A", message: "Excellent!" };
    } else if (wpm >= 40 && accuracy >= 90) {
        return { grade: "B", message: "Good Job!" };
    } else {
        return { grade: "C", message: "Keep Practicing!" };
    }
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timeDisplay.innerText = timer;
        
        // Update WPM in real-time
        let typedText = userInput.value;
        let wpm = calculateWPM(typedText.length, timer);
        wpmDisplay.innerText = wpm;
    }, 1000);
}

// Complete the test
function completeTest() {
    clearInterval(timerInterval);
    textDisplay.classList.remove("active");
    textDisplay.classList.add("completed");
    
    // Calculate final stats
    const finalWpm = parseInt(wpmDisplay.innerText);
    const finalAccuracy = parseInt(accuracyDisplay.innerText);
    
    // Get performance grade
    const performance = getPerformanceGrade(finalWpm, finalAccuracy);
    
    // Update results modal
    resultWpm.innerText = finalWpm;
    resultAccuracy.innerText = finalAccuracy;
    
    // Update grade display
    gradeDisplay.textContent = performance.message;
    gradeDisplay.className = `grade grade-${performance.grade.toLowerCase()}`;
    
    // Show results modal
    resultsModal.style.display = "flex";
}

// Reset the test
function resetTest() {
    clearInterval(timerInterval);
    userInput.value = "";
    timer = 0;
    started = false;
    
    // Reset displays
    timeDisplay.innerText = "0";
    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "100";
    progressBar.style.width = "0%";
    
    // Reset text display highlights
    const textChars = textDisplay.querySelectorAll(".char");
    textChars.forEach(char => {
        char.className = "char";
    });
    
    textDisplay.classList.remove("active", "completed");
    
    // Focus on the input
    userInput.focus();
}

// Initialize the app
init();