function showGift() {
    const giftElement = document.getElementById('gift');
    const videoModal = document.getElementById('video-modal');
    const video = document.getElementById('birthday-video');
    
    giftElement.classList.remove('hidden');
    videoModal.classList.remove('hidden');
    
    // Play video dengan promise handling
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Video berhasil diputar
            console.log("Video berhasil diputar");
        })
        .catch(error => {
            // Auto-play diblokir atau masalah lain
            console.log("Error memutar video:", error);
            // Tampilkan tombol play manual
            video.controls = true;
        });
    }
    
    // Menambahkan efek konfeti
    createConfetti();
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Menambahkan style untuk konfeti
const style = document.createElement('style');
style.textContent = `
    .confetti {
        position: fixed;
        top: -10px;
        width: 10px;
        height: 10px;
        animation: fall linear forwards;
    }
    
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Fungsi untuk foto
function enlargePhoto(img) {
    const modal = document.getElementById('photo-modal');
    const enlargedImg = document.getElementById('enlarged-photo');
    enlargedImg.src = img.src;
    modal.classList.remove('hidden');
    
    // Menambahkan event listener untuk tombol ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Menambahkan event listener untuk click di luar gambar
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('photo-modal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Mini Game: Love Quiz
let gameInterval;
let score = 0;
let isGameRunning = false;
let highScore = localStorage.getItem('highScore') || 0;
let gameContainer;
let currentQuestion = 0;

const questions = [
    {
        question: "Tentukan hasil dari lim(x→∞) (2x² + 3x) / (x² + 1)",
        options: ["0", "1", "2", "∞"],
        correct: 2 // 2 adalah jawaban benar
    },
    {
        question: "Jika matriks A = [[2, 1], [3, 4]], berapakah det(A)?",
        options: ["5", "8", "7", "10"],
        correct: 0 // 5 adalah jawaban benar (2*4 - 1*3 = 5)
    },
    {
        question: "Berapakah integral dari 2x cos(x) dx?",
        options: ["2x sin(x)", "2x sin(x) - 2 cos(x)", "x² sin(x)", "2 sin(x)"],
        correct: 1 // 2x sin(x) - 2 cos(x) adalah jawaban benar
    },
    {
        question: "Dalam segitiga ABC, jika sin A = 3/5, berapakah cos A?",
        options: ["4/5", "3/5", "5/3", "5/4"],
        correct: 0 // 4/5 adalah jawaban benar
    },
    {
        question: "Berapakah volume bola dengan jari-jari r = 3 satuan?",
        options: ["36π", "113.04", "113.097", "113.1"],
        correct: 0 // 36π adalah jawaban benar (4/3 * π * r³)
    }
];

function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    currentQuestion = 0;
    gameContainer = document.getElementById('game-container');
    
    // Reset game container
    updateGameDisplay();
    
    // Reset UI
    const gameBtn = document.querySelector('.game-btn');
    gameBtn.textContent = 'Kuis Sedang Berjalan...';
    gameBtn.disabled = true;
}

function updateGameDisplay() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestion];
    gameContainer.innerHTML = `
        <div class="quiz-container">
            <div class="question-number">Pertanyaan ${currentQuestion + 1}/${questions.length}</div>
            <div class="question">${question.question}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <button class="option-btn" onclick="checkAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
            <div class="score">Skor: ${score}</div>
        </div>
    `;
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestion];
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // Disable all buttons temporarily
    optionButtons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === question.correct) {
        // Correct answer
        optionButtons[selectedIndex].classList.add('correct');
        score += 20;
        createEffect("Benar! +20 ❤️");
    } else {
        // Wrong answer
        optionButtons[selectedIndex].classList.add('wrong');
        optionButtons[question.correct].classList.add('correct');
        createEffect("Coba Lagi! 💔");
    }

    // Wait and show next question
    setTimeout(() => {
        currentQuestion++;
        updateGameDisplay();
    }, 1500);
}

function createEffect(text) {
    const effect = document.createElement('div');
    effect.textContent = text;
    effect.className = 'quiz-effect';
    gameContainer.appendChild(effect);

    setTimeout(() => effect.remove(), 1500);
}

function endGame() {
    isGameRunning = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        alert(`🎉 Selamat! Rekor Baru: ${score} poin! 🎉\n Kamu Pinter banget Sayang!❤️`);
    } else {
        alert(`Kuis Selesai!\nSkor kamu: ${score}\nRekor tertinggi: ${highScore}\n Selamat ulang tahun yaa Sayang! 😊`);
    }

    // Reset UI
    const gameBtn = document.querySelector('.game-btn');
    gameBtn.textContent = 'Main Lagi!';
    gameBtn.disabled = false;

    // Show final screen
    gameContainer.innerHTML = `
        <div class="quiz-end">
            <h3>Kuis Selesai!</h3>
            <p>Skor Akhir: ${score} dari ${questions.length * 20}</p>
            <p class="love-message">${getLoveMessage(score)}</p>
        </div>
    `;
}

function getLoveMessage(score) {
    const maxScore = questions.length * 20;
    const percentage = (score / maxScore) * 100;
    
    if (percentage === 100) return "Kamu Pinter banget Sayang! ❤️❤️❤️";
    if (percentage >= 80) return "Wow! Kamu Pinter Sayang! 💖";
    if (percentage >= 60) return "Kamu cukup pintar! 💕";
    return "Ihhh soal gini doang ga bisa wleeee 😋!";
}

function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    const envelopeWrapper = document.getElementById('envelope-container');
    
    envelope.classList.add('open');
    
    setTimeout(() => {
        envelopeWrapper.classList.add('fade-out');
        setTimeout(() => {
            envelopeWrapper.style.display = 'none';
        }, 1000);
    }, 1500);
}

// Tambahkan event listener untuk video
document.addEventListener('DOMContentLoaded', function() {
    const videoModal = document.getElementById('video-modal');
    const video = document.getElementById('birthday-video');
    
    // Event listener untuk menutup modal
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            video.pause();
            video.currentTime = 0;
            videoModal.classList.add('hidden');
        }
    });
    
    // Event listener untuk error handling video
    video.addEventListener('error', function(e) {
        console.log("Error video:", video.error);
    });
}); 