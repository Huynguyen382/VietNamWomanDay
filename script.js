/**
 * CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10
 * Script điều khiển hiệu ứng, âm thanh, thiệp tương tác và tạo lời chúc
 */

// ==========================================================================
// 1. DỮ LIỆU LỜI CHÚC Ý NGHĨA (WISHES DATABASE)
// ==========================================================================
const WISHES = {
  mom: [
    "Nhân ngày 20/10, con kính chúc Mẹ yêu luôn mạnh khỏe, bình an, tràn đầy niềm vui và hạnh phúc. Cảm ơn Mẹ đã luôn hy sinh thầm lặng, là chỗ dựa vững chắc và ấm áp nhất của cuộc đời con! Con yêu Mẹ thật nhiều! ❤️",
    "Gửi người phụ nữ vĩ đại nhất đời con: Chúc Mẹ một ngày 20/10 thật nhiều nụ cười, bớt đi những âu lo và luôn an yên trong vòng tay gia đình. Mẹ mãi là đóa hoa rạng rỡ nhất trong trái tim con!",
    "Mẹ ơi, hôm nay là 20/10! Con chỉ mong sao Mẹ luôn vui tươi, có thật nhiều sức khỏe để mãi đồng hành cùng chúng con. Mẹ chính là điều kỳ diệu nhất mà cuộc sống ban tặng cho con."
  ],
  lover: [
    "Chúc em yêu một ngày 20/10 thật ngọt ngào, rạng rỡ và hạnh phúc! Cảm ơn em đã bước vào cuộc đời anh, mang đến cho anh những nụ cười và sự ấm áp diệu kỳ. Yêu em hôm nay và mãi mãi về sau! 🌹",
    "Gửi một nửa yêu thương của anh: Chúc em ngày 20/10 luôn xinh đẹp như hoa ban mai, tự tin tỏa sáng và luôn mỉm cười hạnh phúc. Mọi bão giông bên ngoài hãy để anh gánh vác, việc của em là luôn hạnh phúc bên anh!",
    "Ngày Phụ nữ Việt Nam 20/10, anh muốn dành trọn mọi yêu thương và những điều tốt đẹp nhất cho em. Cảm ơn vì em luôn là nốt nhạc dịu êm và là bến đỗ bình yên nhất của anh! ❤️"
  ],
  sister: [
    "Chúc chị/em gái một ngày 20/10 ngập tràn hoa và quà! Chúc bạn luôn xinh đẹp, trẻ trung, học tập và công tác thật tốt, sớm tìm được một nửa yêu thương xứng đáng nhé! 🌸",
    "Nhân ngày 20/10, chúc người chị/em tuyệt vời của tôi luôn giữ nụ cười rạng ngời trên môi, mãi luôn nhiệt huyết, tự tin theo đuổi ước mơ và gặt hái thật nhiều thành công!",
    "Chúc em gái/chị gái có một ngày lễ 20/10 thật đáng nhớ! Hãy luôn yêu thương bản thân, tỏa sáng theo cách riêng và luôn là niềm tự hào của cả gia đình nhé!"
  ],
  colleague: [
    "Chúc toàn thể các chị em phụ nữ ngày 20/10 ngập tràn niềm vui, trẻ trung, xinh đẹp, công việc thăng tiến thuận lợi và luôn giữ được ngọn lửa đam mê, tích cực trong cuộc sống! 💐",
    "Nhân ngày Phụ nữ Việt Nam, chúc bạn nhận được thật nhiều hoa, ngập tràn quà tặng và luôn là bông hoa tươi thắm, rực rỡ nhất nơi công sở cũng như trong cuộc sống!",
    "Chúc phái đẹp ngày 20/10 thật nhiều sức khỏe, luôn vui tươi, rạng ngời và thành công rực rỡ trên mọi chặng đường phía trước! Cảm ơn vì sự cống hiến và nguồn năng lượng tuyệt vời của bạn!"
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
const envelopeWrapper = document.getElementById('envelope-wrapper');
const envelopeActionText = document.getElementById('envelope-action-text');
const letterGreeting = document.getElementById('letter-greeting');
const letterBody = document.getElementById('letter-body');
const letterFrom = document.getElementById('letter-from');
const wishTextElem = document.getElementById('wish-text');
const wishTabs = document.querySelectorAll('.wish-tab');
const copyWishBtn = document.getElementById('copy-wish-btn');
const applyToCardBtn = document.getElementById('apply-to-card-btn');
const nextWishBtn = document.getElementById('next-wish-btn');
const musicBtn = document.getElementById('music-btn');
const burstBtn = document.getElementById('burst-btn');
const inputRecipient = document.getElementById('input-recipient');
const inputSender = document.getElementById('input-sender');
const createCardBtn = document.getElementById('create-card-btn');
const shareLinkBtn = document.getElementById('share-link-btn');
const flowerInteractive = document.getElementById('flower-interactive');
const toastElem = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ==========================================================================
// 3. CANVAS PARTICLE SYSTEM (CÁNH HOA, TIM & HẠT SÁNG)
// ==========================================================================
let particles = [];
let confettiList = [];
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
    this.y = Math.random() * -100;
    this.size = Math.random() * 12 + 8;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.random() * 1.2 - 0.6;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 2;
    this.swing = Math.random() * 2 + 1;
    this.swingAngle = Math.random() * Math.PI * 2;
    this.swingSpeed = Math.random() * 0.02 + 0.01;
    this.type = Math.random() > 0.4 ? 'petal' : (Math.random() > 0.5 ? 'heart' : 'sparkle');
    
    // Màu sắc cánh hoa
    const colors = [
      'rgba(255, 105, 180, 0.75)', // Hot pink
      'rgba(255, 182, 193, 0.85)', // Light pink
      'rgba(255, 51, 102, 0.7)',   // Ruby red
      'rgba(255, 218, 185, 0.8)'   // Peach
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
      ctx.fillStyle = 'rgba(255, 60, 110, 0.8)';
      ctx.beginPath();
      const s = this.size * 0.6;
      ctx.moveTo(0, s / 4);
      ctx.quadraticCurveTo(0, 0, s / 2, 0);
      ctx.quadraticCurveTo(s, 0, s, s / 2);
      ctx.quadraticCurveTo(s, s, 0, s * 1.4);
      ctx.quadraticCurveTo(-s, s, -s, s / 2);
      ctx.quadraticCurveTo(-s, 0, -s / 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, s / 4);
      ctx.fill();
    } else {
      // Sparkle star
      ctx.fillStyle = 'rgba(255, 230, 120, 0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, Math.random() * 2.5 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Hạt nổ confetti khi click
class BurstParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 10 + 6;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.gravity = 0.12;
    this.rotation = Math.random() * 360;
    this.symbol = ['🌸', '💖', '✨', '💐', '🌺', '⭐'][Math.floor(Math.random() * 6)];
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
    ctx.font = `${this.size * 1.5}px serif`;
    ctx.fillText(this.symbol, this.x, this.y);
    ctx.restore();
  }
}

// Khởi tạo các hạt nền
const PARTICLE_COUNT = Math.min(width < 600 ? 25 : 50, 60);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = new AmbientParticle();
  p.y = Math.random() * height; // Rải đều ban đầu
  particles.push(p);
}

function spawnBurst(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    confettiList.push(new BurstParticle(x, y));
  }
}

// Vòng lặp vẽ Canvas
function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  // Cập nhật hạt nền
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  // Cập nhật pháo hoa confetti
  for (let i = confettiList.length - 1; i >= 0; i--) {
    confettiList[i].update();
    confettiList[i].draw();
    if (confettiList[i].alpha <= 0) {
      confettiList.splice(i, 1);
    }
  }

  requestAnimationFrame(animateCanvas);
}
requestAnimationFrame(animateCanvas);

// Click chuột vào màn hình tạo hiệu ứng nở hoa
window.addEventListener('pointerdown', (e) => {
  // Tránh spam nếu click vào input hoặc button
  if (['INPUT', 'BUTTON'].includes(e.target.tagName)) return;
  spawnBurst(e.clientX, e.clientY, 12);
  playChimeTone(400 + Math.random() * 300, 0.15);
});

// ==========================================================================
// 4. HỆ THỐNG ÂM THANH (WEB AUDIO API - SOOTHING MELODY & SFX)
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

// Phát một nốt nhạc dịu nhẹ với âm sắc phong cầm/piano
function playNote(freq, duration = 0.5, type = 'sine', gainVal = 0.1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.error("Audio play error", err);
  }
}

// Hiệu ứng chuông gió khi mở thư / bấm hoa
function playChimeTone(freq = 523.25, time = 0.4) {
  playNote(freq, time, 'triangle', 0.12);
  setTimeout(() => playNote(freq * 1.5, time * 0.8, 'sine', 0.08), 80);
}

// Giai điệu thư giãn lặp lại (Romantic pentatonic sequence)
const melodyNotes = [
  // C major / A minor pentatonic romantic chords (Hz)
  523.25, 659.25, 783.99, 987.77, 880.00, 659.25, 783.99, 523.25,
  587.33, 698.46, 880.00, 1046.50, 783.99, 659.25, 587.33, 523.25
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
    playNote(freq, 0.7, 'triangle', 0.08);
    // Hòa âm nốt trầm
    if (noteIndex % 4 === 0) {
      playNote(freq / 2, 1.2, 'sine', 0.06);
    }
    noteIndex++;
  }, 480);
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

// Nút bắn hoa tim
burstBtn.addEventListener('click', (e) => {
  const rect = burstBtn.getBoundingClientRect();
  spawnBurst(rect.left + 24, rect.top + 24, 30);
  playChimeTone(659.25, 0.3);
  showToast("Gửi ngàn đóa hoa và tim yêu thương! 🌸💖");
});

// ==========================================================================
// 5. ĐIỀU KHIỂN PHONG BÌ & THIỆP 3D
// ==========================================================================
function toggleEnvelope() {
  const isOpen = envelopeWrapper.classList.toggle('open');
  if (isOpen) {
    envelopeActionText.textContent = "Chạm vào phong thư để gập lại";
    playChimeTone(587.33, 0.5);
    // Bắn hạt sáng quanh thư
    const rect = envelopeWrapper.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 3, 25);
  } else {
    envelopeActionText.textContent = "Chạm vào phong thư để mở thiệp chúc mừng";
    playChimeTone(440, 0.2);
  }
}

envelopeWrapper.addEventListener('click', toggleEnvelope);

// ==========================================================================
// 6. QUẢN LÝ LỜI CHÚC & TƯƠNG TÁC TABS
// ==========================================================================
function displayCurrentWish() {
  const list = WISHES[currentCategory];
  if (!list || list.length === 0) return;

  const currentWish = list[currentWishIndex % list.length];
  wishTextElem.style.opacity = '0';
  setTimeout(() => {
    wishTextElem.textContent = currentWish;
    wishTextElem.style.opacity = '1';
  }, 200);
}

// Chuyển tab danh mục
wishTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    wishTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    currentWishIndex = 0;
    displayCurrentWish();
    playChimeTone(523.25, 0.15);
  });
});

// Nút đổi lời chúc tiếp theo
nextWishBtn.addEventListener('click', () => {
  const list = WISHES[currentCategory];
  currentWishIndex = (currentWishIndex + 1) % list.length;
  displayCurrentWish();
  playChimeTone(659.25, 0.15);
});

// Sao chép lời chúc đang hiển thị
copyWishBtn.addEventListener('click', async () => {
  const text = wishTextElem.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    showToast("Đã sao chép lời chúc vào khay nhớ tạm!");
    playChimeTone(880, 0.2);
  } catch (err) {
    showToast("Không thể sao chép, vui lòng copy thủ công!");
  }
});

// Đưa lời chúc đang hiển thị vào trong bức thư
applyToCardBtn.addEventListener('click', () => {
  const text = wishTextElem.textContent.trim();
  letterBody.textContent = text;
  
  // Mở thư nếu đang đóng
  if (!envelopeWrapper.classList.contains('open')) {
    envelopeWrapper.classList.add('open');
    envelopeActionText.textContent = "Chạm vào phong thư để gập lại";
  }

  // Cuộn nhẹ lên khu vực thiệp
  envelopeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const rect = envelopeWrapper.getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
  playChimeTone(783.99, 0.3);
  showToast("Đã cập nhật lời chúc vào trong phong thư!");
});

// ==========================================================================
// 7. CÁ NHÂN HÓA THIỆP & TẠO LINK CHIA SẺ
// ==========================================================================
function updateCardPersonalization() {
  const recipient = inputRecipient.value.trim();
  const sender = inputSender.value.trim();

  if (recipient) {
    letterGreeting.textContent = `Gửi ${recipient},`;
  } else {
    letterGreeting.textContent = "Gửi Người Phụ Nữ Tuyệt Vời,";
  }

  if (sender) {
    letterFrom.textContent = sender;
  } else {
    letterFrom.textContent = "Từ Người Yêu Quý Bạn";
  }

  // Tự động mở thư để xem ngay
  if (!envelopeWrapper.classList.contains('open')) {
    envelopeWrapper.classList.add('open');
    envelopeActionText.textContent = "Chạm vào phong thư để gập lại";
  }

  envelopeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  playChimeTone(880, 0.3);
  const rect = envelopeWrapper.getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
  showToast("Đã cá nhân hóa thiệp thành công!");
}

createCardBtn.addEventListener('click', updateCardPersonalization);

// Sao chép liên kết có chứa tham số tên
shareLinkBtn.addEventListener('click', async () => {
  const recipient = inputRecipient.value.trim();
  const sender = inputSender.value.trim();

  const url = new URL(window.location.href.split('?')[0]);
  if (recipient) url.searchParams.set('to', recipient);
  if (sender) url.searchParams.set('from', sender);
  url.searchParams.set('cat', currentCategory);

  try {
    await navigator.clipboard.writeText(url.toString());
    showToast("Đã sao chép đường dẫn thiệp chúc mừng riêng!");
    playChimeTone(880, 0.25);
  } catch (err) {
    prompt("Sao chép liên kết này gửi cho người thương nhé:", url.toString());
  }
});

// Đọc tham số URL khi người nhận mở trang
function applyURLParams() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  const from = params.get('from');
  const cat = params.get('cat');

  if (to) {
    inputRecipient.value = to;
    letterGreeting.textContent = `Gửi ${to},`;
  }
  if (from) {
    inputSender.value = from;
    letterFrom.textContent = from;
  }
  if (cat && WISHES[cat]) {
    currentCategory = cat;
    wishTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === cat);
    });
  }

  // Tự động mở phong thư nếu có tham số người nhận
  if (to || from) {
    setTimeout(() => {
      envelopeWrapper.classList.add('open');
      envelopeActionText.textContent = "Chạm vào phong thư để gập lại";
    }, 800);
  }
}

// ==========================================================================
// 8. BÔNG HOA TƯƠNG TÁC (INTERACTIVE ROSE)
// ==========================================================================
const flowerQuotes = [
  "Bạn là đóa hoa xinh đẹp và tỏa hương ngát ngào nhất! 🌹",
  "Nụ cười của bạn làm bừng sáng cả thế giới xung quanh! ✨",
  "Tự tin, kiêu hãnh và luôn hạnh phúc nhé cô gái tuyệt vời! 💖",
  "Chúc bạn mỗi ngày trôi qua đều là một ngày ngập tràn yêu thương! 🌸"
];

flowerInteractive.addEventListener('click', (e) => {
  const rect = flowerInteractive.getBoundingClientRect();
  spawnBurst(rect.left + rect.width / 2, rect.top + 50, 25);
  playChimeTone(698.46, 0.35);

  const randomQuote = flowerQuotes[Math.floor(Math.random() * flowerQuotes.length)];
  showToast(randomQuote);
});

// Click thẻ ảnh polaroid tạo hiệu ứng tung hoa
document.querySelectorAll('.polaroid-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const rect = card.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    playChimeTone(740, 0.25);
  });
});

// ==========================================================================
// 9. THÔNG BÁO TOAST THÂN THIỆN
// ==========================================================================
let toastTimer = null;
function showToast(msg) {
  toastMessage.textContent = msg;
  toastElem.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastElem.classList.remove('show');
  }, 3200);
}

// ==========================================================================
// 10. KHỞI TẠO BAN ĐẦU (INIT)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  displayCurrentWish();
  applyURLParams();
});
