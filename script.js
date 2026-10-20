/* ═══════════════════════════════════════════
   Gửi em · 20/10  —  script.js
   Không thư viện, không build. Chỉ là mèo và vài hiệu ứng.
   ═══════════════════════════════════════════ */

/* ── Đổi tên ở đây nếu muốn ─────────────── */
const CONFIG = {
  name: "Nguyên",   // tên người nhận
  sender: "Trân",    // tên người gửi
};

document.querySelectorAll("[data-name]").forEach((el) => {
  el.textContent = CONFIG.name;
});
document.querySelectorAll(".sign-name").forEach((el) => {
  el.textContent = `${CONFIG.sender}.`;
});

/* ── Tiện ích ───────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

let toastTimer = null;
function toast(message, ms = 2600) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), ms);
}

/* ── Trái tim bay nền ───────────────────── */
(function floatingHearts() {
  const layer = $("#hearts");
  const glyphs = ["♥", "♡", "✿", "❀", "♥"];
  for (let i = 0; i < 20; i++) {
    const s = document.createElement("span");
    s.textContent = pick(glyphs);
    s.style.left = `${rand(0, 100)}vw`;
    s.style.fontSize = `${rand(10, 26)}px`;
    s.style.animationDuration = `${rand(14, 26)}s`;
    s.style.animationDelay = `${rand(-26, 0)}s`;
    s.style.opacity = rand(0.2, 0.5).toFixed(2);
    layer.appendChild(s);
  }
})();

/* ── Chữ tự gõ ──────────────────────────── */
(function typewriter() {
  const el = $("#typewriter");
  const phrases = [
    "Chúc em luôn rạng rỡ như nắng sớm 🌸",
    "Cảm ơn em vì đã ở đây, cùng anh.",
    "Hôm nay và mọi ngày, em là điều anh thương nhất.",
    "Một chút hồng, một chút mèo, và rất nhiều yêu thương.",
  ];
  let phrase = 0;
  let char = 0;
  let deleting = false;
  el.textContent = "";

  function tick() {
    const text = phrases[phrase];
    if (!deleting) {
      char++;
      el.textContent = text.slice(0, char);
      if (char === text.length) {
        deleting = true;
        setTimeout(tick, 2300);
        return;
      }
      setTimeout(tick, 55);
    } else {
      char--;
      el.textContent = text.slice(0, char);
      if (char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        setTimeout(tick, 420);
        return;
      }
      setTimeout(tick, 26);
    }
  }
  setTimeout(tick, 700);
})();

/* ── Âm thanh (Web Audio, không cần file) ─ */
const Audio = {
  ctx: null,
  master: null,
  ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);

      // chút vang cho mềm tai
      const delay = this.ctx.createDelay();
      delay.delayTime.value = 0.3;
      const feedback = this.ctx.createGain();
      feedback.gain.value = 0.22;
      const wet = this.ctx.createGain();
      wet.gain.value = 0.22;
      this.master.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },
  tone(freq, at, duration, volume, type = "triangle") {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(at);
    osc.stop(at + duration + 0.05);
  },
  purr() {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 72;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 23;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 16;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.055, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    lfo.start(t);
    osc.stop(t + 0.8);
    lfo.stop(t + 0.8);
  },
  meow() {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    const base = rand(650, 780);
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(base * 0.62, t + 0.16);
    osc.frequency.exponentialRampToValueAtTime(base * 1.05, t + 0.26);
    osc.frequency.exponentialRampToValueAtTime(base * 0.55, t + 0.42);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(base * 0.5, t);
    osc2.frequency.exponentialRampToValueAtTime(base * 0.34, t + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(base * 0.58, t + 0.28);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1900, t);
    filter.frequency.exponentialRampToValueAtTime(850, t + 0.35);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.11, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.46);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.5);
    osc2.stop(t + 0.5);
  },
  pluck(freq, volume = 0.16) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.tone(freq, t, 0.75, volume, "triangle");
    this.tone(freq * 2, t, 0.4, volume * 0.25, "sine");
  },
};

/* ── Nhạc nền ───────────────────────────── */
const Music = {
  on: false,
  step: 0,
  timer: null,
  // 8 ô nhịp, mỗi ô 4 phách
  melody: [
    659.25, 783.99, 880.0, 783.99,
    659.25, 587.33, 523.25, 0,
    587.33, 659.25, 783.99, 659.25,
    587.33, 523.25, 440.0, 0,
    523.25, 659.25, 783.99, 880.0,
    783.99, 659.25, 587.33, 0,
    659.25, 587.33, 523.25, 587.33,
    523.25, 0, 0, 0,
  ],
  bass: [130.81, 110.0, 87.31, 98.0, 130.81, 87.31, 98.0, 130.81],
  start() {
    if (!Audio.ensure()) {
      toast("Trình duyệt này không phát được nhạc 🥲");
      return;
    }
    this.on = true;
    this.step = 0;
    const btn = $("#musicBtn");
    btn.setAttribute("aria-pressed", "true");
    $("#musicIcon").textContent = "🔊";
    btn.querySelector(".music-label").textContent = "Đang phát";
    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 340);
  },
  tick() {
    if (!this.on || !Audio.ctx) return;
    const i = this.step % this.melody.length;
    const note = this.melody[i];
    if (note) Audio.pluck(note, 0.15);
    if (i % 4 === 0) {
      const bar = Math.floor(i / 4);
      Audio.pluck(this.bass[bar % this.bass.length], 0.09);
    }
    this.step++;
  },
  stop() {
    this.on = false;
    clearInterval(this.timer);
    this.timer = null;
    const btn = $("#musicBtn");
    btn.setAttribute("aria-pressed", "false");
    $("#musicIcon").textContent = "🎵";
    btn.querySelector(".music-label").textContent = "Nhạc";
  },
  toggle() {
    this.on ? this.stop() : this.start();
  },
};
$("#musicBtn").addEventListener("click", () => Music.toggle());

/* ── Hoạt ảnh phụ ───────────────────────── */
function heartBurst(x, y, count = 6) {
  const glyphs = ["💗", "💖", "💕", "🌸", "♥"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "burst-heart";
    s.textContent = pick(glyphs);
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.fontSize = `${rand(13, 26)}px`;
    s.style.setProperty("--dx", `${rand(-90, 90)}px`);
    s.style.setProperty("--dy", `${rand(-140, -50)}px`);
    s.style.setProperty("--rot", `${rand(-80, 80)}deg`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}

function confetti(count = 80) {
  const colors = ["#ff5c8f", "#ffb0cc", "#ffcf7a", "#ffffff", "#ff86ae", "#e63f75", "#ffd3e3"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    s.style.left = `${rand(0, 100)}vw`;
    s.style.background = pick(colors);
    s.style.width = `${rand(6, 12)}px`;
    s.style.height = `${rand(9, 18)}px`;
    s.style.borderRadius = Math.random() > 0.7 ? "50%" : "2px";
    s.style.setProperty("--drift", `${rand(-160, 160)}px`);
    s.style.animationDuration = `${rand(2.3, 4)}s`;
    s.style.animationDelay = `${rand(0, 0.5)}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 5000);
  }
}

/* ── Mèo: mắt dõi theo chuột + vuốt ve ─── */
(function cat() {
  const svg = $(".cat-svg");
  const btn = $("#cat");
  const bubble = $("#catBubble");
  const counter = $("#petCount");
  let pets = 0;

  const lines = [
    "Meo meo! Vuốt nữa đi 🐾",
    "Purrr... ấm quá.",
    "Em cũng dễ thương y như tớ vậy đó.",
    "Đừng bỏ đi nhé, tớ buồn đó.",
    "Grừ grừ... tớ ghi lại số lần rồi nha.",
    "Tớ là Mun, mèo của em. Nhớ chưa?",
    "Hôm nay em xinh lắm, tớ thề.",
  ];

  window.addEventListener("pointermove", (e) => {
    const r = svg.getBoundingClientRect();
    if (!r.width) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.44;
    const max = 3.4;
    const px = clamp(((e.clientX - cx) / (window.innerWidth * 0.5)) * max, -max, max);
    const py = clamp(((e.clientY - cy) / (window.innerHeight * 0.5)) * max, -max, max);
    svg.style.setProperty("--px", `${px.toFixed(2)}px`);
    svg.style.setProperty("--py", `${py.toFixed(2)}px`);
  });

  btn.addEventListener("click", (e) => {
    pets++;
    counter.textContent = pets;
    Audio.meow();
    if (pets % 5 === 0) setTimeout(() => Audio.purr(), 430);
    heartBurst(e.clientX, e.clientY, 5);

    bubble.textContent = pick(lines);
    bubble.classList.remove("pop");
    void bubble.offsetWidth;
    bubble.classList.add("pop");
    if (pets === 5) toast("Mun: “Em cũng đáng yêu y như tớ vậy 🐾”");
    if (pets === 15) toast("Mun: “Vuốt nhiều thế này thì tớ theo em về nhà mất thôi.”");
    if (pets === 30) toast("Mun đã ngủ vì được vuốt quá nhiều 😴");
    if (pets === 50) toast("50 lần rồi! Em chắc chắn là người yêu mèo số 1 🌸");
  });

  bubble.addEventListener("animationend", (e) => {
    if (e.animationName === "bubblePop") bubble.classList.remove("pop");
  });
})();

/* ── Mở thư ─────────────────────────────── */
(function letter() {
  const envelope = $("#envelope");
  const btn = $("#openLetter");
  let opened = false;

  btn.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    Audio.pluck(523.25, 0.2);
    setTimeout(() => Audio.pluck(783.99, 0.16), 130);
    setTimeout(() => Audio.pluck(1046.5, 0.12), 270);
    heartBurst(window.innerWidth / 2, window.innerHeight * 0.55, 10);
    setTimeout(() => {
      envelope.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 430);
  });
})();

/* ── Thẻ lật ────────────────────────────── */
document.querySelectorAll(".flip-card").forEach((card) => {
  const toggle = () => {
    const on = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(on));
    if (on) Audio.pluck(880, 0.07);
  };
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
});

/* ── Dây ảnh kỷ niệm + lightbox ─────────── */
(function gallery() {
  const cards = Array.from(document.querySelectorAll(".photo-card"));
  if (!cards.length) return;

  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbTitle = $("#lbTitle");
  const lbCaption = $("#lbCaption");
  const lbIndex = $("#lbIndex");
  const btnClose = $("#lbClose");
  const btnPrev = $("#lbPrev");
  const btnNext = $("#lbNext");

  const items = cards.map((card) => ({
    full: card.dataset.full,
    title: card.dataset.title,
    caption: card.dataset.caption,
    alt: card.querySelector("img")?.alt || card.dataset.title,
  }));

  let index = 0;
  let lastFocus = null;

  function render(i) {
    index = (i + items.length) % items.length;
    const item = items[index];
    lbImg.src = item.full;
    lbImg.alt = item.alt;
    lbTitle.textContent = item.title;
    lbCaption.textContent = item.caption;
    lbIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(
      items.length
    ).padStart(2, "0")}`;

    [index + 1, index - 1].forEach((n) => {
      const pre = new Image();
      pre.src = items[(n + items.length) % items.length].full;
    });
  }

  function open(i, event) {
    lastFocus = document.activeElement;
    render(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnClose.focus({ preventScroll: true });
    if (event) heartBurst(event.clientX, event.clientY, 5);
  }

  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", (e) => open(i, e));
  });

  btnClose.addEventListener("click", close);
  lb.querySelector("[data-close]").addEventListener("click", close);
  btnPrev.addEventListener("click", () => {
    render(index - 1);
    Audio.pluck(523.25, 0.05);
  });
  btnNext.addEventListener("click", () => {
    render(index + 1);
    Audio.pluck(659.25, 0.05);
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") render(index - 1);
    if (e.key === "ArrowRight") render(index + 1);
  });

  // vuốt ngang trên điện thoại
  let startX = null;
  lb.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
  });
  lb.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 55) {
      render(dx > 0 ? index - 1 : index + 1);
      Audio.pluck(587.33, 0.04);
    }
  });
})();

/* ── Trò chơi hứng tim ──────────────────── */
const GAME = (() => {
  const canvas = $("#gameCanvas");
  const g = canvas.getContext("2d");
  const box = $("#canvasBox");
  const overlay = $("#gameOverlay");
  const ovTitle = $("#ovTitle");
  const ovText = $("#ovText");
  const startBtn = $("#startGame");
  const scoreEl = $("#score");
  const timeEl = $("#timeLeft");
  const bestEl = $("#best");

  const state = {
    running: false,
    score: 0,
    time: 25,
    hearts: [],
    pops: [],
    paddleX: 0,
    spawnTimer: 0,
    last: 0,
    raf: 0,
    W: 0,
    H: 0,
    dpr: 1,
    best: 0,
  };

  try {
    state.best = Number(localStorage.getItem("mun-best") || 0) || 0;
  } catch (_) {
    state.best = 0;
  }
  bestEl.textContent = state.best;

  function resize() {
    const r = box.getBoundingClientRect();
    if (!r.width || !r.height) return;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.W = r.width;
    state.H = r.height;
    canvas.width = Math.round(r.width * state.dpr);
    canvas.height = Math.round(r.height * state.dpr);
    g.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    if (!state.paddleX) state.paddleX = state.W / 2;
    state.paddleX = clamp(state.paddleX, 46, state.W - 46);
    if (!state.running) draw();
  }

  function heartPath(x, y, s) {
    g.beginPath();
    g.moveTo(x, y + s * 0.75);
    g.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.7, y - s * 1.1, x, y - s * 0.4);
    g.bezierCurveTo(x + s * 0.7, y - s * 1.1, x + s * 1.4, y - s * 0.1, x, y + s * 0.75);
    g.closePath();
  }

  function drawCat(px) {
    const py = state.H - 62;
    const t = performance.now() / 1000;

    // bóng
    g.fillStyle = "rgba(182,43,88,.12)";
    g.beginPath();
    g.ellipse(px, py + 40, 46, 9, 0, 0, Math.PI * 2);
    g.fill();

    const fur = "#2a2030";
    const line = "#ff9dbe";

    // đuôi
    g.lineCap = "round";
    g.strokeStyle = "#ff9dbe";
    g.lineWidth = 15;
    g.beginPath();
    g.moveTo(px + 30, py + 18);
    g.quadraticCurveTo(px + 66, py + 10 + Math.sin(t * 3) * 8, px + 58, py - 20);
    g.stroke();
    g.strokeStyle = "#2a2030";
    g.lineWidth = 9;
    g.beginPath();
    g.moveTo(px + 30, py + 18);
    g.quadraticCurveTo(px + 66, py + 10 + Math.sin(t * 3) * 8, px + 58, py - 20);
    g.stroke();

    // tai
    g.fillStyle = fur;
    g.strokeStyle = line;
    g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(px - 30, py - 16);
    g.lineTo(px - 36, py - 50);
    g.lineTo(px - 6, py - 33);
    g.closePath();
    g.fill();
    g.stroke();
    g.beginPath();
    g.moveTo(px + 30, py - 16);
    g.lineTo(px + 36, py - 50);
    g.lineTo(px + 6, py - 33);
    g.closePath();
    g.fill();
    g.stroke();

    // đầu
    g.beginPath();
    g.arc(px, py, 36, 0, Math.PI * 2);
    g.fillStyle = fur;
    g.fill();
    g.strokeStyle = line;
    g.stroke();

    // mắt nhìn theo trái tim gần nhất
    let lookX = 0;
    let lookY = 0;
    let target = null;
    state.hearts.forEach((h) => {
      if (!target || h.y > target.y) target = h;
    });
    if (target) {
      lookX = clamp(((target.x - px) / state.W) * 10, -3.2, 3.2);
      lookY = clamp(((target.y - py) / state.H) * 10, -2.4, 2.4);
    }
    g.fillStyle = "#ffcf7a";
    g.beginPath();
    g.ellipse(px - 13 + lookX, py - 4 + lookY, 5, 6.4, 0, 0, Math.PI * 2);
    g.ellipse(px + 13 + lookX, py - 4 + lookY, 5, 6.4, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1c1017";
    g.beginPath();
    g.ellipse(px - 13 + lookX, py - 4 + lookY, 1.8, 4.4, 0, 0, Math.PI * 2);
    g.ellipse(px + 13 + lookX, py - 4 + lookY, 1.8, 4.4, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ff9dbe";
    g.beginPath();
    g.ellipse(px - 23, py + 8, 6, 3.6, 0, 0, Math.PI * 2);
    g.ellipse(px + 23, py + 8, 6, 3.6, 0, 0, Math.PI * 2);
    g.fill();

    // mũi + miệng
    g.fillStyle = "#ff7ea8";
    g.beginPath();
    g.moveTo(px - 4, py + 4);
    g.lineTo(px + 4, py + 4);
    g.lineTo(px, py + 9);
    g.closePath();
    g.fill();
    g.strokeStyle = "#ffc2d8";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(px, py + 9);
    g.quadraticCurveTo(px - 2, py + 15, px - 7, py + 12);
    g.moveTo(px, py + 9);
    g.quadraticCurveTo(px + 2, py + 15, px + 7, py + 12);
    g.stroke();

    // râu
    g.strokeStyle = "#f0b3c8";
    g.lineWidth = 1.8;
    g.beginPath();
    g.moveTo(px - 28, py + 2);
    g.lineTo(px - 48, py - 2);
    g.moveTo(px - 28, py + 9);
    g.lineTo(px - 48, py + 11);
    g.moveTo(px + 28, py + 2);
    g.lineTo(px + 48, py - 2);
    g.moveTo(px + 28, py + 9);
    g.lineTo(px + 48, py + 11);
    g.stroke();
  }

  function draw() {
    g.clearRect(0, 0, state.W, state.H);

    // mây
    g.fillStyle = "rgba(255,255,255,.5)";
    const t = performance.now() / 1000;
    [[state.W * 0.18, 54, 1], [state.W * 0.58, 88, 0.75], [state.W * 0.84, 40, 0.6]].forEach(
      ([x, y, scale], i) => {
        const drift = Math.sin(t * 0.4 + i) * 6;
        g.beginPath();
        g.arc(x + drift, y, 26 * scale, 0, Math.PI * 2);
        g.arc(x + 26 * scale + drift, y + 6 * scale, 19 * scale, 0, Math.PI * 2);
        g.arc(x - 24 * scale + drift, y + 8 * scale, 16 * scale, 0, Math.PI * 2);
        g.fill();
      }
    );

    // trái tim đang rơi
    state.hearts.forEach((h) => {
      g.save();
      g.translate(h.x, h.y);
      g.rotate(h.rot);
      g.fillStyle = h.color;
      heartPath(0, 0, h.s);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,.7)";
      g.lineWidth = 1.6;
      g.stroke();
      g.fillStyle = "rgba(255,255,255,.55)";
      g.beginPath();
      g.arc(-h.s * 0.35, -h.s * 0.35, h.s * 0.18, 0, Math.PI * 2);
      g.fill();
      g.restore();
    });

    // hạt nổ
    state.pops.forEach((p) => {
      g.globalAlpha = Math.max(0, p.life);
      g.fillStyle = p.color;
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      g.fill();
    });
    g.globalAlpha = 1;

    drawCat(state.paddleX);
  }

  function spawn() {
    const size = rand(13, 20);
    state.hearts.push({
      x: rand(36, Math.max(40, state.W - 36)),
      y: -30,
      vy: rand(88, 152),
      s: size,
      phase: rand(0, Math.PI * 2),
      sway: rand(8, 22),
      rot: rand(-0.25, 0.25),
      color: pick(["#ff3d7f", "#ff5c8f", "#e63f75", "#ff7ea8", "#ff4f87"]),
    });
  }

  function loop(now) {
    if (!state.running) return;
    const dt = Math.min((now - state.last) / 1000, 0.05);
    state.last = now;

    state.time -= dt;
    timeEl.textContent = Math.max(0, Math.ceil(state.time));

    state.spawnTimer += dt;
    const interval = Math.max(0.26, 0.46 - (25 - state.time) * 0.006);
    while (state.spawnTimer > interval) {
      state.spawnTimer -= interval;
      spawn();
    }

    const py = state.H - 62;
    for (let i = state.hearts.length - 1; i >= 0; i--) {
      const h = state.hearts[i];
      h.y += h.vy * dt;
      h.phase += dt * 2;
      h.x += Math.sin(h.phase) * h.sway * dt;

      const closeY = h.y + h.s > py - 34 && h.y - h.s < py + 38;
      const closeX = Math.abs(h.x - state.paddleX) < 50 + h.s * 0.7;

      if (closeY && closeX) {
        state.hearts.splice(i, 1);
        state.score++;
        scoreEl.textContent = state.score;
        Audio.pluck(660 + Math.min(state.score, 12) * 30, 0.06);
        for (let k = 0; k < 6; k++) {
          state.pops.push({
            x: h.x,
            y: py - 20,
            vx: rand(-90, 90),
            vy: rand(-140, -20),
            r: rand(2, 4.5),
            life: 1,
            color: h.color,
          });
        }
      } else if (h.y > state.H + 40) {
        state.hearts.splice(i, 1);
      }
    }

    state.pops.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
      p.life -= dt * 1.6;
    });
    state.pops = state.pops.filter((p) => p.life > 0);

    draw();

    if (state.time <= 0) {
      end();
      return;
    }
    state.raf = requestAnimationFrame(loop);
  }

  function start() {
    Audio.ensure();
    cancelAnimationFrame(state.raf);
    state.running = true;
    state.score = 0;
    state.time = 25;
    state.hearts = [];
    state.pops = [];
    state.spawnTimer = 0;
    state.paddleX = state.W / 2;
    state.last = performance.now();
    scoreEl.textContent = "0";
    timeEl.textContent = "25";
    overlay.classList.add("hidden");
    draw();
    state.raf = requestAnimationFrame(loop);
  }

  function end() {
    state.running = false;
    cancelAnimationFrame(state.raf);
    const score = state.score;

    if (score > state.best) {
      state.best = score;
      bestEl.textContent = score;
      try {
        localStorage.setItem("mun-best", String(score));
      } catch (_) {}
    }

    let title;
    let text;
    if (score >= 18) {
      title = "Siêu mèo! 🐱✨";
      text = `Được ${score} trái tim. Mun hạnh phúc đến mức muốn theo em về nhà.`;
    } else if (score >= 10) {
      title = "Giỏi quá em ơi! 💗";
      text = `${score} trái tim — đủ để Mun vui cả ngày. Thử phá kỷ lục nhé?`;
    } else {
      title = "Suýt nữa rồi! 🐾";
      text = `${score} trái tim. Không sao, mèo vẫn thương em. Chơi lại nhé?`;
    }
    showOverlay(title, text, "Chơi lại");
    if (score >= 12) confetti(60);
  }

  function showOverlay(title, text, label) {
    ovTitle.textContent = title;
    ovText.textContent = text;
    startBtn.textContent = label;
    overlay.classList.remove("hidden");
  }

  startBtn.addEventListener("click", start);

  box.addEventListener("pointermove", (e) => {
    if (!state.running) return;
    const r = canvas.getBoundingClientRect();
    state.paddleX = clamp(e.clientX - r.left, 46, state.W - 46);
  });
  box.addEventListener("pointerdown", (e) => {
    if (!state.running) return;
    const r = canvas.getBoundingClientRect();
    state.paddleX = clamp(e.clientX - r.left, 46, state.W - 46);
  });
  window.addEventListener("keydown", (e) => {
    if (!state.running) return;
    if (e.key === "ArrowLeft" || e.key === "a") {
      state.paddleX = clamp(state.paddleX - 34, 46, state.W - 46);
      e.preventDefault();
    }
    if (e.key === "ArrowRight" || e.key === "d") {
      state.paddleX = clamp(state.paddleX + 34, 46, state.W - 46);
      e.preventDefault();
    }
  });

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(box);
  } else {
    window.addEventListener("resize", resize);
  }
  resize();
  showOverlay(
    "Sẵn sàng chưa? 🐱",
    "Mun đang đứng dưới mưa trái tim. Giúp mèo hứng thật nhiều nhé!",
    "Bắt đầu"
  );

  return { start, state };
})();

/* ── Cào phiếu quà ──────────────────────── */
(function scratchCard() {
  const canvas = $("#scratch");
  const sctx = canvas.getContext("2d");
  const box = $("#scratchBox");
  let size = { w: 0, h: 0 };
  let scratching = false;
  let last = null;
  let revealed = false;
  let moves = 0;
  let resizeTimer = null;

  function paint() {
    const r = box.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = { w: r.width, h: r.height };
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.globalCompositeOperation = "source-over";

    const grad = sctx.createLinearGradient(0, 0, r.width, r.height);
    grad.addColorStop(0, "#ff8fb1");
    grad.addColorStop(0.35, "#ffd3e3");
    grad.addColorStop(0.62, "#ff9dbe");
    grad.addColorStop(1, "#ffc07a");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, r.width, r.height);

    // lấp lánh
    for (let i = 0; i < 46; i++) {
      sctx.fillStyle = `rgba(255,255,255,${rand(0.25, 0.8).toFixed(2)})`;
      const rad = rand(1, 3);
      sctx.beginPath();
      sctx.arc(rand(0, r.width), rand(0, r.height), rad, 0, Math.PI * 2);
      sctx.fill();
    }

    sctx.textAlign = "center";
    sctx.textBaseline = "middle";
    sctx.shadowColor = "rgba(255,255,255,.95)";
    sctx.shadowBlur = 10;
    sctx.fillStyle = "#a3284f";
    sctx.font = "700 17px Quicksand, system-ui, sans-serif";
    sctx.fillText("Cào nhẹ để mở quà 💗", r.width / 2, r.height / 2 - 8);
    sctx.font = "600 12px Quicksand, system-ui, sans-serif";
    sctx.fillStyle = "#8a3a58";
    sctx.fillText("dùng chuột hoặc ngón tay", r.width / 2, r.height / 2 + 20);
    sctx.shadowBlur = 0;
    sctx.shadowColor = "transparent";

    revealed = false;
    canvas.style.display = "block";
    canvas.style.opacity = "1";
    canvas.style.pointerEvents = "auto";
  }

  function pointFrom(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function erase(from, to) {
    sctx.globalCompositeOperation = "destination-out";
    sctx.lineWidth = 52;
    sctx.lineCap = "round";
    sctx.lineJoin = "round";
    sctx.beginPath();
    sctx.moveTo(from.x, from.y);
    sctx.lineTo(to.x, to.y);
    sctx.stroke();
    sctx.beginPath();
    sctx.arc(to.x, to.y, 26, 0, Math.PI * 2);
    sctx.fill();
  }

  function progress() {
    const data = sctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 16) {
      total++;
      if (data[i] < 40) cleared++;
    }
    return total ? cleared / total : 0;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    canvas.style.transition = "opacity .5s ease";
    canvas.style.opacity = "0";
    canvas.style.pointerEvents = "none";
    setTimeout(() => {
      canvas.style.display = "none";
    }, 520);
    confetti(45);
    Audio.pluck(1046.5, 0.2);
    setTimeout(() => Audio.pluck(1318.5, 0.15), 140);
    toast("Món quà đã mở! Nhớ đổi lại bằng một cái ôm nhé 💗");
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (revealed) return;
    scratching = true;
    last = pointFrom(e);
    erase(last, last);
    canvas.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!scratching || revealed) return;
    const p = pointFrom(e);
    erase(last || p, p);
    last = p;
    moves++;
    if (moves % 12 === 0 && progress() > 0.55) reveal();
    e.preventDefault();
  });

  const stop = () => {
    scratching = false;
    last = null;
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  canvas.addEventListener("pointerleave", stop);

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!revealed) paint();
    }, 180);
  });

  paint();
})();

/* ── Lời khen ngẫu nhiên ────────────────── */
(function compliments() {
  const el = $("#compliment");
  const btn = $("#complimentBtn");
  const list = [
    "Em là người duy nhất khiến anh vừa muốn nghiêm túc cả đời, vừa muốn trêu đến khi em cười.",
    "Em thông minh hơn em nghĩ, mạnh mẽ hơn em thấy, và đáng yêu hơn em tưởng rất nhiều.",
    "Nếu hôm nay em chỉ làm được một việc, thì việc đó là làm anh thương em thêm một chút.",
    "Cười của em là thứ anh muốn giữ trong túi áo, để lấy ra mỗi khi ngày dài quá.",
    "Em không cần phải hoàn hảo. Em chỉ cần là em, thế là đủ làm anh mê rồi.",
    "Anh thích cách em quan tâm đến những điều nhỏ xíu. Thế giới cần thêm người như em.",
    "Có em, mấy ngày bình thường bỗng có lý do để mong chờ.",
    "Em là phiên bản đẹp nhất của một buổi chiều thứ Bảy mà anh từng biết.",
    "Anh không hứa làm em cười mỗi ngày. Nhưng anh hứa sẽ cố, kể cả khi em đang giận.",
    "Nếu được chọn lại, anh vẫn chọn em. Và chọn thêm một con mèo nữa, chắc em cũng đồng ý nhỉ?",
  ];
  let lastIndex = -1;

  btn.addEventListener("click", () => {
    let i = Math.floor(Math.random() * list.length);
    if (i === lastIndex) i = (i + 1) % list.length;
    lastIndex = i;
    el.classList.add("swap");
    setTimeout(() => {
      el.textContent = list[i];
      el.classList.remove("swap");
    }, 220);
    heartBurst(window.innerWidth / 2, el.getBoundingClientRect().top + 20, 4);
    Audio.pluck(587.33, 0.08);
  });
})();

$("#confettiBtn").addEventListener("click", () => {
  confetti(110);
  Audio.pluck(783.99, 0.12);
  setTimeout(() => Audio.pluck(1046.5, 0.1), 120);
  toast("Pháo hoa cho em, mỗi ngày một ít 🎉");
});

/* ── Hiệu ứng xuất hiện khi cuộn ────────── */
(function revealOnScroll() {
  const targets = document.querySelectorAll(
    ".section-head, .envelope, .cards-grid, .filmstrip-scroll, .game-wrap, .scratch-box, .wish-card"
  );
  if (!("IntersectionObserver" in window)) return;

  targets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((el) => io.observe(el));
})();

/* ── Chạm nhẹ để chào ───────────────────── */
setTimeout(() => toast("Chúc em 20/10 thật vui 💗 Bấm vào chú mèo nhé!"), 1800);
