/**
 * CHÚC MỪNG 20/10 - DÀNH TẶNG NỮ SINH VIÊN
 * Script hiệu ứng ngập tràn trái tim, âm thanh thanh xuân & thiệp chúc mừng sinh viên
 */

// ==========================================================================
// 1. KHO LỜI CHÚC Ý NGHĨA DÀNH CHO CÁC BẠN NỮ
// ==========================================================================
const WISHES = {
  classmate: [
    "Nhân ngày 20/10, chúc bạn luôn ngập tràn niềm vui, nụ cười rạng rỡ, học tập và công việc đều hanh thông, luôn được yêu thương chiều chuộng và mãi là đóa hoa xinh đẹp nhất! 🌸💖",
    "Chúc bạn một ngày 20/10 thật ngọt ngào và nhận được thật nhiều hoa quà! Chúc bạn luôn tràn đầy năng lượng tích cực, thi cử hay công việc đều đạt kết quả xuất sắc và mỗi ngày đều là một ngày hạnh phúc! ✨💯",
    "Gửi bạn nữ tuyệt vời: Cảm ơn bạn đã luôn mang lại sự ấm áp và niềm vui cho mọi người xung quanh. Chúc bạn ngày 20/10 nhận được thật nhiều yêu thương và hạnh phúc trọn vẹn! 💖💐"
  ],
  deadline: [
    "Chúc chị em đồng nghiệp ngày 20/10 thật ngọt ngào và rạng rỡ! Dù deadline hay công việc có bận rộn đến đâu thì chúng mình vẫn luôn xinh đẹp, tự tin và cùng nhau chinh phục mọi mục tiêu xuất sắc! 💻🌸",
    "20/10 chúc phái đẹp team mình: Deadline tự động lùi xa, công việc trôi chảy, sếp khen ngợi, khách hàng hài lòng và luôn tràn đầy nhiệt huyết nhé! Cố lên những cô gái tài năng! 🍀✨",
    "Gửi người đồng hành tuyệt vời: Hôm nay là 20/10, hãy gác lại âu lo công việc để tận hưởng trọn vẹn ngày của phái đẹp nhé. Chúc bạn luôn bản lĩnh, thành công và sớm gặt hái thêm nhiều thành tựu lớn! 👑💖"
  ],
  bestie: [
    "Nhân ngày 20/10, chúc cạ cứng của tớ luôn xinh đẹp hết phần thiên hạ, tiền đầy túi, tình đầy tim, đi đâu cũng gặp may và sớm có người yêu chuẩn gu cưng chiều hết nấc nhé! 👭💖",
    "Chúc bạn thân tuyệt vời nhất của tớ một ngày 20/10 thật rực rỡ! Cảm ơn cậu đã luôn ở bên lắng nghe, sẻ chia từng khoảnh khắc buồn vui cuộc sống. Yêu cậu nhiều! 🌸✨",
    "Gửi cạ cứng: Chúc cậu ngày 20/10 nhận được thật nhiều quà và hoa! Chúc cậu luôn tự tin tỏa sáng theo cách riêng, công việc thuận lợi và luôn có tớ đồng hành phía sau nhé! 🎀❤️"
  ],
  crush: [
    "Chúc nàng thơ của tớ một ngày 20/10 thật dịu dàng, ấm áp và luôn mỉm cười thật tươi. Nụ cười của bạn chính là điều ngọt ngào nhất làm bừng sáng cả một ngày đấy! ✨💖",
    "Ngày Phụ nữ Việt Nam, mong rằng mọi điều tốt đẹp và kỳ diệu nhất sẽ đến với bạn. Chúc bạn luôn xinh đẹp, an yên và được nâng niu như một nàng công chúa! 🌹🌸",
    "Gửi người đặc biệt: Chúc bạn ngày 20/10 ngập tràn hạnh phúc! Hy vọng mỗi ngày trôi qua với bạn đều ngọt ngào, và hy vọng tớ sẽ có cơ hội mang lại nụ cười cho bạn nhiều hơn nữa! 💌✨"
  ]
};

// ==========================================================================
// 2. KHỞI TẠO BIẾN TOÀN CỤC & DOM ELEMENTS
// ==========================================================================
let currentCategory = 'classmate';
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
// 3. CANVAS TRÁI TIM NGẬP TRÀN (HEART RAIN & RISING BUBBLES)
// ==========================================================================
let hearts = [];
let burstParticles = [];
let trailParticles = [];
let width = window.innerWidth;
let height = window.innerHeight;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Hạt trái tim bay lơ lửng (Cả rơi xuống và bay từ dưới lên)
class AmbientHeart {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.direction = Math.random() > 0.4 ? 'down' : 'up'; // Trái tim vừa rơi vừa bay lên
    this.y = initial ? Math.random() * height : (this.direction === 'down' ? -40 : height + 40);
    this.size = Math.random() * 14 + 10;
    this.speed = Math.random() * 1.2 + 0.5;
    this.swing = Math.random() * 1.8 + 0.8;
    this.swingAngle = Math.random() * Math.PI * 2;
    this.swingSpeed = Math.random() * 0.02 + 0.01;
    this.rotation = (Math.random() - 0.5) * 40;
    this.rotSpeed = (Math.random() - 0.5) * 0.8;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.04 + 0.02;

    // Gam màu trái tim phong phú ngọt ngào
    const heartColors = [
      'rgba(255, 51, 119, 0.78)',  // Hồng đậm rực rỡ
      'rgba(255, 105, 180, 0.82)', // Hồng phấn
      'rgba(255, 182, 193, 0.85)', // Hồng pastel
      'rgba(224, 17, 95, 0.75)',   // Ruby red
      'rgba(255, 255, 255, 0.88)'  // Trắng tinh khôi phát sáng
    ];
    this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
  }

  update() {
    this.swingAngle += this.swingSpeed;
    this.x += Math.sin(this.swingAngle) * this.swing;
    this.rotation += this.rotSpeed;
    this.pulse += this.pulseSpeed;

    if (this.direction === 'down') {
      this.y += this.speed;
      if (this.y > height + 50) this.reset();
    } else {
      this.y -= this.speed * 0.8;
      if (this.y < -50) this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    
    // Hiệu ứng nhịp đập nhẹ
    const pulseScale = 1 + Math.sin(this.pulse) * 0.12;
    ctx.scale(pulseScale, pulseScale);

    ctx.fillStyle = this.color;
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

    ctx.restore();
  }
}

// Vệt trái tim nhỏ theo đuôi con trỏ chuột (Cursor Trail)
class CursorHeart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 5;
    this.vy = -Math.random() * 1.5 - 0.5;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.alpha = 1;
    this.decay = Math.random() * 0.03 + 0.02;
    this.color = ['#ff3377', '#ff69b4', '#ffffff', '#ffd166'][Math.floor(Math.random() * 4)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const s = this.size * 0.5;
    ctx.moveTo(this.x, this.y + s / 4);
    ctx.quadraticCurveTo(this.x, this.y, this.x + s / 2, this.y);
    ctx.quadraticCurveTo(this.x + s, this.y, this.x + s, this.y + s / 2);
    ctx.quadraticCurveTo(this.x + s, this.y + s, this.x, this.y + s * 1.4);
    ctx.quadraticCurveTo(this.x - s, this.y + s, this.x - s, this.y + s / 2);
    ctx.quadraticCurveTo(this.x - s, this.y, this.x - s / 2, this.y);
    ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + s / 4);
    ctx.fill();
    ctx.restore();
  }
}

// Hạt nổ tung hoa & tim khi chạm (Burst Confetti)
class BurstParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 12 + 8;
    this.alpha = 1;
    this.decay = Math.random() * 0.025 + 0.015;
    this.gravity = 0.12;
    this.symbol = ['💖', '💕', '💓', '💗', '🌸', '✨', '🎓', '🎀'][Math.floor(Math.random() * 8)];
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
    ctx.font = `${this.size * 1.3}px serif`;
    ctx.fillText(this.symbol, this.x, this.y);
    ctx.restore();
  }
}

// Khởi tạo các trái tim bay
const HEART_COUNT = Math.min(width < 600 ? 30 : 60, 65);
for (let i = 0; i < HEART_COUNT; i++) {
  hearts.push(new AmbientHeart());
}

function spawnBurst(x, y, count = 24) {
  for (let i = 0; i < count; i++) {
    burstParticles.push(new BurstParticle(x, y));
  }
}

// Theo dõi con trỏ chuột tạo vệt trái tim ngọt ngào
let lastMouseSpawn = 0;
window.addEventListener('pointermove', (e) => {
  const now = Date.now();
  if (now - lastMouseSpawn > 60) {
    trailParticles.push(new CursorHeart(e.clientX, e.clientY));
    lastMouseSpawn = now;
  }
});

// Vòng lặp vẽ Canvas
function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  // Vẽ các hạt tim nền
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].update();
    hearts[i].draw();
  }

  // Vẽ vệt tim theo chuột
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    trailParticles[i].update();
    trailParticles[i].draw();
    if (trailParticles[i].alpha <= 0) {
      trailParticles.splice(i, 1);
    }
  }

  // Vẽ pháo hoa tim khi click
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

// Click màn hình tung pháo hoa tim
window.addEventListener('pointerdown', (e) => {
  if (['INPUT', 'BUTTON', 'A'].includes(e.target.tagName)) return;
  spawnBurst(e.clientX, e.clientY, 16);
  playChimeTone(587.33 + Math.random() * 200, 0.2);
});

// ==========================================================================
// 4. ÂM THANH THANH XUÂN DỊU NHẸ (WEB AUDIO API)
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

// Giai điệu thanh xuân tươi vui (Pentatonic uplifting melody)
const melodyNotes = [
  523.25, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 587.33,
  659.25, 783.99, 880.00, 1174.66, 1046.50, 880.00, 783.99, 659.25
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
    playNote(freq, 0.5, 'triangle', 0.07);
    if (noteIndex % 4 === 0) {
      playNote(freq / 2, 0.85, 'sine', 0.05);
    }
    noteIndex++;
  }, 420);
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
    showToast("Đang phát giai điệu thanh xuân 🎶");
  }
});

burstBtn.addEventListener('click', () => {
  const rect = burstBtn.getBoundingClientRect();
  spawnBurst(rect.left + 22, rect.top + 22, 35);
  playChimeTone(880, 0.35);
  showToast("Chúc mừng các bạn nữ ngày 20/10! 💖🌸");
});

// ==========================================================================
// 5. CẬP NHẬT LỜI CHÚC & CHUYỂN TABS
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

nextWishBtn.addEventListener('click', () => {
  const list = WISHES[currentCategory];
  currentWishIndex = (currentWishIndex + 1) % list.length;
  updateWishDisplay();
  playChimeTone(659.25, 0.18);
});

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
// 6. CÁ NHÂN HÓA TÊN NGƯỜI NHẬN / NGƯỜI GỬI
// ==========================================================================
inputRecipient.addEventListener('input', () => {
  const val = inputRecipient.value.trim();
  recipientName.textContent = val ? val : "Các Bạn Nữ Tuyệt Vời";
});

inputSender.addEventListener('input', () => {
  const val = inputSender.value.trim();
  senderName.textContent = val ? `${val} 💖` : "Người gửi lời chúc 💖";
});

shareLinkBtn.addEventListener('click', async () => {
  const recipient = inputRecipient.value.trim();
  const sender = inputSender.value.trim();

  const url = new URL(window.location.href.split('?')[0]);
  if (recipient) url.searchParams.set('to', recipient);
  if (sender) url.searchParams.set('from', sender);
  url.searchParams.set('cat', currentCategory);

  try {
    await navigator.clipboard.writeText(url.toString());
    showToast("Đã sao chép link! Gửi vào nhóm lớp ngay nhé 💌");
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
    senderName.textContent = `${from} 💖`;
  }
  if (cat && WISHES[cat]) {
    currentCategory = cat;
    categoryPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === cat);
    });
  }
}

// ==========================================================================
// 7. TƯƠNG TÁC 6 ẢNH KỶ NIỆM & PHÓNG TO
// ==========================================================================
photoCards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const title = card.getAttribute('data-title');
    const rect = card.getBoundingClientRect();

    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
    playChimeTone(740, 0.25);

    if (img) {
      modalImg.src = img.src;
      modalCaption.textContent = title || "Chú mèo cute tặng hoa ngày 20/10 🌸🐱";
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
// 8. HỘP QUÀ MAY MẮN 20/10 (BỐC QUẺ VUI DÀNH CHO CÁC BẠN NỮ)
// ==========================================================================
const LUCKY_FORTUNES = [
  {
    title: "Nữ Thần May Mắn 🍀",
    desc: "Chúc bạn vạn sự như ý, công việc học tập thuận buồm xuôi gió, ra đường gặp may, về nhà ấm êm, muốn gì được nấy! ✨🎉",
    tags: ["🍀 Vạn Sự Hanh Thông", "🌟 Siêu May Mắn", "🎉 Trọn Vẹn"]
  },
  {
    title: "Xinh Đẹp Rạng Ngời 👑",
    desc: "Nhan sắc ngày càng thăng hạng, nụ cười tỏa nắng rạng rỡ, ra đường ai cũng ngoái nhìn, nhận hoa mỏi tay và luôn là tâm điểm ngọt ngào! 💖🌸",
    tags: ["👑 Xinh Đẹp 1000%", "🌸 Tỏa Sáng", "💖 Rạng Rỡ"]
  },
  {
    title: "Ví Tiền Rủng Rỉnh 💰",
    desc: "Công việc kinh doanh hanh thông, thu nhập tăng vọt, săn sale trúng lớn, shopping thả ga không cần nhìn giá, cả năm sung túc! 🎀✨",
    tags: ["💰 Tiền Về Đầy Túi", "🎀 Shopping Mỏi Tay", "✨ Sung Túc"]
  },
  {
    title: "Bình Yên & Hạnh Phúc ☀️",
    desc: "Mỗi ngày trôi qua đều ngập tràn niềm vui, không chút âu lo muộn phiền, luôn có những người thương yêu bên cạnh chiều chuộng hết mực! 💐❤️",
    tags: ["☀️ Tâm Trạng Tươi Vui", "💐 Bình Yên", "❤️ Được Chiều Chuộng"]
  },
  {
    title: "Chiến Thần Thành Công 💯",
    desc: "Mọi mục tiêu đặt ra đều hoàn thành xuất sắc, thi cử hay công việc đều thăng tiến vượt bậc, ai ai cũng ngưỡng mộ và yêu quý! 🌟🏆",
    tags: ["💯 Điểm 10 Tuyệt Đối", "🏆 Thành Công Lớn", "🌟 Xuất Sắc"]
  },
  {
    title: "Tình Duyên Ngọt Ngào 💌",
    desc: "Sớm gặp được người chuẩn gu tâm đầu ý hợp, được nâng niu như công chúa, tình cảm thăng hoa ngọt ngào tựa như phim Hàn Quốc! 🌹💕",
    tags: ["💌 Chân Ái Chuẩn Gu", "🌹 Được Yêu Thương", "💕 Ngọt Ngào"]
  }
];

const luckyGiftBtn = document.getElementById('lucky-gift-btn');
const giftModal = document.getElementById('gift-modal');
const giftBackdrop = document.getElementById('gift-backdrop');
const giftClose = document.getElementById('gift-close');
const giftAgainBtn = document.getElementById('gift-again-btn');
const giftResultTitle = document.getElementById('gift-result-title');
const giftResultDesc = document.getElementById('gift-result-desc');
const giftResultTags = document.getElementById('gift-result-tags');

let lastFortuneIndex = -1;

function drawFortune() {
  try {
    let rand;
    do {
      rand = Math.floor(Math.random() * LUCKY_FORTUNES.length);
    } while (rand === lastFortuneIndex && LUCKY_FORTUNES.length > 1);
    lastFortuneIndex = rand;
    const f = LUCKY_FORTUNES[rand];

    if (giftResultTitle) giftResultTitle.textContent = f.title;
    if (giftResultDesc) giftResultDesc.textContent = f.desc;
    if (giftResultTags) {
      giftResultTags.innerHTML = f.tags.map(t => `<span>${t}</span>`).join('');
    }
  } catch (err) {
    console.error("Lỗi bốc quẻ:", err);
  }

  try {
    spawnBurst(window.innerWidth / 2, window.innerHeight * 0.45, isMobileDevice ? 14 : 26);
    playChimeTone(880, 0.35);
  } catch (err) {
    console.error("Lỗi hiệu ứng:", err);
  }
}
window.drawFortune = drawFortune;

function openGiftModal(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  drawFortune();
  if (giftModal) {
    giftModal.classList.add('show');
    giftModal.setAttribute('aria-hidden', 'false');
  }
}
window.openGiftModal = openGiftModal;

function closeGiftModal(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (giftModal) {
    giftModal.classList.remove('show');
    giftModal.setAttribute('aria-hidden', 'true');
  }
}
window.closeGiftModal = closeGiftModal;

if (luckyGiftBtn) {
  luckyGiftBtn.addEventListener('click', openGiftModal);
}

if (giftAgainBtn) {
  giftAgainBtn.addEventListener('click', drawFortune);
}

if (giftClose) giftClose.addEventListener('click', closeGiftModal);
if (giftBackdrop) giftBackdrop.addEventListener('click', closeGiftModal);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && giftModal && giftModal.classList.contains('show')) {
    closeGiftModal();
  }
});

// ==========================================================================
// 9. THÔNG BÁO TOAST
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
// 10. KHỞI CHẠY (INIT)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateWishDisplay();
  applyURLParams();
});
