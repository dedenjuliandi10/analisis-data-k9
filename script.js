/* ==========================================================================
   SCRIPT.JS - MEDIA PEMBELAJARAN INTERAKTIF: ANALISIS DATA DENGAN TEKNIK VISUALISASI
   Informatika SMP/MTs (Vanilla JS, Chart.js CDN, Soal HOTS & Clash of Champions)
   ========================================================================== */

// --- 1. STATE & STORAGE MANAGEMENT ---
const APP_STATE = {
  activeSection: 'beranda',
  progress: {
    visitedMateri: false,
    visitedTahapan: false,
    act1Done: false,
    act2Done: false,
    act3Done: false,
    act4Done: false,
    quizDone: false
  },
  currentStep: 1,
  act1Items: [],
  act2SelectedLeft: null,
  act2Matches: {},
  act3Answers: { 1: null, 2: null, 3: null },
  quizIndex: 0,
  quizScore: 0,
  quizAnswers: [],
  modalChartInstance: null,
  act3ChartInstance: null,

  // Clash of Champions (COC) Arena State
  coc: {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    streak: 0,
    maxStreak: 0,
    timerInterval: null,
    startTime: 0,
    elapsedMs: 0,
    bestTimeMs: null,
    isPlaying: false,
    isBusy: false,
    audioEnabled: true
  },

  // Battle Regu Kelas State
  battle: {
    teamCount: 6,
    scores: { alpha: 0, beta: 0, gamma: 0, delta: 0, epsilon: 0, zeta: 0 },
    teamNames: { alpha: 'Regu Alpha', beta: 'Regu Beta', gamma: 'Regu Gamma', delta: 'Regu Delta', epsilon: 'Regu Epsilon', zeta: 'Regu Zeta' },
    isSpinning: false,
    wheelAngle: 0,
    currentSector: null,
    currentChallenge: null,
    timerInterval: null,
    timerSec: 15
  }
};

// Data 6 Tahapan Analisis Data
const STEPS_DATA = [
  {
    num: 1,
    title: "1️⃣ Mengumpulkan Data",
    desc: "Menentukan tujuan analisis dan mengambil data dari sumber yang relevan.",
    example: "Membagikan lembar kuesioner atau survei digital untuk mencatat jenis ekstrakurikuler yang diminati teman sekelas."
  },
  {
    num: 2,
    title: "2️⃣ Membersihkan Data",
    desc: "Memeriksa data yang kosong, salah, tidak masuk akal, atau data yang terisi ganda (duplikat).",
    example: "Menghapus nama siswa yang mengisi kuesioner dua kali atau memperbaiki penulisan nama ekskul yang salah ketik."
  },
  {
    num: 3,
    title: "3️⃣ Mengolah dan Menganalisis Data",
    desc: "Mengelompokkan, menghitung total atau rata-rata, membandingkan data, dan mencari pola hubungan.",
    example: "Menghitung berapa jumlah siswa yang memilih pramuka, basket, paskibra, dan menyusunnya dalam bentuk tabel frekuensi."
  },
  {
    num: 4,
    title: "4️⃣ Memvisualisasikan Data",
    desc: "Menyajikan data yang telah diolah ke dalam bentuk grafik atau diagram agar lebih mudah dibaca mata.",
    example: "Mengubah data tabel ekstrakurikuler menjadi diagram batang yang berwarna dan menarik menggunakan komputer."
  },
  {
    num: 5,
    title: "5️⃣ Menafsirkan Data",
    desc: "Membaca informasi penting dari grafik, memahami makna angka, dan menemukan kesimpulan awal.",
    example: "Melihat bahwa batang diagram futsal adalah yang paling tinggi, artinya futsal paling banyak diminati siswa."
  },
  {
    num: 6,
    title: "6️⃣ Menyajikan Hasil",
    desc: "Menyampaikan informasi, wawasan, dan kesimpulan akhir kepada orang lain secara jelas dan komunikatif.",
    example: "Mempresentasikan hasil pilihan ekskul kepada guru pembina OSIS atau menempelkan poster grafik di mading kelas."
  }
];

// Data 5 Visualisasi Detail
const VIZ_DATA = {
  batang: {
    title: "Diagram Batang",
    icon: "📊",
    pengertian: "Grafik yang menggunakan batang persegi panjang (bisa tegak atau mendatar) dengan tinggi proporsional terhadap nilai data yang diwakili.",
    fungsi: "Sangat cocok untuk membandingkan beberapa kategori data yang berbeda secara langsung dan cepat.",
    contoh: "Membandingkan jumlah siswa per kelas, hobi favorit, atau penjualan makanan kantin sekolah.",
    chartType: 'bar',
    chartData: {
      labels: ['Pramuka', 'Basket', 'Futsal', 'PMR', 'Robotik'],
      datasets: [{
        label: 'Jumlah Siswa',
        data: [25, 18, 32, 14, 20],
        backgroundColor: ['#38bdf8', '#1e3a8a', '#10b981', '#f97316', '#8b5cf6']
      }]
    }
  },
  garis: {
    title: "Diagram Garis",
    icon: "📈",
    pengertian: "Grafik yang menampilkan titik-titik data yang saling dihubungkan oleh garis lurus secara berkesinambungan.",
    fungsi: "Sangat cocok untuk melihat perubahan, pola kenaikan/penurunan (tren), atau perkembangan data dari waktu ke waktu.",
    contoh: "Grafik suhu ruangan kelas dari pagi hingga siang, perkembangan tinggi badan siswa, atau perubahan nilai ulangan.",
    chartType: 'line',
    chartData: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
      datasets: [{
        label: 'Suhu Kelas (°C)',
        data: [26, 27, 29, 28, 30],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#1e3a8a',
        pointRadius: 5
      }]
    }
  },
  lingkaran: {
    title: "Diagram Lingkaran",
    icon: "🥧",
    pengertian: "Grafik berbentuk lingkaran yang dibagi menjadi beberapa juring (potongan) yang mewakili proporsi tiap kategori.",
    fungsi: "Sangat cocok untuk menunjukkan bagian, persentase, atau proporsi dari keseluruhan data total (100%).",
    contoh: "Persentase transportasi siswa ke sekolah (sepeda 30%, jalan kaki 20%, motor 40%, angkutan umum 10%).",
    chartType: 'pie',
    chartData: {
      labels: ['Sepeda', 'Jalan Kaki', 'Sepeda Motor', 'Bus/Angkot'],
      datasets: [{
        data: [30, 20, 40, 10],
        backgroundColor: ['#10b981', '#f97316', '#38bdf8', '#8b5cf6']
      }]
    }
  },
  histogram: {
    title: "Histogram",
    icon: "📶",
    pengertian: "Grafik batang yang batangnya saling berdempetan tanpa jarak celah, mewakili rentang data kontinu.",
    fungsi: "Sangat cocok untuk melihat distribusi frekuensi dan sebaran data dalam interval rentang angka tertentu.",
    contoh: "Sebaran nilai matematika kelas VIII dalam rentang interval: 61-70, 71-80, 81-90, dan 91-100.",
    chartType: 'bar',
    chartData: {
      labels: ['61-70', '71-80', '81-90', '91-100'],
      datasets: [{
        label: 'Frekuensi Siswa',
        data: [6, 14, 18, 8],
        backgroundColor: '#6366f1',
        barPercentage: 1.0,
        categoryPercentage: 1.0
      }]
    }
  },
  scatter: {
    title: "Scatter Plot",
    icon: "🔵",
    pengertian: "Grafik titik koordinat (X, Y) yang menampilkan sebaran titik data pada bidang Kartesius.",
    fungsi: "Sangat cocok untuk melihat hubungan (korelasi) atau pola keterkaitan antara dua variabel yang berbeda.",
    contoh: "Hubungan antara lama waktu belajar harian (jam) dengan perolehan nilai ujian siswa.",
    chartType: 'scatter',
    chartData: {
      datasets: [{
        label: 'Waktu Belajar (X) vs Nilai (Y)',
        data: [
          { x: 1, y: 65 },
          { x: 1.5, y: 70 },
          { x: 2, y: 75 },
          { x: 2.5, y: 80 },
          { x: 3, y: 85 },
          { x: 4, y: 92 },
          { x: 4.5, y: 95 }
        ],
        backgroundColor: '#ef4444',
        pointRadius: 6
      }]
    }
  }
};

// Data Kuis 10 Soal Lengkap
const QUIZ_QUESTIONS = [
  {
    q: "Visualisasi data digunakan untuk...",
    options: [
      "Menghapus semua data yang ada di komputer",
      "Membuat data lebih sulit dan rumit dipahami",
      "Menyajikan data agar lebih mudah dipahami",
      "Menghilangkan informasi penting pada tabel"
    ],
    answer: 2,
    explanation: "Visualisasi data bertujuan menyajikan data mentah menjadi bentuk visual (grafik/tabel) sehingga informasi lebih mudah dan cepat dipahami."
  },
  {
    q: "Proses memeriksa, membersihkan, mengolah, dan menafsirkan data untuk mendapatkan informasi yang bermakna disebut...",
    options: [
      "Analisis data",
      "Penyimpanan berkas",
      "Pemrograman game",
      "Perakitan komputer"
    ],
    answer: 0,
    explanation: "Pengertian analisis data adalah proses mengolah data secara sistematis hingga menghasilkan wawasan dan informasi yang bermanfaat."
  },
  {
    q: "Langkah pertama yang wajib dilakukan dalam tahapan analisis data adalah...",
    options: [
      "Menyajikan hasil akhir",
      "Mengumpulkan data",
      "Membuat diagram lingkaran",
      "Menarik kesimpulan langsung"
    ],
    answer: 1,
    explanation: "Tahap awal dari alur analisis data adalah Mengumpulkan Data sesuai dengan tujuan yang ingin dicapai."
  },
  {
    q: "Pada tahap pembersihan data (data cleaning), kegiatan yang dilakukan adalah...",
    options: [
      "Menghapus data kosong, salah, atau duplikat",
      "Mengganti seluruh angka dengan huruf acak",
      "Menyebarkan kuesioner baru ke sekolah lain",
      "Membuat presentasi grafik di depan kelas"
    ],
    answer: 0,
    explanation: "Membersihkan data berfokus memeriksa dan memperbaiki data anomali, nilai kosong, atau data yang terinput ganda."
  },
  {
    q: "Teknik visualisasi yang paling cocok untuk membandingkan data antarbeberapa kategori yang berbeda adalah...",
    options: [
      "Scatter plot",
      "Diagram batang",
      "Diagram garis",
      "Teks deskripsi panjang"
    ],
    answer: 1,
    explanation: "Diagram batang dirancang khusus agar kita bisa membandingkan tinggi/panjang batang tiap kategori dengan sangat jelas."
  },
  {
    q: "Jika kita ingin melihat perubahan suhu udara dari hari Senin sampai hari Minggu, jenis diagram yang paling tepat digunakan adalah...",
    options: [
      "Diagram garis",
      "Diagram lingkaran",
      "Scatter plot",
      "Tabel teks acak"
    ],
    answer: 0,
    explanation: "Diagram garis sangat ideal untuk melihat pergerakan, tren kenaikan, dan penurunan data dari waktu ke waktu (time-series)."
  },
  {
    q: "Diagram yang berbentuk lingkaran dan dibagi menjadi beberapa juring untuk menunjukkan proporsi dari keseluruhan (100%) adalah...",
    options: [
      "Histogram",
      "Diagram garis",
      "Diagram lingkaran",
      "Scatter plot"
    ],
    answer: 2,
    explanation: "Diagram lingkaran (pie chart) memperlihatkan porsi atau persentase masing-masing kategori terhadap keseluruhan 100%."
  },
  {
    q: "Perbedaan utama antara Histogram dengan Diagram Batang biasa adalah...",
    options: [
      "Histogram tidak menggunakan warna sama sekali",
      "Histogram batangnya saling berdempetan untuk data rentang kontinu",
      "Histogram hanya bisa dibuat dengan kertas dan pulpen",
      "Diagram batang tidak memiliki sumbu X dan Y"
    ],
    answer: 1,
    explanation: "Histogram batangnya berdempetan tanpa celah karena mewakili kelas interval data angka kontinu."
  },
  {
    q: "Untuk melihat apakah ada hubungan (korelasi) antara jam belajar siswa dengan nilai ulangan, visualisasi yang paling cocok adalah...",
    options: [
      "Scatter plot",
      "Diagram lingkaran",
      "Diagram batang mendatar",
      "Peta wilayah"
    ],
    answer: 0,
    explanation: "Scatter plot menyajikan titik-titik koordinat dua variabel untuk mengamati apakah ada hubungan positif, negatif, atau acak."
  },
  {
    q: "Mengapa kesimpulan dalam analisis data harus diambil berdasarkan data dan fakta yang ada?",
    options: [
      "Agar terlihat keren di depan guru",
      "Agar keputusan yang diambil tepat dan dapat dipertanggungjawabkan",
      "Supaya data aslinya bisa segera dihapus",
      "Supaya tidak perlu membuat grafik visualisasi"
    ],
    answer: 1,
    explanation: "Kesimpulan berbasis data (data-driven decision) menghindarkan kita dari perkiraan asal-asalan sehingga keputusan menjadi objektif dan tepat."
  }
];

// --- 2. SOUND SYNTHESIZER (WEB AUDIO API) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.15, startTimeOffset = 0, gainLevel = 0.15) {
  if (!APP_STATE.coc.audioEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTimeOffset);

    gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime + startTimeOffset);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startTimeOffset + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + startTimeOffset);
    osc.stop(audioCtx.currentTime + startTimeOffset + duration);
  } catch (err) {
    // browser audio policy handling
  }
}

function playFlipSound() {
  playTone(480, 'sine', 0.08, 0, 0.1);
}

function playMatchSound() {
  playTone(523.25, 'triangle', 0.12, 0, 0.2);     // C5
  playTone(659.25, 'triangle', 0.12, 0.08, 0.2);  // E5
  playTone(783.99, 'triangle', 0.25, 0.16, 0.25); // G5
}

function playWrongSound() {
  playTone(220, 'sawtooth', 0.18, 0, 0.15);
  playTone(185, 'sawtooth', 0.2, 0.1, 0.15);
}

function playStreakSound(streak) {
  const baseFreq = 500 + (streak * 80);
  playTone(baseFreq, 'square', 0.15, 0, 0.12);
  playTone(baseFreq * 1.25, 'square', 0.2, 0.08, 0.15);
}

function playVictoryFanfare() {
  playTone(523.25, 'triangle', 0.18, 0, 0.25);    // C5
  playTone(659.25, 'triangle', 0.18, 0.12, 0.25); // E5
  playTone(783.99, 'triangle', 0.18, 0.24, 0.25); // G5
  playTone(1046.50, 'triangle', 0.5, 0.36, 0.3);  // C6 (Tinggi)
}

function toggleCocAudio() {
  APP_STATE.coc.audioEnabled = !APP_STATE.coc.audioEnabled;
  const badge = document.getElementById('cocAudioStatus');
  if (badge) {
    badge.textContent = APP_STATE.coc.audioEnabled ? 'ON' : 'OFF';
    badge.style.color = APP_STATE.coc.audioEnabled ? '#38bdf8' : '#94a3b8';
  }
  if (APP_STATE.coc.audioEnabled) {
    initAudio();
    playTone(600, 'sine', 0.1);
  }
}

// --- 3. INISIALISASI SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', () => {
  loadStoredProgress();
  initActivity1();
  initActivity2();
  initActivity3Chart();
  initCocArena();
  updateProgressUI();
});

// --- 4. NAVIGASI SINGLE-PAGE (SPA) ---
function navigateTo(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update menu active indicator
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(btn => {
    if (btn.getAttribute('data-target') === sectionId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Tutup menu mobile jika sedang terbuka
  const navbar = document.getElementById('mainNavbar');
  if (navbar) navbar.classList.remove('open');

  // Catat progress kunjungan materi & tahapan
  if (sectionId === 'materi') {
    APP_STATE.progress.visitedMateri = true;
    saveProgress();
  } else if (sectionId === 'tahapan') {
    APP_STATE.progress.visitedTahapan = true;
    saveProgress();
  } else if (sectionId === 'aktivitas') {
    if (APP_STATE.act3ChartInstance) {
      APP_STATE.act3ChartInstance.resize();
    }
  }

  updateProgressUI();
}

function toggleMobileNav() {
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    navbar.classList.toggle('open');
  }
}

// --- 5. PERSISTENSI PROGRESS (LOCALSTORAGE) ---
function loadStoredProgress() {
  try {
    const saved = localStorage.getItem('analisisDataProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      APP_STATE.progress = Object.assign(APP_STATE.progress, parsed);
    }
    const savedBest = localStorage.getItem('cocBestTimeMs');
    if (savedBest) {
      APP_STATE.coc.bestTimeMs = parseInt(savedBest, 10);
      updateCocBestUI();
    }
  } catch (e) {
    console.warn('localStorage tidak tersedia:', e);
  }
}

function saveProgress() {
  try {
    localStorage.setItem('analisisDataProgress', JSON.stringify(APP_STATE.progress));
  } catch (e) {
    console.warn('Gagal menyimpan progress:', e);
  }
}

function updateProgressUI() {
  const keys = ['visitedMateri', 'visitedTahapan', 'act1Done', 'act2Done', 'act3Done', 'act4Done', 'quizDone'];
  let doneCount = 0;
  keys.forEach(k => {
    if (APP_STATE.progress[k]) doneCount++;
  });

  const percent = Math.round((doneCount / keys.length) * 100);
  const textEl = document.getElementById('globalProgressText');
  const barEl = document.getElementById('globalProgressBar');

  if (textEl) textEl.textContent = `${percent}%`;
  if (barEl) barEl.style.width = `${percent}%`;
}

function resetAllProgress() {
  if (confirm('Apakah kamu yakin ingin mereset seluruh progres belajar dan rekor game?')) {
    APP_STATE.progress = {
      visitedMateri: false,
      visitedTahapan: false,
      act1Done: false,
      act2Done: false,
      act3Done: false,
      act4Done: false,
      quizDone: false
    };
    saveProgress();
    resetCocBestRecord(false);
    updateProgressUI();
    resetActivity1();
    resetActivity2();
    resetActivity3();
    restartQuiz();
    navigateTo('beranda');
    alert('Seluruh progres belajar telah direset kembali ke 0%.');
  }
}

// --- 6. MATERI: CONTOH SEDERHANA & MODAL VISUALISASI ---
function toggleRevealCase() {
  const content = document.getElementById('revealCase');
  const btn = document.getElementById('btnReveal');
  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
    btn.innerHTML = '🙈 Sembunyikan Analisis';
  } else {
    content.style.display = 'none';
    btn.innerHTML = '🔍 Klik untuk Menampilkan Jawaban';
  }
}

function openVizModal(type) {
  const data = VIZ_DATA[type];
  if (!data) return;

  document.getElementById('mIcon').textContent = data.icon;
  document.getElementById('mTitle').textContent = data.title;
  document.getElementById('mPengertian').textContent = data.pengertian;
  document.getElementById('mFungsi').textContent = data.fungsi;
  document.getElementById('mContoh').textContent = data.contoh;

  const modal = document.getElementById('vizDetailModal');
  modal.classList.add('open');

  // Render chart pada canvas modal
  const canvas = document.getElementById('modalCanvas');
  const ctx = canvas.getContext('2d');

  if (APP_STATE.modalChartInstance) {
    APP_STATE.modalChartInstance.destroy();
  }

  APP_STATE.modalChartInstance = new Chart(ctx, {
    type: data.chartType,
    data: data.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: data.chartType === 'pie' || data.chartType === 'scatter',
          position: 'bottom'
        }
      },
      scales: (data.chartType === 'pie') ? {} : {
        y: { beginAtZero: true }
      }
    }
  });
}

function closeVizModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('vizDetailModal');
  modal.classList.remove('open');
  if (APP_STATE.modalChartInstance) {
    APP_STATE.modalChartInstance.destroy();
    APP_STATE.modalChartInstance = null;
  }
}

// --- 7. TAHAPAN ANALISIS (STEPPER) ---
function goToStep(stepNum) {
  if (stepNum < 1 || stepNum > 6) return;
  APP_STATE.currentStep = stepNum;

  const stepInfo = STEPS_DATA[stepNum - 1];
  document.getElementById('stepBadge').textContent = `Tahap ${stepNum} dari 6`;
  document.getElementById('stepTitle').textContent = stepInfo.title;
  document.getElementById('stepDescText').textContent = stepInfo.desc;
  document.getElementById('stepExampleText').textContent = stepInfo.example;
  document.getElementById('stepCounterText').textContent = `Langkah ${stepNum} / 6`;

  // Update status tombol prev & next
  document.getElementById('btnPrevStep').disabled = (stepNum === 1);
  const nextBtn = document.getElementById('btnNextStep');
  if (stepNum === 6) {
    nextBtn.textContent = 'Selesai Membaca ✓';
    nextBtn.onclick = () => navigateTo('aktivitas');
  } else {
    nextBtn.textContent = 'Tahap Selanjutnya ➡';
    nextBtn.onclick = nextStep;
  }

  // Update indikator bulatan
  const nodes = document.querySelectorAll('.step-node');
  nodes.forEach(node => {
    const s = parseInt(node.getAttribute('data-step'), 10);
    node.classList.remove('active', 'passed');
    if (s === stepNum) {
      node.classList.add('active');
    } else if (s < stepNum) {
      node.classList.add('passed');
    }
  });
}

function prevStep() {
  if (APP_STATE.currentStep > 1) {
    goToStep(APP_STATE.currentStep - 1);
  }
}

function nextStep() {
  if (APP_STATE.currentStep < 6) {
    goToStep(APP_STATE.currentStep + 1);
  }
}

// --- 8. MENU AKTIVITAS (TAB SWITCHER 4 AKTIVITAS) ---
function selectActivityTab(actNum) {
  const tabs = document.querySelectorAll('.act-tab');
  tabs.forEach(t => {
    if (parseInt(t.getAttribute('data-act'), 10) === actNum) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  const blocks = [
    document.getElementById('actBlock1'),
    document.getElementById('actBlock2'),
    document.getElementById('actBlock3'),
    document.getElementById('actBlock4'),
    document.getElementById('actBlock5')
  ];

  blocks.forEach((b, idx) => {
    if (b) {
      if (idx + 1 === actNum) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    }
  });

  if (actNum === 3 && APP_STATE.act3ChartInstance) {
    setTimeout(() => {
      APP_STATE.act3ChartInstance.resize();
    }, 100);
  }

  if (actNum === 4 && !APP_STATE.coc.isPlaying && APP_STATE.coc.cards.length === 0) {
    renderCocBoardPreview();
  }

  if (actNum === 5) {
    initBattleArena();
  }
}

// ==========================================================================
// AKTIVITAS 1: URUTKAN TAHAP ANALISIS DATA (DRAG & DROP + TOUCH)
// ==========================================================================
const CORRECT_ACT1_ORDER = [
  "Mengumpulkan Data",
  "Membersihkan Data",
  "Mengolah dan Menganalisis Data",
  "Memvisualisasikan Data",
  "Menafsirkan Data",
  "Menyajikan Hasil"
];

function initActivity1() {
  APP_STATE.act1Items = [
    "Mengolah dan Menganalisis Data",
    "Menyajikan Hasil",
    "Mengumpulkan Data",
    "Menafsirkan Data",
    "Membersihkan Data",
    "Memvisualisasikan Data"
  ];
  renderActivity1List();
}

function renderActivity1List() {
  const container = document.getElementById('dragList');
  if (!container) return;
  container.innerHTML = '';

  APP_STATE.act1Items.forEach((itemText, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'drag-item';
    itemEl.setAttribute('draggable', 'true');
    itemEl.setAttribute('data-index', index);

    itemEl.innerHTML = `
      <div class="drag-left">
        <span class="drag-handle" title="Tahan dan seret">☰</span>
        <span class="drag-number">${index + 1}</span>
        <span class="drag-text">${itemText}</span>
      </div>
      <div class="drag-arrows">
        <button class="btn-arrow" onclick="moveAct1Item(${index}, -1)" title="Pindah ke Atas" ${index === 0 ? 'disabled' : ''}>⬆</button>
        <button class="btn-arrow" onclick="moveAct1Item(${index}, 1)" title="Pindah ke Bawah" ${index === APP_STATE.act1Items.length - 1 ? 'disabled' : ''}>⬇</button>
      </div>
    `;

    itemEl.addEventListener('dragstart', handleDragStart);
    itemEl.addEventListener('dragover', handleDragOver);
    itemEl.addEventListener('drop', handleDrop);
    itemEl.addEventListener('dragend', handleDragEnd);

    container.appendChild(itemEl);
  });
}

let draggedItemIndex = null;

function handleDragStart(e) {
  draggedItemIndex = parseInt(this.getAttribute('data-index'), 10);
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  const targetIndex = parseInt(this.getAttribute('data-index'), 10);

  if (draggedItemIndex !== null && draggedItemIndex !== targetIndex) {
    const moved = APP_STATE.act1Items.splice(draggedItemIndex, 1)[0];
    APP_STATE.act1Items.splice(targetIndex, 0, moved);
    renderActivity1List();
  }
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.drag-item').forEach(el => el.classList.remove('drag-over'));
}

function moveAct1Item(index, direction) {
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < APP_STATE.act1Items.length) {
    const temp = APP_STATE.act1Items[index];
    APP_STATE.act1Items[index] = APP_STATE.act1Items[newIndex];
    APP_STATE.act1Items[newIndex] = temp;
    renderActivity1List();
  }
}

function checkActivity1() {
  const isCorrect = APP_STATE.act1Items.every((item, idx) => item === CORRECT_ACT1_ORDER[idx]);
  const alertEl = document.getElementById('act1Alert');
  const badgeEl = document.getElementById('act1BadgeStatus');

  alertEl.style.display = 'block';

  if (isCorrect) {
    alertEl.className = 'feedback-alert success';
    alertEl.innerHTML = '🎉 <strong>Hebat!</strong> Urutan tahapan analisis data sudah benar.';
    badgeEl.textContent = 'Skor: 100 / 100';
    badgeEl.style.color = 'var(--color-accent-green)';
    APP_STATE.progress.act1Done = true;
    saveProgress();
    updateProgressUI();
  } else {
    alertEl.className = 'feedback-alert error';
    alertEl.innerHTML = '⚠️ <strong>Belum tepat.</strong> Coba periksa kembali urutannya dari Mengumpulkan hingga Menyajikan.';
    badgeEl.textContent = 'Skor: Coba Lagi';
    badgeEl.style.color = 'var(--color-accent-red)';
  }
}

function resetActivity1() {
  initActivity1();
  const alertEl = document.getElementById('act1Alert');
  alertEl.style.display = 'none';
  const badgeEl = document.getElementById('act1BadgeStatus');
  badgeEl.textContent = 'Skor: - / 100';
  badgeEl.style.color = 'var(--color-primary-navy)';
}

// ==========================================================================
// AKTIVITAS 2: JODOHKAN VISUALISASI
// ==========================================================================
const MATCH_PAIRS_DEF = [
  { id: 'batang', label: 'A. Diagram Batang', funcId: 'f2' },
  { id: 'garis', label: 'B. Diagram Garis', funcId: 'f4' },
  { id: 'lingkaran', label: 'C. Diagram Lingkaran', funcId: 'f3' },
  { id: 'histogram', label: 'D. Histogram', funcId: 'f5' },
  { id: 'scatter', label: 'E. Scatter Plot', funcId: 'f1' }
];

const MATCH_FUNCTIONS_DEF = [
  { id: 'f1', text: '1. Menunjukkan hubungan antara dua variabel.' },
  { id: 'f2', text: '2. Membandingkan beberapa kategori.' },
  { id: 'f3', text: '3. Menunjukkan proporsi dari keseluruhan.' },
  { id: 'f4', text: '4. Melihat perubahan data dari waktu ke waktu.' },
  { id: 'f5', text: '5. Melihat distribusi atau sebaran data.' }
];

function initActivity2() {
  APP_STATE.act2SelectedLeft = null;
  APP_STATE.act2Matches = {};

  const leftContainer = document.getElementById('matchLeftContainer');
  const rightContainer = document.getElementById('matchRightContainer');
  if (!leftContainer || !rightContainer) return;

  leftContainer.innerHTML = '';
  rightContainer.innerHTML = '';

  MATCH_PAIRS_DEF.forEach(item => {
    const el = document.createElement('div');
    el.className = 'match-card-item';
    el.id = `left-${item.id}`;
    el.textContent = item.label;
    el.onclick = () => selectLeftMatch(item.id);
    leftContainer.appendChild(el);
  });

  MATCH_FUNCTIONS_DEF.forEach(item => {
    const el = document.createElement('div');
    el.className = 'match-card-item';
    el.id = `right-${item.id}`;
    el.textContent = item.text;
    el.onclick = () => selectRightMatch(item.id);
    rightContainer.appendChild(el);
  });

  updateAct2Badge();
}

function selectLeftMatch(leftId) {
  if (APP_STATE.act2Matches[leftId]) return;

  APP_STATE.act2SelectedLeft = leftId;
  document.querySelectorAll('#matchLeftContainer .match-card-item').forEach(el => {
    el.classList.remove('selected');
  });

  const activeEl = document.getElementById(`left-${leftId}`);
  if (activeEl) activeEl.classList.add('selected');
}

function selectRightMatch(rightId) {
  if (!APP_STATE.act2SelectedLeft) {
    const alertEl = document.getElementById('act2Alert');
    alertEl.style.display = 'block';
    alertEl.className = 'feedback-alert error';
    alertEl.textContent = 'Silakan klik salah satu jenis visualisasi di sisi kiri terlebih dahulu!';
    return;
  }

  const leftId = APP_STATE.act2SelectedLeft;
  const targetPair = MATCH_PAIRS_DEF.find(p => p.id === leftId);

  const leftEl = document.getElementById(`left-${leftId}`);
  const rightEl = document.getElementById(`right-${rightId}`);

  if (targetPair && targetPair.funcId === rightId) {
    APP_STATE.act2Matches[leftId] = rightId;
    leftEl.classList.remove('selected');
    leftEl.classList.add('matched-correct');
    rightEl.classList.add('matched-correct');

    APP_STATE.act2SelectedLeft = null;
    updateAct2Badge();

    const alertEl = document.getElementById('act2Alert');
    alertEl.style.display = 'block';
    alertEl.className = 'feedback-alert success';
    alertEl.textContent = `✅ Tepat sekali! ${targetPair.label} berhasil dijodohkan.`;

    if (Object.keys(APP_STATE.act2Matches).length === 5) {
      alertEl.innerHTML = '🎉 <strong>Luar biasa!</strong> Semua jenis visualisasi berhasil kamu jodohkan dengan tepat!';
      APP_STATE.progress.act2Done = true;
      saveProgress();
      updateProgressUI();
    }
  } else {
    leftEl.classList.add('matched-wrong');
    rightEl.classList.add('matched-wrong');
    setTimeout(() => {
      leftEl.classList.remove('matched-wrong');
      rightEl.classList.remove('matched-wrong');
    }, 500);

    const alertEl = document.getElementById('act2Alert');
    alertEl.style.display = 'block';
    alertEl.className = 'feedback-alert error';
    alertEl.textContent = '❌ Pasangan belum cocok. Coba baca kembali fungsinya dan coba lagi!';
  }
}

function updateAct2Badge() {
  const count = Object.keys(APP_STATE.act2Matches).length;
  const badge = document.getElementById('act2PairCount');
  if (badge) badge.textContent = `Pasangan Benar: ${count} / 5`;
}

function checkActivity2() {
  const count = Object.keys(APP_STATE.act2Matches).length;
  const alertEl = document.getElementById('act2Alert');
  alertEl.style.display = 'block';

  if (count === 5) {
    alertEl.className = 'feedback-alert success';
    alertEl.innerHTML = '🎉 <strong>Sempurna!</strong> Kamu sudah berhasil mencocokkan seluruh 5 jenis visualisasi data.';
    APP_STATE.progress.act2Done = true;
    saveProgress();
    updateProgressUI();
  } else {
    alertEl.className = 'feedback-alert error';
    alertEl.innerHTML = `Kamu baru mencocokkan <strong>${count} dari 5</strong> pasangan. Teruskan sampai selesai!`;
  }
}

function resetActivity2() {
  initActivity2();
  const alertEl = document.getElementById('act2Alert');
  alertEl.style.display = 'none';
}

// ==========================================================================
// AKTIVITAS 3: BACA GRAFIK DENGAN SOAL HOTS (CHART.JS)
// ==========================================================================
function initActivity3Chart() {
  const canvas = document.getElementById('chartAct3');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (APP_STATE.act3ChartInstance) {
    APP_STATE.act3ChartInstance.destroy();
  }

  APP_STATE.act3ChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['7A', '7B', '7C', '8A', '8B'],
      datasets: [
        {
          label: 'Laki-laki',
          data: [15, 12, 18, 11, 14],
          backgroundColor: '#1e40af',
          borderRadius: 6
        },
        {
          label: 'Perempuan',
          data: [10, 14, 7, 16, 13],
          backgroundColor: '#f97316',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 20,
          ticks: { stepSize: 2 }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
}

// Kunci Jawaban & Penjelasan HOTS Mendalam
const ACT3_HOTS_ANSWERS = {
  1: {
    val: 'C',
    correctText: 'C. Kelas 7C — Selisih 11 siswa (18 L vs 7 P)',
    explanation: 'Analisis HOTS Sangat Tepat! Kelas 7C memiliki selisih gender sebesar 18 - 7 = 11 siswa. Kesenjangan ini paling mencolok dibandingkan kelas lain yang hanya berselisih 1 sampai 5 siswa.'
  },
  2: {
    val: 'A',
    correctText: 'A. Jenjang Kelas 8 memiliki proporsi persentase siswi perempuan lebih tinggi (53,7%)',
    explanation: 'Analisis Rasio HOTS Cemerlang! Meskipun secara nominal kelas 7 memiliki 31 siswi (dari total 76 siswa = 40,8%), kelas 8 memiliki 29 siswi dari total 54 siswa (53,7%). Jadi, secara proporsi persentase, kelas 8 lebih didominasi siswi perempuan.'
  },
  3: {
    val: 'A',
    correctText: 'A. Kelas 7C kekurangan 1 siswi putri, solusinya berkolaborasi dengan kelas 7B yang surplus',
    explanation: 'Keputusan Solutif Berbasis Data Tepat Sekali! Dari tabel dan grafik terlihat hanya kelas 7C yang jumlah putrinya di bawah kuota (7 orang, kurang 1 orang). Kolaborasi dengan kelas 7B yang memiliki surplus 14 putri adalah solusi paling rasional dan aplikatif.'
  }
};

function chooseAct3(qId, selectedVal, btnEl) {
  const card = document.getElementById(`act3Q${qId}Card`);
  const buttons = card.querySelectorAll('.btn-choice');
  const msgEl = document.getElementById(`act3Msg${qId}`);

  buttons.forEach(b => {
    b.classList.remove('correct', 'wrong');
    b.disabled = true;
  });

  const correctInfo = ACT3_HOTS_ANSWERS[qId];
  if (selectedVal === correctInfo.val) {
    btnEl.classList.add('correct');
    msgEl.className = 'q-status-msg correct';
    msgEl.innerHTML = `✅ <strong>Jawaban Benar!</strong> ${correctInfo.explanation}`;
    APP_STATE.act3Answers[qId] = true;
    playMatchSound();
  } else {
    btnEl.classList.add('wrong');
    // Beri highlight pada pilihan yang benar
    buttons.forEach(b => {
      if (b.innerText.trim().startsWith(correctInfo.val)) {
        b.classList.add('correct');
      }
    });
    msgEl.className = 'q-status-msg wrong';
    msgEl.innerHTML = `❌ <strong>Analisis Belum Tepat.</strong> Jawaban yang benar adalah <strong>${correctInfo.correctText}</strong>.<br><em>${correctInfo.explanation}</em>`;
    APP_STATE.act3Answers[qId] = false;
    playWrongSound();
  }

  msgEl.style.display = 'block';
  updateAct3Score();
}

function updateAct3Score() {
  let score = 0;
  Object.values(APP_STATE.act3Answers).forEach(ans => {
    if (ans === true) score++;
  });

  const badge = document.getElementById('act3BadgeScore');
  if (badge) badge.textContent = `Skor: ${score} / 3`;

  if (score === 3) {
    APP_STATE.progress.act3Done = true;
    saveProgress();
    updateProgressUI();
  }
}

function resetActivity3() {
  APP_STATE.act3Answers = { 1: null, 2: null, 3: null };
  for (let qId = 1; qId <= 3; qId++) {
    const card = document.getElementById(`act3Q${qId}Card`);
    if (card) {
      const buttons = card.querySelectorAll('.btn-choice');
      buttons.forEach(b => {
        b.classList.remove('correct', 'wrong');
        b.disabled = false;
      });
      const msgEl = document.getElementById(`act3Msg${qId}`);
      if (msgEl) msgEl.style.display = 'none';
    }
  }
  updateAct3Score();
}

// ==========================================================================
// AKTIVITAS 4: CLASH OF CHAMPIONS (COC RUANG GURU) - MEMORY BATTLE
// ==========================================================================
const COC_PAIRS_DATA = [
  {
    pairId: 'batang',
    cardA: { icon: '📊', title: 'Diagram Batang', subtitle: 'Bentuk Persegi Panjang' },
    cardB: { icon: '🎯', title: 'Fungsi Batang', subtitle: 'Membandingkan Kategori Data' }
  },
  {
    pairId: 'garis',
    cardA: { icon: '📈', title: 'Diagram Garis', subtitle: 'Titik Data Terhubung' },
    cardB: { icon: '⏱️', title: 'Fungsi Garis', subtitle: 'Melihat Perubahan dari Waktu ke Waktu' }
  },
  {
    pairId: 'lingkaran',
    cardA: { icon: '🥧', title: 'Diagram Lingkaran', subtitle: 'Juring Lingkaran' },
    cardB: { icon: '💯', title: 'Fungsi Lingkaran', subtitle: 'Proporsi Bagian dari Total (100%)' }
  },
  {
    pairId: 'histogram',
    cardA: { icon: '📶', title: 'Histogram', subtitle: 'Batang Saling Berdempetan' },
    cardB: { icon: '📊', title: 'Fungsi Histogram', subtitle: 'Melihat Distribusi Data Kontinu' }
  },
  {
    pairId: 'scatter',
    cardA: { icon: '🔵', title: 'Scatter Plot', subtitle: 'Titik Koordinat (X, Y)' },
    cardB: { icon: '🔗', title: 'Fungsi Scatter', subtitle: 'Melihat Hubungan Dua Variabel' }
  },
  {
    pairId: 'cleaning',
    cardA: { icon: '🧹', title: 'Pembersihan Data', subtitle: 'Tahap 2 Analisis Data' },
    cardB: { icon: '✨', title: 'Fungsi Cleaning', subtitle: 'Hapus Data Duplikat & Nilai Salah' }
  }
];

function initCocArena() {
  updateCocBestUI();
  renderCocBoardPreview();
}

function updateCocBestUI() {
  const el = document.getElementById('cocBestText');
  if (el) {
    if (APP_STATE.coc.bestTimeMs) {
      el.textContent = formatMs(APP_STATE.coc.bestTimeMs);
    } else {
      el.textContent = '-';
    }
  }
}

function formatMs(ms) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');
  return `${mStr}:${sStr}.${tenths}`;
}

function renderCocBoardPreview() {
  const container = document.getElementById('cocGridContainer');
  if (!container) return;
  container.innerHTML = '';

  // Generate 12 kartu placeholder sebelum battle dimulai
  for (let i = 0; i < 12; i++) {
    const cardEl = document.createElement('div');
    cardEl.className = 'coc-card';
    cardEl.innerHTML = `
      <div class="coc-card-front">
        <div class="coc-front-logo">⚡</div>
        <div class="coc-front-text">CLASH OF DATA</div>
      </div>
      <div class="coc-card-back">
        <div class="coc-card-icon">❓</div>
        <div class="coc-card-title">Kartu Rahasia #${i + 1}</div>
      </div>
    `;
    container.appendChild(cardEl);
  }
}

function startCocGame() {
  initAudio();
  const victoryModal = document.getElementById('cocVictoryModal');
  if (victoryModal) victoryModal.style.display = 'none';

  clearInterval(APP_STATE.coc.timerInterval);

  // Buat dek 12 kartu dari 6 pasangan
  let deck = [];
  COC_PAIRS_DATA.forEach(pair => {
    deck.push({
      id: `${pair.pairId}_A`,
      pairId: pair.pairId,
      icon: pair.cardA.icon,
      title: pair.cardA.title,
      subtitle: pair.cardA.subtitle
    });
    deck.push({
      id: `${pair.pairId}_B`,
      pairId: pair.pairId,
      icon: pair.cardB.icon,
      title: pair.cardB.title,
      subtitle: pair.cardB.subtitle
    });
  });

  // Acak kartu (Fisher-Yates Shuffle)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  APP_STATE.coc.cards = deck;
  APP_STATE.coc.flippedCards = [];
  APP_STATE.coc.matchedPairs = 0;
  APP_STATE.coc.moves = 0;
  APP_STATE.coc.streak = 0;
  APP_STATE.coc.maxStreak = 0;
  APP_STATE.coc.isPlaying = false;
  APP_STATE.coc.isBusy = true;

  document.getElementById('cocMovesText').textContent = '0';
  document.getElementById('cocStreakText').textContent = 'x0';
  document.getElementById('cocTimerText').textContent = '00:00.0';

  const container = document.getElementById('cocGridContainer');
  container.innerHTML = '';

  deck.forEach((cardData, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'coc-card flipped'; // Awalnya terbuka untuk Memory Flash!
    cardEl.id = `cocCard_${idx}`;
    cardEl.setAttribute('data-index', idx);

    cardEl.innerHTML = `
      <div class="coc-card-front">
        <div class="coc-front-logo">⚡</div>
        <div class="coc-front-text">CLASH OF DATA</div>
      </div>
      <div class="coc-card-back">
        <div class="coc-card-icon">${cardData.icon}</div>
        <div class="coc-card-title">${cardData.title}</div>
        <div class="coc-card-subtitle">${cardData.subtitle}</div>
      </div>
    `;

    cardEl.onclick = () => onCocCardClick(idx);
    container.appendChild(cardEl);
  });

  // FASE 1: MEMORY FLASH COUNTDOWN (5 DETIK MENGINGAT KARTU ALA COC RUANG GURU)
  const countdownBanner = document.getElementById('cocCountdownBanner');
  const countdownNum = document.getElementById('cocCountdownNumber');
  const countdownLabel = document.getElementById('cocCountdownLabel');

  countdownBanner.style.display = 'block';
  let countdownSec = 5;
  countdownNum.textContent = countdownSec;
  countdownLabel.textContent = 'HAFALKAN SELURUH KARTU SEBELUM DIKUNCI! (5 DETIK)';
  playTone(550, 'sine', 0.15);

  const countInterval = setInterval(() => {
    countdownSec--;
    if (countdownSec > 0) {
      countdownNum.textContent = countdownSec;
      playTone(550, 'sine', 0.15);
    } else {
      clearInterval(countInterval);
      countdownNum.textContent = '🔒 MEMORY LOCKED!';
      playTone(750, 'square', 0.3);

      setTimeout(() => {
        countdownBanner.style.display = 'none';

        // Balik kartu menutup semua
        document.querySelectorAll('.coc-card').forEach(el => {
          el.classList.remove('flipped');
        });

        APP_STATE.coc.isPlaying = true;
        APP_STATE.coc.isBusy = false;
        APP_STATE.coc.startTime = performance.now();

        // Mulai Stopwatch COC
        APP_STATE.coc.timerInterval = setInterval(() => {
          const now = performance.now();
          APP_STATE.coc.elapsedMs = now - APP_STATE.coc.startTime;
          document.getElementById('cocTimerText').textContent = formatMs(APP_STATE.coc.elapsedMs);
        }, 80);
      }, 700);
    }
  }, 1000);
}

function onCocCardClick(index) {
  if (!APP_STATE.coc.isPlaying || APP_STATE.coc.isBusy) return;

  const cardData = APP_STATE.coc.cards[index];
  const cardEl = document.getElementById(`cocCard_${index}`);

  // Jangan lakukan apa-apa jika kartu sudah terbuka atau sudah matched
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) {
    return;
  }

  // Balik kartu
  cardEl.classList.add('flipped');
  playFlipSound();
  APP_STATE.coc.flippedCards.push({ index, data: cardData, el: cardEl });

  if (APP_STATE.coc.flippedCards.length === 2) {
    APP_STATE.coc.moves++;
    document.getElementById('cocMovesText').textContent = APP_STATE.coc.moves;
    APP_STATE.coc.isBusy = true;

    const [first, second] = APP_STATE.coc.flippedCards;

    if (first.data.pairId === second.data.pairId) {
      // COCOK BENAR! (MATCH)
      APP_STATE.coc.matchedPairs++;
      APP_STATE.coc.streak++;
      if (APP_STATE.coc.streak > APP_STATE.coc.maxStreak) {
        APP_STATE.coc.maxStreak = APP_STATE.coc.streak;
      }

      document.getElementById('cocStreakText').textContent = `x${APP_STATE.coc.streak} 🔥`;

      first.el.classList.add('matched');
      second.el.classList.add('matched');

      if (APP_STATE.coc.streak >= 2) {
        playStreakSound(APP_STATE.coc.streak);
      } else {
        playMatchSound();
      }

      APP_STATE.coc.flippedCards = [];
      APP_STATE.coc.isBusy = false;

      // Cek apakah menang (Semua 6 pasangan terbuka)
      if (APP_STATE.coc.matchedPairs === 6) {
        onCocVictory();
      }
    } else {
      // SALAH COCOK (MISMATCH)
      APP_STATE.coc.streak = 0;
      document.getElementById('cocStreakText').textContent = 'x0';
      playWrongSound();

      first.el.classList.add('wrong-shake');
      second.el.classList.add('wrong-shake');

      setTimeout(() => {
        first.el.classList.remove('flipped', 'wrong-shake');
        second.el.classList.remove('flipped', 'wrong-shake');
        APP_STATE.coc.flippedCards = [];
        APP_STATE.coc.isBusy = false;
      }, 750);
    }
  }
}

function onCocVictory() {
  clearInterval(APP_STATE.coc.timerInterval);
  APP_STATE.coc.isPlaying = false;
  playVictoryFanfare();

  const finalMs = APP_STATE.coc.elapsedMs;
  const timeStr = formatMs(finalMs);

  // Cek dan simpan Rekor Pribadi Terbaik
  let isNewBest = false;
  if (!APP_STATE.coc.bestTimeMs || finalMs < APP_STATE.coc.bestTimeMs) {
    APP_STATE.coc.bestTimeMs = Math.round(finalMs);
    try {
      localStorage.setItem('cocBestTimeMs', APP_STATE.coc.bestTimeMs);
    } catch (e) {}
    updateCocBestUI();
    isNewBest = true;
  }

  // Tentukan Rank Champion (ala Ruang Guru COC)
  let rankTitle = '';
  let rankDesc = '';
  let trophy = '🏆';
  const totalSec = finalMs / 1000;

  if (totalSec <= 25) {
    rankTitle = '🏆 GRAND CHAMPION';
    rankDesc = `Luar Biasa Jenius! Kecepatan dan ketajaman memorimu setara Maxwell & Sandy di Clash of Champions!${isNewBest ? ' (🌟 REKOR BARU!)' : ''}`;
    trophy = '🏆';
  } else if (totalSec <= 40) {
    rankTitle = '🥇 MASTER CHAMPION';
    rankDesc = `Hebat Banget! Analisis ingatan visualmu sangat cepat dan akurat setara Shakira & Axel!${isNewBest ? ' (🌟 REKOR BARU!)' : ''}`;
    trophy = '🥇';
  } else if (totalSec <= 60) {
    rankTitle = '🥈 ELITE ANALYST';
    rankDesc = `Kerja Bagus! Daya ingat visual datamu sangat solid dan terlatih dengan baik!${isNewBest ? ' (🌟 REKOR BARU!)' : ''}`;
    trophy = '🥈';
  } else {
    rankTitle = '🥉 RISING CHAMPION';
    rankDesc = `Selamat berhasil menaklukkan tantangan! Asah terus fokus dan memorimu untuk mencapai Grand Champion!`;
    trophy = '🥉';
  }

  document.getElementById('cocTrophyIcon').textContent = trophy;
  document.getElementById('cocRankBadge').textContent = rankTitle;
  document.getElementById('cocRankDesc').textContent = rankDesc;
  document.getElementById('cocFinishTime').textContent = timeStr;
  document.getElementById('cocFinishMoves').textContent = `${APP_STATE.coc.moves} Langkah`;
  document.getElementById('cocFinishCombo').textContent = `x${APP_STATE.coc.maxStreak} 🔥`;

  document.getElementById('cocVictoryModal').style.display = 'flex';

  APP_STATE.progress.act4Done = true;
  saveProgress();
  updateProgressUI();
}

function resetCocBestRecord(showNotice = true) {
  APP_STATE.coc.bestTimeMs = null;
  try {
    localStorage.removeItem('cocBestTimeMs');
  } catch (e) {}
  updateCocBestUI();
  if (showNotice) {
    alert('Rekor terbaik Clash of Champions telah direset.');
  }
}

// ==========================================================================
// 9. MENU KUIS (10 SOAL PILIHAN GANDA - 1 SOAL PER HALAMAN)
// ==========================================================================
function loadQuestion(index) {
  const total = QUIZ_QUESTIONS.length;
  if (index >= total) {
    showQuizResult();
    return;
  }

  const qData = QUIZ_QUESTIONS[index];
  document.getElementById('quizProgressText').textContent = `SOAL ${index + 1} / ${total}`;
  document.getElementById('quizRunningScore').textContent = `Skor: ${APP_STATE.quizScore}`;

  // Progress Bar
  const progressPercent = Math.round(((index + 1) / total) * 100);
  document.getElementById('quizBarFill').style.width = `${progressPercent}%`;

  // Teks Soal
  document.getElementById('quizQuestionTitle').textContent = qData.q;

  // Options
  const container = document.getElementById('quizOptionsList');
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  qData.options.forEach((optText, optIdx) => {
    const optBtn = document.createElement('button');
    optBtn.className = 'quiz-option-btn';
    optBtn.innerHTML = `
      <span class="quiz-opt-letter">${letters[optIdx]}</span>
      <span class="quiz-opt-text">${optText}</span>
    `;
    optBtn.onclick = () => answerQuestion(optIdx);
    container.appendChild(optBtn);
  });

  document.getElementById('quizFeedbackBanner').style.display = 'none';
  document.getElementById('btnNextQuestion').style.display = 'none';
}

function answerQuestion(chosenIndex) {
  const currentQ = QUIZ_QUESTIONS[APP_STATE.quizIndex];
  const buttons = document.querySelectorAll('.quiz-option-btn');
  buttons.forEach(b => b.disabled = true);

  const feedbackEl = document.getElementById('quizFeedbackBanner');
  feedbackEl.style.display = 'block';

  if (chosenIndex === currentQ.answer) {
    buttons[chosenIndex].classList.add('correct');
    feedbackEl.className = 'quiz-feedback-banner correct';
    feedbackEl.innerHTML = `🎉 <strong>Benar!</strong> ${currentQ.explanation}`;
    APP_STATE.quizScore += 10;
    APP_STATE.quizAnswers.push(true);
    playMatchSound();
  } else {
    buttons[chosenIndex].classList.add('wrong');
    buttons[currentQ.answer].classList.add('correct');
    feedbackEl.className = 'quiz-feedback-banner wrong';
    feedbackEl.innerHTML = `❌ <strong>Kurang tepat.</strong> ${currentQ.explanation}`;
    APP_STATE.quizAnswers.push(false);
    playWrongSound();
  }

  document.getElementById('quizRunningScore').textContent = `Skor: ${APP_STATE.quizScore}`;

  const nextBtn = document.getElementById('btnNextQuestion');
  nextBtn.style.display = 'inline-flex';
  if (APP_STATE.quizIndex === QUIZ_QUESTIONS.length - 1) {
    nextBtn.textContent = 'Lihat Hasil Akhir 🏆';
  } else {
    nextBtn.textContent = 'Lanjut ke Soal Berikutnya ➡';
  }
}

function nextQuestion() {
  APP_STATE.quizIndex++;
  loadQuestion(APP_STATE.quizIndex);
}

function showQuizResult() {
  document.getElementById('quizPlayingBox').style.display = 'none';
  const finishCard = document.getElementById('quizFinishCard');
  finishCard.style.display = 'block';

  const score = APP_STATE.quizScore;
  document.getElementById('quizFinalScore').textContent = score;

  const correctCount = APP_STATE.quizAnswers.filter(a => a === true).length;
  const wrongCount = APP_STATE.quizAnswers.length - correctCount;

  document.getElementById('statCorrectNum').textContent = correctCount;
  document.getElementById('statWrongNum').textContent = wrongCount;

  const categoryEl = document.getElementById('quizFinalCategory');
  const noteEl = document.getElementById('quizFinalNote');
  const iconEl = document.getElementById('quizFinalIcon');

  if (score >= 90) {
    categoryEl.textContent = 'Sangat Baik 🏆';
    categoryEl.style.color = '#1e3a8a';
    iconEl.textContent = '🏆';
    noteEl.textContent = 'Luar biasa! Kamu memahami seluruh konsep analisis dan visualisasi data dengan sangat cemerlang.';
  } else if (score >= 80) {
    categoryEl.textContent = 'Baik 👍';
    categoryEl.style.color = '#10b981';
    iconEl.textContent = '👍';
    noteEl.textContent = 'Kerja bagus! Pemahaman materi kamu sudah sangat baik. Terus tingkatkan kemampuan analisismu!';
  } else if (score >= 70) {
    categoryEl.textContent = 'Cukup 🙂';
    categoryEl.style.color = '#f59e0b';
    iconEl.textContent = '🙂';
    noteEl.textContent = 'Sudah cukup memahami dasar-dasarnya. Pelajari kembali teknik visualisasi data agar pemahaman makin mantap.';
  } else {
    categoryEl.textContent = 'Perlu Belajar Lagi 📚';
    categoryEl.style.color = '#ef4444';
    iconEl.textContent = '📚';
    noteEl.textContent = 'Jangan berkecil hati! Buka kembali menu Materi dan Tahapan Analisis, lalu coba kerjakan kuis ini lagi.';
  }

  playVictoryFanfare();
  APP_STATE.progress.quizDone = true;
  saveProgress();
  updateProgressUI();
}

function restartQuiz() {
  APP_STATE.quizIndex = 0;
  APP_STATE.quizScore = 0;
  APP_STATE.quizAnswers = [];

  document.getElementById('quizPlayingBox').style.display = 'block';
  document.getElementById('quizFinishCard').style.display = 'none';

  loadQuestion(0);
}

// Inisialisasi pertanyaan pertama kuis
loadQuestion(0);

// ==========================================================================
// AKTIVITAS 5: BATTLE REGU KELAS (MULTIPLAYER CLASSROOM ARENA)
// ==========================================================================
const WHEEL_SECTORS = [
  { label: '📊 Tebak Cepat', pts: 100, color: '#3b82f6', textColor: '#ffffff' },
  { label: '🕵️ Kasus Detektif', pts: 150, color: '#10b981', textColor: '#ffffff' },
  { label: '⚡ Duel Rebutan', pts: 200, color: '#f59e0b', textColor: '#ffffff' },
  { label: '🎯 Analisis Rasio', pts: 100, color: '#8b5cf6', textColor: '#ffffff' },
  { label: '💎 Super Bonus', pts: 300, color: '#06b6d4', textColor: '#ffffff' },
  { label: '💣 Tantangan Ekstra', pts: 250, color: '#ef4444', textColor: '#ffffff' },
  { label: '🔄 Rebut Poin', pts: 150, color: '#ec4899', textColor: '#ffffff' },
  { label: '🚀 Kilat HOTS', pts: 200, color: '#f97316', textColor: '#ffffff' }
];

const BATTLE_CHALLENGES = [
  {
    "id": "tc-1",
    "category": "📊 Tebak Cepat",
    "points": 100,
    "title": "Visualisasi Makanan Terlaris Kantin",
    "desc": "Pengurus kantin sekolah ingin membandingkan jumlah porsi yang terjual untuk 5 jenis makanan (Bakso, Nasi Goreng, Siomay, Batagor, Mie Ayam).",
    "visual": "📋 Data Penjualan: Bakso (80), Nasi Goreng (65), Siomay (90), Batagor (50), Mie Ayam (75).<br><strong>Pertanyaan:</strong> Diagram manakah yang paling tepat digunakan untuk membandingkan penjualan kelima makanan ini?",
    "answer": "<strong>Diagram Batang (Bar Chart)!</strong> Karena diagram batang paling tepat digunakan untuk membandingkan jumlah/kuantitas antar-kategori data yang berbeda."
  },
  {
    "id": "tc-2",
    "category": "📊 Tebak Cepat",
    "points": 100,
    "title": "Grafik Pemantauan Suhu Pasien",
    "desc": "Petugas UKS mencatat suhu tubuh siswa yang demam setiap jam dari pukul 07.00 hingga 13.00.",
    "visual": "🌡️ Data Suhu: 07.00 (38.5°C), 09.00 (39.0°C), 11.00 (37.8°C), 13.00 (37.0°C).<br><strong>Pertanyaan:</strong> Jenis visualisasi manakah yang paling cocok untuk melihat tren kenaikan atau penurunan suhu dari waktu ke waktu?",
    "answer": "<strong>Diagram Garis (Line Chart)!</strong> Karena diagram garis sangat ideal untuk melihat tren perubahan data yang berkesinambungan dari waktu ke waktu."
  },
  {
    "id": "tc-3",
    "category": "📊 Tebak Cepat",
    "points": 100,
    "title": "Identifikasi Bentuk Data Nilai Ujian",
    "desc": "Seorang guru mengumpulkan data nilai ujian informatika: 85, 90, 78, 92, dan 88.",
    "visual": "🔢 Kumpulan Data: [85, 90, 78, 92, 88].<br><strong>Pertanyaan:</strong> Berdasarkan bentuknya, apakah data tersebut termasuk Data Kuantitatif atau Data Kualitatif? Jelaskan alasannya!",
    "answer": "<strong>Data Kuantitatif!</strong> Karena datanya berupa angka/bilangan yang dapat dihitung atau diukur secara langsung."
  },
  {
    "id": "tc-4",
    "category": "📊 Tebak Cepat",
    "points": 100,
    "title": "Klasifikasi Data Hobi dan Warna Favorit",
    "desc": "Ketua kelas mencatat data warna hijab siswi (\"Cokelat\", \"Biru\", \"Hitam\") dan hobi siswa (\"Futsal\", \"Membaca\", \"Melukis\").",
    "visual": "🏷️ Data Terkumpul: Warna favorit (\"Biru\", \"Merah\") dan Hobi (\"Musik\", \"Renang\").<br><strong>Pertanyaan:</strong> Berdasarkan bentuknya, tergolong jenis data apakah warna dan hobi tersebut?",
    "answer": "<strong>Data Kualitatif!</strong> Karena datanya berupa deskripsi, label, atau kategori dan bukan berupa angka yang dihitung."
  },
  {
    "id": "tc-5",
    "category": "📊 Tebak Cepat",
    "points": 100,
    "title": "Survei Mandiri Kebiasaan Belajar",
    "desc": "Regu Alpha membuat angket kuesioner sendiri dan membagikannya ke 35 teman sekelas untuk diteliti.",
    "visual": "📝 Skenario: Siswa menyebarkan angket buatan sendiri langsung ke teman-teman sekelasnya.<br><strong>Pertanyaan:</strong> Berdasarkan sumbernya, apakah data angket ini termasuk Data Primer atau Data Sekunder?",
    "answer": "<strong>Data Primer!</strong> Karena data dikumpulkan secara langsung dari sumber aslinya (tangan pertama) oleh peneliti/siswa itu sendiri."
  },
  {
    "id": "kd-1",
    "category": "🕵️ Kasus Detektif",
    "points": 150,
    "title": "Mendeteksi 2 Data Anomali / Kotor",
    "desc": "Detektif Data menemukan catatan tinggi badan siswa kelas VIII dalam satuan cm sebagai berikut:",
    "visual": "📝 Data Mentah: [152, 148, <strong>1500</strong>, 156, <strong>-15</strong>, 160, 155].<br><strong>Tugas Regu:</strong> Sebutkan 2 data tidak masuk akal (anomali) yang wajib dibersihkan pada tahap Pembersihan Data (Data Cleaning)!",
    "answer": "<strong>1500 cm</strong> (kesalahan ketik kelebihan nol) dan <strong>-15 cm</strong> (tinggi badan tidak mungkin bernilai negatif). Keduanya wajib dibersihkan!"
  },
  {
    "id": "kd-2",
    "category": "🕵️ Kasus Detektif",
    "points": 150,
    "title": "Kasus Data Duplikat & Typo Nama Kota",
    "desc": "Pada formulir pendaftaran lomba antar-sekolah ditemukan data kota asal:",
    "visual": "🏙️ Daftar Input: [\"Sumedang\", \"Bandung\", \"SUMEDANG\", \"Bndung\", \"Jakarta\", \"Sumedang\"].<br><strong>Tugas Detektif:</strong> Setelah dibersihkan dari duplikasi dan kesalahan ketik (typo), ada berapa kota unik yang sebenarnya?",
    "answer": "<strong>Ada 3 kota unik:</strong> Sumedang, Bandung, dan Jakarta. Entri \"SUMEDANG\" & duplikat disatukan, serta \"Bndung\" diperbaiki menjadi \"Bandung\"."
  },
  {
    "id": "kd-3",
    "category": "🕵️ Kasus Detektif",
    "points": 150,
    "title": "Kasus Kejanggalan Jam Tidur Siswa",
    "desc": "Detektif memeriksa data survei durasi tidur harian 6 orang siswa:",
    "visual": "⏰ Data Input: [7 jam, 8 jam, <strong>26 jam</strong>, 6 jam, <strong>\"tidak tahu\"</strong>, 8 jam].<br><strong>Tugas Regu:</strong> Temukan 2 data cacat/kotor yang harus dibuang atau dikoreksi!",
    "answer": "<strong>26 jam</strong> (mustahil karena sehari hanya 24 jam) dan <strong>\"tidak tahu\"</strong> (berupa teks bukan angka/jam kuantitatif)."
  },
  {
    "id": "kd-4",
    "category": "🕵️ Kasus Detektif",
    "points": 150,
    "title": "Deteksi Asal Sumber Data BPS",
    "desc": "Siswa mengunduh dokumen sensus penduduk Kabupaten Sumedang langsung dari website resmi Badan Pusat Statistik (BPS).",
    "visual": "🏛️ Dokumen: Laporan Statistik Kependudukan Resmi dari website BPS.<br><strong>Tugas Detektif:</strong> Bagi siswa tersebut, apakah dokumen BPS ini berstatus sebagai Data Primer atau Data Sekunder? Jelaskan!",
    "answer": "<strong>Data Sekunder!</strong> Karena siswa tidak mencacah langsung penduduk di lapangan, melainkan memanfaatkan data yang telah dihimpun dan diterbitkan oleh pihak BPS."
  },
  {
    "id": "kd-5",
    "category": "🕵️ Kasus Detektif",
    "points": 150,
    "title": "Misteri Nilai Ulangan Angka 0",
    "desc": "Data nilai ujian 8 siswa: [80, 85, 90, 75, 80, <strong>0</strong>, 85, 95]. Diketahui siswa ke-6 izin sakit dan belum susulan.",
    "visual": "🔍 Skenario: Angka 0 milik siswa sakit yang belum ujian.<br><strong>Tugas Detektif:</strong> Mengapa angka 0 tersebut harus ditandai khusus (missing data) dan tidak boleh langsung dihitung ke dalam rata-rata kelas?",
    "answer": "Karena nilai 0 tersebut bukan nilai murni melainkan data kosong (absen). Jika dimasukkan, nilai rata-rata kelas akan turun drastis secara tidak adil dan tidak akurat!"
  },
  {
    "id": "dr-1",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Urutan 4 Tahap Pertama Analisis Data",
    "desc": "Regu tercepat yang mengangkat tangan atau menekan bel berhak menjawab!",
    "visual": "❓ <strong>Pertanyaan Rebutan:</strong> Sebutkan secara urut dan tepat 4 tahap pertama dalam proses analisis data!",
    "answer": "<strong>1. Mengumpulkan Data -> 2. Membersihkan Data -> 3. Mengolah & Menganalisis Data -> 4. Memvisualisasikan Data.</strong>"
  },
  {
    "id": "dr-2",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Perbedaan Mendasar Data vs Informasi",
    "desc": "Duel konsep dasar analisis data!",
    "visual": "❓ <strong>Pertanyaan Rebutan:</strong> Apakah perbedaan utama antara DATA dan INFORMASI?",
    "answer": "<strong>Data</strong> adalah fakta/angka mentah yang belum diolah dan belum memiliki makna. Sedangkan <strong>Informasi</strong> adalah data yang sudah diolah dan bermakna sehingga berguna untuk mengambil keputusan!"
  },
  {
    "id": "dr-3",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Tiga Tahap Terakhir Analisis Data",
    "desc": "Tunjukkan ingatan tajam regu kalian!",
    "visual": "❓ <strong>Pertanyaan Rebutan:</strong> Sebutkan 3 tahap terakhir dari 6 tahapan analisis data secara berurutan!",
    "answer": "<strong>4. Memvisualisasikan Data -> 5. Menafsirkan Data -> 6. Menyajikan Data.</strong>"
  },
  {
    "id": "dr-4",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Ciri Khas Histogram vs Diagram Batang",
    "desc": "Duel pemahaman visual data!",
    "visual": "❓ <strong>Pertanyaan Rebutan:</strong> Mengapa batang pada diagram batang memiliki celah/spasi, sedangkan batang pada histogram menempel tanpa celah?",
    "answer": "Karena Diagram Batang mewakili <strong>kategori data diskrit/terpisah</strong>, sedangkan Histogram mewakili <strong>rentang interval data numerik yang kontinu/bersambung</strong>!"
  },
  {
    "id": "dr-5",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Sebutkan Contoh Nyata Data Primer & Sekunder",
    "desc": "Duel contoh nyata di madrasah/sekolah!",
    "visual": "❓ <strong>Pertanyaan Rebutan:</strong> Berikan masing-masing 1 contoh aktivitas pengumpulan Data Primer dan Data Sekunder di sekolah!",
    "answer": "<strong>Primer:</strong> Melakukan wawancara langsung dengan penjual kantin atau menyebar kuesioner. <strong>Sekunder:</strong> Meminjam buku rekam medis UKS atau meminta data absensi dari wali kelas."
  },
  {
    "id": "ar-1",
    "category": "🎯 Analisis Rasio",
    "points": 100,
    "title": "Membaca Proporsi Diagram Lingkaran",
    "desc": "Hasil survei sarana transportasi 100 orang siswa:",
    "visual": "🥧 Data Lingkaran: Sepeda Motor (50%), Sepeda Kayuh (25%), Jalan Kaki (15%), Angkutan Umum (?)<br><strong>Pertanyaan:</strong> Berapa persen siswa pengguna Angkutan Umum dan berapa banyak siswanya?",
    "answer": "<strong>10% dan 10 siswa!</strong> (100% - 50% - 25% - 15% = 10%. Dari 100 siswa, 10% x 100 = 10 siswa)."
  },
  {
    "id": "ar-2",
    "category": "🎯 Analisis Rasio",
    "points": 100,
    "title": "Menghitung Derajat Juring Lingkaran",
    "desc": "Data hobi 120 siswa disajikan dalam diagram lingkaran. Hobi membaca komik menempati 25% juring lingkaran.",
    "visual": "📐 Porsi Membaca: 25% dari total satu lingkaran penuh (360°).<br><strong>Pertanyaan:</strong> Berapa derajat sudut juring untuk hobi membaca dan berapa siswa yang menyukainya?",
    "answer": "<strong>Sudut 90° dan 30 siswa!</strong> (25% x 360° = 90°. Jumlah siswa = 25% x 120 = 30 siswa)."
  },
  {
    "id": "ar-3",
    "category": "🎯 Analisis Rasio",
    "points": 100,
    "title": "Rasio Pengunjung Perpustakaan",
    "desc": "Data pengunjung perpus: Hari Senin = 40 siswa, Hari Selasa = 60 siswa, Hari Rabu = 80 siswa.",
    "visual": "📚 Kunjungan: Senin (40), Selasa (60), Rabu (80).<br><strong>Pertanyaan:</strong> Berapakah rasio perbandingan pengunjung hari Senin terhadap hari Rabu dalam bentuk paling sederhana?",
    "answer": "<strong>1 : 2</strong> (karena 40 : 80 disederhanakan dengan membagi keduanya dengan 40 menjadi 1 : 2)."
  },
  {
    "id": "ar-4",
    "category": "🎯 Analisis Rasio",
    "points": 100,
    "title": "Persentase Lonjakan Peminjaman Buku",
    "desc": "Bulan Januari peminjam buku ada 50 siswa. Pada bulan Februari melonjak menjadi 75 siswa.",
    "visual": "📈 Peminjam: Januari (50) -> Februari (75).<br><strong>Pertanyaan:</strong> Berapa persen kenaikan jumlah peminjam buku dari Januari ke Februari?",
    "answer": "<strong>50% Kenaikan!</strong> (Selisih kenaikan = 75 - 50 = 25. Persentase = 25 / 50 x 100% = 50%)."
  },
  {
    "id": "ar-5",
    "category": "🎯 Analisis Rasio",
    "points": 100,
    "title": "Rasio Gender Peserta Ekskul Robotik",
    "desc": "Dari 40 anggota ekskul robotik, terdapat 30 siswa laki-laki dan 10 siswi perempuan.",
    "visual": "🤖 Anggota: 30 Laki-laki & 10 Perempuan.<br><strong>Pertanyaan:</strong> Berapa persentase siswi perempuan dan berapa perbandingan rasio Laki-laki : Perempuan?",
    "answer": "<strong>Perempuan 25% dan Rasio 3 : 1!</strong> (Perempuan: 10/40 x 100% = 25%. Rasio L:P = 30:10 = 3:1)."
  },
  {
    "id": "sb-1",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Perbedaan Diagram Batang vs Histogram",
    "desc": "Tantangan konsep tingkat lanjut untuk 300 poin penuh!",
    "visual": "❓ <strong>Pertanyaan Super:</strong> Jelaskan 2 perbedaan mendasar (dari segi bentuk visual dan jenis data) antara Diagram Batang dengan Histogram!",
    "answer": "1. <strong>Tampilan:</strong> Diagram Batang memiliki celah/spasi antarbatang, sedangkan Histogram batangnya berdempetan tanpa celah.<br>2. <strong>Jenis Data:</strong> Diagram Batang untuk data kategori terpisah (diskrit/kualitatif), sedangkan Histogram untuk rentang interval data angka kontinu."
  },
  {
    "id": "sb-2",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Membongkar Manipulasi Grafik (Misleading Chart)",
    "desc": "Tantangan berpikir kritis tingkat tinggi!",
    "visual": "📉 Grafik Penjualan Toko A terlihat 5x lebih tinggi dari Toko B padahal nilainya 102 vs 100, karena sumbu Y dimulai dari angka 99 (tidak dari 0).<br><strong>Pertanyaan:</strong> Mengapa grafik yang tidak memulai sumbu Y dari angka 0 (truncated baseline) dianggap manipulatif/menyesatkan?",
    "answer": "Karena memperbesar perbedaan kecil secara visual sehingga tampak sangat drastis dan mengecoh pembaca grafik yang tidak cermat melihat angka sumbu!"
  },
  {
    "id": "sb-3",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Klasifikasi Ganda Skenario Data",
    "desc": "Klasifikasikan skenario data berikut ke dalam 2 jenis sekaligus!",
    "visual": "📋 Skenario: \"Seorang siswa mewawancarai langsung 20 orang guru untuk mencatat jumlah jam mengajar mereka per minggu.\"<br><strong>Pertanyaan:</strong> Apakah data tersebut: (1) Kuantitatif atau Kualitatif? DAN (2) Primer atau Sekunder?",
    "answer": "1. <strong>Data Kuantitatif</strong> (karena jumlah jam mengajar berupa angka yang dihitung).<br>2. <strong>Data Primer</strong> (karena siswa melakukan wawancara langsung sendiri ke narasumber)."
  },
  {
    "id": "sb-4",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Penerapan Siklus Analisis Data di Kantin",
    "desc": "Studi kasus riil dunia usaha sekolah!",
    "visual": "🍧 Kasus: Penjualan es jeruk di kantin habis dalam 15 menit saat jam istirahat terik matahari, sementara saat hujan tersisa banyak.<br><strong>Pertanyaan:</strong> Bagaimana tahapan Kumpulkan -> Olah -> Keputusan dapat memecahkan masalah ini?",
    "answer": "Kumpulkan data cuaca harian & sisa cup -> Olah korelasi cuaca vs penjualan -> Buat keputusan: Jika cuaca terik siapkan 100 cup, jika mendung/hujan kurangi menjadi 30 cup agar tidak merugi!"
  },
  {
    "id": "sb-5",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Tafsir Scatter Plot Hubungan Terbalik",
    "desc": "Membaca korelasi dua variabel!",
    "visual": "📈 Scatter Plot: Sumbu X = Durasi Bermain Game HP (jam), Sumbu Y = Nilai Ulangan. Pola titik-titik bergerak menurun tajam dari kiri atas ke kanan bawah.<br><strong>Pertanyaan:</strong> Pola korelasi apa yang terjadi dan apa makna kesimpulannya?",
    "answer": "<strong>Korelasi Negatif (Berbanding Terbalik)!</strong> Maknanya: semakin banyak waktu yang dihabiskan bermain game HP, ada kecenderungan nilai ulangan siswa semakin menurun."
  },
  {
    "id": "te-1",
    "category": "💣 Tantangan Ekstra",
    "points": 250,
    "title": "Evaluasi Gender Ekskul Paling Seimbang",
    "desc": "Cermati komposisi dua regu kegiatan sekolah:",
    "visual": "⚽ Ekskul Futsal: 24 Laki-laki & 6 Perempuan (Total 30).<br>♟️ Ekskul Catur: 15 Laki-laki & 15 Perempuan (Total 30).<br><strong>Pertanyaan:</strong> Ekskul manakah yang komposisi gendernya paling seimbang (heterogen) dan buktikan dengan persentase!",
    "answer": "<strong>Ekskul Catur!</strong> Karena rasionya 1:1 yaitu 50% Laki-laki dan 50% Perempuan, sedangkan Futsal didominasi 80% Laki-laki berbanding 20% Perempuan."
  },
  {
    "id": "te-2",
    "category": "💣 Tantangan Ekstra",
    "points": 250,
    "title": "Mendeteksi Data Pencilan (Outlier)",
    "desc": "Kecepatan internet laboratorium komputer selama 5 hari (dalam Mbps):",
    "visual": "📶 Data: [20 Mbps, 25 Mbps, 15 Mbps, 30 Mbps, <strong>250 Mbps</strong>].<br><strong>Pertanyaan:</strong> Manakah data yang tergolong Pencilan (Outlier) dan berapa nilai median dari data tersebut?",
    "answer": "<strong>Outlier = 250 Mbps</strong> (jauh melonjak di luar batas normal hari lainnya). <strong>Median = 25 Mbps</strong> (setelah diurutkan: 15, 20, 25, 30, 250)."
  },
  {
    "id": "te-3",
    "category": "💣 Tantangan Ekstra",
    "points": 250,
    "title": "Menentukan Visualisasi Terbaik untuk 3 Kasus",
    "desc": "Tentukan grafik paling tepat untuk 3 kebutuhan berikut!",
    "visual": "1. Pembagian persentase anggaran dana kas kelas.<br>2. Perbandingan jumlah buku per mata pelajaran.<br>3. Pertumbuhan tinggi tanaman jagung selama 14 hari berturut-turut.<br><strong>Tugas:</strong> Pasangkan masing-masing dengan grafik terbaiknya!",
    "answer": "1. <strong>Diagram Lingkaran (Pie Chart)</strong><br>2. <strong>Diagram Batang (Bar Chart)</strong><br>3. <strong>Diagram Garis (Line Chart)</strong>"
  },
  {
    "id": "te-4",
    "category": "💣 Tantangan Ekstra",
    "points": 250,
    "title": "Evaluasi Survei Kepuasan Kantin",
    "desc": "Dari 200 siswa yang disurvei: Sangat Puas = 45%, Puas = 35%, Cukup = 15%, Tidak Puas = 5%.",
    "visual": "📊 Kepuasan: Sangat Puas (45%) & Puas (35%).<br><strong>Pertanyaan:</strong> Berapa jumlah total siswa yang merasa minimal puas (kategori Sangat Puas + Puas)?",
    "answer": "<strong>160 Siswa!</strong> (Persentase gabungan = 45% + 35% = 80%. Jumlah siswa = 80% x 200 = 160 siswa)."
  },
  {
    "id": "te-5",
    "category": "💣 Tantangan Ekstra",
    "points": 250,
    "title": "Validasi Kualitas Data Sebelum Dianalisis",
    "desc": "Kritis dalam memilah data!",
    "visual": "❓ <strong>Pertanyaan Kritis:</strong> Mengapa data mentah yang diunduh dari internet tidak boleh langsung disajikan dalam laporan tanpa melalui tahap verifikasi dan pembersihan data?",
    "answer": "Karena data dari internet rentan memuat informasi palsu (hoaks), kesalahan ketik/format, duplikasi, atau data yang sudah usang sehingga dapat menghasilkan kesimpulan yang salah dan merugikan!"
  },
  {
    "id": "rp-1",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Interpretasi Arah Scatter Plot Positif",
    "desc": "Perhatikan grafik koordinat antara \"Waktu Belajar\" dan \"Nilai Ujian\":",
    "visual": "📈 Pola: Semakin ke kanan (jam belajar bertambah), titik-titik semakin naik ke atas.<br><strong>Pertanyaan:</strong> Pola korelasi apa yang terbentuk pada scatter plot tersebut?",
    "answer": "<strong>Korelasi Positif (Hubungan Searah)!</strong> Artinya penambahan waktu belajar berbanding lurus dengan kenaikan nilai ujian siswa."
  },
  {
    "id": "rp-2",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Scatter Plot Korelasi Nol (Tidak Berkorelasi)",
    "desc": "Peneliti meneliti hubungan antara \"Ukuran Sepatu Siswa\" dengan \"Nilai Matematika\".",
    "visual": "🔵 Pola: Titik-titik tersebar merata dan acak membentuk awan bundar tanpa arah.<br><strong>Pertanyaan:</strong> Apa kesimpulan hubungan antar kedua variabel tersebut?",
    "answer": "<strong>Korelasi Nol (Tidak Ada Hubungan)!</strong> Ukuran sepatu seseorang tidak memengaruhi kecerdasan atau kemampuan matematikanya."
  },
  {
    "id": "rp-3",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Komparasi Data Dua Kelas Berbeda",
    "desc": "Kelas 8A memiliki 16 siswa laki-laki & 14 siswi perempuan (Total 30). Kelas 8B memiliki 12 siswa laki-laki & 18 siswi perempuan (Total 30).",
    "visual": "👥 Kelas 8A: 16L & 14P | Kelas 8B: 12L & 18P.<br><strong>Pertanyaan:</strong> Kelas manakah yang memiliki siswi perempuan terbanyak dan berapa selisihnya?",
    "answer": "<strong>Kelas 8B!</strong> Selisihnya adalah 4 orang (Kelas 8B memiliki 18 siswi perempuan, sedangkan Kelas 8A memiliki 14 siswi perempuan)."
  },
  {
    "id": "rp-4",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Aplikasi Ramalan Cuaca di Smartphone",
    "desc": "Seorang siswa membaca informasi prakiraan cuaca di Sumedang melalui aplikasi BMKG di ponselnya.",
    "visual": "📱 Data: Peringatan hujan lebat disertai petir dari aplikasi BMKG.<br><strong>Pertanyaan:</strong> Bagi siswa tersebut, apakah informasi ramalan cuaca itu merupakan data primer atau data sekunder? Berikan alasan!",
    "answer": "<strong>Data Sekunder!</strong> Karena siswa tidak mengukur kecepatan angin dan tekanan udara sendiri di lapangan, melainkan memanfaatkan data yang disediakan oleh pihak BMKG."
  },
  {
    "id": "rp-5",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Membaca Modus Data Nilai Ulangan",
    "desc": "Tabel nilai ulangan harian siswa: Nilai 70 (4 orang), Nilai 80 (15 orang), Nilai 90 (8 orang), Nilai 100 (3 orang).",
    "visual": "📋 Frekuensi: 70 (4), 80 (15), 90 (8), 100 (3).<br><strong>Pertanyaan:</strong> Berapakah nilai Modus (nilai yang paling sering muncul) dan berapa persen siswa yang mendapat nilai 80 ke atas?",
    "answer": "<strong>Modus = 80!</strong> Siswa nilai 80 ke atas ada 26 orang (15 + 8 + 3) dari total 30 siswa, yaitu sekitar <strong>86,7%</strong>."
  },
  {
    "id": "kh-1",
    "category": "🚀 Kilat HOTS",
    "points": 200,
    "title": "Tantangan Pengambilan Keputusan Nyata",
    "desc": "Cermati nilai rata-rata mata pelajaran satu kelas:",
    "visual": "📊 Nilai Rata-rata: Matematika (68), IPA (72), Bahasa Indonesia (85), Informatika (88). KKM yang ditetapkan adalah 75.<br><strong>Pertanyaan:</strong> Dua mata pelajaran manakah yang harus diprioritaskan guru untuk bimbingan belajar tambahan?",
    "answer": "<strong>Matematika (68) dan IPA (72)!</strong> Karena rata-rata nilainya masih di bawah standar ketuntasan minimal (KKM 75)."
  },
  {
    "id": "kh-2",
    "category": "🚀 Kilat HOTS",
    "points": 200,
    "title": "Evaluasi Solutif Kuota Ekskul Membludak",
    "desc": "Pendaftar ekskul Robotika ada 60 siswa (kapasitas lab hanya 20 siswa), sedangkan ekskul Paduan Suara hanya 5 pendaftar (kapasitas 30 siswa).",
    "visual": "🤖 Robotika: 60 pendaftar (kapasitas 20) | 🎵 Paduan Suara: 5 pendaftar (kapasitas 30).<br><strong>Tantangan Analitis:</strong> Sebagai wakil kepala sekolah, keputusan bijak apa yang harus diambil berbasis data tersebut?",
    "answer": "Membuka gelombang/shift kedua untuk ekskul Robotika (misal jadwal hari lain), serta mengadakan demonstrasi penampilan menarik untuk ekskul Paduan Suara agar kuotanya terisi lebih berimbang!"
  },
  {
    "id": "kh-3",
    "category": "🚀 Kilat HOTS",
    "points": 200,
    "title": "Efisiensi Anggaran Berbasis Data Survei",
    "desc": "Survei media informasi pilihan siswa: Instagram OSIS (65%), WhatsApp Kelas (25%), Mading Kertas (10%). Saat ini anggaran OSIS 70% dipakai mencetak poster mading.",
    "visual": "📱 Minat Siswa: Instagram (65%) & WA (25%). Anggaran poster kertas (70%).<br><strong>Pertanyaan Keputusan:</strong> Rekomendasi apa yang paling tepat untuk efisiensi anggaran pengurus OSIS?",
    "answer": "Mengalihkan sebagian besar anggaran poster mading kertas ke pembuatan konten digital di media sosial OSIS yang terbukti diakses oleh 90% siswa, sehingga jauh lebih hemat dan berdampak luas!"
  },
  {
    "id": "kh-4",
    "category": "🚀 Kilat HOTS",
    "points": 200,
    "title": "Menilai Kredibilitas Sampel Survei Online",
    "desc": "Sebuah survei pemilihan menu makanan kantin baru hanya diisi oleh 10 orang yang semuanya adalah anggota satu geng kelas yang sama dari total 500 siswa madrasah.",
    "visual": "👥 Responden: 10 orang teman dekat dari 500 total siswa madrasah.<br><strong>Pertanyaan Evaluasi:</strong> Apakah data survei tersebut valid untuk menentukan menu seluruh siswa? Jelaskan secara analitis!",
    "answer": "<strong>Tidak Valid!</strong> Karena jumlah sampel terlalu sedikit (hanya 2%) dan terjadi bias seleksi (hanya satu kelompok berteman), sehingga tidak mewakili (representatif) selera seluruh siswa sekolah."
  },
  {
    "id": "kh-5",
    "category": "🚀 Kilat HOTS",
    "points": 200,
    "title": "Analisis Data Penjualan Koperasi Sekolah",
    "desc": "Grafik garis penjualan alat tulis koperasi sekolah menunjukkan penurunan drastis 90% setiap bulan Juni dan Juli.",
    "visual": "📉 Tren: Penjualan anjlok 90% pada bulan Juni-Juli setiap tahunnya.<br><strong>Pertanyaan:</strong> Apa penyebab pola tren tahunan tersebut dan tindakan persiapan apa yang harus dilakukan koperasi pada akhir Juli?",
    "answer": "Penyebabnya adalah masa libur kenaikan kelas (tidak ada kegiatan belajar di sekolah). Tindakan koperasi: menambah stok buku tulis dan perlengkapan sekolah pada akhir Juli untuk menyambut tahun ajaran baru!"
  }
];

function initBattleArena() {
  updateScoreboardUI();
  updateAwardButtons();
  drawBattleWheel();
}

function setTeamCount(count) {
  APP_STATE.battle.teamCount = count;

  document.querySelectorAll('.btn-team-count').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btnTeam${count}`);
  if (activeBtn) activeBtn.classList.add('active');

  const cardGamma = document.getElementById('cardTeamGamma');
  const cardDelta = document.getElementById('cardTeamDelta');
  const cardEpsilon = document.getElementById('cardTeamEpsilon');
  const cardZeta = document.getElementById('cardTeamZeta');

  if (cardGamma) cardGamma.style.display = (count >= 3) ? 'flex' : 'none';
  if (cardDelta) cardDelta.style.display = (count >= 4) ? 'flex' : 'none';
  if (cardEpsilon) cardEpsilon.style.display = (count >= 5) ? 'flex' : 'none';
  if (cardZeta) cardZeta.style.display = (count >= 6) ? 'flex' : 'none';

  updateAwardButtons();
  playTone(500, 'sine', 0.1);
}

function adjustTeamScore(teamKey, delta) {
  APP_STATE.battle.scores[teamKey] = Math.max(0, APP_STATE.battle.scores[teamKey] + delta);
  updateScoreboardUI();

  if (delta > 0) {
    playTone(600, 'triangle', 0.1);
    playTone(800, 'triangle', 0.15, 0.08);
  } else {
    playTone(250, 'sawtooth', 0.15);
  }
}

function resetBattleScores() {
  if (confirm('Reset seluruh skor regu menjadi 0?')) {
    APP_STATE.battle.scores = { alpha: 0, beta: 0, gamma: 0, delta: 0, epsilon: 0, zeta: 0 };
    updateScoreboardUI();
  }
}

function updateScoreboardUI() {
  const teams = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'];
  teams.forEach(t => {
    const el = document.getElementById(`score${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (el) {
      el.textContent = APP_STATE.battle.scores[t];
    }
  });
}

function updateAwardButtons() {
  const container = document.getElementById('awardBtnGroup');
  if (!container) return;

  const count = APP_STATE.battle.teamCount;
  const teams = [
    { key: 'alpha', name: 'Regu Alpha 🦅', cls: 'award-alpha' },
    { key: 'beta', name: 'Regu Beta 🦁', cls: 'award-beta' }
  ];

  if (count >= 3) teams.push({ key: 'gamma', name: 'Regu Gamma 🐯', cls: 'award-gamma' });
  if (count >= 4) teams.push({ key: 'delta', name: 'Regu Delta ⚡', cls: 'award-delta' });
  if (count >= 5) teams.push({ key: 'epsilon', name: 'Regu Epsilon 🦊', cls: 'award-epsilon' });
  if (count >= 6) teams.push({ key: 'zeta', name: 'Regu Zeta 🐺', cls: 'award-zeta' });

  container.innerHTML = '';
  teams.forEach(tm => {
    const btn = document.createElement('button');
    btn.className = `btn-award-team ${tm.cls}`;
    btn.innerHTML = `+ Poin ke ${tm.name}`;
    btn.onclick = () => awardChallengePoints(tm.key);
    container.appendChild(btn);
  });
}

function drawBattleWheel() {
  const canvas = document.getElementById('battleWheelCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const center = width / 2;
  const radius = center - 8;
  const totalSectors = WHEEL_SECTORS.length;
  const arc = (2 * Math.PI) / totalSectors;

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(APP_STATE.battle.wheelAngle);

  for (let i = 0; i < totalSectors; i++) {
    const sector = WHEEL_SECTORS[i];
    const angle = i * arc;

    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, angle, angle + arc);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();

    // Garis pembatas
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Teks sektor
    ctx.save();
    ctx.fillStyle = sector.textColor;
    ctx.font = 'bold 11px Poppins, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.rotate(angle + arc / 2);
    ctx.fillText(`${sector.label} (${sector.pts})`, radius - 14, 0);
    ctx.restore();
  }

  ctx.restore();

  // Border cincin luar emas
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.stroke();
}

function spinBattleWheel() {
  if (APP_STATE.battle.isSpinning) return;
  initAudio();

  APP_STATE.battle.isSpinning = true;
  const spinBtn = document.getElementById('btnSpinWheel');
  if (spinBtn) spinBtn.disabled = true;

  // Hentikan timer tantangan sebelumnya jika ada
  stopChallengeCountdown();

  // Tentukan jumlah putaran (misal 5 - 8 putaran penuh + random offset)
  const totalSectors = WHEEL_SECTORS.length;
  const arc = (2 * Math.PI) / totalSectors;
  const targetSectorIndex = Math.floor(Math.random() * totalSectors);

  // Penunjuk roda ada di ATAS (arah jam 12 / -PI/2)
  // Hitung sudut akhir agar targetSectorIndex tepat berada di penunjuk atas
  const extraRotations = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
  // Sudut posisi sektor target relatif terhadap penunjuk atas (-Math.PI / 2)
  const targetAngle = extraRotations + (3 * Math.PI / 2) - (targetSectorIndex * arc + arc / 2);

  const startAngle = APP_STATE.battle.wheelAngle % (2 * Math.PI);
  const totalDelta = targetAngle - startAngle;
  const duration = 4000; // 4 detik putaran
  const startTime = performance.now();

  let lastTickSoundSector = -1;

  function animateWheel(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);

    // Easing cubic ease-out
    const easeOut = 1 - Math.pow(1 - progress, 3);
    APP_STATE.battle.wheelAngle = startAngle + totalDelta * easeOut;

    drawBattleWheel();

    // Sound efek detak putaran
    const currentNormAngle = (APP_STATE.battle.wheelAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const curSector = Math.floor(currentNormAngle / arc);
    if (curSector !== lastTickSoundSector) {
      lastTickSoundSector = curSector;
      playTone(700, 'sine', 0.04, 0, 0.08);
    }

    if (progress < 1) {
      requestAnimationFrame(animateWheel);
    } else {
      APP_STATE.battle.isSpinning = false;
      if (spinBtn) spinBtn.disabled = false;

      // Gong kemenangan roda berhenti
      playTone(523.25, 'triangle', 0.4, 0, 0.3);
      playTone(659.25, 'triangle', 0.5, 0.1, 0.3);

      const winningSector = WHEEL_SECTORS[targetSectorIndex];
      onWheelResultSelected(winningSector);
    }
  }

  requestAnimationFrame(animateWheel);
}

function onWheelResultSelected(sector) {
  if (!APP_STATE.battle.usedChallengeIds) {
    APP_STATE.battle.usedChallengeIds = [];
  }

  let matching = BATTLE_CHALLENGES.filter(c => c.category === sector.label);
  if (matching.length === 0) {
    matching = BATTLE_CHALLENGES;
  }

  // Filter soal yang belum pernah keluar
  let unused = matching.filter(c => !APP_STATE.battle.usedChallengeIds.includes(c.id));
  if (unused.length === 0) {
    // Reset pool untuk kategori ini jika semua soal di kategori ini sudah keluar
    APP_STATE.battle.usedChallengeIds = APP_STATE.battle.usedChallengeIds.filter(id => !matching.some(m => m.id === id));
    unused = matching;
  }

  const selectedTemplate = unused[Math.floor(Math.random() * unused.length)];
  APP_STATE.battle.usedChallengeIds.push(selectedTemplate.id);

  // Gunakan poin dari sektor roda
  const challenge = Object.assign({}, selectedTemplate, { points: sector.pts, category: sector.label });
  APP_STATE.battle.currentChallenge = challenge;

  displayChallengeCard(challenge);
}

function nextChallengeInCategory() {
  const cur = APP_STATE.battle.currentChallenge;
  const cat = cur ? cur.category : '📊 Tebak Cepat';
  const pts = cur ? cur.points : 100;

  const sector = { label: cat, pts: pts };
  onWheelResultSelected(sector);
  playTone(587.33, 'triangle', 0.15);
}

function displayChallengeCard(ch) {
  const placeholder = document.getElementById('challengePlaceholder');
  const activeCard = document.getElementById('challengeActiveCard');
  if (placeholder) placeholder.style.display = 'none';
  if (activeCard) activeCard.style.display = 'block';

  document.getElementById('challengeCategoryPill').textContent = `Kategori: ${ch.category}`;
  document.getElementById('challengePointsPill').textContent = `+${ch.points} Poin Rebutan`;
  document.getElementById('challengeTitle').textContent = ch.title;
  document.getElementById('challengeDesc').textContent = ch.desc;
  document.getElementById('challengeVisualBox').innerHTML = ch.visual;
  document.getElementById('challengeAnswerText').innerHTML = ch.answer;

  // Tutup kembali kunci jawaban
  const ansBox = document.getElementById('challengeRevealedAns');
  const toggleBtn = document.getElementById('btnToggleRevealAnswer');
  if (ansBox) ansBox.style.display = 'none';
  if (toggleBtn) toggleBtn.innerHTML = '👁️ Buka Kunci Jawaban & Pembahasan';

  // Mulai otomatis hitung mundur 15 detik
  startChallengeCountdown(15);
}

function nextRandomChallengeDirect() {
  const ch = BATTLE_CHALLENGES[Math.floor(Math.random() * BATTLE_CHALLENGES.length)];
  APP_STATE.battle.currentChallenge = ch;
  displayChallengeCard(ch);
}

function startChallengeCountdown(seconds) {
  stopChallengeCountdown();
  APP_STATE.battle.timerSec = seconds;

  const badge = document.getElementById('challengeTimerBadge');
  if (badge) badge.textContent = `⏱️ Waktu Rebutan: ${APP_STATE.battle.timerSec}s`;

  APP_STATE.battle.timerInterval = setInterval(() => {
    APP_STATE.battle.timerSec--;
    if (badge) badge.textContent = `⏱️ Waktu Rebutan: ${APP_STATE.battle.timerSec}s`;

    if (APP_STATE.battle.timerSec > 0) {
      playTone(650, 'sine', 0.05, 0, 0.05);
    } else {
      stopChallengeCountdown();
      if (badge) badge.textContent = `⏰ WAKTU HABIS! REBUTAN SELESAI!`;
      playTone(220, 'sawtooth', 0.4, 0, 0.25);
    }
  }, 1000);
}

function stopChallengeCountdown() {
  if (APP_STATE.battle.timerInterval) {
    clearInterval(APP_STATE.battle.timerInterval);
    APP_STATE.battle.timerInterval = null;
  }
}

function toggleChallengeAnswer() {
  const ansBox = document.getElementById('challengeRevealedAns');
  const btn = document.getElementById('btnToggleRevealAnswer');
  if (ansBox.style.display === 'none') {
    ansBox.style.display = 'block';
    btn.innerHTML = '🙈 Sembunyikan Kunci Jawaban';
  } else {
    ansBox.style.display = 'none';
    btn.innerHTML = '👁️ Buka Kunci Jawaban & Pembahasan';
  }
}

function awardChallengePoints(teamKey) {
  const pts = APP_STATE.battle.currentChallenge ? APP_STATE.battle.currentChallenge.points : 100;
  adjustTeamScore(teamKey, pts);

  // Efek selebrasi suara riuh
  playTone(523.25, 'triangle', 0.2, 0, 0.25);
  playTone(659.25, 'triangle', 0.2, 0.1, 0.25);
  playTone(783.99, 'triangle', 0.3, 0.2, 0.3);

  // Ambil nama regu
  const card = document.getElementById(`cardTeam${teamKey.charAt(0).toUpperCase() + teamKey.slice(1)}`);
  const teamName = card ? card.querySelector('.team-name').innerText.trim() : `Regu ${teamKey}`;

  alert(`🎉 POIN MASUK! ${pts} Poin berhasil diraih oleh ${teamName}!`);
}

function coronateClassroomWinner() {
  const scores = APP_STATE.battle.scores;
  const count = APP_STATE.battle.teamCount;

  const teamList = [
    { key: 'alpha', name: 'Regu Alpha 🦅', score: scores.alpha },
    { key: 'beta', name: 'Regu Beta 🦁', score: scores.beta }
  ];

  if (count >= 3) teamList.push({ key: 'gamma', name: 'Regu Gamma 🐯', score: scores.gamma });
  if (count >= 4) teamList.push({ key: 'delta', name: 'Regu Delta ⚡', score: scores.delta });
  if (count >= 5) teamList.push({ key: 'epsilon', name: 'Regu Epsilon 🦊', score: scores.epsilon || 0 });
  if (count >= 6) teamList.push({ key: 'zeta', name: 'Regu Zeta 🐺', score: scores.zeta || 0 });

  // Urutkan berdasarkan skor tertinggi
  teamList.sort((a, b) => b.score - a.score);

  const winner = teamList[0];
  document.getElementById('winnerTeamBanner').textContent = `${winner.name} JUARA 1 KELAS! 🏆`;
  document.getElementById('winnerCongratsText').textContent = `Hebat sekali! Memperoleh skor tertinggi ${winner.score} Poin dalam duel analisis data di kelas!`;

  const podiumContainer = document.getElementById('podiumScoresList');
  podiumContainer.innerHTML = '';

  const rankBadges = ['🥇 Juara 1', '🥈 Juara 2', '🥉 Juara 3', '🎖️ Peringkat 4', '🎖️ Peringkat 5', '🎖️ Peringkat 6'];
  teamList.forEach((tm, idx) => {
    const item = document.createElement('div');
    item.className = `podium-item ${idx === 0 ? 'podium-first' : ''}`;
    item.innerHTML = `
      <span>${rankBadges[idx]}: <strong>${tm.name}</strong></span>
      <span>${tm.score} Poin</span>
    `;
    podiumContainer.appendChild(item);
  });

  document.getElementById('classroomVictoryModal').style.display = 'flex';
  playVictoryFanfare();
}

function closeClassroomVictory() {
  const modal = document.getElementById('classroomVictoryModal');
  if (modal) modal.style.display = 'none';
}


// ==========================================================================
// PETUNJUK CARA BERMAIN UNTUK SETIAP AKTIVITAS (1 SAMPAI 5)
// ==========================================================================
const HOW_TO_PLAY_DATA = {
  1: {
    icon: '🧩',
    title: 'Cara Bermain: Aktivitas 1 — Urutkan Tahap',
    category: 'Panduan Drag & Drop Tahapan Analisis',
    steps: [
      {
        num: 1,
        title: 'Tujuan Permainan',
        text: 'Menyusun 6 tahapan analisis data secara runut dari tahap awal (Mengumpulkan) sampai tahap akhir (Menyajikan).'
      },
      {
        num: 2,
        title: 'Menggunakan Komputer / Laptop',
        text: 'Klik dan tahan (Drag) kartu tahapan pada simbol ☰, lalu geser ke atas atau ke bawah ke posisi urutan yang tepat (Drop).'
      },
      {
        num: 3,
        title: 'Menggunakan Layar Sentuh / Tablet / Proyektor',
        text: 'Tekan tombol panah ⬆ (Pindah ke Atas) atau ⬇ (Pindah ke Bawah) di sisi kanan setiap kartu untuk menaikkan/menurunkan posisi.'
      },
      {
        num: 4,
        title: 'Periksa & Dapatkan Skor',
        text: 'Setelah urutan menurutmu sudah benar dari 1 sampai 6, tekan tombol "Periksa Jawaban". Kamu akan mendapat skor 100 jika berhasil!'
      }
    ],
    tip: '💡 Tips Detektif: Ingat urutan dasarnya: Kumpulkan data dulu -> Bersihkan yang salah -> Olah & hitung -> Buat visualisasi grafik -> Tafsirkan maknanya -> Sajikan kesimpulan!'
  },
  2: {
    icon: '🔗',
    title: 'Cara Bermain: Aktivitas 2 — Jodohkan Visualisasi',
    category: 'Panduan Menjodohkan Konsep & Fungsi',
    steps: [
      {
        num: 1,
        title: 'Pilih Jenis Visualisasi (Sisi Kiri)',
        text: 'Klik salah satu kartu jenis grafik di sisi kiri (kartu akan aktif dengan highlight warna biru).'
      },
      {
        num: 2,
        title: 'Pilih Fungsi yang Sesuai (Sisi Kanan)',
        text: 'Klik kartu fungsi penggunaan di sisi kanan yang menurutmu merupakan kegunaan utama dari grafik tersebut.'
      },
      {
        num: 3,
        title: 'Perhatikan Warna Kartu',
        text: 'Jika pasangan BENAR, kedua kartu akan berubah warna hijau dan terkunci. Jika SALAH, kartu akan bergetar merah dan kamu bisa mencoba kembali.'
      },
      {
        num: 4,
        title: 'Kunci Kemenangan',
        text: 'Cocokkan seluruh 5 pasangan (Diagram Batang, Garis, Lingkaran, Histogram, Scatter Plot) untuk menuntaskan aktivitas ini!'
      }
    ],
    tip: '💡 Tips Detektif: Diagram Batang untuk membandingkan kategori, Garis untuk tren waktu ke waktu, Lingkaran untuk proporsi 100%, Histogram untuk distribusi data kontinu, dan Scatter Plot untuk hubungan dua variabel!'
  },
  3: {
    icon: '📊',
    title: 'Cara Bermain: Aktivitas 3 — Baca Grafik HOTS',
    category: 'Panduan Analisis Kritis Tingkat Tinggi',
    steps: [
      {
        num: 1,
        title: 'Cermati Tabel & Diagram Batang',
        text: 'Amati batang biru (Laki-laki) dan oranye (Perempuan) untuk kelas 7A, 7B, 7C, 8A, dan 8B beserta total keseluruhan siswanya.'
      },
      {
        num: 2,
        title: 'Pahami Tantangan Soal HOTS',
        text: 'Soal tidak hanya sekadar membaca angka, melainkan menguji analisis selisih kesenjangan gender, perbandingan rasio proporsi persentase antargenerasi kelas, dan evaluasi pemecahan masalah kuota kegiatan.'
      },
      {
        num: 3,
        title: 'Pilih Jawaban Terbaik',
        text: 'Klik salah satu opsi jawaban A, B, C, atau D pada setiap nomor pertanyaan.'
      },
      {
        num: 4,
        title: 'Pelajari Pembahasan Analitis',
        text: 'Setelah memilih, feedback penjelasan ilmiah akan langsung muncul seketika untuk membimbing pemahaman analisismu.'
      }
    ],
    tip: '💡 Tips HOTS: Jangan terjebak nominal mentah! Perhatikan perbandingan selisih (pengurangan) dan rasio persentase terhadap total masing-masing kelompok.'
  },
  4: {
    icon: '⚡',
    title: 'Cara Bermain: Aktivitas 4 — Clash of Champions (COC)',
    category: 'Panduan Ujian Memori Kilat Data',
    steps: [
      {
        num: 1,
        title: 'Fase 1: Hafalan Kilat 5 Detik',
        text: 'Saat tombol "Mulai Battle Champion Baru" ditekan, seluruh 12 kartu akan terbuka selama 5 DETIK PENUH dengan countdown 5... 4... 3... 2... 1...! Fokuskan mata dan hafalkan letak kartu secepat mungkin!'
      },
      {
        num: 2,
        title: 'Fase 2: Kartu Terkunci & Stopwatch Berjalan',
        text: 'Kartu otomatis tertutup dan stopwatch mulai berdetak. Klik 2 kartu untuk membukanya.'
      },
      {
        num: 3,
        title: 'Cocokkan Pasangan & Bangun Combo',
        text: 'Jika 2 kartu yang kamu buka merupakan pasangan konsep & fungsi yang cocok, kartu akan terkunci hijau dan kamu mendapat Combo Streak (+ suara efek juara)! Jika salah, kartu akan menutup kembali.'
      },
      {
        num: 4,
        title: 'Raih Gelar Grand Champion',
        text: 'Selesaikan 6 pasangan kartu secepat mungkin. Waktu di bawah 25 detik akan menganugerahkan gelar prestisius GRAND CHAMPION (Level Maxwell/Sandy)!'
      }
    ],
    tip: '💡 Tips COC: Bagi area pandang memorimu menjadi sisi kiri dan sisi kanan saat hitungan mundur 5 detik berlangsung!'
  },
  5: {
    icon: '🔥',
    title: 'Cara Bermain: Aktivitas 5 — Battle Regu Kelas',
    category: 'Panduan Duel Multiplayer Bersama di Kelas',
    steps: [
      {
        num: 1,
        title: 'Bagi Kelas Menjadi 2 - 4 Regu',
        text: 'Pilih jumlah regu (2 sampai 6 tim: Alpha 🦅, Beta 🦁, Gamma 🐯, Delta ⚡, Epsilon 🦊, Zeta 🐺). Guru atau perwakilan regu dapat mengedit nama regu langsung di layar.'
      },
      {
        num: 2,
        title: 'Putar Roda Tantangan Keberuntungan',
        text: 'Tekan tombol besar "PUTAR RODA TANTANGAN!". Roda berputar dengan animasi fisika dan mendarat pada jenis tantangan serta nominal poin (100 - 300 Poin).'
      },
      {
        num: 3,
        title: 'Tantangan Rebutan 15 Detik',
        text: 'Studi kasus data akan muncul di layar. Jalankan timer hitung mundur 15 detik. Anggota regu berdiskusi dan berebut mengacungkan tangan untuk menjawab kasus!'
      },
      {
        num: 4,
        title: 'Buka Kunci Jawaban & Beri Poin',
        text: 'Guru membuka tombol "Kunci Jawaban" untuk memvalidasi. Jika benar, klik tombol "+ Poin ke Regu..." yang menang. Skor di papan live akan otomatis bertambah!'
      },
      {
        num: 5,
        title: 'Nobatkan Juara Kelas',
        text: 'Di akhir sesi pelajaran, tekan tombol "👑 Nobatkan Regu Juara Kelas!" untuk menampilkan podium pemenang, mahkota emas, dan lagu selebrasi kemenangan!'
      }
    ],
    tip: '💡 Tips Guru / Moderator Kelas: Sambungkan laptop ke LCD Proyektor dan aktifkan speaker agar suara efek gong roda dan detak timer ketegangan terdengar seru oleh seluruh anak di kelas!'
  }
};

function showHowToPlay(actNum) {
  initAudio();
  const data = HOW_TO_PLAY_DATA[actNum];
  if (!data) return;

  document.getElementById('htpIcon').textContent = data.icon;
  document.getElementById('htpTitle').textContent = data.title;
  document.getElementById('htpCategory').textContent = data.category;

  const bodyEl = document.getElementById('htpContentBody');
  bodyEl.innerHTML = '';

  data.steps.forEach(step => {
    const stepCard = document.createElement('div');
    stepCard.className = 'htp-step-card';
    stepCard.innerHTML = `
      <div class="htp-step-num">${step.num}</div>
      <div class="htp-step-content">
        <strong>${step.title}</strong>
        <p>${step.text}</p>
      </div>
    `;
    bodyEl.appendChild(stepCard);
  });

  if (data.tip) {
    const tipEl = document.createElement('div');
    tipEl.className = 'htp-pro-tip';
    tipEl.innerHTML = data.tip;
    bodyEl.appendChild(tipEl);
  }

  const modal = document.getElementById('howToPlayModal');
  modal.classList.add('open');

  playTone(550, 'triangle', 0.15);
}

function closeHowToPlayModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('howToPlayModal');
  if (modal) modal.classList.remove('open');
}
