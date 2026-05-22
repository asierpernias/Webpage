// script.js
const canvas = document.querySelector(".starfield");
const ctx = canvas.getContext("2d");

const cards = document.querySelectorAll(".card");
const revealElements = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll("nav a");

let stars = [];
let width = 0;
let height = 0;
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  const totalStars = Math.min(90, Math.floor(width / 16));

  stars = Array.from({ length: totalStars }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.6,
    speed: Math.random() * 0.25 + 0.08,
    glow: Math.random() * 0.5 + 0.35
  }));
}

function drawStarfield() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach((star, index) => {
    const driftX = (mouseX - width / 2) * 0.0008 * (index % 4);
    const driftY = (mouseY - height / 2) * 0.0008 * (index % 4);

    star.y += star.speed;
    star.x += driftX;

    if (star.y > height + 10) {
      star.y = -10;
      star.x = Math.random() * width;
    }

    ctx.beginPath();
    ctx.arc(star.x + driftX, star.y + driftY, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(31, 122, 77, ${star.glow})`;
    ctx.fill();

    const next = stars[index + 1];

    if (next) {
      const distance = Math.hypot(star.x - next.x, star.y - next.y);

      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(50, 115, 220, ${0.16 - distance / 1000})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawStarfield);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, {
  threshold: 0.18
});

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 80, 300)}ms`;
  revealObserver.observe(element);
});

cards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    card.style.setProperty("--shine-x", `${x}px`);
    card.style.setProperty("--shine-y", `${y}px`);
    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

window.addEventListener("scroll", () => {
  const fromTop = window.scrollY + 120;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));

    if (!section) return;

    const isActive =
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop;

    link.classList.toggle("active", isActive);
  });
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawStarfield();