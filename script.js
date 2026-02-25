// script.js

const CONTENT = {
  about: {
    body: [
      "I design and build interfaces that are simple, fast, and inclusive.",
      "I care about motion that feels intentional, and UI that stays readable and clean.",
    ],
    facts: [
      { term: "Location", detail: "Philippines" },
      { term: "Focus", detail: "Design + Frontend" },
      { term: "Style", detail: "Clean, accessible, modern" },
    ],
  },

  skills: {
    groups: [
      { title: "Design", items: ["UI Design", "Design Systems", "Accessibility"] },
      { title: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
      { title: "Tools", items: ["Figma", "Git", "VS Code"] },
      { title: "Collaboration", items: ["Documentation", "Reviews", "Systems thinking"] },
    ],
  },

  projects: {
    filters: ["All", "Web", "UI", "Other"],
    items: [
      // 1) FIRST IN CAROUSEL
      {
        id: "home-pamos",
        title: "PAM OS Homepage",
        category: "Notion",
        description: "A personal project.",
        tech: ["Notion"],
        links: { live: "https://example.com", github: "https://github.com/" },
        thumbnail: "assets/home-pamos.png", // <-- put file in /assets
        details: ["Add more details here."],
      },

      // 2) SECOND IN CAROUSEL
      {
        id: "kintal-pamos",
        title: "PAM OS Kintal",
        category: "Notion",
        description: "A personal project.",
        tech: ["Notion"],
        links: { live: "https://example.com", github: "https://github.com/" },
        thumbnail: "assets/kintal-pamos.png", // <-- put file in /assets
        details: ["Add more details here."],
      },

      // Your existing project (now third)
      {
        id: "project-1",
        title: "Project One",
        category: "Other",
        description: "Short description of your project.",
        tech: ["HTML", "CSS", "JS"],
        links: { live: "https://example.com", github: "https://github.com/" },
        thumbnail: "",
        details: ["Add more details here."],
      },
    ],
  },

  experience: {
    items: [
      {
        role: "Role Title",
        company: "Company",
        period: "2023 — Present",
        location: "Remote",
        bullets: ["Impact bullet one", "Impact bullet two"],
      },
    ],
  },

  testimonials: {
    enabled: true,
    items: [
      { quote: "Raven is sharp and detail-oriented.", name: "Someone", title: "Role" },
      { quote: "Clean work and great taste.", name: "Another", title: "Role" },
    ],
  },

  contact: {
    email: "you@example.com",
    socials: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ],
  },
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Renderers */
function renderAbout() {
  const body = $("#aboutBody");
  const facts = $("#aboutFacts");
  if (body) body.innerHTML = CONTENT.about.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  if (facts) {
    facts.innerHTML = CONTENT.about.facts
      .map(
        (f) => `
        <div>
          <dt>${escapeHtml(f.term)}</dt>
          <dd>${escapeHtml(f.detail)}</dd>
        </div>
      `
      )
      .join("");
  }
}

function renderSkills() {
  const grid = $("#skillsGrid");
  if (!grid) return;
  grid.innerHTML = CONTENT.skills.groups
    .map(
      (g) => `
      <div class="card reveal skill-group">
        <h3 class="card-title">${escapeHtml(g.title)}</h3>
        <div class="skill-chips" aria-label="${escapeHtml(g.title)} skills">
          ${g.items.map((it) => `<span class="chip">${escapeHtml(it)}</span>`).join("")}
        </div>
      </div>
    `
    )
    .join("");
}

function projectCardTemplate(p) {
  const techTags = (p.tech || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  const media = p.thumbnail
    ? `<img src="${escapeHtml(p.thumbnail)}" alt="${escapeHtml(p.title)} thumbnail" loading="lazy" decoding="async" />`
    : `<div style="width:100%;height:100%;background:linear-gradient(135deg, rgba(139,11,175,.18), rgba(214,98,248,.12));"></div>`;

  return `
    <article class="card project-card fade-in" data-project data-category="${escapeHtml(p.category)}" data-id="${escapeHtml(p.id)}">
      <div class="project-media">
        ${media}
      </div>
      <div class="project-content">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="tags" aria-label="Tech tags">${techTags}</div>
        <div class="project-actions project-open">
          <button class="btn btn-primary" type="button" data-open-project="${escapeHtml(p.id)}">View details</button>
          <div class="project-actions">
            ${p.links?.live ? `<a class="btn btn-ghost" href="${escapeHtml(p.links.live)}" target="_blank" rel="noreferrer">Live</a>` : ""}
            ${p.links?.github ? `<a class="btn btn-ghost" href="${escapeHtml(p.links.github)}" target="_blank" rel="noreferrer">GitHub</a>` : ""}
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderProjectFilters() {
  const wrap = $("#projectFilters");
  if (!wrap) return;
  wrap.innerHTML = CONTENT.projects.filters
    .map((f, idx) => {
      const selected = idx === 0 ? "true" : "false";
      return `<button class="filter-btn" type="button" role="tab" aria-selected="${selected}" data-filter="${escapeHtml(f)}">${escapeHtml(f)}</button>`;
    })
    .join("");
}

function renderProjects(items) {
  const grid = $("#projectsGrid");
  if (!grid) return;
  const list = items || CONTENT.projects.items;
  grid.innerHTML = list.map(projectCardTemplate).join("");
}

function renderExperience() {
  const list = $("#experienceTimeline");
  if (!list) return;
  list.innerHTML = CONTENT.experience.items
    .map(
      (x) => `
      <li class="card reveal timeline-item">
        <div class="timeline-top">
          <p class="timeline-role">${escapeHtml(x.role)} • ${escapeHtml(x.company)}</p>
          <p class="timeline-meta">${escapeHtml(x.period)} • ${escapeHtml(x.location)}</p>
        </div>
        <ul class="timeline-bullets">
          ${(x.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
      </li>
    `
    )
    .join("");
}

function renderTestimonials() {
  const section = $("#testimonials");
  const grid = $("#testimonialsGrid");
  if (!section || !grid) return;

  if (!CONTENT.testimonials.enabled) {
    section.style.display = "none";
    return;
  }

  grid.innerHTML = CONTENT.testimonials.items
    .map(
      (t) => `
      <figure class="card reveal">
        <blockquote class="quote">“${escapeHtml(t.quote)}”</blockquote>
        <figcaption class="cite">— ${escapeHtml(t.name)}, ${escapeHtml(t.title)}</figcaption>
      </figure>
    `
    )
    .join("");
}

function renderContact() {
  const social = $("#contactSocial");
  const emailRow = $("#contactEmailRow");
  if (social) {
    social.innerHTML = CONTENT.contact.socials
      .map(
        (s) => `
      <li>
        <a href="${escapeHtml(s.href)}" target="_blank" rel="noreferrer">
          <span>${escapeHtml(s.label)}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </li>
    `
      )
      .join("");
  }
  if (emailRow) {
    emailRow.innerHTML = `Email: <a href="mailto:${escapeHtml(CONTENT.contact.email)}">${escapeHtml(CONTENT.contact.email)}</a>`;
  }
}

function renderFooter() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

/* HERO: wire quick links from CONTENT */
function initHeroLinks() {
  const emailLink = $('.hero-icon-link[aria-label="Email"]');
  const linkedInLink = $('.hero-icon-link[aria-label="LinkedIn"]');

  if (emailLink && CONTENT.contact.email) {
    emailLink.setAttribute("href", `mailto:${CONTENT.contact.email}`);
  }
  if (linkedInLink) {
    const li = CONTENT.contact.socials.find((s) => s.label.toLowerCase() === "linkedin");
    if (li?.href) linkedInLink.setAttribute("href", li.href);
  }
}

/* HERO CAROUSEL (uses CONTENT.projects.items) */
function slideTemplate(p) {
  const tags = (p.tech || []).slice(0, 4).map((t) => `<span class="slide-tag">${escapeHtml(t)}</span>`).join("");

  const media = p.thumbnail
    ? `<div class="slide-media"><img src="${escapeHtml(p.thumbnail)}" alt="${escapeHtml(p.title)} preview" loading="lazy" decoding="async" /></div>`
    : `<div class="slide-media placeholder-media" aria-hidden="true"><span class="placeholder-badge">Project image</span></div>`;

  return `
    <article class="carousel-slide" data-slide-id="${escapeHtml(p.id)}">
      ${media}
      <div class="slide-body">
        <h3 class="slide-title">${escapeHtml(p.title)}</h3>
        <p class="slide-desc">${escapeHtml(p.description)}</p>
        <div class="slide-tags" aria-label="Tech tags">${tags}</div>
      </div>
    </article>
  `;
}

function initHeroCarousel() {
  const root = $("#heroCarousel");
  const dotsWrap = $("#carouselDots");
  const prevBtn = $("#carouselPrev");
  const nextBtn = $("#carouselNext");
  if (!root || !dotsWrap || !prevBtn || !nextBtn) return;

  const items = (CONTENT.projects.items || []).slice(0, 6);
  if (!items.length) return;

  root.innerHTML = `<div class="carousel-track" id="carouselTrack">${items.map(slideTemplate).join("")}</div>`;
  const track = $("#carouselTrack", root);
  if (!track) return;

  dotsWrap.innerHTML = items
    .map(
      (_, i) =>
        `<button class="dot" type="button" aria-label="Go to slide ${i + 1}" aria-current="${
          i === 0 ? "true" : "false"
        }" data-dot="${i}"></button>`
    )
    .join("");

  const dots = $$("[data-dot]", dotsWrap);

  let index = 0;
  let stepPx = 0;

  function measure() {
    const first = track.children[0];
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).gap || "0") || 0;
    stepPx = first.getBoundingClientRect().width + gap;
  }

  function update() {
    measure();
    track.style.transform = `translateX(${-index * stepPx}px)`;
    dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));
  }

  function goTo(i) {
    index = (i + items.length) % items.length;
    update();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  dots.forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.dot || "0")));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const active = document.activeElement;
    const inHero = active && active.closest && active.closest(".hero");
    if (!inHero) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else {
      e.preventDefault();
      next();
    }
  });

  window.addEventListener("resize", () => update(), { passive: true });

  update();
}

/* -----------------------------
   HERO LOCK (no scroll until button)
-------------------------------- */
function initHeroLock() {
  const hero = document.querySelector(".hero");
  const unlockBtn = document.querySelector('.scroll-down-btn[href^="#"]');
  const backToTopBtn = document.getElementById("backToTop");

  if (!hero || !unlockBtn) return;

  let locked = false;

  function lockHero() {
    locked = true;

    // lock scroll
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    // help on iOS Safari
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
  }

  function unlockHero() {
    locked = false;

    document.body.style.overflow = "";
    document.body.style.height = "";

    document.documentElement.style.overflow = "";
    document.documentElement.style.height = "";
  }

  function preventScroll(e) {
    if (!locked) return;

    // Allow interaction with hero controls, but block scroll gestures
    e.preventDefault();
  }

  function initialState() {
    const h = (location.hash || "").toLowerCase();
    if (h && h !== "#top") unlockHero();
    else lockHero();
  }

  // Init
  initialState();

  // Keep state in sync if hash changes (back/forward)
  window.addEventListener("hashchange", () => {
    const h = (location.hash || "").toLowerCase();
    if (!h || h === "#top") lockHero();
    else unlockHero();
  });

  // Unlock ONLY when clicking the hero button, then scroll
  unlockBtn.addEventListener("click", (e) => {
    const href = unlockBtn.getAttribute("href") || "";
    if (!href.startsWith("#")) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    unlockHero();

    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });

    history.pushState(null, "", `#${id}`);
  });

  // Re-lock when clicking Back to top (and set hash to #top)
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      history.pushState(null, "", "#top");

      window.setTimeout(() => {
        lockHero();
      }, prefersReducedMotion() ? 0 : 350);
    });
  }

  // Hard-block scrolling while locked
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });

  // Block common scroll keys while locked
  window.addEventListener("keydown", (e) => {
    if (!locked) return;

    const keys = ["ArrowDown", "PageDown", "Space", "End"];
    if (keys.includes(e.code) || keys.includes(e.key)) {
      e.preventDefault();
    }
  });
}

/* Reveal */
function initRevealOnScroll() {
  const els = $$(".reveal");
  if (!els.length) return;

  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));
}

/* Smooth scroll */
function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    // IMPORTANT: hero button is handled by initHeroLock (so it can unlock first)
    if (a.classList.contains("scroll-down-btn")) return;

    const hash = a.getAttribute("href");
    if (!hash || hash === "#") return;

    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  });
}

/* Projects filtering */
let currentFilter = "All";
let currentSearch = "";

function getFilteredProjects() {
  return CONTENT.projects.items.filter((p) => {
    const matchFilter = currentFilter === "All" ? true : p.category === currentFilter;
    const q = currentSearch.trim().toLowerCase();
    const matchSearch = !q
      ? true
      : (p.title + " " + p.description + " " + (p.tech || []).join(" ")).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
}

function animateGridReplace(nextItems) {
  const grid = $("#projectsGrid");
  if (!grid) return;

  if (prefersReducedMotion()) {
    renderProjects(nextItems);
    initRevealOnScroll();
    return;
  }

  const cards = $$("[data-project]", grid);
  cards.forEach((c) => c.classList.add("fade-out"));
  window.setTimeout(() => {
    renderProjects(nextItems);
    initRevealOnScroll();
  }, 180);
}

function initProjectFiltering() {
  renderProjectFilters();
  renderProjects(CONTENT.projects.items);

  const filters = $$("[data-filter]");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      filters.forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      animateGridReplace(getFilteredProjects());
    });
  });

  $("#projectSearch")?.addEventListener("input", (e) => {
    currentSearch = e.target.value || "";
    animateGridReplace(getFilteredProjects());
  });
}

/* Modal */
let modalLastFocus = null;

function openProjectModal(projectId) {
  const modal = $("#projectModal");
  const closeBtn = $("#modalClose");
  if (!modal || !closeBtn) return;

  const project = CONTENT.projects.items.find((p) => p.id === projectId);
  if (!project) return;

  modalLastFocus = document.activeElement;

  $("#modalTitle").textContent = project.title;
  $("#modalDesc").textContent = project.description;

  const meta = $("#modalMeta");
  if (meta) {
    meta.innerHTML = `
      <span class="tag">${escapeHtml(project.category)}</span>
      ${(project.tech || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
    `;
  }

  const actions = $("#modalActions");
  if (actions) {
    actions.innerHTML = `
      ${
        project.links?.live
          ? `<a class="btn btn-primary" href="${escapeHtml(project.links.live)}" target="_blank" rel="noreferrer">Live</a>`
          : ""
      }
      ${
        project.links?.github
          ? `<a class="btn btn-ghost" href="${escapeHtml(project.links.github)}" target="_blank" rel="noreferrer">GitHub</a>`
          : ""
      }
    `;
  }

  const details = $("#modalDetails");
  if (details) details.innerHTML = (project.details || []).map((d) => `<p>${escapeHtml(d)}</p>`).join("");

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  closeBtn.focus();
  document.addEventListener("keydown", onModalKeydown);
}

function closeProjectModal() {
  const modal = $("#projectModal");
  if (!modal) return;

  modal.hidden = true;
  document.body.style.overflow = "";
  document.removeEventListener("keydown", onModalKeydown);

  if (modalLastFocus && typeof modalLastFocus.focus === "function") modalLastFocus.focus();
}

function onModalKeydown(e) {
  const modal = $("#projectModal");
  if (!modal || modal.hidden) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeProjectModal();
    return;
  }

  if (e.key === "Tab") {
    const focusables = $$(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      modal
    ).filter((el) => !el.hasAttribute("disabled"));

    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function initProjectModal() {
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open-project]");
    if (openBtn) openProjectModal(openBtn.dataset.openProject);
    if (e.target.matches("[data-close-modal]")) closeProjectModal();
  });
  $("#modalClose")?.addEventListener("click", closeProjectModal);
}

/* Contact form validation (UI only) */
function setFieldValidity(fieldEl, isValid) {
  const wrapper = fieldEl.closest(".field");
  if (!wrapper) return;
  wrapper.classList.toggle("is-invalid", !isValid);
}

function initContactForm() {
  const form = $("#contactForm");
  const status = $("#formStatus");
  if (!form || !status) return;

  const name = $("#name");
  const email = $("#email");
  const message = $("#message");
  if (!name || !email || !message) return;

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: (v) => v.trim().length >= 10,
  };

  function validateAll() {
    const vName = validators.name(name.value);
    const vEmail = validators.email(email.value);
    const vMsg = validators.message(message.value);

    setFieldValidity(name, vName);
    setFieldValidity(email, vEmail);
    setFieldValidity(message, vMsg);

    return vName && vEmail && vMsg;
  }

  [name, email, message].forEach((el) => {
    el.addEventListener("blur", validateAll);
    el.addEventListener("input", () => (status.textContent = ""));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = validateAll();
    if (!ok) {
      status.textContent = "Please fix the highlighted fields.";
      return;
    }
    status.textContent = "Thanks! Your message is ready to send (add a backend to deliver it).";
    form.reset();
    [name, email, message].forEach((el) => setFieldValidity(el, true));
  });
}

/* Back to top */
function initBackToTop() {
  // NOTE: Back-to-top locking is handled in initHeroLock()
  $("#backToTop")?.addEventListener("click", (e) => {
    // If initHeroLock is active, we prevent default there already.
    // Keep this as a fallback for safety.
    if (e.defaultPrevented) return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

function init() {
  renderAbout();
  renderSkills();
  renderProjects(CONTENT.projects.items);
  renderExperience();
  renderTestimonials();
  renderContact();
  renderFooter();

  initHeroLinks();
  initHeroCarousel();
  initHeroLock(); // ✅ ADD: lock hero until button is clicked

  initSmoothScroll();
  initRevealOnScroll();
  initProjectFiltering();
  initProjectModal();
  initContactForm();
  initBackToTop();
}

document.addEventListener("DOMContentLoaded", init);
