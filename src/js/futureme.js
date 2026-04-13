document.addEventListener("DOMContentLoaded", function () {
  // Các biến toàn cục
  let letters = JSON.parse(localStorage.getItem("futureMeLetters")) || [];
  let currentTab = "all";
  let letterTemplate = null; // Template cho thư

  // DOM Elements
  const newLetterBtn = document.getElementById("newLetterBtn");
  const createFirstLetterBtn = document.getElementById("createFirstLetterBtn");
  const letterModal = document.getElementById("letterModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelLetterBtn = document.getElementById("cancelLetterBtn");
  const saveLetterBtn = document.getElementById("saveLetterBtn");
  const deliveryDate = document.getElementById("deliveryDate");
  const letterTitle = document.getElementById("letterTitle");
  const letterContent = document.getElementById("letterContent");
  const lettersContainer = document.getElementById("lettersContainer");
  const noLettersMessage = document.getElementById("noLettersMessage");
  const tabButtons = document.querySelectorAll(".tab-btn");

  // Lấy template thư từ DOM nếu có
  const templateEl = document.getElementById("letterTemplate");
  if (templateEl) {
    letterTemplate = templateEl.cloneNode(true);
  } else {
    // Tạo template mặc định nếu không tìm thấy trong DOM
    letterTemplate = document.createElement("div");
    letterTemplate.className = "bg-white/80 backdrop-blur-xl rounded-2xl shadow-md overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all card-hover-enhanced";
    letterTemplate.innerHTML = `
      <div class="p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
              <i class="ri-mail-send-line text-xl text-primary"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800" data-field="title">Tiêu đề thư</h3>
              <p class="text-xs text-gray-500" data-field="date">Gửi đến: 01/01/2025</p>
            </div>
          </div>
          <span class="text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary" data-field="status">Chưa gửi</span>
        </div>
        <p class="text-gray-600 text-sm mb-4" data-field="content-preview">Nội dung thư xem trước...</p>
        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <button class="view-letter-btn text-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Xem chi tiết</button>
          <button class="delete-letter-btn text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Xoá</button>
        </div>
      </div>
    `;
  }

  // Đặt ngày tối thiểu là ngày mai
  if (deliveryDate) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    deliveryDate.min = tomorrow.toISOString().split("T")[0];
  }

  // Make functions globally accessible
  window.openLetterModal = function() {
    if (!letterModal) return;

    // Reset form
    if (deliveryDate) deliveryDate.value = "";
    if (letterTitle) letterTitle.value = "";
    if (letterContent) letterContent.value = "";

    // Show modal with animation
    letterModal.classList.remove("hidden");
    letterModal.classList.add("modal-open");

    // Focus on first input
    setTimeout(() => {
      if (letterTitle) letterTitle.focus();
    }, 300);
  };

  window.closeLetterModal = function() {
    if (!letterModal) return;
    letterModal.classList.remove("modal-open");
    setTimeout(() => {
      letterModal.classList.add("hidden");
    }, 200);
  };

  // Sự kiện click nút viết thư mới
  if (newLetterBtn) newLetterBtn.addEventListener("click", window.openLetterModal);
  if (createFirstLetterBtn) createFirstLetterBtn.addEventListener("click", window.openLetterModal);

  // Sự kiện đóng modal
  if (closeModalBtn) closeModalBtn.addEventListener("click", window.closeLetterModal);
  if (cancelLetterBtn) cancelLetterBtn.addEventListener("click", window.closeLetterModal);

  // Sự kiện lưu thư
  if (saveLetterBtn) saveLetterBtn.addEventListener("click", saveLetter);

  // Sự kiện chuyển tab
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => {
        btn.classList.remove("active", "bg-white", "text-primary", "shadow-sm");
        btn.classList.add("text-gray-600", "hover:text-gray-800");
      });

      button.classList.add("active", "bg-white", "text-primary", "shadow-sm");
      button.classList.remove("text-gray-600", "hover:text-gray-800");

      currentTab = button.dataset.tab;
      renderLetters();
    });
  });

  // Khởi tạo trang
  renderLetters();

  // Hàm mở modal viết thư
  function openLetterModal() {
    // Reset form
    deliveryDate.value = "";
    letterTitle.value = "";
    letterContent.value = "";

    letterModal.classList.remove("hidden");
  }

  // Hàm đóng modal
  function closeLetterModal() {
    letterModal.classList.add("hidden");
  }

  // Hàm lưu thư
  function saveLetter() {
    if (!deliveryDate.value || !letterTitle.value || !letterContent.value) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newLetter = {
      id: Date.now(),
      title: letterTitle.value,
      content: letterContent.value,
      deliveryDate: deliveryDate.value,
      createdAt: new Date().toISOString(),
      status: "pending", // pending or sent
    };

    letters.unshift(newLetter);
    saveToLocalStorage();
    renderLetters();
    closeLetterModal();

    // Hiệu ứng thông báo
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up";
    notification.innerHTML = `
            <div class="flex items-center">
                <i class="ri-checkbox-circle-fill mr-2"></i>
                <span>Đã lưu thư thành công!</span>
            </div>
        `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("animate-fade-out");
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  // Hàm render danh sách thư
  // Hàm render danh sách thư
  // Hàm render danh sách thư hoàn chỉnh
  function renderLetters() {
    // Lọc thư theo tab hiện tại
    let filteredLetters = letters;
    if (currentTab === "pending") {
      filteredLetters = letters.filter((letter) => letter.status === "pending");
    } else if (currentTab === "sent") {
      filteredLetters = letters.filter((letter) => letter.status === "sent");
    }

    // Xóa toàn bộ nội dung cũ
    lettersContainer.innerHTML = "";

    // Hiển thị empty state nếu không có thư
    if (filteredLetters.length === 0) {
      // Tạo bản sao của empty state template để tránh xung đột DOM
      const emptyState = document.createElement("div");
      emptyState.className =
        "bg-white rounded-xl shadow-sm p-8 text-center card-hover";
      emptyState.innerHTML = `
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ri-mail-line text-primary text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">
                Bạn chưa có lá thư nào
            </h3>
            <p class="text-gray-600 mb-4">
                Hãy viết thư đầu tiên gửi đến tương lai của bạn
            </p>
            <button
                id="createFirstLetterBtn"
                class="px-6 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-opacity-90 hover:shadow-md active:scale-95 transition-all"
            >
                Viết thư đầu tiên
            </button>
        `;

      lettersContainer.appendChild(emptyState);

      // Thêm sự kiện cho nút
      emptyState
        .querySelector("#createFirstLetterBtn")
        .addEventListener("click", openLetterModal);
      return;
    }

    // Render từng thư nếu có dữ liệu
    filteredLetters.forEach((letter) => {
      const letterElement = letterTemplate.cloneNode(true);
      letterElement.classList.remove("hidden");
      letterElement.id = "";

      // Định dạng ngày
      const deliveryDate = new Date(letter.deliveryDate);
      const formattedDate = deliveryDate.toLocaleDateString("vi-VN");

      // Điền thông tin vào thư
      letterElement.querySelector('[data-field="title"]').textContent =
        letter.title;
      letterElement.querySelector(
        '[data-field="date"]'
      ).textContent = `Gửi đến: ${formattedDate}`;
      letterElement.querySelector('[data-field="status"]').textContent =
        letter.status === "pending" ? "Chưa gửi" : "Đã gửi";
      letterElement.querySelector(
        '[data-field="content-preview"]'
      ).textContent =
        letter.content.length > 100
          ? letter.content.substring(0, 100) + "..."
          : letter.content;

      // Thêm sự kiện xem chi tiết
      letterElement
        .querySelector(".view-letter-btn")
        .addEventListener("click", () => viewLetterDetails(letter));

      // Thêm sự kiện xóa thư
      letterElement
        .querySelector(".delete-letter-btn")
        .addEventListener("click", () => deleteLetter(letter.id));

      lettersContainer.appendChild(letterElement);
    });
  }

  // Hàm xem chi tiết thư
  function viewLetterDetails(letter) {
    // Định dạng ngày
    const deliveryDate = new Date(letter.deliveryDate);
    const formattedDate = deliveryDate.toLocaleDateString("vi-VN");
    const createdAt = new Date(letter.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString("vi-VN");

    // Tạo modal chi tiết
    const detailModal = document.createElement("div");
    detailModal.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center z-[70] animate-fade-in";
    detailModal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 card-hover">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold">${letter.title}</h3>
                    <button class="text-gray-600 hover:text-gray-800 btn-scale-outline close-detail-modal">
                        <div class="w-6 h-6 flex items-center justify-center icon-hover">
                            <i class="ri-close-line"></i>
                        </div>
                    </button>
                </div>
                
                <div class="mb-4">
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div class="flex items-center space-x-1">
                            <i class="ri-calendar-line"></i>
                            <span>Ngày tạo: ${formattedCreatedAt}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <i class="ri-mail-send-line"></i>
                            <span>Gửi đến: ${formattedDate}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <i class="ri-information-line"></i>
                            <span>Trạng thái: ${
                              letter.status === "pending"
                                ? "Chưa gửi"
                                : "Đã gửi"
                            }</span>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                        <p class="whitespace-pre-line">${letter.content}</p>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3">
                    ${
                      letter.status === "pending"
                        ? `
                    <button class="px-4 py-2 bg-primary text-white rounded-button font-medium text-sm btn-scale hover:bg-opacity-90 send-now-btn">
                        Gửi ngay
                    </button>
                    `
                        : ""
                    }
                    <button class="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-button font-medium text-sm btn-scale-outline close-detail-modal">
                        Đóng
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(detailModal);

    // Sự kiện đóng modal
    const closeButtons = detailModal.querySelectorAll(".close-detail-modal");
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        detailModal.classList.add("animate-fade-out");
        setTimeout(() => detailModal.remove(), 500);
      });
    });

    // Sự kiện gửi thư ngay
    if (letter.status === "pending") {
      const sendNowBtn = detailModal.querySelector(".send-now-btn");
      sendNowBtn.addEventListener("click", () => {
        letter.status = "sent";
        saveToLocalStorage();
        renderLetters();

        // Hiệu ứng thông báo
        const notification = document.createElement("div");
        notification.className =
          "fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up";
        notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="ri-mail-send-fill mr-2"></i>
                        <span>Đã gửi thư thành công!</span>
                    </div>
                `;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.classList.add("animate-fade-out");
          setTimeout(() => notification.remove(), 500);
        }, 3000);

        detailModal.classList.add("animate-fade-out");
        setTimeout(() => detailModal.remove(), 500);
      });
    }
  }

  // Hàm xóa thư
  function deleteLetter(letterId) {
    if (!confirm("Bạn có chắc chắn muốn xóa thư này?")) return;

    letters = letters.filter((letter) => letter.id !== letterId);
    saveToLocalStorage();
    renderLetters();

    // Hiệu ứng thông báo
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-6 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up";
    notification.innerHTML = `
            <div class="flex items-center">
                <i class="ri-delete-bin-fill mr-2"></i>
                <span>Đã xóa thư thành công!</span>
            </div>
        `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("animate-fade-out");
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  // Hàm lưu vào localStorage
  function saveToLocalStorage() {
    localStorage.setItem("futureMeLetters", JSON.stringify(letters));
  }

  // Kiểm tra và gửi thư đã đến hạn
  function checkAndSendLetters() {
    const today = new Date().toISOString().split("T")[0];
    let hasUpdates = false;

    letters.forEach((letter) => {
      if (letter.status === "pending" && letter.deliveryDate <= today) {
        letter.status = "sent";
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      saveToLocalStorage();
      renderLetters();
    }
  }

  // Kiểm tra thư mỗi ngày
  checkAndSendLetters();

  // Thêm animation CSS
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
        }
        .animate-fade-out {
            animation: fadeOut 0.5s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
    `;

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

  // Handle payment redirection
  window.handlePayment = function(method) {
    if (method === 'momo') {
      window.location.href = 'momo-payment.html';
    } else if (method === 'zalopay') {
      window.location.href = 'zalopay-payment.html';
    }
  };

  // Premium Modal functions
  window.showPremiumModal = function() {
    const modal = document.getElementById("premiumModal");
    if (modal) {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  window.closePremiumModal = function() {
    const modal = document.getElementById("premiumModal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  };

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

  window.initJournal = function() {
    updatePrompt();
    loadJournalEntry();
    loadGratitude();
    updateStreak();
    loadJournalHistory();

    const textarea = document.getElementById('journal-textarea');
    if (textarea) {
      textarea.addEventListener('input', function() {
        const charCount = document.getElementById('char-count');
        if (charCount) charCount.textContent = this.value.length + ' ký tự';
      });
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const voiceBtn = document.getElementById('voice-btn');
      if (voiceBtn) {
        voiceBtn.title = 'Trình duyệt không hỗ trợ nhận dạng giọng nói';
        voiceBtn.disabled = true;
      }
    }
  };

  window.switchJournalTab = function(tab) {
    currentJournalTab = tab;
    document.querySelectorAll('.journal-tab').forEach(el => {
      el.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
      el.classList.add('text-white');
    });
    const activeTab = document.getElementById('tab-' + tab);
    if (activeTab) {
      activeTab.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
      activeTab.classList.remove('text-white');
    }
    loadJournalEntry();
    updatePrompt();
  };

  window.updatePrompt = function() {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const prompts = currentJournalTab === 'morning' ? morningPrompts : eveningPrompts;
    const promptIndex = (dayOfMonth - 1) % prompts.length;
    const promptEl = document.getElementById('current-prompt');
    if (promptEl) promptEl.textContent = prompts[promptIndex];
  };

  window.saveJournalEntry = function() {
    const textarea = document.getElementById('journal-textarea');
    const content = textarea ? textarea.value : '';
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
    localStorage.setItem('ngo_nho_journal_' + currentJournalTab, JSON.stringify(entry));

    // Save to history
    const history = JSON.parse(localStorage.getItem('ngo_nho_journal_history') || '[]');
    history.unshift(entry);
    if (history.length > 30) history.pop(); // Keep last 30 entries
    localStorage.setItem('ngo_nho_journal_history', JSON.stringify(history));

    loadJournalHistory();
    alert('Đã lưu nhật ký!');
  };

  window.loadJournalEntry = function() {
    const key = 'ngo_nho_journal_' + currentJournalTab;
    const saved = localStorage.getItem(key);
    const textarea = document.getElementById('journal-textarea');
    const charCount = document.getElementById('char-count');
    if (saved && textarea) {
      const entry = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      if (entry.date === today) {
        textarea.value = entry.content;
        if (charCount) charCount.textContent = entry.content.length + ' ký tự';
      } else {
        textarea.value = '';
        if (charCount) charCount.textContent = '0 ký tự';
      }
    }
  };

  window.saveGratitude = function() {
    const g1 = document.getElementById('gratitude-1')?.value || '';
    const g2 = document.getElementById('gratitude-2')?.value || '';
    const g3 = document.getElementById('gratitude-3')?.value || '';
    if (!g1.trim() && !g2.trim() && !g3.trim()) {
      alert('Vui lòng nhập ít nhất một điều bạn biết ơn!');
      return;
    }
    const entry = {
      date: new Date().toISOString().split('T')[0],
      items: [g1, g2, g3].filter(i => i.trim()),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('ngo_nho_gratitude', JSON.stringify(entry));
    updateStreak();
    alert('Đã lưu lời biết ơn!');
  };

  window.loadGratitude = function() {
    const saved = localStorage.getItem('ngo_nho_gratitude');
    if (saved) {
      const entry = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      if (entry.date === today) {
        const g1 = document.getElementById('gratitude-1');
        const g2 = document.getElementById('gratitude-2');
        const g3 = document.getElementById('gratitude-3');
        if (g1) g1.value = entry.items[0] || '';
        if (g2) g2.value = entry.items[1] || '';
        if (g3) g3.value = entry.items[2] || '';
      }
    }
  };

  window.updateStreak = function() {
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
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = streak;
  };

  window.loadJournalHistory = function() {
    const historyContainer = document.getElementById('journal-history');
    if (!historyContainer) return;

    const history = JSON.parse(localStorage.getItem('ngo_nho_journal_history') || '[]');

    if (history.length === 0) {
      historyContainer.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">Chưa có nhật ký nào</p>';
      return;
    }

    historyContainer.innerHTML = history.slice(0, 10).map(entry => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
      const typeIcon = entry.type === 'morning' ? '☀️' : '🌙';
      const preview = entry.content.substring(0, 50) + (entry.content.length > 50 ? '...' : '');

      return `
        <div class="journal-history-item p-3 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-all cursor-pointer" onclick="showJournalDetail('${entry.timestamp}')">
          <div class="flex justify-between items-start mb-1">
            <span class="text-xs text-primary font-medium">${typeIcon} ${entry.type === 'morning' ? 'Sáng' : 'Tối'}</span>
            <span class="text-xs text-gray-400">${formattedDate}</span>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2">${preview}</p>
        </div>
      `;
    }).join('');

    // Add fade-in animation
    if (window.anime) {
      anime({
        targets: '.journal-history-item',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 400,
        easing: 'easeOutQuad',
        delay: anime.stagger(50)
      });
    }
  };

  window.showJournalDetail = function(timestamp) {
    const history = JSON.parse(localStorage.getItem('ngo_nho_journal_history') || '[]');
    const entry = history.find(e => e.timestamp === timestamp);
    if (entry) {
      alert(`${entry.type === 'morning' ? '☀️ Buổi sáng' : '🌙 Buổi tối'} - ${entry.date}\n\n${entry.content}`);
    }
  };

  window.toggleVoiceInput = function() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  window.startRecording = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt không hỗ trợ. Dùng Chrome/Edge.');
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
        voiceBtn.classList.add('bg-red-500', 'text-white');
        voiceBtn.innerHTML = '<i class="ri-stop-line"></i>';
      }
    };
    recognition.onresult = function(event) {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const textarea = document.getElementById('journal-textarea');
      if (textarea) textarea.value += transcript;
      const charCount = document.getElementById('char-count');
      if (charCount) charCount.textContent = textarea.value.length + ' ký tự';
    };
    recognition.onend = function() { stopRecording(); };
    recognition.start();
  };

  window.stopRecording = function() {
    if (recognition) recognition.stop();
    isRecording = false;
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
      voiceBtn.classList.remove('bg-red-500', 'text-white');
      voiceBtn.innerHTML = '<i class="ri-mic-line"></i>';
    }
  };

  // Initialize journal on page load
  initJournal();
});