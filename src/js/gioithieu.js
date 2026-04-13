/**
 * Ngõ Nhỏ - gioithieu.html JavaScript
 */

// ========== HEADER SCROLL EFFECT ==========

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ========== ANIME.JS INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function () {
    // Hero section animations
    anime({
        targets: '#hero-title',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 300
    });

    anime({
        targets: '#hero-subtitle',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 600
    });

    anime({
        targets: '#cta-btn',
        translateY: [20, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .5)',
        delay: 900
    });

    anime({
        targets: '#video-btn',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 1100
    });

    anime({
        targets: '#hero-stats',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 1300
    });

    // Animated avatar images
    anime({
        targets: '#hero-stats img',
        translateY: [-10, 0],
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .6)',
        delay: anime.stagger(150, { start: 1400 })
    });

    // CTA button pulse effect on hover
    const ctaBtn = document.getElementById('cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', function () {
            anime({
                targets: this,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        ctaBtn.addEventListener('mouseleave', function () {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    }

    // Reveal sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    duration: 800,
                    easing: 'easeOutExpo'
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .price-card, .card-hover, .expert-card').forEach(function (el) {
        el.classList.add('reveal-section');
        observer.observe(el);
    });

    // Stagger animation for feature cards
    anime({
        targets: '.feature-card',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: anime.stagger(100)
    });

    // Feature icon floating animation
    anime({
        targets: '.feature-icon-wrapper i',
        translateY: [-5, 5, -5],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true,
        delay: anime.stagger(200, { start: 800 })
    });

    // Feature icon hover rotation
    document.querySelectorAll('.feature-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.feature-icon-wrapper i');
            if (icon) {
                anime({
                    targets: icon,
                    rotate: '1turn',
                    scale: 1.2,
                    duration: 600,
                    easing: 'easeOutExpo'
                });
            }
        });
        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.feature-icon-wrapper i');
            if (icon) {
                anime({
                    targets: icon,
                    rotate: '0deg',
                    scale: 1,
                    duration: 400,
                    easing: 'easeOutQuad'
                });
            }
        });
    });

    // Floating elements subtle animation
    anime({
        targets: '.float',
        scale: [1, 1.1, 1],
        duration: 4000,
        easing: 'easeInOutSine',
        loop: true
    });

    // Mood chart bar animations
    anime({
        targets: '.chart-bar',
        height: function (el) {
            return el.style.height;
        },
        scaleY: [0, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .6)',
        delay: anime.stagger(30, { start: 2000 })
    });

    // Mood icon interactions
    document.querySelectorAll('.mood-icon').forEach(function (icon) {
        icon.addEventListener('click', function () {
            document.querySelectorAll('.mood-icon').forEach(function (el) {
                el.classList.remove('selected');
            });
            this.classList.add('selected');
            anime({
                targets: this,
                scale: [1, 1.2, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .5)'
            });
        });
    });

    // Rainbow text animation for section titles
    anime({
        targets: 'h2',
        backgroundPosition: ['0% 50%', '200% 50%'],
        duration: 3000,
        easing: 'linear',
        loop: true
    });

    // Colorful floating orbs animation
    anime({
        targets: '.fixed[class*="bg-"]',
        translateX: function () { return anime.random(-20, 20); },
        translateY: function () { return anime.random(-20, 20); },
        scale: [1, 1.3, 1],
        duration: 5000,
        easing: 'easeInOutSine',
        loop: true,
        delay: anime.stagger(500)
    });

    // Pricing cards colorful entrance
    anime({
        targets: '.price-card',
        translateY: [50, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 700,
        easing: 'easeOutExpo',
        delay: anime.stagger(100, { start: 1500 })
    });

    // Expert cards animation
    anime({
        targets: '.expert-card',
        translateX: [-30, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: anime.stagger(150, { start: 2500 })
    });

    // Product cards animation
    anime({
        targets: '.card-hover',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad',
        delay: anime.stagger(100, { start: 3000 })
    });

    // Blog cards animation
    anime({
        targets: '#blog .card-hover',
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: anime.stagger(120, { start: 3500 })
    });

    // Initialize journal features
    initJournal();
});

// ========== JOURNALING FEATURES ==========

const morningPrompts = [
    "Hôm nay bạn cảm thấy biết ơn điều gì?",
    "Một điều bạn muốn hoàn thành hôm nay là gì?",
    "Điều gì khiến bạn cảm thấy hy vọng?",
    "Nếu có một điều bạn có thể thay đổi hôm nay, đó là gì?",
    "Điều gì mang lại năng lượng tích cực cho bạn?",
    "Bạn đang mong chờ điều gì hôm nay?",
    "Một điều bạn tự hào về bản thân là gì?"
];

const eveningPrompts = [
    "Điều gì khiến bạn mỉm cười hôm nay?",
    "Bạn đã học được điều gì mới?",
    "Điều gì đã vượt qua kỳ vọng của bạn?",
    "Ai là người bạn muốn cảm ơn hôm nay?",
    "Một khoảnh khắc đẹp trong ngày của bạn là gì?",
    "Điều gì bạn có thể làm tốt hơn ngày mai?",
    "Một điều bạn thích về bản thân hôm nay?"
];

let currentJournalTab = 'morning';
let recognition = null;
let isRecording = false;

function initJournal() {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const journalDateEl = document.getElementById('journal-date');
    if (journalDateEl) {
        journalDateEl.textContent = today.toLocaleDateString('vi-VN', options);
    }

    updatePrompt();
    loadJournalEntry();
    loadGratitude();
    loadStreak();
    generateWeeklyCalendar();

    const textarea = document.getElementById('journal-textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            const charCountEl = document.getElementById('char-count');
            if (charCountEl) {
                charCountEl.textContent = this.value.length + ' ký tự';
            }
        });
    }

    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            voiceBtn.title = 'Trình duyệt không hỗ trợ nhận dạng giọng nói';
            voiceBtn.disabled = true;
        }
    }
}

function switchJournalTab(tab) {
    currentJournalTab = tab;

    document.querySelectorAll('.journal-tab').forEach(el => el.classList.remove('active'));
    const tabEl = document.getElementById('tab-' + tab);
    if (tabEl) {
        tabEl.classList.add('active');
    }

    loadJournalEntry();
    updatePrompt();
}

function updatePrompt() {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const prompts = currentJournalTab === 'morning' ? morningPrompts : eveningPrompts;
    const promptIndex = (dayOfMonth - 1) % prompts.length;

    const promptEl = document.getElementById('current-prompt');
    if (promptEl) {
        promptEl.textContent = prompts[promptIndex];
    }
}

function saveJournalEntry() {
    const textarea = document.getElementById('journal-textarea');
    if (!textarea) return;

    const content = textarea.value;
    if (!content.trim()) {
        alert('Vui lòng viết gì đó trước khi lưu!');
        return;
    }

    const entry = {
        date: new Date().toISOString().split('T')[0],
        type: currentJournalTab,
        content: content,
        timestamp: new Date().toISOString()
    };

    const key = 'ngo_nho_journal_' + currentJournalTab;
    localStorage.setItem(key, JSON.stringify(entry));

    anime({
        targets: '.bg-white.rounded-2xl',
        scale: [1, 1.02, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });

    alert('Đã lưu nhật ký!');
}

function loadJournalEntry() {
    const key = 'ngo_nho_journal_' + currentJournalTab;
    const saved = localStorage.getItem(key);
    const textarea = document.getElementById('journal-textarea');
    const charCountEl = document.getElementById('char-count');

    if (saved && textarea) {
        const entry = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];

        if (entry.date === today) {
            textarea.value = entry.content;
            if (charCountEl) {
                charCountEl.textContent = entry.content.length + ' ký tự';
            }
        } else {
            textarea.value = '';
            if (charCountEl) {
                charCountEl.textContent = '0 ký tự';
            }
        }
    }
}

function saveGratitude() {
    const g1 = document.getElementById('gratitude-1');
    const g2 = document.getElementById('gratitude-2');
    const g3 = document.getElementById('gratitude-3');

    if (!g1 || !g2 || !g3) return;

    const val1 = g1.value, val2 = g2.value, val3 = g3.value;

    if (!val1.trim() && !val2.trim() && !val3.trim()) {
        alert('Vui lòng nhập ít nhất một điều bạn biết ơn!');
        return;
    }

    const entry = {
        date: new Date().toISOString().split('T')[0],
        items: [val1, val2, val3].filter(i => i.trim()),
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('ngo_nho_gratitude', JSON.stringify(entry));
    updateStreak();
    generateWeeklyCalendar();

    alert('Đã lưu lời biết ơn!');
}

function loadGratitude() {
    const saved = localStorage.getItem('ngo_nho_gratitude');
    const g1 = document.getElementById('gratitude-1');
    const g2 = document.getElementById('gratitude-2');
    const g3 = document.getElementById('gratitude-3');

    if (saved && g1 && g2 && g3) {
        const entry = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];

        if (entry.date === today) {
            g1.value = entry.items[0] || '';
            g2.value = entry.items[1] || '';
            g3.value = entry.items[2] || '';
        }
    }
}

function updateStreak() {
    const gratitudeLog = JSON.parse(localStorage.getItem('ngo_nho_gratitude_log') || '[]');
    const today = new Date().toISOString().split('T')[0];

    if (!gratitudeLog.includes(today)) {
        gratitudeLog.push(today);
        localStorage.setItem('ngo_nho_gratitude_log', JSON.stringify(gratitudeLog));
    }

    let streak = 0;
    const sortedDates = gratitudeLog.sort().reverse();

    for (let i = 0; i < sortedDates.length; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const expectedDate = checkDate.toISOString().split('T')[0];

        if (sortedDates.includes(expectedDate)) {
            streak++;
        } else {
            if (i === 0) continue;
            break;
        }
    }

    const streakCountEl = document.getElementById('streak-count');
    if (streakCountEl) {
        streakCountEl.textContent = streak;
    }

    if (streak > 0) {
        anime({
            targets: '#streak-flame',
            scale: [1, 1.3, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
        });
    }
}

function loadStreak() {
    updateStreak();
}

function generateWeeklyCalendar() {
    const calendar = document.getElementById('weekly-calendar');
    if (!calendar) return;

    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = new Date();
    const currentDay = today.getDay();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    const gratitudeLog = JSON.parse(localStorage.getItem('ngo_nho_gratitude_log') || '[]');

    let html = '';
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const isLogged = gratitudeLog.includes(dateStr);
        const isToday = dateStr === today.toISOString().split('T')[0];

        html += `
            <div class="calendar-day">
                <span class="text-xs ${isToday ? 'text-primary font-bold' : 'text-gray-400'}">${days[i]}</span>
                <div class="calendar-dot ${isLogged ? 'logged' : ''}"></div>
            </div>
        `;
    }

    calendar.innerHTML = html;
}

// ========== VOICE INPUT ==========

function toggleVoiceInput() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome hoặc Edge.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        isRecording = true;
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.classList.add('voice-recording');
            voiceBtn.innerHTML = '<i class="ri-stop-line"></i>';
        }
    };

    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        const textarea = document.getElementById('journal-textarea');
        const charCount = document.getElementById('char-count');
        if (textarea) {
            textarea.value += transcript;
            if (charCount) {
                charCount.textContent = textarea.value.length + ' ký tự';
            }
        }
    };

    recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        stopRecording();
    };

    recognition.onend = function() {
        stopRecording();
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
    isRecording = false;
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        voiceBtn.classList.remove('voice-recording');
        voiceBtn.innerHTML = '<i class="ri-mic-line"></i>';
    }
}
