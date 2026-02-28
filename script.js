// ============================================
// Cloud & DevOps Portfolio — Futuristic Scripts
// ============================================

// ---- Cloud Network Canvas Background ----
// Floating cloud nodes with pipeline connections (DevOps-themed)

const cloudCanvas = document.getElementById("cloud-canvas");

if (cloudCanvas) {
  const ctx = cloudCanvas.getContext("2d");
  let cloudNodes = [];
  let pipelines = [];

  function resizeCanvas() {
    cloudCanvas.width = window.innerWidth;
    cloudCanvas.height = window.innerHeight;
  }

  // Cloud node shapes: small hexagons, circles, diamonds
  const nodeShapes = ["circle", "hexagon", "diamond"];

  class CloudNode {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * cloudCanvas.width;
      this.y = Math.random() * cloudCanvas.height;
      this.size = Math.random() * 3 + 1.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.shape = nodeShapes[Math.floor(Math.random() * nodeShapes.length)];
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.01 + Math.random() * 0.02;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulsePhase += this.pulseSpeed;

      if (this.x < -20) this.x = cloudCanvas.width + 20;
      if (this.x > cloudCanvas.width + 20) this.x = -20;
      if (this.y < -20) this.y = cloudCanvas.height + 20;
      if (this.y > cloudCanvas.height + 20) this.y = -20;
    }

    draw() {
      const isDark = document.body.classList.contains("dark");
      const pulse = Math.sin(this.pulsePhase) * 0.15 + 0.85;
      const finalOpacity = this.opacity * pulse;
      const baseColor = isDark ? [0, 255, 166] : [0, 150, 100];

      ctx.save();
      ctx.globalAlpha = finalOpacity;
      ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
      ctx.translate(this.x, this.y);

      if (this.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === "hexagon") {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = Math.cos(angle) * this.size;
          const py = Math.sin(angle) * this.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Animated pipeline segments flowing between nodes
  class Pipeline {
    constructor(nodeA, nodeB) {
      this.nodeA = nodeA;
      this.nodeB = nodeB;
      this.progress = 0;
      this.speed = 0.003 + Math.random() * 0.005;
      this.active = true;
    }

    update() {
      this.progress += this.speed;
      if (this.progress > 1) {
        this.progress = 0;
      }
    }

    draw() {
      const isDark = document.body.classList.contains("dark");
      const dx = this.nodeB.x - this.nodeA.x;
      const dy = this.nodeB.y - this.nodeA.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 200) return;

      const lineOpacity = (1 - dist / 200) * 0.12;

      // Static connection line
      ctx.beginPath();
      ctx.moveTo(this.nodeA.x, this.nodeA.y);
      ctx.lineTo(this.nodeB.x, this.nodeB.y);
      ctx.strokeStyle = isDark
        ? `rgba(0, 255, 166, ${lineOpacity})`
        : `rgba(0, 120, 80, ${lineOpacity * 0.7})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Flowing data packet along the pipeline
      const packetX = this.nodeA.x + dx * this.progress;
      const packetY = this.nodeA.y + dy * this.progress;
      const packetOpacity = lineOpacity * 3;

      ctx.beginPath();
      ctx.arc(packetX, packetY, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(115, 255, 225, ${packetOpacity})`
        : `rgba(0, 200, 130, ${packetOpacity})`;
      ctx.fill();
    }
  }

  function initCloudNetwork() {
    cloudNodes = [];
    pipelines = [];
    const nodeCount = Math.min(
      Math.floor((cloudCanvas.width * cloudCanvas.height) / 14000),
      100
    );

    for (let i = 0; i < nodeCount; i++) {
      cloudNodes.push(new CloudNode());
    }

    // Create pipelines between nearby nodes
    for (let i = 0; i < cloudNodes.length; i++) {
      for (let j = i + 1; j < cloudNodes.length; j++) {
        const dx = cloudNodes[i].x - cloudNodes[j].x;
        const dy = cloudNodes[i].y - cloudNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && Math.random() < 0.3) {
          pipelines.push(new Pipeline(cloudNodes[i], cloudNodes[j]));
        }
      }
    }
  }

  function animateCloudNetwork() {
    ctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);

    // Draw connections/pipelines
    pipelines.forEach((p) => {
      p.update();
      p.draw();
    });

    // Also draw dynamic connections between nearby nodes
    for (let i = 0; i < cloudNodes.length; i++) {
      for (let j = i + 1; j < cloudNodes.length; j++) {
        const dx = cloudNodes[i].x - cloudNodes[j].x;
        const dy = cloudNodes[i].y - cloudNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const isDark = document.body.classList.contains("dark");
          const opacity = (1 - dist / 150) * 0.08;
          ctx.beginPath();
          ctx.moveTo(cloudNodes[i].x, cloudNodes[i].y);
          ctx.lineTo(cloudNodes[j].x, cloudNodes[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(255, 90, 112, ${opacity})`
            : `rgba(180, 50, 70, ${opacity * 0.5})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    cloudNodes.forEach((node) => {
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

// ---- DOM References ----

const nav = document.querySelector(".nav");
const navMenu = document.querySelector(".nav-items");
const btnToggleNav = document.querySelector(".menu-btn");
const workEls = document.querySelectorAll(".work-box");
const workImgs = document.querySelectorAll(".work-img");
const mainEl = document.querySelector("main");
const yearEl = document.querySelector(".footer-text span");

// ---- Navigation Toggle ----

const toggleNav = () => {
  nav.classList.toggle("hidden");
  document.body.classList.toggle("lock-screen");

  if (nav.classList.contains("hidden")) {
    btnToggleNav.textContent = "menu";
  } else {
    setTimeout(() => {
      btnToggleNav.textContent = "close";
    }, 475);
  }
};

btnToggleNav.addEventListener("click", toggleNav);

navMenu.addEventListener("click", (e) => {
  if (e.target.localName === "a") {
    toggleNav();
  }
});

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !nav.classList.contains("hidden")) {
    toggleNav();
  }
});

// ---- Work Scroll Animations ----

workImgs.forEach((workImg) => workImg.classList.add("transform"));

let observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    const [textbox, picture] = Array.from(entry.target.children);
    if (entry.isIntersecting) {
      picture.classList.remove("transform");
      Array.from(textbox.children).forEach(
        (el) => (el.style.animationPlayState = "running")
      );
    }
  },
  { threshold: 0.3 }
);

workEls.forEach((workEl) => {
  observer.observe(workEl);
});

// ---- Section Reveal on Scroll ----

const revealSections = document.querySelectorAll(
  ".highlights, .client, .work, .article, .skills, .contact, section:has(.testimonials)"
);

revealSections.forEach((section) => {
  section.classList.add("section-reveal");
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  { threshold: 0.08 }
);

revealSections.forEach((section) => {
  sectionObserver.observe(section);
});

// ---- Deploy Card Staggered Reveal ----

const deployCards = document.querySelectorAll(".deploy-card");

deployCards.forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = `opacity 0.6s ease ${index * 0.18}s, transform 0.6s ease ${index * 0.18}s`;
});

const deployObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

deployCards.forEach((card) => deployObserver.observe(card));

// ---- Deploy Card 3D Tilt on Hover ----

deployCards.forEach((card) => {
  const inner = card.querySelector(".deploy-card-inner");
  if (!inner) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    inner.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    inner.style.transition = "transform 0.5s ease";
  });

  card.addEventListener("mouseenter", () => {
    inner.style.transition = "transform 0.1s ease";
  });
});

// ---- Theme Toggle ----

const switchThemeEl = document.querySelector('input[type="checkbox"]');
const storedTheme = localStorage.getItem("theme");

switchThemeEl.checked = storedTheme === "dark" || storedTheme === null;

switchThemeEl.addEventListener("click", () => {
  const isChecked = switchThemeEl.checked;

  if (!isChecked) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
    switchThemeEl.checked = false;
  } else {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }
});

// ---- Tab Trap ----

const lastFocusedEl = document.querySelector('a[data-focused="last-focused"]');

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && document.activeElement === lastFocusedEl) {
    e.preventDefault();
    btnToggleNav.focus();
  }
});

// ---- Rotating Logos Animation ----

const logosWrappers = document.querySelectorAll(".logo-group");
const sleep = (number) => new Promise((res) => setTimeout(res, number));

logosWrappers.forEach(async (logoWrapper, i) => {
  const logos = Array.from(logoWrapper.children);
  await sleep(1400 * i);
  setInterval(() => {
    let temp = logos[0];
    logos[0] = logos[1];
    logos[1] = logos[2];
    logos[2] = temp;
    logos[0].classList.add("hide", "to-top");
    logos[1].classList.remove("hide", "to-top", "to-bottom");
    logos[2].classList.add("hide", "to-bottom");
  }, 5600);
});

if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Testimonials Toggle ----

const testimonialsToggle = document.querySelector(".testimonials-toggle");
const testimonialsList = document.querySelector(".testimonials");
const extraTestimonials = document.querySelectorAll(".testimonial-extra");

if (testimonialsToggle && testimonialsList) {
  testimonialsToggle.addEventListener("click", () => {
    const isExpanded = testimonialsList.classList.toggle("show-all");

    extraTestimonials.forEach((el) => {
      el.style.display = isExpanded ? "flex" : "none";
    });

    testimonialsToggle.textContent = isExpanded
      ? "Show Less"
      : "Show More Testimonials";
    testimonialsToggle.setAttribute("aria-expanded", String(isExpanded));
  });
}

// ---- Mobile CTA Hide on Contact Visible ----

const mobileCta = document.querySelector(".mobile-cta");
const contactSection = document.querySelector(".contact");

if (mobileCta && contactSection) {
  const ctaObserver = new IntersectionObserver(
    ([entry]) => {
      mobileCta.style.transform = entry.isIntersecting
        ? "translateY(100%)"
        : "translateY(0)";
    },
    { threshold: 0.2 }
  );
  ctaObserver.observe(contactSection);
  mobileCta.style.transition = "transform 0.3s ease";
}

// ---- Highlight Counter Animation ----

const highlightNumbers = document.querySelectorAll(".highlight-number");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)/);

        if (match) {
          const target = parseInt(match[1], 10);
          const suffix = text.replace(match[1], "");
          const duration = 1500;
          const start = performance.now();

          function updateCounter(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
        }

        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

highlightNumbers.forEach((el) => {
  counterObserver.observe(el);
});
