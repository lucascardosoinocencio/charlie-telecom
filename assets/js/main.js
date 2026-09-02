(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const waFloat = document.querySelector("[data-whatsapp-float]");

  // --- Header solid-on-scroll ---
  const onScroll = () => {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle("is-scrolled", scrolled);
    waFloat?.classList.toggle("is-visible", window.scrollY > 360);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Mobile menu ---
  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.toggle("hidden") === false;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // --- One-shot reveal-on-scroll ---
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach((el) => {
      const delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // --- Auto-rotating product photo stacks (service cards) ---
  const ROTATE_MS = 3800;
  document.querySelectorAll("[data-rotator]").forEach((rotator) => {
    const slides = rotator.querySelectorAll("[data-rotator-slide]");
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;

    const show = (next) => {
      slides[index].classList.remove("is-active");
      index = next;
      slides[index].classList.add("is-active");
    };

    const start = () => {
      if (timer) return;
      timer = setInterval(() => show((index + 1) % slides.length), ROTATE_MS);
    };
    const stop = () => {
      clearInterval(timer);
      timer = null;
    };

    start();
    rotator.addEventListener("mouseenter", stop);
    rotator.addEventListener("mouseleave", start);
  });
})();
