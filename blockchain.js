/* ============================================ */
/* Blockchain Projects — Interactive Scripts    */
/* ============================================ */

// ---- Particle Network Background ----

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null };
let animFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    const isDark = document.body.classList.contains("dark");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? `rgba(0, 255, 166, ${this.opacity})`
      : `rgba(0, 150, 100, ${this.opacity * 0.5})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  const isDark = document.body.classList.contains("dark");
  const maxDist = 150;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = isDark
          ? `rgba(0, 255, 166, ${opacity})`
          : `rgba(0, 120, 80, ${opacity * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  drawConnections();
  animFrameId = requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
animateParticles();

// ---- Stat Counter Animation ----

function animateCounters() {
  const statNumbers = document.querySelectorAll(".bc-stat-number[data-target]");

  statNumbers.forEach((el) => {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });
}

// Use IntersectionObserver to trigger counter when hero is visible
const heroStats = document.querySelector(".bc-hero-stats");
if (heroStats) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(heroStats);
}

// ---- Card Hover Tilt Effect ----

const cards = document.querySelectorAll(".bc-project-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) perspective(1000px) rotateX(0) rotateY(0)";
  });
});

// ---- Scroll Reveal for Cards ----

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach((card) => {
  card.style.animationPlayState = "paused";
  revealObserver.observe(card);
});

// ---- Theme Toggle ----

const themeToggle = document.getElementById("bc-theme-toggle");
const storedTheme = localStorage.getItem("theme");

// Sync checkbox with current theme
themeToggle.checked = storedTheme === "dark" || storedTheme === null;

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
  }
});

// ---- Smooth Nav Background on Scroll ----

const nav = document.querySelector(".bc-nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    nav.style.borderBottomColor = "var(--border-glow)";
  } else {
    nav.style.borderBottomColor = "var(--glass-border)";
  }
});
