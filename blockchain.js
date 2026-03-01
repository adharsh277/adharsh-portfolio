/* ============================================ */
/* Blockchain Projects — Interactive Scripts    */
/* ============================================ */

// ---- Blockchain Network Background ----

const cloudCanvas = document.getElementById("cloud-canvas");

if (cloudCanvas) {
  const ctx = cloudCanvas.getContext("2d");
  let chainNodes = [];
  let dashOffset = 0;
  const NODE_COUNT = 40;
  const MAX_CONNECTION_DISTANCE = 170;

  function resizeCanvas() {
    cloudCanvas.width = window.innerWidth;
    cloudCanvas.height = window.innerHeight;
  }

  class CloudNode {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * cloudCanvas.width;
      this.y = Math.random() * cloudCanvas.height;
      this.size = Math.random() * 2.2 + 1.8;
      this.speedX = (Math.random() - 0.5) * 0.9;
      this.speedY = (Math.random() - 0.5) * 0.9;
      this.opacity = Math.random() * 0.4 + 0.35;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;

      if (this.x < this.size || this.x > cloudCanvas.width - this.size) {
        this.speedX *= -1;
        this.x = Math.max(this.size, Math.min(cloudCanvas.width - this.size, this.x));
      }

      if (this.y < this.size || this.y > cloudCanvas.height - this.size) {
        this.speedY *= -1;
        this.y = Math.max(this.size, Math.min(cloudCanvas.height - this.size, this.y));
      }
    }

    draw() {
      const pulse = Math.sin(this.pulsePhase) * 0.15 + 0.85;
      const finalOpacity = this.opacity * pulse;
      const isDark = document.body.classList.contains("dark");

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(255, 215, 0, ${finalOpacity})`
        : `rgba(173, 111, 0, ${Math.min(finalOpacity, 0.8)})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.6, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(247, 147, 26, ${finalOpacity * 0.14})`
        : `rgba(247, 147, 26, ${finalOpacity * 0.08})`;
      ctx.fill();
    }
  }

  function initCloudNetwork() {
    chainNodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      chainNodes.push(new CloudNode());
    }
  }

  function animateCloudNetwork() {
    ctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
    dashOffset -= 0.55;

    for (let i = 0; i < chainNodes.length; i++) {
      for (let j = i + 1; j < chainNodes.length; j++) {
        const dx = chainNodes[i].x - chainNodes[j].x;
        const dy = chainNodes[i].y - chainNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_CONNECTION_DISTANCE) {
          const isDark = document.body.classList.contains("dark");
          const opacity = (1 - dist / MAX_CONNECTION_DISTANCE) * 0.35;
          const gradient = ctx.createLinearGradient(
            chainNodes[i].x,
            chainNodes[i].y,
            chainNodes[j].x,
            chainNodes[j].y
          );

          if (isDark) {
            gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
            gradient.addColorStop(1, `rgba(247, 147, 26, ${opacity * 0.8})`);
          } else {
            gradient.addColorStop(0, `rgba(173, 111, 0, ${opacity * 0.85})`);
            gradient.addColorStop(1, `rgba(247, 147, 26, ${opacity * 0.75})`);
          }

          ctx.beginPath();
          ctx.moveTo(chainNodes[i].x, chainNodes[i].y);
          ctx.lineTo(chainNodes[j].x, chainNodes[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.65;
          ctx.setLineDash([4, 9]);
          ctx.lineDashOffset = dashOffset;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    chainNodes.forEach((node) => {
      node.update();
      node.draw();
    });

    requestAnimationFrame(animateCloudNetwork);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    initCloudNetwork();
  });

  resizeCanvas();
  initCloudNetwork();
  animateCloudNetwork();
}

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
