/* ============================================================
   Devansh Rusiya — portfolio interactions
   Small, dependency-free, progressive.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Nav background + scroll progress ---------- */
  const nav = document.getElementById("nav");
  const progressBar = document.getElementById("progressBar");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 12);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(y / max, 1) : 0;
    progressBar.style.width = `${ratio * 100}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    const menuLinks = [...menu.querySelectorAll("a")];
    let menuOpen = false;

    const setMenu = (open) => {
      menuOpen = open;
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    };

    menuToggle.addEventListener("click", () => setMenu(!menuOpen));
    menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
      if (event.matches && menuOpen) setMenu(false);
    });
  }

  /* ---------- Reveal on enter ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = [...document.querySelectorAll(".nav-links a[data-nav]")];
  const sections = navLinks
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle("is-active", link.dataset.nav === entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Floating project preview ---------- */
  const preview = document.getElementById("workPreview");

  if (preview && finePointer && !reduceMotion) {
    const previewTitle = preview.querySelector(".work-preview-title");
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    let visible = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;

      // Sit just to the right of the cursor, but never leave the viewport.
      const halfWidth = preview.offsetWidth / 2 || 150;
      const centerX = Math.min(
        Math.max(currentX + 32 + halfWidth, halfWidth + 16),
        window.innerWidth - halfWidth - 16
      );

      preview.style.transform =
        `translate(${centerX}px, ${currentY}px) translate(-50%, -50%) scale(${visible ? 1 : 0.94})`;
      rafId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (rafId === null) rafId = requestAnimationFrame(render);
    };

    const show = (item, event) => {
      const title = item.querySelector(".work-heading h3");
      previewTitle.textContent = title ? title.textContent : "";
      preview.style.setProperty("--hue", item.dataset.hue || 265);
      targetX = currentX = event.clientX;
      targetY = currentY = event.clientY;
      visible = true;
      preview.classList.add("is-visible");
      startLoop();
    };

    const hide = () => {
      visible = false;
      preview.classList.remove("is-visible");
    };

    document.querySelectorAll(".work-item").forEach((item) => {
      item.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") return;
        show(item, event);
      });
      item.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        targetX = event.clientX;
        targetY = event.clientY;
      });
      item.addEventListener("pointerleave", hide);
    });

    window.addEventListener("blur", hide);
    document.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copyEmail");

  if (copyBtn) {
    const label = copyBtn.querySelector("span");
    let resetTimer = null;

    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // Fallback for browsers without clipboard permissions.
        const field = document.createElement("textarea");
        field.value = email;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }

      label.textContent = "Copied";
      copyBtn.classList.add("is-copied");
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        label.textContent = "Copy";
        copyBtn.classList.remove("is-copied");
      }, 1800);
    });
  }

  /* ---------- IST clock ---------- */
  const clockEls = [document.getElementById("clock"), document.getElementById("clockFoot")];
  const timeFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const tick = () => {
    const time = timeFormat.format(new Date());
    clockEls.forEach((el) => {
      if (el) el.textContent = time;
    });
  };

  tick();
  setInterval(tick, 15000);

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
