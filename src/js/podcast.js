document.addEventListener("DOMContentLoaded", function () {
    // ============ DATA ============
    const podcasts = [
        {
            id: 1,
            title: "Nhạc lo-fi thư giãn",
            author: "Lofi Girl",
            duration: "60 phút",
            category: "calming",
            moodTag: ["low", "medium", "high"],
            embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
            thumbnail: "https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg",
            description: "Nhạc lo-fi chill để thư giãn, học tập hoặc làm việc"
        },
        {
            id: 2,
            title: "Thiền định buổi sáng",
            author: "Meditation Coach",
            duration: "20 phút",
            category: "meditation",
            moodTag: ["low", "medium"],
            embedUrl: "https://www.youtube.com/embed/hApzlfPGBGw?si=UrWSwEDm3ByuXSJH",
            thumbnail: "https://img.youtube.com/vi/hApzlfPGBGw/mqdefault.jpg",
            description: "PODCAST: Một Mình Cũng Là Cách Chữa Lành Hiệu Quả!"
        },
        {
            id: 3,
            title: "Câu chuyện ngủ ngon",
            author: "Sleep Stories",
            duration: "45 phút",
            category: "sleep",
            moodTag: ["low", "medium", "high"],
            embedUrl: "https://open.spotify.com/embed/episode/2mCFcEKUwi8Xr1pePBYBjF?utm_source=generator&theme=0",
            thumbnail: "https://i.pinimg.com/1200x/4e/93/cb/4e93cb6397c65a554bfca3c3fad1814d.jpg",
            description: "Câu chuyện nhẹ nhàng giúp bạn thư giãn và dễ ngủ"
        },
        {
            id: 4,
            title: "Nếu cả đời không rực rỡ",
            author: "Sunhuyn",
            duration: "3 giờ",
            category: "calming",
            moodTag: ["low", "medium", "high"],
            embedUrl: "https://open.spotify.com/embed/episode/26kXdYSVYjmw2hYb1otHFi?si=nDm5Zi9ORd2eRsrpCiQzTw",
            thumbnail: "https://i.pinimg.com/1200x/fa/11/d0/fa11d05275ba52485c2f964eef620f52.jpg",
            description: "Tiếng mưa rơi để thư giãn tinh thần"
        },
        {
            id: 5,
            title: "Kể cho tôi nghe",
            author: "Ngõ Nhỏ",
            duration: "15 phút",
            category: "advice",
            moodTag: ["low"],
            embedUrl: "https://open.spotify.com/embed/episode/4SHOYYVSe1d5uDBb2KM1HK?si=0YxATi-WTOSmHMzJ5nxSWA",
            thumbnail: "https://i.pinimg.com/736x/6c/f8/8a/6cf88a29dfcf16e32fc7c9d535f36bc0.jpg",
            description: "Những lời yêu thương dành cho bạn trong những ngày khó khăn"
        },
        {
            id: 6,
            title: "Về những tiếng yêu chưa thành lời",
            author: "Chill Vibes",
            duration: "90 phút",
            category: "sleep",
            moodTag: ["low", "medium"],
            embedUrl: "https://open.spotify.com/embed/episode/3zQWqjvyyDFSflEK4bJT2s?si=-P9rJts3QFCCHW-Q_N57Yw",
            thumbnail: "https://i.pinimg.com/736x/a8/dc/fd/a8dcfd49ccd3a3e4bc20316821b619ac.jpg",
            description: "Tiếng mưa và cà phê - hoàn hảo cho buổi tối thư giãn"
        }
    ];

    const ambientSounds = {
        rain: "https://www.soundjay.com/nature/rain-01.mp3",
        forest: "https://www.soundjay.com/nature/forest-1.mp3",
        ocean: "https://www.soundjay.com/nature/ocean-wave-1.mp3",
        fire: "https://www.soundjay.com/nature/fire-1.mp3",
        wind: "https://www.soundjay.com/nature/wind-1.mp3"
    };

    // ============ STATE ============
    let favorites = JSON.parse(localStorage.getItem("podcastFavorites")) || [];
    let history = JSON.parse(localStorage.getItem("podcastHistory")) || [];
    let currentCategory = "all";
    let currentTab = "favorites";
    let currentPlaying = null;
    let activeSound = null;

    // ============ DOM ELEMENTS ============
    const podcastList = document.getElementById("podcastList");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const favoritesList = document.getElementById("favoritesList");
    const historyList = document.getElementById("historyList");
    const nowPlaying = document.getElementById("nowPlaying");
    const nowPlayingTitle = document.getElementById("nowPlayingTitle");
    const nowPlayingAuthor = document.getElementById("nowPlayingAuthor");
    const closePlayerBtn = document.getElementById("closePlayer");
    const ambientAudio = document.getElementById("ambientAudio");
    const ambientBtns = document.querySelectorAll(".ambient-btn");
    const recommendedList = document.getElementById("recommendedList");
    const miniMoodChartDom = document.getElementById("miniMoodChart");

    // ============ INIT ============
    initMoodGreeting();
    renderPodcasts();
    renderFavorites();
    renderHistory();
    renderRecommended();
    initMiniMoodChart();
    updateStats();

    // ============ FUNCTIONS ============

    // Lấy mood hiện tại từ localStorage
    function getCurrentMood() {
        const moods = JSON.parse(localStorage.getItem("moods")) || [];
        if (moods.length === 0) return null;
        const latestMood = moods[moods.length - 1];
        return latestMood.moodValue;
    }

    // Chuyển mood value sang mood tag
    function moodToTag(moodValue) {
        if (moodValue <= 2) return "low";
        if (moodValue === 3) return "medium";
        return "high";
    }

    // Hiển thị lời chào theo mood
    function initMoodGreeting() {
        const moodMessage = document.getElementById("moodMessage");
        const currentMood = getCurrentMood();

        if (currentMood) {
            const moodTag = moodToTag(currentMood);
            const messages = {
                low: "Tôi hiểu, hôm nay có vẻ khó khăn. Đây là vài gợi ý để bạn cảm thấy tốt hơn nhé.",
                medium: "Cảm ơn bạn đã chia sẻ. Hãy thư giãn với vài podcast hay nhé!",
                high: "Tuyệt vời! Hãy giữ năng lượng tích cực này với những podcast truyền cảm hứng!"
            };
            moodMessage.textContent = messages[moodTag] || "Hãy nghe podcast để thư giãn nhé!";
        } else {
            moodMessage.textContent = "Hãy nghe podcast để thư giãn và chữa lành tâm hồn nhé!";
        }
    }

    // Render danh sách podcast
    function renderPodcasts() {
        let filteredPodcasts = podcasts;
        if (currentCategory !== "all") {
            filteredPodcasts = podcasts.filter(p => p.category === currentCategory);
        }

        if (filteredPodcasts.length === 0) {
            podcastList.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="ri-headphone-line text-3xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-700 mb-2">Không tìm thấy podcast</h3>
                    <p class="text-gray-500 text-sm">Thử chọn danh mục khác nhé</p>
                </div>
            `;
            return;
        }

        podcastList.innerHTML = filteredPodcasts.map(podcast => {
            const isFavorite = favorites.includes(podcast.id);
            const isSpotify = podcast.embedUrl.includes("open.spotify.com") || podcast.embedUrl.includes("spotify.com/embed");
            return `
                <div class="podcast-card glass-card rounded-2xl p-4 mb-4 cursor-pointer" data-id="${podcast.id}">
                    <div class="flex items-start space-x-4">
                        <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                            <img src="${podcast.thumbnail}" alt="${podcast.title}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/80x80?text=Podcast'">
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-gray-800 mb-1">${podcast.title}</h3>
                            <p class="text-sm text-gray-500 mb-2">${podcast.author} • ${podcast.duration}</p>
                            <p class="text-sm text-gray-600 mb-3 line-clamp-2">${podcast.description}</p>
                            <div class="flex items-center space-x-2">
                                <button class="play-btn px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium hover:shadow-lg transition-all" data-id="${podcast.id}">
                                    <i class="ri-play-fill mr-1"></i>Nghe
                                </button>
                                <button class="favorite-btn p-1.5 rounded-full hover:bg-gray-100 transition-all ${isFavorite ? 'text-red-500' : 'text-gray-400'}" data-id="${podcast.id}">
                                    <i class="ri-${isFavorite ? 'heart-fill' : 'heart-line'}"></i>
                                </button>
                                <span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">${getCategoryLabel(podcast.category)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // Add event listeners
        document.querySelectorAll(".podcast-card").forEach(card => {
            card.addEventListener("click", () => {
                playPodcast(parseInt(card.dataset.id));
            });
        });

        document.querySelectorAll(".play-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                playPodcast(parseInt(btn.dataset.id));
            });
        });

        document.querySelectorAll(".favorite-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorite(parseInt(btn.dataset.id));
            });
        });
    }

    function getCategoryLabel(category) {
        const labels = {
            calming: "Calming",
            meditation: "Meditation",
            sleep: "Sleep",
            advice: "Lời khuyên"
        };
        return labels[category] || category;
    }

    // Phát podcast
    function playPodcast(podcastId) {
        const podcast = podcasts.find(p => p.id === podcastId);
        if (!podcast) return;

        currentPlaying = podcast;

        // Hiện player
        nowPlayingTitle.textContent = podcast.title;
        nowPlayingAuthor.textContent = podcast.author;
        nowPlaying.classList.remove("hidden");

        // Thêm vào lịch sử
        if (!history.includes(podcastId)) {
            history.unshift(podcastId);
            if (history.length > 20) history.pop();
            localStorage.setItem("podcastHistory", JSON.stringify(history));
            renderHistory();
            updateStats();
        }

        // Tạo modal player
        showPlayerModal(podcast);
    }

    // Hiển thị modal player
    function showPlayerModal(podcast) {
        // Đóng modal cũ nếu có
        const existingModal = document.getElementById("playerModal");
        if (existingModal) existingModal.remove();

        const isSpotify = podcast.embedUrl.includes("open.spotify.com") || podcast.embedUrl.includes("spotify.com/embed");
        const modal = document.createElement("div");
        modal.id = "playerModal";
        modal.className = "fixed inset-0 bg-black/80 flex items-center justify-center z-[70]";

        // Xây dựng URL embed - nếu đã có params thì không thêm
        let embedSrc = podcast.embedUrl;
        if (isSpotify && !embedSrc.includes('utm_source')) {
            embedSrc += (embedSrc.includes('?') ? '&' : '?') + 'utm_source=generator&theme=0';
        }

        if (isSpotify) {
            modal.innerHTML = `
                <div class="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden">
                    <div class="p-4 border-b">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-semibold text-gray-800">${podcast.title}</h3>
                                <p class="text-sm text-gray-500">${podcast.author} • ${podcast.duration}</p>
                            </div>
                            <button onclick="document.getElementById('playerModal').remove()" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                <i class="ri-close-line text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <iframe style="border-radius:12px" src="${embedSrc}" width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            `;
        } else {
            modal.innerHTML = `
                <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 overflow-hidden">
                    <div class="relative aspect-video">
                        <iframe width="100%" height="100%" src="${podcast.embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-semibold text-gray-800">${podcast.title}</h3>
                                <p class="text-sm text-gray-500">${podcast.author} • ${podcast.duration}</p>
                            </div>
                            <button onclick="document.getElementById('playerModal').remove()" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                <i class="ri-close-line text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        document.body.appendChild(modal);
    }

    // Yêu thích podcast
    function toggleFavorite(podcastId) {
        const index = favorites.indexOf(podcastId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(podcastId);
        }
        localStorage.setItem("podcastFavorites", JSON.stringify(favorites));
        renderPodcasts();
        renderFavorites();
        updateStats();
    }

    // Render favorites
    function renderFavorites() {
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="ri-heart-add-line text-3xl mb-2"></i>
                    <p>Chưa có podcast yêu thích</p>
                </div>
            `;
            return;
        }

        const favoritePodcasts = podcasts.filter(p => favorites.includes(p.id));
        favoritesList.innerHTML = favoritePodcasts.map(p => `
            <div class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onclick="playPodcast(${p.id})">
                <img src="${p.thumbnail}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/40x40?text=P'">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 truncate">${p.title}</p>
                    <p class="text-xs text-gray-500">${p.duration}</p>
                </div>
                <button class="favorite-btn text-red-500" data-id="${p.id}">
                    <i class="ri-heart-fill"></i>
                </button>
            </div>
        `).join("");

        // Re-attach event listeners
        favoritesList.querySelectorAll(".favorite-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorite(parseInt(btn.dataset.id));
            });
        });
    }

    // Render history
    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="ri-time-line text-3xl mb-2"></i>
                    <p>Chưa có lịch sử nghe</p>
                </div>
            `;
            return;
        }

        const historyPodcasts = podcasts.filter(p => history.includes(p.id));
        historyList.innerHTML = historyPodcasts.map(p => `
            <div class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onclick="playPodcast(${p.id})">
                <img src="${p.thumbnail}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/40x40?text=P'">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 truncate">${p.title}</p>
                    <p class="text-xs text-gray-500">${p.author}</p>
                </div>
                <i class="ri-play-circle-line text-gray-400"></i>
            </div>
        `).join("");
    }

    // Gợi ý theo mood
    function renderRecommended() {
        const currentMood = getCurrentMood();
        let recommended = podcasts;

        if (currentMood) {
            const moodTag = moodToTag(currentMood);
            recommended = podcasts.filter(p => p.moodTag.includes(moodTag));
            if (recommended.length < 3) {
                recommended = podcasts.slice(0, 3);
            }
        } else {
            recommended = podcasts.slice(0, 3);
        }

        recommendedList.innerHTML = recommended.map(p => `
            <div class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onclick="playPodcast(${p.id})">
                <img src="${p.thumbnail}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/40x40?text=P'">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 truncate">${p.title}</p>
                    <p class="text-xs text-gray-500">${p.duration}</p>
                </div>
            </div>
        `).join("");
    }

    // Mini mood chart
    function initMiniMoodChart() {
        if (!miniMoodChartDom) return;

        try {
            const moods = JSON.parse(localStorage.getItem("moods")) || [];
            const last7Days = [];
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
                last7Days.push(dateStr);
            }

            const moodData = last7Days.map((_, i) => {
                const dayMoods = moods.filter(m => {
                    const moodDate = new Date(m.date);
                    const targetDate = new Date(today);
                    targetDate.setDate(targetDate.getDate() - (6 - i));
                    return moodDate.toDateString() === targetDate.toDateString();
                });
                if (dayMoods.length > 0) return dayMoods[dayMoods.length - 1].moodValue;
                return null;
            });

            const miniMoodChart = echarts.init(miniMoodChartDom);
            const option = {
                animation: false,
                tooltip: { trigger: "axis" },
                grid: { left: "3%", right: "3%", bottom: "3%", top: "3%", containLabel: true },
                xAxis: {
                    type: "category",
                    data: last7Days,
                    axisLine: { lineStyle: { color: "#e2e8f0" } },
                    axisLabel: { color: "#1f2937", fontSize: 10 }
                },
                yAxis: {
                    type: "value",
                    min: 1,
                    max: 5,
                    axisLine: { show: false },
                    axisLabel: { show: false },
                    splitLine: { lineStyle: { color: "#e2e8f0" } }
                },
                series: [{
                    name: "Tâm trạng",
                    type: "line",
                    data: moodData,
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 8,
                    lineStyle: { color: "#A8C5DA", width: 2 },
                    itemStyle: { color: "#A8C5DA" },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(168, 197, 218, 0.3)" },
                            { offset: 1, color: "rgba(168, 197, 218, 0.05)" }
                        ])
                    }
                }]
            };
            miniMoodChart.setOption(option);
            window.addEventListener("resize", () => miniMoodChart.resize());
        } catch (e) {
            console.log("Mini mood chart error:", e);
            // Hide the chart container if error
            if (miniMoodChartDom) {
                miniMoodChartDom.innerHTML = '<p class="text-center text-gray-400 text-sm py-4">Chưa có dữ liệu tâm trạng</p>';
            }
        }
    }

    // Cập nhật stats
    function updateStats() {
        document.getElementById("totalListened").textContent = history.length;
        document.getElementById("totalFavorites").textContent = favorites.length;
    }

    // Ambient sounds
    ambientBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const sound = btn.dataset.sound;

            if (activeSound === sound) {
                // Tắt
                ambientAudio.pause();
                ambientAudio.src = "";
                btn.classList.remove("active");
                activeSound = null;
            } else {
                // Bật
                ambientBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                ambientAudio.src = ambientSounds[sound];
                ambientAudio.volume = 0.3;
                ambientAudio.play().catch(() => { });
                activeSound = sound;
            }
        });
    });

    // ============ EVENT LISTENERS ============

    // Category buttons
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach(b => {
                b.classList.remove("active", "bg-primary", "text-white");
                b.classList.add("bg-gray-100", "text-gray-700");
            });
            btn.classList.add("active", "bg-primary", "text-white");
            btn.classList.remove("bg-gray-100", "text-gray-700");
            currentCategory = btn.dataset.category;
            renderPodcasts();
        });
    });

    // Tab buttons
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => {
                b.classList.remove("active", "text-primary", "border-primary");
                b.classList.add("text-gray-500");
            });
            btn.classList.add("active", "text-primary", "border-primary");
            btn.classList.remove("text-gray-500");

            currentTab = btn.dataset.tab;
            document.getElementById("favoritesTab").classList.toggle("hidden", currentTab !== "favorites");
            document.getElementById("historyTab").classList.toggle("hidden", currentTab !== "history");
        });
    });

    // Close player
    if (closePlayerBtn) {
        closePlayerBtn.addEventListener("click", () => {
            nowPlaying.classList.add("hidden");
            currentPlaying = null;
        });
    }

    // Make playPodcast globally accessible
    window.playPodcast = playPodcast;

    // Premium modal
    window.showPremiumModal = function () {
        document.getElementById("premiumModal").classList.remove("hidden");
    };
    window.closePremiumModal = function () {
        document.getElementById("premiumModal").classList.add("hidden");
    };
});