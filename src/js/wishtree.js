document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newWishInput = document.getElementById('newWish');
    const isGratitudeCheckbox = document.getElementById('isGratitude');
    const addWishBtn = document.getElementById('addWishBtn');
    const wishesList = document.getElementById('wishesList');
    const sortSelect = document.getElementById('sortWishes');

    // Initialize the app
    initWishTree();

    function initWishTree() {
        loadWishes();
        setupEventListeners();
    }

    function setupEventListeners() {
        addWishBtn.addEventListener('click', addNewWish);
        sortSelect.addEventListener('change', loadWishes);
        
        // Add wish when pressing Enter (but not Shift+Enter)
        newWishInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addNewWish();
            }
        });
    }

    function addNewWish() {
        const wishText = newWishInput.value.trim();
        const isGratitude = isGratitudeCheckbox.checked;
        
        if (!wishText) {
            alert('Vui lòng nhập điều ước hoặc lòng biết ơn của bạn');
            return;
        }
        
        let wishes = getWishesFromStorage();
        
        const newWish = {
            id: Date.now(),
            text: wishText,
            isGratitude: isGratitude,
            date: new Date().toISOString()
        };
        
        wishes.unshift(newWish);
        saveWishesToStorage(wishes);
        
        clearInputFields();
        loadWishes();
    }

    function loadWishes() {
        let wishes = getWishesFromStorage();
        const sortBy = sortSelect.value;
        
        wishes = sortWishes(wishes, sortBy);
        renderWishes(wishes);
        updateStatistics(wishes);
    }

    function getWishesFromStorage() {
        return JSON.parse(localStorage.getItem('wishes')) || [];
    }

    function saveWishesToStorage(wishes) {
        localStorage.setItem('wishes', JSON.stringify(wishes));
    }

    function sortWishes(wishes, sortBy) {
        switch(sortBy) {
            case 'newest':
                return [...wishes].sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return [...wishes].sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'gratitude':
                return wishes.filter(w => w.isGratitude)
                           .sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'wishes':
                return wishes.filter(w => !w.isGratitude)
                           .sort((a, b) => new Date(b.date) - new Date(a.date));
            default:
                return wishes;
        }
    }

    function renderWishes(wishes) {
        wishesList.innerHTML = '';
        
        if (wishes.length === 0) {
            wishesList.innerHTML = `
                <div class="empty-state">
                    <i class="ri-plant-line text-4xl text-gray-300 mb-2"></i>
                    <p>Bạn chưa có điều ước nào</p>
                    <p class="text-sm mt-1">Hãy thêm điều ước đầu tiên của bạn!</p>
                </div>
            `;
            return;
        }
        
        wishes.forEach(wish => {
            const wishElement = createWishElement(wish);
            wishesList.appendChild(wishElement);
        });
    }

    function createWishElement(wish) {
        const wishElement = document.createElement('div');
        wishElement.className = `wish-item ${wish.isGratitude ? 'wish-gratitude' : 'wish-normal'}`;
        
        const date = new Date(wish.date);
        const dateStr = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        wishElement.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <p class="text-gray-800">${escapeHtml(wish.text)}</p>
                <button data-id="${wish.id}" class="delete-wish text-gray-400 hover:text-red-500 ml-2">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
            <div class="flex justify-between items-center text-xs text-gray-500">
                <span>${dateStr}</span>
                ${wish.isGratitude ? 
                  '<span class="bg-green-100 text-green-600 px-2 py-1 rounded-full">Lòng biết ơn</span>' : 
                  '<span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Điều ước</span>'}
            </div>
        `;
        
        wishElement.querySelector('.delete-wish').addEventListener('click', function() {
            deleteWish(this.getAttribute('data-id'));
        });
        
        return wishElement;
    }

    function deleteWish(id) {
        if (!confirm('Bạn có chắc muốn xóa điều ước này?')) return;
        
        let wishes = getWishesFromStorage();
        wishes = wishes.filter(wish => wish.id !== parseInt(id));
        saveWishesToStorage(wishes);
        loadWishes();
    }

    function updateStatistics(wishes) {
        document.getElementById('totalWishes').textContent = wishes.length;
        document.getElementById('gratitudeCount').textContent = wishes.filter(w => w.isGratitude).length;
        document.getElementById('thisMonthWishes').textContent = countWishesThisMonth(wishes);
        document.getElementById('streakDays').textContent = calculateStreak(wishes);
    }

    function countWishesThisMonth(wishes) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return wishes.filter(w => {
            const date = new Date(w.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length;
    }

    function calculateStreak(wishes) {
        if (wishes.length === 0) return 0;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let streak = 0;
        let currentDate = new Date(today);
        
        // Create a Set of unique dates for faster lookup
        const wishDates = new Set(
            wishes.map(w => {
                const d = new Date(w.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            })
        );
        
        while (wishDates.has(currentDate.getTime())) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return streak;
    }

    function clearInputFields() {
        newWishInput.value = '';
        isGratitudeCheckbox.checked = false;
        newWishInput.focus();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// --- BIỂU ĐỒ TÂM TRẠNG NHỎ (miniMoodChart) ---
  const miniMoodChartDom = document.getElementById("miniMoodChart");
  if (miniMoodChartDom) {
    const miniMoodChart = echarts.init(miniMoodChartDom);
    const isMTrackPage = document.querySelector("title").textContent.includes("Mood Tracker");
    const miniMoodOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "#e2e8f0",
        textStyle: { color: "#1f2937" },
      },
      grid: { left: "3%", right: "3%", bottom: "3%", top: "3%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: isMTrackPage
          ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
          : ["17/05", "18/05", "19/05", "20/05", "21/05", "22/05", "23/05"],
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: { color: "#1f2937" },
      },
      yAxis: {
        type: "value",
        min: 1,
        max: 5,
        interval: 1,
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          name: "Tâm trạng",
          type: "line",
          data: [2, 3, 2, 4, 3, 4, 3],
          smooth: true,
          symbol: "none",
          lineStyle: { color: "#6366f1", width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(99, 102, 241, 0.3)" },
              { offset: 1, color: "rgba(99, 102, 241, 0.1)" },
            ]),
          },
        },
      ],
    };
    miniMoodChart.setOption(miniMoodOption);
    window.addEventListener("resize", function () {
      miniMoodChart.resize();
    });
  }