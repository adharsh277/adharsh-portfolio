// ============================================
// Cloud & DevOps Portfolio — Futuristic Scripts
// ============================================

// ---- Blockchain Network Canvas Background ----
// 40 floating nodes with bounce physics and flowing gold connections

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
