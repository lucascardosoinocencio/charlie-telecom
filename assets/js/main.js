(() => {
  "use strict";

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // --- Mobile menu (links stagger in with anime.js when the panel opens) ---
  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.toggle("hidden") === false;
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen && typeof window.anime === "function" && !prefersReducedMotion()) {
      const links = mobileMenu.querySelectorAll("a");
      links.forEach((el) => {
        el.style.opacity = "0";
      });
      window.anime({
        targets: links,
        opacity: [0, 1],
        translateX: [-16, 0],
        duration: 400,
        delay: window.anime.stagger(50),
        easing: "easeOutQuad",
      });
    }
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

            // Draw the section's red kicker line alongside the fade-up, anime.js-powered.
            const line = entry.target.querySelector("[data-kicker-line]");
            if (line) {
              if (typeof window.anime === "function" && !prefersReducedMotion()) {
                window.anime({
                  targets: line,
                  width: ["0rem", "2rem"],
                  duration: 700,
                  delay: 150,
                  easing: "easeOutQuart",
                });
              } else {
                line.style.width = "2rem";
              }
            }

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

  // --- Hero entrance: staggered anime.js timeline on load ---
  const heroItems = document.querySelectorAll("[data-hero-item]");
  if (heroItems.length) {
    if (typeof window.anime === "function" && !prefersReducedMotion()) {
      window.anime({
        targets: heroItems,
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 900,
        delay: window.anime.stagger(130, { start: 200 }),
        easing: "easeOutExpo",
      });
    } else {
      heroItems.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
  }

  // --- Desktop nav links: a quick anime.js pop on hover, layered on the CSS color/border transition ---
  if (typeof window.anime === "function" && !prefersReducedMotion()) {
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        window.anime({
          targets: link,
          scale: [1, 1.06, 1],
          duration: 420,
          easing: "easeOutQuad",
        });
      });
    });
  }

  // --- Footer columns staggered entrance, anime.js ---
  const footerCols = document.querySelector("[data-footer-cols]");
  if (footerCols) {
    const cols = footerCols.querySelectorAll(":scope > div");
    if ("IntersectionObserver" in window) {
      const footerObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (typeof window.anime === "function" && !prefersReducedMotion()) {
              window.anime({
                targets: cols,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                delay: window.anime.stagger(100),
                easing: "easeOutExpo",
              });
            } else {
              cols.forEach((el) => {
                el.style.opacity = "1";
                el.style.transform = "none";
              });
            }
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );
      footerObserver.observe(footerCols);
    } else {
      cols.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
  }

  // --- 3D mousemove tilt on cards, spring-back on leave (all driven by anime.js) ---
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    if (prefersReducedMotion() || typeof window.anime !== "function") return;
    const maxTilt = 8;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      window.anime({
        targets: card,
        rotateX: -py * maxTilt,
        rotateY: px * maxTilt,
        translateY: -4,
        scale: 1.015,
        duration: 400,
        easing: "easeOutQuad",
      });
    });

    card.addEventListener("mouseleave", () => {
      window.anime({
        targets: card,
        rotateX: 0,
        rotateY: 0,
        translateY: 0,
        scale: 1,
        duration: 700,
        easing: "easeOutElastic(1, .7)",
      });
    });
  });

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

  // --- Animated stat counters (Hero credibility numbers), powered by anime.js ---
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const runCounter = (el) => {
      const target = Number(el.getAttribute("data-target"));
      const suffix = el.getAttribute("data-suffix") || "";

      if (typeof window.anime !== "function" || prefersReducedMotion()) {
        el.textContent = `${target}${suffix}`;
        return;
      }

      const counted = { value: 0 };
      window.anime({
        targets: counted,
        value: target,
        duration: 1800,
        easing: "easeOutExpo",
        round: 1,
        update: () => {
          el.textContent = `${counted.value}${suffix}`;
        },
      });
    };

    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  // --- Animated text counter (Hero "Bauru e Região" stat), letter-by-letter reveal ---
  const textCounters = document.querySelectorAll("[data-text-counter]");
  if (textCounters.length) {
    const runTextCounter = (el) => {
      const text = el.getAttribute("data-text") || "";

      if (typeof window.anime !== "function" || prefersReducedMotion()) {
        el.textContent = text;
        return;
      }

      el.textContent = "";
      const letterSpans = [];
      text.split(" ").forEach((word, wordIndex) => {
        if (wordIndex > 0) {
          const space = document.createElement("span");
          space.textContent = " ";
          space.style.display = "inline-block";
          space.style.opacity = "0";
          el.appendChild(space);
          letterSpans.push(space);
        }

        const wordWrapper = document.createElement("span");
        wordWrapper.style.display = "inline-block";
        el.appendChild(wordWrapper);

        [...word].forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          wordWrapper.appendChild(span);
          letterSpans.push(span);
        });
      });

      window.anime({
        targets: letterSpans,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 600,
        delay: window.anime.stagger(35),
        easing: "easeOutExpo",
      });
    };

    if ("IntersectionObserver" in window) {
      const textCounterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runTextCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      textCounters.forEach((el) => textCounterObserver.observe(el));
    } else {
      textCounters.forEach(runTextCounter);
    }
  }

  // --- Visit counter: real count from a hit-counter API, odometer digit roll (anime.js) ---
  const visitCounter = document.querySelector("[data-visit-counter]");
  const visitDigits = document.querySelector("[data-visit-counter-digits]");
  if (visitCounter && visitDigits) {
    const buildOdometer = (numberStr) => {
      visitDigits.innerHTML = "";
      const columns = [];
      for (const ch of numberStr) {
        if (ch < "0" || ch > "9") {
          const staticEl = document.createElement("span");
          staticEl.className = "odometer-col is-static";
          staticEl.textContent = ch;
          visitDigits.appendChild(staticEl);
          continue;
        }
        const col = document.createElement("span");
        col.className = "odometer-col";
        const strip = document.createElement("span");
        strip.className = "odometer-strip";
        for (let d = 0; d <= 9; d++) {
          const digitSpan = document.createElement("span");
          digitSpan.textContent = String(d);
          strip.appendChild(digitSpan);
        }
        col.appendChild(strip);
        visitDigits.appendChild(col);
        columns.push({ strip, target: Number(ch) });
      }
      return columns;
    };

    fetch("https://countapi.mileshilliard.com/api/v1/hit/charlietelecom-site-visitas", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        const value = data && typeof data.value === "number" ? data.value : null;
        if (value === null) throw new Error("no value");

        const columns = buildOdometer(value.toLocaleString("pt-BR"));
        visitCounter.classList.remove("hidden");
        visitCounter.classList.add("is-visible");

        if (typeof window.anime === "function" && !prefersReducedMotion()) {
          columns.forEach(({ strip, target }, i) => {
            window.anime({
              targets: strip,
              translateY: ["0%", `-${target * 10}%`],
              duration: 900,
              delay: 200 + i * 90,
              easing: "easeOutExpo",
            });
          });
        } else {
          columns.forEach(({ strip, target }) => {
            strip.style.transform = `translateY(-${target * 10}%)`;
          });
        }
      })
      .catch(() => {
        // Counting service unavailable: hide the counter rather than show a fake or stuck number.
        visitCounter.remove();
      });
  }
})();
