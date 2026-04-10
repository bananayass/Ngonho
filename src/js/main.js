document.addEventListener("DOMContentLoaded", function () {
  // --- CẬP NHẬT NGÀY HIỆN TẠI (cho mTrack.html) ---
  const currentDate = document.getElementById("currentDate");
  const today = new Date();
  if (currentDate) {
    currentDate.textContent = today.toLocaleDateString("vi-VN");
  }

  // --- BIỂU ĐỒ TÂM TRẠNG CHÍNH (moodChart) ---
  const moodChartDom = document.getElementById("moodChart");
  if (moodChartDom) {
    const moodChart = echarts.init(moodChartDom);
    const isMTrackPage = document.querySelector("title").textContent.includes("Mood Tracker");
    const moodOption = {
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
        data: ["17/05", "18/05", "19/05", "20/05", "21/05", "22/05", "23/05"],
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: { color: "#1f2937" },
      },
      yAxis: {
        type: "value",
        min: 1,
        max: 5,
        interval: 1,
        axisLine: { show: false },
        axisLabel: {
          color: "#1f2937",
          formatter: function (value) {
            const labels = ["", "Rất buồn", "Buồn", "Bình thường", "Vui", "Rất vui"];
            return labels[value];
          },
        },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          name: "Tâm trạng",
          type: "line",
          data: [2, 3, 2, 4, 3, 4, 3],
          smooth: true,
          symbol: "none",
          lineStyle: {
            color: isMTrackPage ? "rgba(99, 102, 241, 1)" : "rgba(87, 181, 231, 1)",
            width: 3,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: isMTrackPage ? "rgba(99, 102, 241, 0.3)" : "rgba(87, 181, 231, 0.3)",
              },
              {
                offset: 1,
                color: isMTrackPage ? "rgba(99, 102, 241, 0.1)" : "rgba(87, 181, 231, 0.1)",
              },
            ]),
          },
        },
      ],
    };
    moodChart.setOption(moodOption);
    window.addEventListener("resize", function () {
      moodChart.resize();
    });
  }

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

  // --- THANH TRƯỢT TÂM TRẠNG (moodSlider) ---
  const moodSlider = document.getElementById("moodSlider");
  if (moodSlider) {
    moodSlider.addEventListener("input", function () {
      const value = this.value;
      let gradient;
      if (value <= 2) {
        gradient = `linear-gradient(to right, #ef4444 ${(value - 1) * 50}%, #f59e0b ${(value - 1) * 50}%, #f59e0b 100%)`;
      } else if (value <= 4) {
        gradient = `linear-gradient(to right, #ef4444 50%, #f59e0b 50%, #f59e0b ${50 + (value - 3) * 50}%, #10b981 ${50 + (value - 3) * 50}%, #10b981 100%)`;
      } else {
        gradient = `linear-gradient(to right, #ef4444 50%, #f59e0b 50%, #f59e0b 100%, #10b981 100%)`;
      }
      this.style.background = gradient;
    });
    moodSlider.dispatchEvent(new Event("input"));
  }

  // --- LƯU TÂM TRẠNG (cho mTrack.html) ---
  const saveMoodBtn = document.getElementById("saveMood");
  const cancelMoodBtn = document.getElementById("cancelMood");
  const moodNote = document.getElementById("moodNote");
  const successToast = document.getElementById("successToast");
  const moodHistory = document.getElementById("moodHistory");

  let moods = JSON.parse(localStorage.getItem("moods")) || [];

  function saveMood() {
    if (!moodSlider || !moodNote || !moodHistory || !successToast) return;
    const moodValue = moodSlider.value;
    const note = moodNote.value.trim();
    const date = today.toLocaleDateString("vi-VN");
    const moodLabel =
      moodValue == 1
        ? "Rất buồn"
        : moodValue == 2
        ? "Buồn"
        : moodValue == 3
        ? "Bình thường"
        : moodValue == 4
        ? "Vui"
        : "Rất vui";
    const moodColor =
      moodValue <= 2 ? "text-red-500" : moodValue <= 3 ? "text-yellow-500" : "text-green-500";

    if (note) {
      moods.push({ date, moodValue, moodLabel, note });
      localStorage.setItem("moods", JSON.stringify(moods));

      const moodEntry = document.createElement("div");
      moodEntry.className = "border-b border-gray-100 pb-4";
      moodEntry.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <p class="font-medium text-sm">${date}</p>
          <span class="text-sm ${moodColor}">${moodLabel}</span>
        </div>
        <p class="text-gray-600 text-sm">${note}</p>
      `;
      moodHistory.prepend(moodEntry);

      successToast.classList.remove("hidden");
      setTimeout(() => successToast.classList.add("hidden"), 3000);

      moodNote.value = "";
      moodSlider.value = 3;
      moodSlider.dispatchEvent(new Event("input"));
    }
  }

  if (saveMoodBtn) {
    saveMoodBtn.addEventListener("click", saveMood);
  }
  if (cancelMoodBtn) {
    cancelMoodBtn.addEventListener("click", () => {
      if (moodNote && moodSlider) {
        moodNote.value = "";
        moodSlider.value = 3;
        moodSlider.dispatchEvent(new Event("input"));
      }
    });
  }

  // --- TẢI LỊCH SỬ TÂM TRẠNG (cho mTrack.html) ---
  if (moodHistory) {
    moods.forEach((mood) => {
      const moodColor =
        mood.moodValue <= 2 ? "text-red-500" : mood.moodValue <= 3 ? "text-yellow-500" : "text-green-500";
      const moodEntry = document.createElement("div");
      moodEntry.className = "border-b border-gray-100 pb-4";
      moodEntry.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <p class="font-medium text-sm">${mood.date}</p>
          <span class="text-sm ${moodColor}">${mood.moodLabel}</span>
        </div>
        <p class="text-gray-600 text-sm">${mood.note}</p>
      `;
      moodHistory.appendChild(moodEntry);
    });
  }

  // --- TÌM KIẾM LỊCH SỬ TÂM TRẠNG (cho mTrack.html) ---
  const searchMood = document.getElementById("searchMood");
  if (searchMood) {
    searchMood.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const entries = moodHistory.querySelectorAll("div.border-b");
      entries.forEach((entry) => {
        const note = entry.querySelector("p.text-gray-600").textContent.toLowerCase();
        entry.style.display = note.includes(query) ? "" : "none";
      });
    });
  }

  // --- TÍNH NĂNG PREMIUM (cho main.html và khoND.html) ---
  const isPremium = localStorage.getItem("isPremium") === "true";
  const premiumContent = document.querySelectorAll(".premium-content");
  premiumContent.forEach((content) => {
    if (!isPremium) {
      const innerContent = content.innerHTML;
      content.innerHTML = `
        <div class="relative">
          <div class="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px] flex items-center justify-center z-10">
            <button onclick="showPremiumModal()" class="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-button font-medium btn-scale">
              <div class="w-5 h-5 flex items-center justify-center icon-hover">
                <i class="ri-lock-line"></i>
              </div>
              <span>Mở khóa với Premium</span>
            </button>
          </div>
          <div class="blur-sm pointer-events-none">${innerContent}</div>
        </div>
      `;
    }
  });

  // --- CHỌN GÓI PREMIUM (cho main.html và khoND.html) ---
  const packageOptions = document.querySelectorAll(".package-option");
  packageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      packageOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  // --- CHUYỂN ĐỔI CHẾ ĐỘ ẨN DANH (cho main.html) ---
  const anonymousSwitch = document.getElementById("anonymousSwitch");
  if (anonymousSwitch) {
    anonymousSwitch.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  }
});

// --- TRÌNH PHÁT YOUTUBE (cho main.html và khoND.html) ---
let player;
function onYouTubeIframeAPIReady() {
  const pageTitle = document.querySelector("title").textContent;
  if (pageTitle.includes("Kho nội dung")) {
    // Handled in khoND.html inline script
  } else {
    player = new YT.Player("youtubePlayer", {
      events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange },
    });
  }
}
function onPlayerReady(event) {
  const playButton = document.getElementById("playButton");
  const playOverlay = document.getElementById("playOverlay");
  if (playButton && playOverlay) {
    playButton.addEventListener("click", function () {
      player.playVideo();
      playOverlay.style.display = "none";
    });
  }
}
function onPlayerStateChange(event) {
  const playOverlay = document.getElementById("playOverlay");
  if (playOverlay && event.data === YT.PlayerState.PLAYING) {
    playOverlay.style.display = "none";
  }
}

// --- MODAL PREMIUM (cho main.html và khoND.html) ---
function showPremiumModal() {
  const modal = document.getElementById("premiumModal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}
function closePremiumModal() {
  const modal = document.getElementById("premiumModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}
function handlePayment(method) {
  const selectedPackage = document.querySelector(".package-option.selected");
  if (selectedPackage) {
    const packageType = selectedPackage.dataset.package;
    console.log(`Đang xử lý thanh toán cho gói ${packageType} qua ${method}`);
    // Redirect to payment pages
    if (method === 'momo') {
      window.location.href = 'momo-payment.html';
    } else if (method === 'zalopay') {
      window.location.href = 'zalopay-payment.html';
    }
  } else {
    alert("Vui lòng chọn một gói trước khi thanh toán.");
  }
}