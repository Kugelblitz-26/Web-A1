// German A1 Revision App JavaScript - Fixed Version

let currentSlide = 1;
const totalSlides = 18;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    updateNavigationButtons();
    initializeExercises();
    setupFinalTestHandlers();
});

// Slide Navigation Functions
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function goToSlide(slideNumber) {
    const slide = parseInt(slideNumber);
    if (slide >= 1 && slide <= totalSlides) {
        currentSlide = slide;
        showSlide(currentSlide);
    }
}

function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const currentSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
    }
    
    // Update progress and navigation
    updateProgress();
    updateNavigationButtons();
    updateSlideSelect();
    
    // Re-initialize exercises for the new slide
    initializeSlideExercises();
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const progressPercentage = (currentSlide / totalSlides) * 100;
    progressFill.style.width = progressPercentage + '%';
    progressText.textContent = `Slide ${currentSlide} of ${totalSlides}`;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
    
    if (currentSlide === 1) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }
    
    if (currentSlide === totalSlides) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

function updateSlideSelect() {
    const slideSelect = document.getElementById('slideSelect');
    slideSelect.value = currentSlide;
}

// Exercise Functions
function initializeExercises() {
    // Initialize all exercises on page load
    initializeSlideExercises();
}

function initializeSlideExercises() {
    // Initialize multiple choice questions for current slide
    const currentSlideElement = document.querySelector(`[data-slide="${currentSlide}"]`);
    if (currentSlideElement) {
        const options = currentSlideElement.querySelectorAll('.option');
        options.forEach(option => {
            // Remove any existing event listeners by cloning
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
            
            // Add fresh event listener
            newOption.addEventListener('click', function() {
                handleOptionClick(this);
            });
        });
        
        // Reset input validation for current slide
        const blankInputs = currentSlideElement.querySelectorAll('.blank-input');
        blankInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('correct', 'incorrect');
            });
        });
    }
}

function handleOptionClick(clickedOption) {
    const mcqContainer = clickedOption.closest('.mcq');
    const allOptions = mcqContainer.querySelectorAll('.option');
    
    // Remove previous selections
    allOptions.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Mark as selected
    clickedOption.classList.add('selected');
    
    // Check if correct after a short delay for visual feedback
    setTimeout(() => {
        if (clickedOption.dataset.correct === 'true') {
            clickedOption.classList.add('correct');
            showFeedback(mcqContainer, true, '✅ Richtig! Correct!');
            trackProgress(currentSlide, true);
        } else {
            clickedOption.classList.add('incorrect');
            // Show correct answer
            const correctOption = mcqContainer.querySelector('[data-correct="true"]');
            if (correctOption) {
                correctOption.classList.add('correct');
            }
            showFeedback(mcqContainer, false, '❌ Falsch. The correct answer is highlighted.');
            trackProgress(currentSlide, false);
        }
    }, 200);
}

function checkAnswers(button) {
    const exercise = button.closest('.exercise');
    const blankInputs = exercise.querySelectorAll('.blank-input');
    let correctCount = 0;
    let totalCount = blankInputs.length;
    
    blankInputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.answer.toLowerCase();
        
        input.classList.remove('correct', 'incorrect');
        
        if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            correctCount++;
        } else {
            input.classList.add('incorrect');
        }
    });
    
    // Show feedback with tips
    const isAllCorrect = correctCount === totalCount;
    let tips = null;
    
    if (!isAllCorrect) {
        if (currentSlide === 2) {
            tips = "Remember: 'ich' is always lowercase except at the beginning of a sentence.";
        } else if (currentSlide === 4) {
            tips = "Der/Den changes in Akkusativ, but Die/Das stay the same.";
        } else if (currentSlide === 6) {
            tips = "Irregular verbs like 'sein' have unique conjugations.";
        } else if (currentSlide === 7) {
            tips = "Possessive articles change based on gender: mein/meine.";
        }
    }
    
    const feedbackText = isAllCorrect 
        ? `🎉 Ausgezeichnet! ${correctCount}/${totalCount} correct!`
        : `${correctCount}/${totalCount} correct. Keep trying!`;
    
    showEnhancedFeedback(exercise, isAllCorrect, feedbackText, tips);
    
    // Mark slide as completed if all correct
    if (isAllCorrect) {
        markSlideCompleted(currentSlide);
    }
    
    trackProgress(currentSlide, isAllCorrect);
}

function showFeedback(container, isSuccess, message) {
    let feedback = container.querySelector('.feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'feedback';
        container.appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.className = isSuccess ? 'feedback success' : 'feedback error';
    feedback.style.display = 'block';
    
    // Hide feedback after 4 seconds
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 4000);
}

function showEnhancedFeedback(container, isSuccess, message, tips = null) {
    let feedback = container.querySelector('.feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'feedback';
        container.appendChild(feedback);
    }
    
    let feedbackHTML = `<strong>${message}</strong>`;
    if (tips) {
        feedbackHTML += `<br><small>💡 Tip: ${tips}</small>`;
    }
    
    feedback.innerHTML = feedbackHTML;
    feedback.className = isSuccess ? 'feedback success' : 'feedback error';
    feedback.style.display = 'block';
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 5000);
}

// Final Test Functions
function setupFinalTestHandlers() {
    // This will be called when DOM is ready and when slide 18 is shown
    setTimeout(() => {
        const finalTestOptions = document.querySelectorAll('.test-question .option');
        finalTestOptions.forEach(option => {
            option.addEventListener('click', function() {
                const question = this.closest('.test-question');
                const allOptions = question.querySelectorAll('.option');
                
                // Remove previous selections
                allOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Mark as selected
                this.classList.add('selected');
            });
        });
    }, 100);
}

function calculateFinalScore() {
    const finalScore = document.getElementById('finalScore');
    const scoreValue = document.getElementById('scoreValue');
    const scoreMessage = document.getElementById('scoreMessage');
    
    let score = 0;
    let totalQuestions = 5;
    
    // Check Question 1 (open text - just check if answered)
    const q1Input = document.querySelector('.test-question:nth-child(1) .test-input');
    if (q1Input && q1Input.value.trim().length > 0) {
        score++;
    }
    
    // Check Question 2 (MCQ)
    const q2Selected = document.querySelector('.test-question:nth-child(2) .option.selected');
    if (q2Selected && q2Selected.dataset.correct === 'true') {
        score++;
    }
    
    // Check Question 3 (fill in the blank)
    const q3Input = document.querySelector('.test-question:nth-child(3) .test-input');
    if (q3Input && q3Input.value.trim().toLowerCase() === 'sind') {
        score++;
    }
    
    // Check Question 4 (MCQ)
    const q4Selected = document.querySelector('.test-question:nth-child(4) .option.selected');
    if (q4Selected && q4Selected.dataset.correct === 'true') {
        score++;
    }
    
    // Check Question 5 (fill in the blank)
    const q5Input = document.querySelector('.test-question:nth-child(5) .test-input');
    if (q5Input && q5Input.value.trim().toLowerCase() === 'meine') {
        score++;
    }
    
    // Display score
    scoreValue.textContent = score;
    
    let message = '';
    if (score === 5) {
        message = '🎉 Perfekt! You have mastered German A1 basics!';
    } else if (score >= 4) {
        message = '👏 Sehr gut! Very good! Keep practicing!';
    } else if (score >= 3) {
        message = '👍 Gut! Good! Review the topics you missed.';
    } else {
        message = '📚 Keep studying! Review the materials and try again.';
    }
    
    scoreMessage.textContent = message;
    finalScore.style.display = 'block';
    
    // Highlight incorrect answers
    highlightFinalTestAnswers();
    
    // Scroll to results
    finalScore.scrollIntoView({ behavior: 'smooth' });
}

function highlightFinalTestAnswers() {
    // Highlight MCQ answers
    const mcqQuestions = document.querySelectorAll('.test-question .mcq');
    mcqQuestions.forEach(mcq => {
        const selected = mcq.querySelector('.option.selected');
        const correct = mcq.querySelector('.option[data-correct="true"]');
        
        if (selected) {
            if (selected.dataset.correct === 'true') {
                selected.classList.add('correct');
            } else {
                selected.classList.add('incorrect');
                if (correct) {
                    correct.classList.add('correct');
                }
            }
        }
    });
    
    // Highlight text inputs
    const testInputs = document.querySelectorAll('.test-input[data-answer]');
    testInputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.answer.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            input.style.borderColor = 'var(--color-success)';
            input.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
        } else {
            input.style.borderColor = 'var(--color-error)';
            input.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
        }
    });
}

// Keyboard Navigation
document.addEventListener('keydown', function(event) {
    // Don't interfere when user is typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
        return;
    }
    
    if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        nextSlide();
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previousSlide();
    } else if (event.key >= '1' && event.key <= '9') {
        const slideNum = parseInt(event.key);
        if (slideNum <= totalSlides) {
            goToSlide(slideNum);
        }
    }
});

// Progress Tracking
let userProgress = {
    completedSlides: new Set(),
    correctAnswers: 0,
    totalAttempts: 0
};

function trackProgress(slideNumber, isCorrect = null) {
    userProgress.completedSlides.add(slideNumber);
    
    if (isCorrect !== null) {
        userProgress.totalAttempts++;
        if (isCorrect) {
            userProgress.correctAnswers++;
        }
    }
    
    updateProgressStats();
}

function updateProgressStats() {
    const accuracy = userProgress.totalAttempts > 0 
        ? (userProgress.correctAnswers / userProgress.totalAttempts * 100).toFixed(1)
        : 0;
    
    console.log(`Progress: ${userProgress.completedSlides.size}/${totalSlides} slides, ${accuracy}% accuracy`);
}

function markSlideCompleted(slideNumber) {
    userProgress.completedSlides.add(slideNumber);
    
    // Visual indicator for completed slides
    const slideOption = document.querySelector(`#slideSelect option[value="${slideNumber}"]`);
    if (slideOption && !slideOption.textContent.includes('✓')) {
        slideOption.style.color = 'var(--color-success)';
        slideOption.textContent += ' ✓';
    }
}

// Pronunciation hints
function addPronunciationHints() {
    const pronunciations = {
        'ich': '[ɪç]',
        'heiße': '[ˈhaɪsə]',
        'bin': '[bɪn]',
        'komme': '[ˈkɔmə]',
        'wohne': '[ˈvoːnə]',
        'Vater': '[ˈfaːtɐ]',
        'Mutter': '[ˈmʊtɐ]',
        'Bruder': '[ˈbruːdɐ]',
        'Schwester': '[ˈʃvɛstɐ]',
        'lesen': '[ˈleːzn̩]',
        'schwimmen': '[ˈʃvɪmən]',
        'Wasser': '[ˈvasɐ]',
        'Brot': '[broːt]'
    };
    
    const germanWords = document.querySelectorAll('.qa-pair em, .family-member, .hobby-item, .food-items span');
    
    germanWords.forEach(word => {
        const cleanWord = word.textContent.trim().replace(/^(der|die|das)\s+/, '');
        if (pronunciations[cleanWord]) {
            word.style.cursor = 'help';
            word.title = `Pronunciation: ${pronunciations[cleanWord]}`;
        }
    });
}

// Initialize pronunciation hints when slides change
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addPronunciationHints, 500);
});

// Re-initialize when slide changes
function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const currentSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
    }
    
    // Update progress and navigation
    updateProgress();
    updateNavigationButtons();
    updateSlideSelect();
    
    // Re-initialize exercises for the new slide
    setTimeout(() => {
        initializeSlideExercises();
        addPronunciationHints();
        if (slideNumber === 18) {
            setupFinalTestHandlers();
        }
    }, 100);
}