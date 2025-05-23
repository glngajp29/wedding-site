// =======================
// 1. Countdown Timer
// =======================
const targetDate = new Date("31 May, 2025 09:00:00").getTime();
const timerElement = document.getElementById("timer");

setInterval(() => {
  const now = new Date().getTime();
  let distance = targetDate - now;
  if (distance < 0) distance = 0;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const sec = Math.floor((distance % (1000 * 60)) / 1000);

  timerElement.innerHTML = `
    <div class="time-box"><div class="number">${String(days).padStart(2, '0')}</div><div class="label">Hari</div></div>
    <div class="time-box"><div class="number">${String(hrs).padStart(2, '0')}</div><div class="label">Jam</div></div>
    <div class="time-box"><div class="number">${String(min).padStart(2, '0')}</div><div class="label">Menit</div></div>
    <div class="time-box"><div class="number">${String(sec).padStart(2, '0')}</div><div class="label">Detik</div></div>
  `;
}, 1000);

// =======================
// 2. Modal Galeri Foto
// =======================
function openModal(img) {
  document.getElementById("imgModal").style.display = "block";
  document.getElementById("modalImg").src = img.src;
}
function closeModal() {
  document.getElementById("imgModal").style.display = "none";
}

// =======================
// 3. Buka Undangan & Fade Out
// =======================
function openInvitation() {
  const hero = document.getElementById("hero");
  const mainContent = document.getElementById("main-content");

  hero.classList.add("fade-out");
  setTimeout(() => {
    hero.style.display = "none";
    mainContent.style.display = "block";
  }, 1000);
}

// =======================
// 4. Scroll & Tombol Buka
// =======================
document.body.classList.add('noscroll');
const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click', () => {
  document.body.classList.remove('noscroll');
  document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
  openBtn.classList.add('hide');
  setTimeout(() => openBtn.style.display = 'none', 1000);
});

// =======================
// 5. Efek Parallax Hero
// =======================
(() => {
  const hero = document.querySelector('.hero');
  let baseOffset = 0, currentOffset = 0, targetOffset = 0;
  let maxBlur = 5, currentBlur = 0, targetBlur = 0, ticking = false;

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function onScroll() {
    const scrollY = window.pageYOffset;
    targetOffset = baseOffset - scrollY * 0.08;
    targetOffset = Math.max(baseOffset - 100, targetOffset);
    targetBlur = maxBlur * Math.min(scrollY / 2300, 1);
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    currentOffset = lerp(currentOffset, targetOffset, 0.1);
    currentBlur = lerp(currentBlur, targetBlur, 0.1);
    hero.style.backgroundPositionY = `${currentOffset.toFixed(2)}px`;
    hero.style.filter = `blur(${currentBlur.toFixed(2)}px)`;

    if (Math.abs(currentOffset - targetOffset) > 0.2 || Math.abs(currentBlur - targetBlur) > 0.1) {
      requestAnimationFrame(update);
    } else {
      ticking = false;
    }
  }

  document.addEventListener('scroll', onScroll);
})();

// =======================
// 6. Intersection Observer
// =======================
const animateEls = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.1 });

animateEls.forEach(el => observer.observe(el));

// =======================
// 7. Musik Background
// =======================
const bgMusic = document.getElementById('bg-music');
openBtn.addEventListener('click', () => {
  bgMusic.play().catch(() => {
    console.log("Autoplay ditolak. Musik akan mulai setelah interaksi berikutnya.");
  });
});

// =======================
// 8. Firebase Firestore Setup (Tanpa Hosting)
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_pcQQfzF_0khbjwpG_IxTqpdVrXysWSc",
  authDomain: "rayarofiqwedding.firebaseapp.com",
  projectId: "rayarofiqwedding",
  storageBucket: "rayarofiqwedding.appspot.com",
  messagingSenderId: "168418586866",
  appId: "1:168418586866:web:632af302bd422bdbd8e06b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// 9. Form RSVP Komentar
// =======================
const form = document.getElementById("rsvp-form");
const commentSection = document.getElementById("comment-section");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("guest-name").value.trim();
  const message = document.getElementById("guest-message").value.trim();
  const attendance = document.getElementById("guest-attendance").value;

  if (name && message && attendance) {
    await addDoc(collection(db, "comments"), {
      name,
      message,
      attendance,
      timestamp: serverTimestamp()
    });
    form.reset();
    loadComments();
  }
});

async function loadComments() {
  commentSection.innerHTML = "";
  const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const time = data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000) : new Date();
    const formattedTime = time.toLocaleString('id-ID');

    const div = document.createElement("div");
    div.classList.add("comment-card");
    div.innerHTML = `
      <div class="comment-name"><strong>${data.name}</strong> <span class="attendance">(${data.attendance})</span></div>
      <div class="comment-message">${data.message}</div>
      <div class="comment-time">🕒 ${formattedTime}</div>
    `;
    commentSection.appendChild(div);
  });
}

loadComments();

// =======================
// 10. Rekening Hadiah - Toggle & Copy
// =======================
const toggleGiftBtn = document.getElementById("toggleGiftBtn");
const giftDetails = document.getElementById("giftDetails");
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

toggleGiftBtn.addEventListener("click", () => {
  giftDetails.style.display = giftDetails.style.display === "block" ? "none" : "block";
});

copyBtn.onclick = () => {
  const rekeningText = document.getElementById('rekening-number').childNodes[0].nodeValue.trim();
  navigator.clipboard.writeText(rekeningText).then(() => {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });
};

// =======================
// 11. Scroll Animasi On Load
// =======================
const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-animate]');
  const triggerBottom = window.innerHeight * 0.85;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add('animated');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
