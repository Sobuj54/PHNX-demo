gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 0. Initialize Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Sync Lenis with ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// 1. Navigation Scroll Effect
ScrollTrigger.create({
  start: "top -50",
  onEnter: () =>
    gsap.to("#navbar", {
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      padding: "16px 0",
      duration: 0.3,
      ease: "power2.out",
    }),
  onLeaveBack: () =>
    gsap.to("#navbar", {
      background: "transparent",
      backdropFilter: "blur(0px)",
      padding: "24px 0",
      duration: 0.3,
      ease: "power2.out",
    }),
});

// 2. Mobile Menu GSAP Logic
const hamburger = document.getElementById("hamburger");
const closeMenu = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-links a");

const menuTL = gsap.timeline({ paused: true });
menuTL
  .set(mobileMenu, { display: "flex" })
  .to(mobileMenu, { opacity: 1, duration: 0.5, ease: "power2.out" })
  .from(
    ".mobile-links a",
    { y: 50, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power4.out" },
    "-=0.3",
  )
  .from(closeMenu, { rotate: -90, opacity: 0, duration: 0.4 }, "-=0.5");

hamburger.addEventListener("click", () => {
  menuTL.play();
  document.body.style.overflow = "hidden";
});

const closeAction = () => {
  menuTL.reverse();
  document.body.style.overflow = "auto";
};

closeMenu.addEventListener("click", closeAction);
mobileLinks.forEach((link) => link.addEventListener("click", closeAction));

// 3. Brand Marquee GSAP (Infinite Scroll)
const track = document.querySelector(".brand-track");
if (track) {
  // Double the content to create a seamless loop
  track.innerHTML += track.innerHTML;

  gsap.to(track, {
    xPercent: -50,
    duration: 30,
    repeat: -1,
    ease: "none",
  });
}

// 4. FAQ Accordion GSAP
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  const icon = q.querySelector("span");
  let isOpen = false;

  q.addEventListener("click", () => {
    if (!isOpen) {
      gsap.to(a, {
        height: "auto",
        paddingTop: 0,
        duration: 0.5,
        ease: "power1.in",
      });
      gsap.to(icon, { rotate: 45, duration: 0.3 });
    } else {
      gsap.to(a, {
        height: 0,
        paddingTop: 0,
        duration: 0.5,
        ease: "power2.in",
      });
      gsap.to(icon, { rotate: 0, duration: 0.3 });
    }
    isOpen = !isOpen;
  });
});

// 5. Section Reveals (Optimized)

// 5a. Scaling Reveal (For Cards)
gsap.utils
  .toArray(
    ".service-card, .reserve-card, .testimonial-card, .protocol-card, .guarantee-card, .value-card, .part-card, .pricing-card",
  )
  .forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      scale: 0.8,
      duration: 1.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(el, { clearProps: "transform" });
      },
    });
  });

// 5b. Standard Reveal (For Non-Card Elements)
gsap.utils
  .toArray(".footer-col, .faq-item, .story-content, .story-image")
  .forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "expo.out",
    });
  });

// 5.1 Stats Count-up Animation
function animateCounter(el, value, suffix = "") {
  let obj = { val: 0 };

  gsap.to(obj, {
    val: value,
    duration: 2,
    ease: "power1.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
    },
    onUpdate: () => {
      el.textContent = Math.floor(obj.val).toLocaleString() + suffix;
    },
  });
}

document.querySelectorAll(".stat-item h3").forEach((el) => {
  const raw = el.getAttribute("data-value");

  if (raw === "14000") animateCounter(el, 14000, "+");
  if (raw === "99.4") animateCounter(el, 99.4, "%");
  if (raw === "45") animateCounter(el, 45, "m");
  if (raw === "1") el.textContent = "Lifetime";

  // New About Page Stats
  if (raw === "100" && el.textContent === "0") {
    const p = el.nextElementSibling.textContent;
    if (p.includes("ISO")) animateCounter(el, 100, "");
    if (p.includes("Privacy")) animateCounter(el, 100, "%");
  }
  if (raw === "42") animateCounter(el, 42, "");
  if (raw === "24") animateCounter(el, 24, "");
});

// 6. Hero Entrance
const heroTL = gsap.timeline();
heroTL
  .from("#h-tag", { opacity: 0, y: 20, duration: 1, ease: "power3.out" })
  .from(
    "#h-title",
    { opacity: 0, y: 40, duration: 1, ease: "power3.out" },
    "-=0.7",
  )
  .from(
    "#h-desc",
    { opacity: 0, y: 20, duration: 1, ease: "power3.out" },
    "-=0.8",
  )
  .from(
    "#h-btn",
    { opacity: 0, y: 10, duration: 1, ease: "power3.out" },
    "-=0.9",
  );

//  card stacking animation
const steps = gsap.utils.toArray(".process-step");

steps.forEach((step, i) => {
  const nextStep = steps[i + 1];

  if (!nextStep) return;

  gsap.to(step, {
    scale: 0.92,
    y: -40,
    scrollTrigger: {
      trigger: nextStep,
      start: "top 80%",
      end: "top 30%",
      scrub: true,
    },
  });
});

// 10. Reserve Slot Smooth Scroll
document.querySelector('a[href="#reserve"]').addEventListener("click", (e) => {
  e.preventDefault();
  lenis.scrollTo("#reserve", {
    offset: -50,
    duration: 1.5,
    easing: gsap.parseEase("expo.out"),
  });
});

// Initialize on load
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
