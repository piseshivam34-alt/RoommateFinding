/**
 * Roommate Sync - Frontend Logic
 * Handles Authentication, Quiz State, and Score Animation
 */
 
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. AUTH PAGE LOGIC ---
    if (document.querySelector('.page-auth')) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabIndicator = document.querySelector('.tab-indicator');
        
        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Toggle Active Class
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Move Indicator
                if (index === 0) {
                    tabIndicator.style.transform = 'translateX(0)';
                } else {
                    tabIndicator.style.transform = 'translateX(100%)';
                }
                
                // Optional: Toggle Form fields logic could go here
                const btnText = btn.dataset.tab === 'login' ? 'Continue to Dashboard' : 'Create Account';
                document.querySelector('.btn-primary span').textContent = btnText;
            });
        });
    }
 
    // --- 2. QUIZ PAGE LOGIC ---
    if (document.querySelector('.page-quiz')) {
        let currentStep = 1;
        const totalSteps = 4;
        
        // Progress Bar & Text Elements
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const currentStepText = document.getElementById('currentStep');
        const checkItems = document.querySelectorAll('.check-item');
 
        // Save answer to localStorage whenever a radio option is selected
        const allRadios = document.querySelectorAll('.option-card input[type="radio"]');
        allRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                let answers = JSON.parse(localStorage.getItem('quizAnswers')) || {};
                answers[radio.name] = radio.value;
                localStorage.setItem('quizAnswers', JSON.stringify(answers));
            });
        });
 
        window.nextStep = function(step) {
            if(step > totalSteps) return;
            
            // Hide current card
            document.querySelector('.question-card.active').classList.remove('active');
            
            // Show next card
            const nextCard = document.getElementById(`q${step}`);
            nextCard.classList.add('active');
            
            // Update State
            currentStep = step;
            updateProgress();
        };
 
        window.prevStep = function(step) {
            if(step < 1) return;
            
            document.querySelector('.question-card.active').classList.remove('active');
            document.getElementById(`q${step}`).classList.add('active');
            
            currentStep = step;
            updateProgress();
        };
 
        function updateProgress() {
            // Update percentage
            const percent = (currentStep / totalSteps) * 100;
            progressBar.style.width = `${percent}%`;
            progressPercent.textContent = `${percent}%`;
            currentStepText.textContent = currentStep;
 
            // Update Sidebar Checklist
            checkItems.forEach((item, index) => {
                if (index < currentStep) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
 
        // Calculate compatibility score from quiz answers and go to result page
        window.submitQuiz = function() {
            const answers = JSON.parse(localStorage.getItem('quizAnswers')) || {};
 
            // Scoring tables per option (tweak these numbers anytime)
            const sleepScores  = { early: 92, regular: 88, late: 75 };
            const foodScores   = { omni: 80, veg: 85, strict: 70 };
            const cleanScores  = { messy: 65, average: 88, neat: 98 };
            const budgetScores = { thrifty: 70, balanced: 90, luxury: 74 };
 
            const sleep  = sleepScores[answers.sleep]   || 70;
            const food   = foodScores[answers.food]     || 70;
            const clean  = cleanScores[answers.clean]   || 70;
            const budget = budgetScores[answers.budget] || 70;
 
            const overall = Math.round((sleep + food + clean + budget) / 4);
 
            const result = { sleep, food, clean, budget, overall };
            localStorage.setItem('quizResult', JSON.stringify(result));
 
            window.location.href = 'result.html';
        };
    }
 
    // --- 3. RESULTS PAGE LOGIC ---
    if (document.querySelector('.page-result')) {
        // Read the score computed from the quiz, fall back to defaults if missing
        const result = JSON.parse(localStorage.getItem('quizResult')) ||
            { sleep: 92, food: 85, clean: 98, budget: 74, overall: 94 };
 
        const scoreCircle = document.getElementById('scoreCircle');
        const scoreNumber = document.getElementById('scoreNumber');
        const targetScore = result.overall;
        
        // Circular Progress Logic
        const radius = scoreCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        scoreCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        scoreCircle.style.strokeDashoffset = circumference;
        
        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            scoreCircle.style.strokeDashoffset = offset;
        }
 
        // Fill in the four category cards with the real computed values
        const sleepBar = document.getElementById('sleepBar');
        const sleepText = document.getElementById('sleepText');
        if (sleepBar && sleepText) {
            sleepBar.style.width = result.sleep + '%';
            sleepText.textContent = result.sleep + '% Match. Your circadian rhythms are highly compatible.';
        }
 
        const foodBar = document.getElementById('foodBar');
        const foodText = document.getElementById('foodText');
        if (foodBar && foodText) {
            foodBar.style.width = result.food + '%';
            foodText.textContent = result.food + '% Match. Shared preference for home cooking.';
        }
 
        const cleanBar = document.getElementById('cleanBar');
        const cleanText = document.getElementById('cleanText');
        if (cleanBar && cleanText) {
            cleanBar.style.width = result.clean + '%';
            cleanText.textContent = result.clean + '% Match. Critical alignment on tidiness standards.';
        }
 
        const budgetBar = document.getElementById('budgetBar');
        const budgetText = document.getElementById('budgetText');
        if (budgetBar && budgetText) {
            budgetBar.style.width = result.budget + '%';
            budgetText.textContent = result.budget + '% Match. Slight variance in utility spending preferences.';
        }
 
        // Animate Score on Load
        setTimeout(() => {
            setProgress(targetScore);
            
            // Counter Animation
            let start = 0;
            const duration = 2000;
            const stepTime = Math.abs(Math.floor(duration / targetScore));
            
            const timer = setInterval(() => {
                start += 1;
                scoreNumber.textContent = start;
                if (start == targetScore) {
                    clearInterval(timer);
                }
            }, stepTime);
            
        }, 500); // Small delay for visual impact
    }
    
    // --- 4. GLOBAL MOUSE PARALLAX (Subtle) ---
    const orbs = document.querySelectorAll('.orb');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
            
            // Apply slight transform based on mouse position
            // Note: Keeping existing animation via CSS, adding slight offset via JS
            // orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
});
 
