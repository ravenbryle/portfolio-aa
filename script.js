// script.js

const CONTENT = {
  skills: {
    groups: [
      { title: "Design", items: ["UI Design", "Design Systems", "Accessibility"] },
      { title: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
      { title: "Tools", items: ["Figma", "Git", "VS Code"] },
      { title: "Collaboration", items: ["Documentation", "Reviews", "Systems thinking"] },
    ],
  },

  projects: {
    items: [
      {
        id: "home-pamos",
        title: "PAM OS Homepage",
        category: "Notion",
        company: "Client Name",
        date: "2025-11-01",
        description: "A personal project.",
        tech: ["Notion"],
        links: { live: "https://example.com", github: "https://github.com/" },
        thumbnail: "assets/home-pamos.png",
        modalMedia: "assets/home-pamos.png",
        details: ["Add more details here."],
      },
      {
        id: "kintal-pamos",
        title: "PAM OS Kintal",
        category: "Notion",
        company: "Client Name",
        date: "2025-08-01",
        description: "A personal project.",
        tech: ["Notion"],
        links: { live: "https://example.com", github: "https://github.com/" },
        thumbnail: "assets/kintal-pamos.png",
        modalMedia: "assets/kintal-pamos.png",
        details: ["Add more details here."],
      },
      {
        id: "project-1",
        title: "Project One",
        category: "Other",
        company: "Internal",
        date: "2024-12-15",
        description: "Short description of your project.",
        tech: ["HTML", "CSS", "JS"],
        links: { live: "https://example.com", github: "https://github.com/" },
        thumbnail: "",
        modalMedia: "",
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

/* -----------------------------
   WORK LOGOS MARQUEE
-------------------------------- */
const WORK_LOGOS = [
  { name: "Sutherland", file: "assets/work-logos/1 Sutherland.png" },
  { name: "FTD", file: "assets/work-logos/2 FTD.png" },
  { name: "Startek", file: "assets/work-logos/3 Startek.png" },
  { name: "Credit One", file: "assets/work-logos/4 Credit One.png" },
  { name: "CloudHQ", file: "assets/work-logos/5 CloudHQ.png" },
  { name: "iQor", file: "assets/work-logos/6 iQor.png" },
  { name: "T-Mobile", file: "assets/work-logos/7 T-Mobile.png" },
  { name: "Athena", file: "assets/work-logos/8 Athena.png" },
  { name: "TGC", file: "assets/work-logos/9 TGC.png" },
  { name: "Tenant CS", file: "assets/work-logos/10 Tenant CS.png" },
];

function initWorkMarquee() {
  const track = $("#workMarqueeTrack");
  if (!track) return;

  const oneSet = WORK_LOGOS.map(
    (l) => `
      <div class="marquee-item" aria-label="${escapeHtml(l.name)}">
        <img
          src="${escapeHtml(l.file)}"
          alt="${escapeHtml(l.name)} logo"
          loading="eager"
          decoding="async"
        />
      </div>
    `
  ).join("");

  track.innerHTML = oneSet + oneSet;

  const imgs = $$("img", track);

  function setDistance() {
    const distance = track.scrollWidth / 2;
    track.style.setProperty("--marquee-distance", `${distance}px`);
  }

  let remaining = imgs.length;
  if (!remaining) {
    setDistance();
    return;
  }

  function doneOne() {
    remaining -= 1;
    if (remaining === 0) setDistance();
  }

  imgs.forEach((img) => {
    if (img.complete) {
      doneOne();
      return;
    }
    img.addEventListener("load", doneOne, { once: true });
    img.addEventListener("error", doneOne, { once: true });
  });

  window.addEventListener("resize", setDistance, { passive: true });

  if (prefersReducedMotion()) {
    track.style.animation = "none";
  }
}

/* -----------------------------
   HERO: wire quick links
-------------------------------- */
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

/* -----------------------------
   HERO CAROUSEL
-------------------------------- */
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
        `<button class="dot" type="button" aria-label="Go to slide ${i + 1}" aria-current="${i === 0 ? "true" : "false"}" data-dot="${i}"></button>`
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

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  dots.forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.dot || "0")));
  });

  window.addEventListener("resize", () => update(), { passive: true });
  update();
}

/* -----------------------------
   HERO LOCK
-------------------------------- */
function initHeroLock() {
  const htmlEl = document.documentElement;
  const heroInner = document.querySelector(".hero .hero-inner");
  const unlockBtn = document.querySelector('.scroll-down-btn[href^="#"]');
  const backToTopBtn = document.getElementById("backToTop");

  if (!heroInner || !unlockBtn) return;

  let locked = false;

  function lockHero() {
    locked = true;
    htmlEl.classList.add("hero-locked");
    document.body.style.touchAction = "auto";
  }

  function unlockHero() {
    locked = false;
    htmlEl.classList.remove("hero-locked");
    document.body.style.touchAction = "";
  }

  function isInsideHeroInner(target) {
    return !!(target && target.closest && target.closest(".hero .hero-inner"));
  }

  function initialState() {
    const h = (location.hash || "").toLowerCase();
    if (h && h !== "#top") unlockHero();
    else lockHero();
  }

  initialState();

  window.addEventListener("hashchange", () => {
    const h = (location.hash || "").toLowerCase();
    if (!h || h === "#top") lockHero();
    else unlockHero();
  });

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

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();

      unlockHero();

      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      history.pushState(null, "", "#top");

      window.setTimeout(() => {
        lockHero();
      }, prefersReducedMotion() ? 0 : 350);
    });
  }

  function blockPageScroll(e) {
    if (!locked) return;
    if (isInsideHeroInner(e.target)) return;
    e.preventDefault();
  }

  window.addEventListener("wheel", blockPageScroll, { passive: false });
  window.addEventListener("touchmove", blockPageScroll, { passive: false });

  window.addEventListener("keydown", (e) => {
    if (!locked) return;

    const active = document.activeElement;
    const allow = active && active.closest && active.closest(".hero .hero-inner");
    if (allow) return;

    const keys = ["ArrowDown", "PageDown", "Space", "End", "PageUp", "Home"];
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

/* -----------------------------
   SKILLS + EXPERIENCE
-------------------------------- */
function renderSkills() {
  const grid = $("#skillsGrid");
  if (!grid) return;
  grid.innerHTML = CONTENT.skills.groups
    .map(
      (g) => `
      <div class="card reveal">
        <h3 class="card-title">${escapeHtml(g.title)}</h3>
        <div class="skill-chips" aria-label="${escapeHtml(g.title)} skills">
          ${g.items.map((it) => `<span class="chip">${escapeHtml(it)}</span>`).join("")}
        </div>
      </div>
    `
    )
    .join("");
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

function renderFooter() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

/* -----------------------------
   Modal color extraction
-------------------------------- */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function pickModalColorsFromImage(imgEl) {
  const fallback = {
    bg: "#ebebeb",
    glow1: "rgba(139, 11, 175, 0.28)",
    glow2: "rgba(255, 193, 74, 0.22)",
  };

  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return fallback;

    const W = 48;
    const H = 48;
    c.width = W;
    c.height = H;

    ctx.drawImage(imgEl, 0, 0, W, H);
    const { data } = ctx.getImageData(0, 0, W, H);

    const buckets = new Array(24).fill(0).map(() => ({ count: 0, r: 0, g: 0, b: 0 }));
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 220) continue;

      const { h, s, l } = rgbToHsl(r, g, b);
      if (s < 0.18) continue;
      if (l < 0.08 || l > 0.92) continue;

      const idx = Math.min(23, Math.floor(h * 24));
      const bucket = buckets[idx];
      bucket.count += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
    }

    const ranked = buckets
      .map((b, idx) => ({ ...b, idx }))
      .filter((b) => b.count > 0)
      .sort((a, b) => b.count - a.count);

    if (!ranked.length) return fallback;

    const top1 = ranked[0];
    const top2 = ranked.find((b) => b.idx !== top1.idx) || ranked[0];

    const avg = (b) => ({
      r: Math.round(b.r / b.count),
      g: Math.round(b.g / b.count),
      b: Math.round(b.b / b.count),
    });

    const c1 = avg(top1);
    const c2 = avg(top2);

    const bg = `rgb(${Math.round((c1.r + 235) / 2)}, ${Math.round((c1.g + 235) / 2)}, ${Math.round((c1.b + 235) / 2)})`;
    const glow1 = `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.28)`;
    const glow2 = `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.22)`;

    return { bg, glow1, glow2 };
  } catch {
    return fallback;
  }
}

/* -----------------------------
   Modal logic
-------------------------------- */
let modalLastFocus = null;
let playlistPausedByGallery = false;

function formatMonthYear(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  const mo = d.toLocaleString(undefined, { month: "short" });
  return `${mo} ${d.getFullYear()}`;
}

function openProjectModal(projectId) {
  const modal = $("#projectModal");
  const closeBtn = $("#modalClose");
  const dialog = $("#projectModalDialog");
  if (!modal || !closeBtn || !dialog) return;

  dialog.classList.remove("is-gallery");

  const project = CONTENT.projects.items.find((p) => p.id === projectId);
  if (!project) return;

  modalLastFocus = document.activeElement;

  $("#modalTitle").textContent = project.title;
  $("#modalDesc").textContent = project.description;

  const mediaWrap = $("#modalMedia");
  const src = project.modalMedia || project.thumbnail || "";
  if (mediaWrap) {
    if (src) {
      mediaWrap.innerHTML = `<img id="modalMediaImg" src="${escapeHtml(src)}" alt="${escapeHtml(project.title)} preview" loading="eager" decoding="async" />`;
    } else {
      mediaWrap.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg, rgba(139,11,175,.18), rgba(214,98,248,.12));"></div>`;
    }
  }

  const meta = $("#modalMeta");
  if (meta) {
    const company = project.company ? `<span class="chip">${escapeHtml(project.company)}</span>` : "";
    const skills = (project.tech || []).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
    const date = project.date ? `<span class="chip">${escapeHtml(project.date)}</span>` : "";
    meta.innerHTML = `${company}${skills}${date}`;
  }

  const actions = $("#modalActions");
  if (actions) {
    actions.innerHTML = `
      ${project.links?.live ? `<a class="btn btn-primary" href="${escapeHtml(project.links.live)}" target="_blank" rel="noreferrer">Live</a>` : ""}
      ${project.links?.github ? `<a class="btn btn-ghost" href="${escapeHtml(project.links.github)}" target="_blank" rel="noreferrer">GitHub</a>` : ""}
    `;
  }

  const details = $("#modalDetails");
  if (details) details.innerHTML = (project.details || []).map((d) => `<p style="margin:0 0 10px">${escapeHtml(d)}</p>`).join("");

  const imgEl = $("#modalMediaImg");
  if (imgEl) {
    const apply = () => {
      const { bg, glow1, glow2 } = pickModalColorsFromImage(imgEl);
      dialog.style.setProperty("--modal-bg", bg);
      dialog.style.setProperty("--glow-1", glow1);
      dialog.style.setProperty("--glow-2", glow2);
    };
    if (imgEl.complete) apply();
    else imgEl.addEventListener("load", apply, { once: true });
  }

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  closeBtn.focus();
  document.addEventListener("keydown", onModalKeydown);
}

function openGalleryModal() {
  const modal = $("#projectModal");
  const closeBtn = $("#modalClose");
  const dialog = $("#projectModalDialog");
  if (!modal || !closeBtn || !dialog) return;

  if (!mwPlayer.paused) {
    mwPause();
    playlistPausedByGallery = true;
  } else {
    playlistPausedByGallery = false;
  }

  dialog.classList.add("is-gallery");
  modalLastFocus = document.activeElement;

  $("#modalTitle").textContent = "All Projects";
  $("#modalDesc").textContent = "Click any project to open its full details.";

  $("#modalMeta").innerHTML = "";
  $("#modalActions").innerHTML = "";
  $("#modalMedia").innerHTML = "";

  $("#modalDetails").innerHTML = `
    <div class="mw-gallery">
      ${CONTENT.projects.items
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((p) => {
          const img = p.modalMedia || p.thumbnail || `https://picsum.photos/seed/${encodeURIComponent(p.id)}/1200/720`;
          const sub = `${p.company || "—"} • ${formatMonthYear(p.date)}`;
          return `
            <div class="mw-gcard">
              <button class="mw-gbtn" type="button" data-open-project="${escapeHtml(p.id)}" aria-label="Open ${escapeHtml(p.title)}">
                <div class="mw-gthumb">
                  <img src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" loading="lazy" decoding="async" />
                </div>
                <div class="mw-gbody">
                  <p class="mw-gtitle">${escapeHtml(p.title)}</p>
                  <p class="mw-gsub">${escapeHtml(sub)}</p>
                </div>
              </button>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  dialog.style.setProperty("--modal-bg", "#ebebeb");
  dialog.style.setProperty("--glow-1", "rgba(139,11,175,.22)");
  dialog.style.setProperty("--glow-2", "rgba(255,193,74,.18)");

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  closeBtn.focus();
  document.addEventListener("keydown", onModalKeydown);
}

function closeProjectModal() {
  const modal = $("#projectModal");
  const dialog = $("#projectModalDialog");
  if (!modal) return;

  modal.hidden = true;
  document.body.style.overflow = "";
  document.removeEventListener("keydown", onModalKeydown);

  if (playlistPausedByGallery) {
    mwResume();
    playlistPausedByGallery = false;
  }

  if (dialog) dialog.classList.remove("is-gallery");

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
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
    if (openBtn) openProjectModal(openBtn.getAttribute("data-open-project"));
    if (e.target.matches("[data-close-modal]")) closeProjectModal();
  });
  $("#modalClose")?.addEventListener("click", closeProjectModal);
}

/* -----------------------------
   My Works Playlist
-------------------------------- */
function mwChip(text) {
  return `<span class="mw-chip">${escapeHtml(text)}</span>`;
}

function projectImageForPlaylist(p) {
  const src = p.modalMedia || p.thumbnail;
  if (src && String(src).trim()) return src;
  return `https://picsum.photos/seed/${encodeURIComponent(p.id)}/1200/720`;
}

const mwPlayer = {
  order: [],
  nowId: null,
  rafId: null,
  startedAt: 0,
  elapsed: 0,
  durationMs: 16000,
  paused: false,
};

function renderMyWorksPlaylist() {
  const root = $("#myWorksPlaylist");
  if (!root) return;

  const items = CONTENT.projects.items
    .slice()
    .filter((p) => p.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!items.length) {
    root.innerHTML = `<div style="padding:18px;color:rgba(39,37,37,.72)">Add projects to CONTENT.projects.items to populate My Works.</div>`;
    return;
  }

  mwPlayer.order = items.map((p) => p.id);
  mwPlayer.nowId = items[0].id;
  mwPlayer.elapsed = 0;
  mwPlayer.paused = false;

  root.innerHTML = `
    <div class="mw-playcard" id="mwPlaycard">
      <button class="mw-playbtn" type="button" id="mwPlayOpen" aria-label="Open current project">
        <div class="mw-play-media" id="mwPlayMedia"></div>
      </button>

      <div class="mw-play-body">
        <div class="mw-title-row">
          <h3 class="mw-play-title" id="mwPlayTitle"></h3>
          <button class="mw-nextbtn" type="button" id="mwNextBtn" aria-label="Next">›</button>
        </div>

        <p class="mw-play-meta" id="mwPlayMeta"></p>

        <div class="mw-chips" id="mwPlayTags" aria-label="Project tags"></div>

        <div class="mw-progress" aria-label="Playback progress">
          <div class="mw-bar" aria-hidden="true"><div class="mw-fill" id="mwFill"></div></div>
          <div class="mw-time-row">
            <span id="mwTimeCur">0:00</span>
            <span id="mwTimeDur">0:00</span>
          </div>
        </div>
      </div>
    </div>

    <aside class="mw-queue" aria-label="Up next">
      <div class="mw-q-head">
        <div>
          <p class="mw-q-title">Queue</p>
          <p class="mw-q-count" id="mwQCount"></p>
        </div>

        <div class="mw-q-actions">
          <button class="mw-seeall" type="button" id="mwSeeAll">See All Projects</button>
        </div>
      </div>

      <div class="mw-q-list" id="mwQList"></div>
    </aside>
  `;

  $("#mwPlayOpen")?.addEventListener("click", () => openProjectModal(mwPlayer.nowId));
  $("#mwNextBtn")?.addEventListener("click", () => mwNext());
  $("#mwSeeAll")?.addEventListener("click", () => openGalleryModal());

  mwUpdateNowUI();
  mwRenderQueue();
  mwStart(true);
}

function mwGetProject(id) {
  return CONTENT.projects.items.find((p) => p.id === id) || null;
}

function mwQueueIds() {
  return mwPlayer.order.filter((id) => id !== mwPlayer.nowId);
}

function mwUpdateNowUI() {
  const p = mwGetProject(mwPlayer.nowId);
  if (!p) return;

  const img = projectImageForPlaylist(p);

  $("#mwPlayMedia").innerHTML = `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.title)} preview" loading="eager" decoding="async" />`;
  $("#mwPlayTitle").textContent = p.title;
  $("#mwPlayMeta").textContent = `${p.company || "—"} • ${formatMonthYear(p.date)}`;

  $("#mwPlayTags").innerHTML = `
    ${p.company ? mwChip(p.company) : ""}
    ${(p.tech || []).slice(0, 3).map(mwChip).join("")}
    ${p.date ? mwChip(formatMonthYear(p.date)) : ""}
  `;

  $("#mwTimeDur").textContent = mwMsToTime(mwPlayer.durationMs);
}

function mwRenderQueue() {
  const list = $("#mwQList");
  const count = $("#mwQCount");
  if (!list || !count) return;

  const queue = mwQueueIds().map(mwGetProject).filter(Boolean);
  count.textContent = `${queue.length} items`;

  list.innerHTML = queue
    .map((p) => {
      const img = projectImageForPlaylist(p);
      return `
        <div class="mw-q-item">
          <button class="mw-q-btn" type="button" data-mw-open="${escapeHtml(p.id)}" aria-label="Play ${escapeHtml(p.title)}">
            <div class="mw-q-mini">
              <img src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" loading="lazy" decoding="async" />
            </div>
            <div class="mw-q-main">
              <p class="mw-q-name">${escapeHtml(p.title)}</p>
              <p class="mw-q-sub">${escapeHtml(p.company || "—")} • ${escapeHtml(formatMonthYear(p.date))}</p>
            </div>
          </button>
        </div>
      `;
    })
    .join("");

  list.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("[data-mw-open]");
      if (!btn) return;
      mwJump(btn.getAttribute("data-mw-open"));
    },
    { passive: true }
  );
}

/* Playback */
function mwStart(reset = false) {
  mwStop();
  if (reset) mwPlayer.elapsed = 0;
  mwPlayer.startedAt = performance.now() - mwPlayer.elapsed;
  mwPlayer.paused = false;
  mwTick();
}
function mwStop() {
  if (mwPlayer.rafId) cancelAnimationFrame(mwPlayer.rafId);
  mwPlayer.rafId = null;
}
function mwPause() {
  if (mwPlayer.paused) return;
  mwPlayer.paused = true;
  mwPlayer.elapsed = performance.now() - mwPlayer.startedAt;
  mwStop();
}
function mwResume() {
  if (!mwPlayer.paused) return;
  mwPlayer.paused = false;
  mwStart(false);
}
function mwTick() {
  const now = performance.now();
  const elapsed = now - mwPlayer.startedAt;
  const pct = Math.min(1, elapsed / mwPlayer.durationMs);

  $("#mwFill").style.width = `${pct * 100}%`;
  $("#mwTimeCur").textContent = mwMsToTime(elapsed);

  if (pct >= 1) {
    mwNext();
    return;
  }

  mwPlayer.rafId = requestAnimationFrame(mwTick);
}
function mwMsToTime(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function mwNext() {
  const queue = mwQueueIds();
  if (!queue.length) return;

  const nextId = queue[0];
  const currentId = mwPlayer.nowId;

  mwPlayer.nowId = nextId;

  const newOrder = mwPlayer.order.filter((id) => id !== nextId);
  const withoutCurrent = newOrder.filter((id) => id !== currentId);
  withoutCurrent.push(currentId);

  mwPlayer.order = [mwPlayer.nowId, ...withoutCurrent.filter((id) => id !== mwPlayer.nowId)];

  mwUpdateNowUI();
  mwRenderQueue();
  mwStart(true);
}

function mwJump(id) {
  if (!id || id === mwPlayer.nowId) return;

  const currentId = mwPlayer.nowId;
  mwPlayer.nowId = id;

  const withoutChosen = mwPlayer.order.filter((x) => x !== id);
  const withoutCurrent = withoutChosen.filter((x) => x !== currentId);
  withoutCurrent.push(currentId);

  mwPlayer.order = [mwPlayer.nowId, ...withoutCurrent.filter((x) => x !== mwPlayer.nowId)];

  mwUpdateNowUI();
  mwRenderQueue();
  mwStart(true);
}

/* -----------------------------
   Init
-------------------------------- */
function initBackToTop() {
  $("#backToTop")?.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

function init() {
  renderSkills();
  renderExperience();
  renderFooter();

  initHeroLinks();
  initHeroCarousel();
  initWorkMarquee();

  initHeroLock();
  initRevealOnScroll();
  initBackToTop();

  initProjectModal();
  renderMyWorksPlaylist();
}

document.addEventListener("DOMContentLoaded", init);