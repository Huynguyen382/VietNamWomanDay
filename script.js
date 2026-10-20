/**
 * CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10
 * Script điều khiển hiệu ứng sinh động, âm thanh đáng yêu, thiệp tương tác & ảnh bao quanh
 */

// ==========================================================================
// 1. DỮ LIỆU LỜI CHÚC Ý NGHĨA THEO CHỦ ĐỀ
// ==========================================================================
const WISHES = {
  mom: [
    "Kính chúc Mẹ yêu ngày 20/10 luôn tràn ngập sức khỏe, bình an và hạnh phúc! Cảm ơn Mẹ đã luôn là vòng tay ấm áp nhất chở che cho con suốt cuộc đời. Con yêu Mẹ thật nhiều! ❤️",
    "Gửi Mẹ kính yêu! Con chúc Mẹ có một ngày 20/10 thật nhiều niềm vui, bớt đi những âu lo và luôn an yên bên gia đình. Mẹ mãi là đóa hoa đẹp nhất trong lòng con!",
    "Mẹ ơi, hôm nay là ngày của Mẹ! Con chỉ mong sao Mẹ mãi luôn khỏe mạnh, vui vẻ và nụ cười luôn nở trên môi. Cảm ơn Mẹ vì tất cả những hy sinh cao cả!"
  ],
  lover: [
    "Chúc em yêu ngày 20/10 thật ngọt ngào, xinh đẹp và rạng rỡ! Cảm ơn em đã đến bên anh, mang lại nụ cười và sự ấm áp diệu kỳ. Mãi yêu em! 🌹",
    "Gửi người con gái anh yêu nhất: Chúc em luôn tự tin, vui tươi và ngập tràn hạnh phúc. Mọi bão giông bên ngoài hãy để anh lo, việc của em là luôn mỉm cười nhé! 💖",
    "Ngày Phụ nữ Việt Nam, chúc cô gái nhỏ của anh luôn được cưng chiều, nhận thật nhiều hoa và quà, và mãi là bến đỗ bình yên nhất của anh! ✨"
  ],
  sister: [
    "Chúc chị/em gái một ngày 20/10 ngập tràn hoa tươi, quà đẹp và luôn rạng rỡ! Chúc bạn sớm tìm được một nửa yêu thương thật tuyệt vời nhé! 🌸",
    "Nhân ngày 20/10, chúc người chị/em tuyệt vời của tôi luôn trẻ trung, yêu đời, học tập và công tác thật tốt, đạt được mọi ước mơ của mình!",
    "Chúc bạn có một ngày lễ 20/10 ngập tràn niềm vui! Hãy luôn yêu thương bản thân, tỏa sáng theo cách riêng và luôn mỉm cười thật tươi nhé!"
  ],
  colleague: [
    "Chúc toàn thể chị em đồng nghiệp ngày 20/10 thật nhiều niềm vui, luôn xinh đẹp, trẻ trung, công việc hanh thông và gặt hái thật nhiều thành công! 💐",
    "Chúc phái đẹp ngày 20/10 ngập tràn tiếng cười, nhận được thật nhiều hoa và quà, luôn là nguồn cảm hứng tươi mới nơi công sở!",
    "Nhân ngày Phụ nữ Việt Nam, chúc bạn luôn giữ được ngọn lửa đam mê, tích cực trong cuộc sống và luôn tỏa sáng rực rỡ!"
  ]
};

// ==========================================================================
// 2. KHỞI TẠO BIẾN TOÀN CỤC & DOM ELEMENTS
// ==========================================================================
let currentCategory = 'mom';
let currentWishIndex = 0;
let isAudioPlaying = false;
let audioCtx = null;
let musicInterval = null;

// DOM Elements
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const musicBtn = document.getElementById('music-btn');
const burstBtn = document.getElementById('burst-btn');
const categoryPills = document.querySelectorAll('.pill-btn');
const wishContent = document.getElementById('wish-content');
const recipientName = document.getElementById('recipient-name');
const senderName = document.getElementById('sender-name');
const inputRecipient = document.getElementById('name-recipient-input');
const inputSender = document.getElementById('name-sender-input');
const nextWishBtn = document.getElementById('next-wish-btn');
const copyWishBtn = document.getElementById('copy-wish-btn');
const shareLinkBtn = document.getElementById('share-link-btn');
const toastElem = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Modal xem ảnh phóng to
const photoCards = document.querySelectorAll('.cute-photo-card');
const photoModal = document.getElementById('photo-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');

// ==========================================================================
// 3. CANVAS PARTICLE SYSTEM (CÁNH HOA HỒNG & TIM BAY BỔNG)
// ==========================================================================
let particles = [];
let burstParticles = [];
let width = window.innerWidth;
let height = window.innerHeight;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class AmbientParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * -60;
    this.size = Math.random() * 12 + 8;
    this.speedY = Math.random() * 1.4 + 0.6;
    this.speedX = Math.random() * 1.0 - 0.5;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 1.8;
    this.swing = Math.random() * 2 + 1;
    this.swingAngle = Math.random() * Math.PI * 2;
    this.swingSpeed = Math.random() * 0.02 + 0.01;
    this.type = Math.random() > 0.35 ? 'petal' : (Math.random() > 0.5 ? 'heart' : 'sparkle');
    
    // Màu cánh hoa hồng phấn tươi sáng
    const colors = [
      'rgba(255, 105, 180, 0.75)', // Hot pink
      'rgba(255, 182, 193, 0.85)', // Light pink
      'rgba(255, 64, 129, 0.7)',   // Bright pink
      'rgba(255, 228, 235, 0.9)'   // Pale rose
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speedY;
    this.swingAngle += this.swingSpeed;
    this.x += Math.sin(this.swingAngle) * this.swing + this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    if (this.type === 'petal') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();
    } else if (this.type === 'heart') {
      ctx.fillStyle = 'rgba(255, 64, 129, 0.75)';
      ctx.beginPath();
      const s = this.size * 0.55;
      ctx.moveTo(0, s / 4);
      ctx.quadraticCurveTo(0, 0, s / 2, 0);
      ctx.quadraticCurveTo(s, 0, s, s / 2);
      ctx.quadraticCurveTo(s, s, 0, s * 1.4);
      ctx.quadraticCurveTo(-s, s, -s, s / 2);
      ctx.quadraticCurveTo(-s, 0, -s / 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, s / 4);
      ctx.fill();
    } else {
      // Ngôi sao lấp lánh vàng nhạt
      ctx.fillStyle = 'rgba(255, 215, 0, 0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, Math.random() * 2 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Hạt nổ tung hoa & tim khi chạm
class BurstParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 10 + 6;
    this.alpha = 1;
    this.decay = Math.random() * 0.025 + 0.015;
    this.gravity = 0.12;
    this.symbol = ['🌸', '💖', '✨', '💐', '🌺', '🎀', '⭐'][Math.floor(Math.random() * 7)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.alpha -= this.decay;
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.font = `${this.size * 1.4}px serif`;
    ctx.fillText(this.symbol, this.x, this.y);
    ctx.restore();
  }
}

// Khởi tạo các hạt
const PARTICLE_COUNT = Math.min(width < 600 ? 25 : 45, 50);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = new AmbientParticle();
  p.y = Math.random() * height;
  particles.push(p);
}

function spawnBurst(x, y, count = 18) {
  for (let i = 0; i < count; i++) {
    burstParticles.push(new BurstParticle(x, y));
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  for (let i = burstParticles.length - 1; i >= 0; i--) {
    burstParticles[i].update();
    burstParticles[i].draw();
    if (burstParticles[i].alpha <= 0) {
      burstParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateCanvas);
}
requestAnimationFrame(animateCanvas);

// Click màn hình tạo pháo hoa tim
window.addEventListener('pointerdown', (e) => {
  if (['INPUT', 'BUTTON', 'A'].includes(e.target.tagName)) return;
  spawnBurst(e.clientX, e.clientY, 12);
  playChimeTone(523.25 + Math.random() * 200, 0.15);
});

// ==========================================================================
// 4. HỆ THỐNG ÂM THANH NGỌT NGÀO (WEB AUDIO API)
// ==========================================================================
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playNote(freq, duration = 0.5, type = 'sine', gainVal = 0.08) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.error("Audio error", err);
  }
}

function playChimeTone(freq = 659.25, time = 0.35) {
  playNote(freq, time, 'triangle', 0.1);
  setTimeout(() => playNote(freq * 1.5, time * 0.7, 'sine', 0.06), 70);
}

// Giai điệu trong trẻo, vui tươi đáng yêu (C major pentatonic melody)
const melodyNotes = [
  523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25,
  659.25, 783.99, 1046.50, 987.77, 880.00, 783.99, 659.25, 587.33
];
let noteIndex = 0;

function startBackgroundMusic() {
  getAudioContext();
  isAudioPlaying = true;
  musicBtn.classList.add('active');
  musicBtn.title = "Tắt nhạc nền";

  musicInterval = setInterval(() => {
    if (!isAudioPlaying) return;
    const freq = melodyNotes[noteIndex % melodyNotes.length];
    playNote(freq, 0.55, 'triangle', 0.07);
    if (noteIndex % 4 === 0) {
      playNote(freq / 2, 0.9, 'sine', 0.05);
    }
    noteIndex++;
  }, 440);
}

function stopBackgroundMusic() {
  isAudioPlaying = false;
  musicBtn.classList.remove('active');
  musicBtn.title = "Bật nhạc nền";
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

musicBtn.addEventListener('click', () => {
  if (isAudioPlaying) {
    stopBackgroundMusic();
    showToast("Đã tắt nhạc nền");
  } else {
    startBackgroundMusic();
    showToast("Đang phát giai điệu yêu thương 🎶");
  }
});

burstBtn.addEventListener('click', (e) => {
  const rect = burstBtn.getBoundingClientRect();
  spawnBurst(rect.left + 21, rect.top + 21, 28);
  playChimeTone(783.99, 0.35);
  showToast("Gửi triệu đóa hoa và tim yêu thương! 🌸💖");
});

// ==========================================================================
// 5. HIỂN THỊ LỜI CHÚC & CHUYỂN TABS
// ==========================================================================
function updateWishDisplay() {
  const list = WISHES[currentCategory];
  if (!list || list.length === 0) return;

  const currentWish = list[currentWishIndex % list.length];
  wishContent.style.opacity = '0';
  setTimeout(() => {
    wishContent.textContent = currentWish;
    wishContent.style.opacity = '1';
  }, 180);
}

// Bấm chuyển tab chủ đề
categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    categoryPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentCategory = pill.dataset.category;
    currentWishIndex = 0;
    updateWishDisplay();
    playChimeTone(587.33, 0.15);
  });
});

// Bấm đổi lời chúc tiếp theo
nextWishBtn.addEventListener('click', () => {
  const list = WISHES[currentCategory];
  currentWishIndex = (currentWishIndex + 1) % list.length;
  updateWishDisplay();
  playChimeTone(659.25, 0.18);
});

// Sao chép lời chúc
copyWishBtn.addEventListener('click', async () => {
  const text = wishContent.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    showToast("Đã sao chép lời chúc thành công! 💖");
    playChimeTone(880, 0.25);
  } catch (err) {
    showToast("Vui lòng bôi đen để sao chép!");
  }
});

// ==========================================================================
// 6. CÁ NHÂN HÓA TÊN NGƯỜI NHẬN & NGƯỜI GỬI TỨC THÌ
// ==========================================================================
inputRecipient.addEventListener('input', () => {
  const val = inputRecipient.value.trim();
  recipientName.textContent = val ? val : "Người Phụ Nữ Tuyệt Vời";
});

inputSender.addEventListener('input', () => {
  const val = inputSender.value.trim();
  senderName.textContent = val ? `${val} ❤️` : "Người Yêu Quý Bạn ❤️";
});

// Sao chép liên kết chia sẻ có chứa tham số tên
shareLinkBtn.addEventListener('click', async () => {
  const recipient = inputRecipient.value.trim();
  const sender = inputSender.value.trim();

  const url = new URL(window.location.href.split('?')[0]);
  if (recipient) url.searchParams.set('to', recipient);
  if (sender) url.searchParams.set('from', sender);
  url.searchParams.set('cat', currentCategory);

  try {
    await navigator.clipboard.writeText(url.toString());
    showToast("Đã sao chép link! Hãy gửi ngay cho người thương nhé 💌");
    playChimeTone(880, 0.3);
  } catch (err) {
    prompt("Sao chép link này để gửi tặng:", url.toString());
  }
});

function applyURLParams() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  const from = params.get('from');
  const cat = params.get('cat');

  if (to) {
    inputRecipient.value = to;
    recipientName.textContent = to;
  }
  if (from) {
    inputSender.value = from;
    senderName.textContent = `${from} ❤️`;
  }
  if (cat && WISHES[cat]) {
    currentCategory = cat;
    categoryPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === cat);
    });
  }
}

// ==========================================================================
// 7. TƯƠNG TÁC 6 ẢNH XUNG QUANH & MODAL PHÓNG TO
// ==========================================================================
photoCards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const title = card.getAttribute('data-title');
    const rect = card.getBoundingClientRect();

    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
    playChimeTone(740, 0.25);

    if (img) {
      modalImg.src = img.src;
      modalCaption.textContent = title || "Khoảnh khắc đáng yêu 🌸";
      photoModal.classList.add('show');
      photoModal.setAttribute('aria-hidden', 'false');
    }
  });
});

function closeModal() {
  photoModal.classList.remove('show');
  photoModal.setAttribute('aria-hidden', 'true');
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && photoModal.classList.contains('show')) {
    closeModal();
  }
});

// ==========================================================================
// 8. THÔNG BÁO TOAST NGỌT NGÀO
// ==========================================================================
let toastTimer = null;
function showToast(msg) {
  toastMessage.textContent = msg;
  toastElem.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastElem.classList.remove('show');
  }, 3000);
}

// ==========================================================================
// 9. KHỞI CHẠY (INIT)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateWishDisplay();
  applyURLParams();
});
