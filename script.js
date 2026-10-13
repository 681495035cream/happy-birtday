const nameEl = document.getElementById('name');
const surpriseBtn = document.getElementById('surpriseBtn');
const confettiLayer = document.getElementById('confetti-layer');
const wishForm = document.getElementById('wishForm');
const wishStatus = document.getElementById('wishStatus');
const wishList = document.getElementById('wishList');
const ownerPassInput = document.getElementById('ownerPass');
const showWishesBtn = document.getElementById('showWishesBtn');
const hideWishesBtn = document.getElementById('hideWishesBtn');
const ownerWishes = document.getElementById('ownerWishes');

const names = ['You', 'Bestie', 'Love', 'Sweetheart', 'Princess', 'Star'];
const ownerCode = 'birthday2026';
const storageKey = 'happy-birthday-wishes';
let nameIndex = 0;

setInterval(() => {
  nameIndex = (nameIndex + 1) % names.length;
  nameEl.textContent = names[nameIndex];
}, 1800);

function getWishes() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
}

function saveWishes(wishes) {
  localStorage.setItem(storageKey, JSON.stringify(wishes));
}

function renderWishes() {
  const wishes = getWishes();
  wishList.innerHTML = '';

  if (wishes.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.innerHTML = '<strong>ยังไม่มีคำอธิษฐาน</strong><p>ให้คนที่รักส่งความหวังและคำอวยพรให้กันก่อนนะ</p>';
    wishList.appendChild(emptyItem);
    return;
  }

  wishes.forEach((wish) => {
    const item = document.createElement('li');
    const name = document.createElement('strong');
    const text = document.createElement('p');
    name.textContent = wish.name;
    text.textContent = wish.message;
    item.appendChild(name);
    item.appendChild(text);
    wishList.appendChild(item);
  });
}

function createConfettiBurst() {
  const colors = ['#ff5ea8', '#ffd166', '#6ee7b7', '#8ec5fc', '#c084fc', '#f9a8d4'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--move-x', `${(Math.random() - 0.5) * 260}px`);
    piece.style.animationDuration = `${3 + Math.random() * 2.5}s`;
    piece.style.transform = `scale(${0.8 + Math.random() * 1.6})`;
    confettiLayer.appendChild(piece);

    setTimeout(() => piece.remove(), 5000);
  }
}

wishForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const guestName = document.getElementById('guestName').value.trim();
  const wishText = document.getElementById('wishText').value.trim();

  if (!guestName || !wishText) {
    wishStatus.textContent = 'กรุณากรอกชื่อและคำอธิษฐานให้ครบก่อนส่ง';
    return;
  }

  const wishes = getWishes();
  wishes.unshift({
    name: guestName,
    message: wishText,
    createdAt: new Date().toISOString()
  });
  saveWishes(wishes);

  wishForm.reset();
  createConfettiBurst();
  window.location.href = 'warning.html';
});

showWishesBtn.addEventListener('click', () => {
  const inputPass = ownerPassInput.value.trim();

  if (inputPass !== ownerCode) {
    ownerPassInput.focus();
    ownerPassInput.setAttribute('placeholder', 'รหัสไม่ถูกต้อง ลองใหม่');
    ownerPassInput.value = '';
    return;
  }

  ownerWishes.classList.remove('hidden');
  renderWishes();
});

hideWishesBtn.addEventListener('click', () => {
  ownerWishes.classList.add('hidden');
  ownerPassInput.value = '';
});

surpriseBtn.addEventListener('click', () => {
  createConfettiBurst();

  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const melody = [
      { note: 262, duration: 0.38 },
      { note: 262, duration: 0.38 },
      { note: 294, duration: 0.54 },
      { note: 262, duration: 0.54 },
      { note: 349, duration: 0.54 },
      { note: 330, duration: 0.78 },
      { note: 262, duration: 0.38 },
      { note: 262, duration: 0.38 },
      { note: 294, duration: 0.54 },
      { note: 262, duration: 0.54 },
      { note: 392, duration: 0.54 },
      { note: 349, duration: 0.78 },
      { note: 262, duration: 0.38 },
      { note: 262, duration: 0.38 },
      { note: 523.25, duration: 0.54 },
      { note: 440, duration: 0.54 },
      { note: 349, duration: 0.54 },
      { note: 330, duration: 0.54 },
      { note: 294, duration: 0.82 },
      { note: 392, duration: 0.38 },
      { note: 392, duration: 0.38 },
      { note: 440, duration: 0.54 },
      { note: 349, duration: 0.54 },
      { note: 330, duration: 0.54 },
      { note: 349, duration: 0.82 }
    ];

    const start = audioCtx.currentTime + 0.05;

    melody.forEach((step, index) => {
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const when = start + melody.slice(0, index).reduce((sum, item) => sum + item.duration, 0);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(step.note, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.16, when + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + step.duration * 0.85);

      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start(when);
      oscillator.stop(when + step.duration * 0.9);
    });
  } catch {
    // ignore audio errors in browsers without AudioContext support
  }

  setTimeout(() => createConfettiBurst(), 300);
});

setInterval(createConfettiBurst, 2200);
renderWishes();
