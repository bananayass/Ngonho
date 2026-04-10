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
});