/*!
 * main.js - FutEducation (Optimized)
 * UI + Navbar + Schema + NEET Sarthi AI Chatbot (Gemini 1.5 Flash - Free)
 */

(function () {
  "use strict";

  var _body = document.body;

  /* 1. SCROLL & HEADER */
  function toggleScrolled() {
    var header = document.querySelector("#header");
    if (!header) return;
    var sticky = header.classList.contains("scroll-up-sticky") ||
                 header.classList.contains("sticky-top") ||
                 header.classList.contains("fixed-top");
    if (!sticky) return;
    _body.classList.toggle("scrolled", window.scrollY > 100);
  }
  document.addEventListener("scroll", toggleScrolled, { passive: true });
  window.addEventListener("load", toggleScrolled);

  /* 2. PRELOADER */
  window.addEventListener("load", function () {
    var loader = document.getElementById("preloader");
    if (!loader) return;
    loader.style.opacity = "0";
    setTimeout(function () { loader.remove(); }, 400);
  });

  /* 3. SCROLL-TO-TOP */
  var scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn) {
    var toggleScrollTop = function () {
      scrollTopBtn.classList.toggle("active", window.scrollY > 100);
    };
    scrollTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop, { passive: true });
  }

  /* 4. AOS */
  function aosInit() {
    if (typeof AOS === "undefined") return;
    AOS.init({ duration: 600, easing: "ease-in-out", once: true, mirror: false });
  }
  window.addEventListener("load", aosInit);

  /* 5. CAROUSEL INDICATORS */
  document.querySelectorAll(".carousel-indicators").forEach(function (indicator) {
    var carousel = indicator.closest(".carousel");
    if (!carousel) return;
    carousel.querySelectorAll(".carousel-item").forEach(function (item, i) {
      indicator.insertAdjacentHTML("beforeend",
        "<li data-bs-target=\"#" + carousel.id + "\" data-bs-slide-to=\"" + i + "\"" +
        (i === 0 ? " class=\"active\"" : "") + "></li>");
    });
  });

  /* 6. GLIGHTBOX */
  window.addEventListener("load", function () {
    if (typeof GLightbox !== "undefined") GLightbox({ selector: ".glightbox" });
  });

  /* 7. ISOTOPE */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    var layout    = isotopeItem.dataset.layout        || "masonry";
    var filter    = isotopeItem.dataset.defaultFilter || "*";
    var sort      = isotopeItem.dataset.sort          || "original-order";
    var container = isotopeItem.querySelector(".isotope-container");
    if (!container || typeof Isotope === "undefined" || typeof imagesLoaded === "undefined") return;
    var iso;
    imagesLoaded(container, function () {
      iso = new Isotope(container, { itemSelector: ".isotope-item", layoutMode: layout, filter: filter, sortBy: sort });
    });
    isotopeItem.querySelectorAll(".isotope-filters li").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var active = isotopeItem.querySelector(".isotope-filters .filter-active");
        if (active) active.classList.remove("filter-active");
        this.classList.add("filter-active");
        if (iso) iso.arrange({ filter: this.dataset.filter });
        aosInit();
      });
    });
  });

  /* 8. PURE COUNTER */
  window.addEventListener("load", function () {
    if (typeof PureCounter !== "undefined") new PureCounter();
  });

  /* 9. SKILLS PROGRESS BAR */
  document.querySelectorAll(".skills-animation").forEach(function (item) {
    if (typeof Waypoint === "undefined") return;
    new Waypoint({
      element: item,
      offset: "80%",
      handler: function () {
        item.querySelectorAll(".progress .progress-bar").forEach(function (bar) {
          bar.style.width = bar.getAttribute("aria-valuenow") + "%";
        });
      }
    });
  });

  /* 10. SWIPER */
  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".init-swiper").forEach(function (el) {
      var configEl = el.querySelector(".swiper-config");
      if (!configEl) return;
      var config = JSON.parse(configEl.innerHTML.trim());
      if (el.classList.contains("swiper-tab") && typeof initSwiperWithCustomPagination === "function") {
        initSwiperWithCustomPagination(el, config);
      } else {
        new Swiper(el, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /* 11. NAVBAR */

/**
 * =============================================
 *  FIXED & OPTIMIZED NAVBAR — v2.0
 * ============================================= */

(function () {
  "use strict";
  // ── Cached references ──
  var body = document.body;
  var DESKTOP_BP = 1200; // px — must match your CSS @media breakpoint
  var lastWidth = window.innerWidth;

  /**
   * Main init — safe to call multiple times (idempotent).
   */
  window.initNavbar = function initNavbar() {

    // ── 1. Grab elements ──
    var mobileToggle = document.querySelector(".futeducation-mobile-toggle");

    // Try ID first, fall back to class (fixes selector-mismatch bug)
    var navMenu = document.querySelector("#futeducation-navmenu")
               || document.querySelector(".futeducation-navmenu");

    if (!mobileToggle) return; // nothing to do — no toggle in the DOM
    if (mobileToggle.dataset.navReady === "true") return; // already wired
    mobileToggle.dataset.navReady = "true";

    // ── 2. Ensure clean starting state ──
    body.classList.remove("futeducation-mobile-active");
    mobileToggle.classList.remove("bi-x");
    mobileToggle.classList.add("bi-list");

    // ── 3. Create overlay (once) ──
    var overlay = document.querySelector(".futeducation-mobile-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "futeducation-mobile-overlay";
      body.appendChild(overlay);
    }

    // ── 4. Open / Close helpers ──
    function isOpen() {
      return body.classList.contains("futeducation-mobile-active");
    }

    function openMenu() {
      body.classList.add("futeducation-mobile-active");
      mobileToggle.classList.replace("bi-list", "bi-x");
    }

    function closeMenu() {
      body.classList.remove("futeducation-mobile-active");
      mobileToggle.classList.replace("bi-x", "bi-list");

      // Collapse every open dropdown so re-opening the menu is clean
      if (navMenu) {
        navMenu.querySelectorAll(".futeducation-dropdown-active")
          .forEach(function (dd) { dd.classList.remove("futeducation-dropdown-active"); });
      }
    }

    // ── 5. Toggle button ──
    mobileToggle.addEventListener("click", function (e) {
      e.stopPropagation(); // prevent document-level taps from interfering
      isOpen() ? closeMenu() : openMenu();
    });

    // ── 6. Overlay click closes menu ──
    overlay.addEventListener("click", function (e) {
      e.stopPropagation();
      closeMenu();
    });

    // ── 7. Dropdown toggles (MOBILE ONLY) ──
    //    The entire parent <a> acts as the toggle when it contains an <i> arrow.
    //    This fixes the "tap area too narrow" bug.
    if (navMenu) {
      navMenu.addEventListener("click", function (e) {
        if (window.innerWidth >= DESKTOP_BP) return; // desktop uses CSS :hover

        // Did the tap land on (or inside) a dropdown's direct <a>?
        var parentLi = e.target.closest(".futeducation-dropdown");
        if (!parentLi) return;

        // Only intercept the *direct* child link of this dropdown <li>,
        // not links inside the nested <ul>.
        var directLink = parentLi.querySelector(":scope > a");
        var clickedLink = e.target.closest("a");

        if (clickedLink && clickedLink === directLink) {
          e.preventDefault(); // don't navigate — just toggle
          e.stopPropagation();

          // Close sibling dropdowns at the same level (accordion behavior)
          var siblings = parentLi.parentElement
            ? parentLi.parentElement.querySelectorAll(":scope > .futeducation-dropdown-active")
            : [];
          siblings.forEach(function (sib) {
            if (sib !== parentLi) sib.classList.remove("futeducation-dropdown-active");
          });

          parentLi.classList.toggle("futeducation-dropdown-active");
        }
        // If the click was on a *child* link inside the dropdown <ul>,
        // we let it navigate normally (handled below in step 8).
      });
    }

    // ── 8. Close menu when a real (non-dropdown-parent) link is tapped ──
    //    FIX: skip links that are dropdown toggles — they are handled above.
    if (navMenu) {
      navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          if (window.innerWidth >= DESKTOP_BP) return;

          // If this link is the direct child of a .futeducation-dropdown,
          // it's a toggle — do NOT close the menu.
          var parentDropdown = link.closest(".futeducation-dropdown");
          if (parentDropdown) {
            var directLink = parentDropdown.querySelector(":scope > a");
            if (link === directLink) return; // it's a toggle, skip
          }

          // It's a real navigation link → close menu
          closeMenu();
        });
      });
    }

    // ── 9. Active-menu highlighting ──
    if (navMenu) {
      // Priority 1: explicit `activeMenu` JS variable or data-active attribute
      var currentMenu = (typeof activeMenu !== "undefined" && activeMenu)
        ? activeMenu
        : (navMenu.dataset.active || null);

      var activeLink = null;

      if (currentMenu) {
        activeLink = navMenu.querySelector('[data-menu="' + currentMenu + '"]');
      }

      // Priority 2: match by URL pathname
      if (!activeLink) {
        var currentPath = window.location.pathname.replace(/\/+$/, ""); // strip trailing slash
        var bestMatch = null;
        var bestLength = 0;

        navMenu.querySelectorAll("a[href]").forEach(function (a) {
          try {
            var linkPath = new URL(a.href, window.location.origin).pathname.replace(/\/+$/, "");
            // Skip root "/" to avoid matching everything
            if (linkPath === "" || linkPath === "/") return;
            // Longest-match wins (e.g., /courses/neet beats /courses)
            if (currentPath.endsWith(linkPath) && linkPath.length > bestLength) {
              bestMatch = a;
              bestLength = linkPath.length;
            }
          } catch (ex) { /* malformed href, ignore */ }
        });

        activeLink = bestMatch;
      }

      if (activeLink) {
        activeLink.classList.add("active");
        // Walk up and mark parent dropdowns as active too
        var parent = activeLink.closest(".futeducation-dropdown");
        while (parent) {
          parent.classList.add("active");
          var grandparent = parent.parentElement
            ? parent.parentElement.closest(".futeducation-dropdown")
            : null;
          parent = grandparent;
        }
      }
    }

    // ── 10. Resize handler — ONLY fires when crossing the breakpoint ──
    //    FIX: mobile browsers fire `resize` when the address bar hides on
    //    scroll. We now track actual width changes and only act when the
    //    viewport crosses the desktop breakpoint.
    window.addEventListener("resize", function () {
      var newWidth = window.innerWidth;
      if (newWidth === lastWidth) return; // address-bar resize, ignore

      var crossedToDesktop = lastWidth < DESKTOP_BP && newWidth >= DESKTOP_BP;
      lastWidth = newWidth;

      if (crossedToDesktop && isOpen()) {
        closeMenu();
      }
    }, { passive: true });

  }; // end initNavbar

  // ── Auto-init: wait for DOM if needed ──
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.querySelector("#futeducation-navmenu") ||
          document.querySelector(".futeducation-navmenu")) {
        window.initNavbar();
      }
    });
  } else {
    // DOM already ready (script has `defer`, or is at end of <body>)
    if (document.querySelector("#futeducation-navmenu") ||
        document.querySelector(".futeducation-navmenu")) {
      window.initNavbar();
    }
  }

})();

  /* 13. IMAGE FALLBACK */
  var PH = "/assets/img/futeducation.png";
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function onE() {
      this.removeEventListener("error", onE);
      this.style.backgroundImage = "url('" + PH + "')";
      this.style.backgroundSize = "cover"; this.style.backgroundPosition = "center";
      this.style.backgroundRepeat = "no-repeat"; this.style.minHeight = "200px"; this.style.objectFit = "cover";
    });
  });

})();


/* 14. CANONICAL */
(function () {
  try {
    var p = window.location.pathname.toLowerCase();
    if (p.indexOf("/admin") !== -1 || p.indexOf("/login") !== -1) return;
    var url = (window.location.origin + window.location.pathname).replace(/index\.html$/i, "").split("?")[0].split("#")[0].replace(/([^:]\/)\/+/g, "$1");
    var isHome = (url === window.location.origin || url === window.location.origin + "/");
    url = isHome ? window.location.origin + "/" : url.replace(/\/$/, "");
    var ex = document.querySelector("link[rel='canonical']");
    if (ex) { ex.href = url; } else { var lnk = document.createElement("link"); lnk.rel = "canonical"; lnk.href = url; document.head.appendChild(lnk); }
  } catch (e) {}
})();


/* 15. BREADCRUMB JSON-LD */
(function () {
  try {
    var segs = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    if (!segs.length) return;
    var items = [{ "@type": "ListItem", position: 1, name: "Home", item: window.location.origin + "/" }];
    var acc = "";
    segs.forEach(function (s, i) {
      acc += "/" + s;
      items.push({ "@type": "ListItem", position: i + 2, name: s.replace(/-/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); }), item: window.location.origin + acc });
    });
    _injectSchema({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items });
  } catch (e) {}
})();


/* 16. FAQ SCHEMA */
(function () {
  try {
    var qs = document.querySelectorAll(".faq-question"), as = document.querySelectorAll(".faq-answer");
    if (!qs.length) return;
    var items = [];
    qs.forEach(function (q, i) { if (as[i]) items.push({ "@type": "Question", name: q.innerText.trim(), acceptedAnswer: { "@type": "Answer", text: as[i].innerText.trim() } }); });
    if (items.length) _injectSchema({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items });
  } catch (e) {}
})();


/* 17. ORG SCHEMA */
(function () {
  try {
    var p = window.location.pathname;
    if (p !== "/" && p !== "/index.html") return;
    _injectSchema({ "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Future Education", url: "https://neet.futeducation.com/", logo: "https://neet.futeducation.com/assets/img/logo/log.png", description: "NEET UG 2026 medical admission consultancy.", sameAs: ["https://www.instagram.com/futeducation/", "https://www.facebook.com/futureeducationdelhi/"], contactPoint: { "@type": "ContactPoint", telephone: "+91-7303848310", contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Hindi"] }, areaServed: { "@type": "Country", name: "India" } });
  } catch (e) {}
})();


/* 18. ARTICLE SCHEMA */
(function () {
  try {
    var folders = ["/news/", "/neet-ug-2026/", "/ultimate-medical-guide-2026/", "/neet-guide/"];
    if (!folders.some(function (f) { return window.location.pathname.indexOf(f) !== -1; })) return;
    var d = document.querySelector("meta[name='description']");
    _injectSchema({ "@context": "https://schema.org", "@type": "Article", headline: document.title, description: d ? d.content : "", author: { "@type": "Organization", name: "Future Education" }, publisher: { "@type": "Organization", name: "Future Education", logo: { "@type": "ImageObject", url: "https://neet.futeducation.com/assets/img/logo/log.png" } }, mainEntityOfPage: window.location.href, datePublished: document.lastModified, dateModified: document.lastModified });
  } catch (e) {}
})();


/* 19. COLLEGE SCHEMA */
(function () {
  try {
    if (window.location.pathname.indexOf("/colleges/") === -1) return;
    var d = document.querySelector("meta[name='description']");
    _injectSchema({ "@context": "https://schema.org", "@type": "CollegeOrUniversity", name: document.title, url: window.location.href, description: d ? d.content : "", educationalCredentialAwarded: "MBBS Degree", address: { "@type": "PostalAddress", addressCountry: "India" } });
  } catch (e) {}
})();


/* 20. COURSE SCHEMA */
(function () {
  try {
    var p = window.location.pathname;
    if (p.indexOf("mbbs") === -1 && p.indexOf("bds") === -1 && p.indexOf("ayush") === -1) return;
    var d = document.querySelector("meta[name='description']");
    _injectSchema({ "@context": "https://schema.org", "@type": "Course", name: document.title, description: d ? d.content : "", provider: { "@type": "EducationalOrganization", name: "Future Education", url: "https://neet.futeducation.com/" } });
  } catch (e) {}
})();


/* 21. MEDICAL SERVICE SCHEMA */
(function () {
  try {
    if (window.location.pathname.indexOf("/counselling/") === -1) return;
    _injectSchema({ "@context": "https://schema.org", "@type": "MedicalBusiness", name: "Future Education NEET Counselling", url: window.location.href, medicalSpecialty: "Medical Education Consultancy", areaServed: "India" });
  } catch (e) {}
})();


/* 22. REVIEW SCHEMA */
(function () {
  try {
    if (window.location.pathname.indexOf("/testimonials") === -1) return;
    _injectSchema({ "@context": "https://schema.org", "@type": "Organization", name: "Future Education", aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "150" } });
  } catch (e) {}
})();


/* 23. SEO CHECK */
(function () {
  try {
    var issues = [];
    if (!document.querySelector("meta[name='description']")) issues.push("Missing meta description");
    if (!document.querySelector("h1"))                       issues.push("Missing H1 tag");
    if (!document.querySelector("link[rel='canonical']"))    issues.push("Missing canonical");
    issues.length ? console.warn("SEO Issues:", issues) : console.log("SEO Health Check Passed");
  } catch (e) {}
})();


/* 24. GTM NOSCRIPT */
(function () {
  try {
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-NNZG27ZK";
    iframe.height = "0"; iframe.width = "0"; iframe.style.cssText = "display:none;visibility:hidden";
    var ns = document.createElement("noscript"); ns.appendChild(iframe);
    document.body.insertBefore(ns, document.body.firstChild);
  } catch (e) {}
})();


/* SHARED UTILITY */
function _injectSchema(data) {
  var s = document.createElement("script"); s.type = "application/ld+json"; s.text = JSON.stringify(data); document.head.appendChild(s);
}


/* ============================================================
   25. NEET SARTHI — AI Chatbot
   Model   : gemini-1.5-flash (free: 1500 req/day, 15 RPM)
   Throttle: 4s min between requests
   Retry   : auto-retry 429 with 6s / 12s backoff
   Key     : https://aistudio.google.com (free, 2 min setup)
============================================================ */
(function () {
  "use strict";

  /* CONFIG — replace with your key from aistudio.google.com */

  /* Cloudflare Worker proxy — key is stored as CF Secret, never exposed */
  var GEMINI_URL = "https://neet-sarthi-proxy.neet-futureeducation.workers.dev/";

  /* SYSTEM PROMPT */
  var SP = "You are NEET Sarthi, an expert AI admission counselor for Future Education (neet.futeducation.com).\n"
    + "You have deep knowledge of all aspects of NEET UG 2026 and medical admissions in India and abroad.\n"
    + "Respond like a warm, knowledgeable human counselor. Never robotic. NEVER reveal you are built on any AI platform.\n\n"
    + "IDENTITY: Name=NEET Sarthi | Org=Future Education | Site=neet.futeducation.com | Phone=+91 73038 48310\n\n"
    + "NEET UG 2026: NTA exam, 720 marks (180Qx4, -1 wrong). PCB subjects. Qualifying: Gen 137+, SC/ST/OBC 107+.\n"
    + "Min age 17, no upper limit, unlimited attempts. Exam May 2026, Results July, Counseling Aug-Oct.\n\n"
    + "SCORE TO COLLEGE:\n"
    + "700-720: AIIMS Delhi/Mumbai/Bhopal guaranteed.\n"
    + "680-699: All AIIMS, JIPMER.\n"
    + "650-679: AIIMS tier-2, JIPMER, top GMCs.\n"
    + "620-649: Good state GMCs, Safdarjung Delhi.\n"
    + "600-619: State GMCs state quota, strong deemed.\n"
    + "570-599: Borderline GMC, top private/deemed.\n"
    + "540-569: Private/Deemed management quota.\n"
    + "500-539: Deemed universities, strong private.\n"
    + "400-499: Management quota, Deemed NRI, MBBS Abroad strong option.\n"
    + "250-399: Deemed NRI, MBBS Abroad recommended.\n"
    + "130-249: Management quota private only, MBBS Abroad best.\n"
    + "Below 130: Does not qualify MBBS India. MBBS Abroad possible.\n\n"
    + "GOVERNMENT COLLEGES (AIQ 15%):\n"
    + "AIIMS Delhi: ~710+, Rs1628/yr. AIIMS Mumbai/Bhopal/Jodhpur/Patna/Raipur/Rishikesh/Bhubaneswar: 680-700+.\n"
    + "PGIMER Chandigarh: 680+. JIPMER Puducherry: 670+. NIMHANS Bangalore: 650+.\n"
    + "KGMU Lucknow: 620+. BHU Varanasi: 615+. Madras MC: 600+. SGPGIMS: 620+.\n"
    + "Seth GS MC Mumbai: 610+. BJ MC Pune: 595+. VMMC Safdarjung Delhi: 625+.\n\n"
    + "DEEMED UNIVERSITIES:\n"
    + "KMC Manipal: Rs21L/yr, cutoff 500+. KMC Mangalore: Rs19L/yr, cutoff 480+.\n"
    + "DY Patil Pune/Pimpri: Rs18-22L/yr, cutoff 400+. DY Patil Navi Mumbai: Rs20L/yr.\n"
    + "Amrita Kochi/Coimbatore: Rs15-18L/yr. SRIHER Chennai: Rs16L/yr. JSS Mysore: Rs14L/yr.\n"
    + "JNMC Belgaum: Rs13L/yr. Symbiosis Pune: Rs18L/yr. MGM Mumbai/Aurangabad: Rs12-15L/yr.\n"
    + "Bharati Vidyapeeth Pune/Sangli: Rs11-14L/yr. Yenepoya Mangalore: Rs12L/yr.\n"
    + "Kshema Mangalore: Rs11L/yr. SRM Chennai: Rs16L/yr. KIMS/KIIT Bhubaneswar: Rs14L/yr.\n"
    + "Datta Meghe Wardha/Nagpur: Rs12L/yr. MMU Ambala: Rs11L/yr. Hamdard Delhi: Rs14L/yr.\n"
    + "SOA Bhubaneswar: Rs13L/yr. Rural MC Loni: Rs10L/yr. GITAM Visakhapatnam: Rs13L/yr.\n\n"
    + "PRIVATE COLLEGES:\n"
    + "St Johns Bangalore: Rs7L/yr. MS Ramaiah Bangalore: Rs11L/yr. CMC Vellore: Rs3L/yr.\n"
    + "CMC Ludhiana: Rs5L/yr. DMC Ludhiana: Rs8L/yr. PSG Coimbatore: Rs6L/yr.\n"
    + "Chettinad Chennai: Rs10L/yr. Amrita Coimbatore: Rs12L/yr. Sharda Greater Noida: Rs12L/yr.\n\n"
    + "MBBS ABROAD:\n"
    + "Russia: Sechenov, Pirogov, RUDN, Pavlov, Kazan Federal. Fees $4000-8000/yr, 6yrs, English, NMC approved.\n"
    + "Georgia: Tbilisi State, David Tvildiani. $5000-7000/yr. EU-recognized.\n"
    + "Kazakhstan: $3500-5500/yr. Uzbekistan: $3000-4500/yr.\n"
    + "Key: Only qualifying NEET needed. Must clear FMGE/NExT (~15-20% pass rate). 1yr India internship mandatory.\n\n"
    + "COUNSELING: AIQ=15% Govt + 100% AIIMS/JIPMER. Deemed=100% via MCC. State=85%.\n"
    + "Process: Register -> Deposit (Rs10K Gen/Rs5K SC-ST Govt; Rs2L Deemed) -> Choice Fill 50+ -> Allotment -> Report.\n\n"
    + "DOCUMENTS: NEET Admit Card, Scorecard, Class 10&12 marksheets, Aadhar/PAN, 10+ photos,\n"
    + "Category cert, Domicile cert (state quota), Income cert (EWS).\n\n"
    + "RESERVATION: OBC-NCL 27%, SC 15%, ST 7.5%, EWS 10%, PwD 5% horizontal.\n\n"
    + "SERVICE BONDS: Rajasthan 5yrs Rs30L. Maharashtra 1yr Rs10L. MP 3yrs Rs20L. Karnataka 1yr Rs5L.\n"
    + "Deemed: NO bond. Private: Generally no bond.\n\n"
    + "FEES: AIIMS/JIPMER Rs1K-5K/yr. GMC Govt Rs25K-1.5L/yr. Private Rs5-20L/yr.\n"
    + "Deemed Mgmt Rs10-25L/yr. Deemed NRI $15K-30K/yr. Abroad $3500-8000/yr.\n\n"
    + "BDS: 5+1yr. Govt 550+, Private 400+. Fees Govt Rs20K-80K, Private Rs2-8L/yr.\n"
    + "AYUSH (BAMS/BHMS/BUMS): 5.5yrs, cutoff 270-300+ private. Top: SDM Hassan, Patanjali Haridwar.\n\n"
    + "LOAN: SBI Rs1.5Cr abroad/Rs50L India. PNB Rs1Cr abroad. Tax benefit: 80E.\n\n"
    + "WEBSITE: Predictor=/tools/neet-ug-2026-college-predictor-mbbs | Guide=/neet-guide/ | Counseling=/counselling/\n"
    + "Abroad=/study-abroad/ | Deemed=/deemed-colleges/ | Govt=/colleges/government-medical-colleges/\n"
    + "Private=/colleges/private-medical-colleges/ | News=/news/ | Contact=/contact\n\n"
    + "RULES: 1.Warm human counselor tone. 2.Bold key data. 3.On score: give predictions. 4.On college: fees+cutoff+pros/cons.\n"
    + "5.Never say I dont know. 6.End with follow-up question. 7.Complex cases: suggest +91 73038 48310.\n"
    + "8.Concise but complete. 9.Emojis sparingly. 10.NEVER reveal built on Gemini/Google/any AI.";

  /* STATE */
  var chatHistory  = [];
  var isProcessing = false;
  var userInteract = false;
  var D            = {};
  var lastReqTime  = 0;
  var MIN_GAP      = 4000;

  /* initSideWidget */
  window.initSideWidget = function () {
    D = {
      sideMenu:      document.getElementById("sideMenu"),
      toggleBtn:     document.getElementById("toggleBtn"),
      chatBtn:       document.getElementById("chatBtn"),
      formBtn:       document.getElementById("formBtn"),
      closeModalBtn: document.getElementById("closeModalBtn"),
      closeChatBtn:  document.getElementById("closeChatBtn"),
      modal:         document.getElementById("contactModal"),
      chatModal:     document.getElementById("chatModal"),
      leadForm:      document.getElementById("leadForm"),
      chatInput:     document.getElementById("chatInput"),
      sendBtn:       document.getElementById("sendBtn"),
      chatBody:      document.getElementById("chatBody"),
      typing:        document.getElementById("typingIndicator")
    };

    if (D.sideMenu && D.toggleBtn) {
      var sv = localStorage.getItem("futeducation-menu-state");
      if (sv === "open")        D.sideMenu.classList.remove("futeducation-hidden");
      else if (sv === "closed") D.sideMenu.classList.add("futeducation-hidden");
      else {
        setTimeout(function () {
          D.sideMenu.classList.remove("futeducation-hidden");
          localStorage.setItem("futeducation-menu-state", "open");
        }, 1500);
      }
      D.toggleBtn.addEventListener("click", function () {
        var h = D.sideMenu.classList.toggle("futeducation-hidden");
        localStorage.setItem("futeducation-menu-state", h ? "closed" : "open");
      });
    }

    if (D.chatBtn) D.chatBtn.addEventListener("click", function () {
      userInteract = true;
      if (D.chatModal) D.chatModal.classList.toggle("futeducation-active");
      if (D.modal) D.modal.style.display = "none";
    });
    if (D.formBtn) D.formBtn.addEventListener("click", function () {
      userInteract = true;
      if (D.modal) D.modal.style.display = "flex";
      if (D.chatModal) D.chatModal.classList.remove("futeducation-active");
    });
    if (D.closeModalBtn) D.closeModalBtn.addEventListener("click", function () { if (D.modal) D.modal.style.display = "none"; });
    if (D.closeChatBtn)  D.closeChatBtn.addEventListener("click",  function () { if (D.chatModal) D.chatModal.classList.remove("futeducation-active"); });

    document.addEventListener("click", function (e) {
      if (D.chatModal && D.chatModal.classList.contains("futeducation-active") &&
          !D.chatModal.contains(e.target) && D.chatBtn && !D.chatBtn.contains(e.target)) {
        D.chatModal.classList.remove("futeducation-active");
      }
      if (D.modal && e.target === D.modal) D.modal.style.display = "none";
    });

    setTimeout(function () {
      if (!userInteract && D.modal && D.modal.style.display !== "flex" &&
          D.chatModal && !D.chatModal.classList.contains("futeducation-active")) {
        D.modal.style.display = "flex";
      }
    }, 20000);

    if (D.leadForm) D.leadForm.addEventListener("submit", function () {
      setTimeout(function () { if (D.modal) D.modal.style.display = "none"; D.leadForm.reset(); }, 1000);
    });

    if (D.chatInput) D.chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && !isProcessing) { e.preventDefault(); sendMsg(); }
    });
    if (D.sendBtn) D.sendBtn.addEventListener("click", function (e) {
      e.preventDefault(); if (!isProcessing) sendMsg();
    });
  };

  if (document.getElementById("sideMenu")) window.initSideWidget();

  /* Global function — safely opens chat from any button/link on the page */
  window.openNeetChat = function () {
    /* If chatModal not ready yet (footer still loading), retry */
    if (!D.chatModal) {
      setTimeout(window.openNeetChat, 200);
      return;
    }
    D.chatModal.classList.add("futeducation-active");
    if (D.modal) D.modal.style.display = "none";
    userInteract = true;
  };



  /* SEND */
  function sendMsg() {
    if (!D.chatInput || !D.chatBody) return;
    var msg = D.chatInput.value.trim();
    if (!msg) return;
    isProcessing = true;
    bubble(msg, "user");
    D.chatInput.value = "";
    D.chatInput.disabled = true;
    if (D.sendBtn) D.sendBtn.disabled = true;
    typing(true);
    chatHistory.push({ role: "user", parts: [{ text: msg }] });
    var wait = Math.max(0, MIN_GAP - (Date.now() - lastReqTime));
    setTimeout(function () { req(0); }, wait);
  }

  /* GEMINI REQUEST + throttle + retry */
  function req(attempt) {
    lastReqTime = Date.now();
    var body = {
      contents: [
        { role: "user",  parts: [{ text: SP + "\n\nAcknowledge you are ready as NEET Sarthi." }] },
        { role: "model", parts: [{ text: "I am NEET Sarthi from Future Education. Ready to help!" }] }
      ].concat(chatHistory),
      generationConfig: { temperature: 0.7, maxOutputTokens: 800, topP: 0.9 },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    };

    fetch(GEMINI_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then(function (res) {
      if (res.status === 429) {
        if (attempt < 2) {
          var w = (attempt + 1) * 6000;
          console.warn("Gemini 429 - retry " + (attempt + 1) + " in " + (w / 1000) + "s");
          setTimeout(function () { req(attempt + 1); }, w);
          return null;
        }
        throw new Error("quota");
      }
      if (!res.ok) throw new Error("err_" + res.status);
      return res.json();
    })
    .then(function (data) {
      if (!data) return;
      var reply = "";
      try { reply = data.candidates[0].content.parts[0].text; } catch (ex) {}
      if (!reply) reply = "I couldn't process that right now. Please call +91 73038 48310 for help.";
      chatHistory.push({ role: "model", parts: [{ text: reply }] });
      if (chatHistory.length > 32) chatHistory.splice(0, 2);
      typing(false);
      bubble(reply, "bot");
      reset();
    })
    .catch(function (err) {
      console.warn("NEET Sarthi:", err.message);
      typing(false);
      var fb = err.message === "quota"
        ? "Too many requests right now. Please try in a minute or call **+91 73038 48310** — our counselors are available!"
        : "Connection issue. Call **+91 73038 48310** or visit [neet.futeducation.com](https://neet.futeducation.com).";
      bubble(fb, "bot");
      reset();
    });
  }

  function reset() {
    isProcessing = false;
    if (D.chatInput) { D.chatInput.disabled = false; D.chatInput.focus(); }
    if (D.sendBtn)   D.sendBtn.disabled = false;
  }

  function typing(show) {
    if (!D.typing || !D.chatBody) return;
    D.typing.style.display = show ? "block" : "none";
    D.chatBody.scrollTop = D.chatBody.scrollHeight;
  }

  function bubble(text, sender) {
    if (!D.chatBody) return;
    var el = document.createElement("div");
    el.className = "futeducation-chat-bubble futeducation-" + sender;
    el.innerHTML = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline\">$1</a>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
    D.chatBody.appendChild(el);
    D.chatBody.scrollTop = D.chatBody.scrollHeight;
  }

})();
//
/* main.js */

document.addEventListener('DOMContentLoaded', function () {

  /* ── AOS init ─────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }

  /* ── Sticky subnav: highlight active section pill ── */
  const sections = document.querySelectorAll('main section[id]');
  const pills    = document.querySelectorAll('.nf-subnav-inner .nf-nav-pill');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      pills.forEach(p => p.classList.remove('active'));
      const match = document.querySelector(`.nf-nav-pill[href="#${e.target.id}"]`);
      if (match) {
        match.classList.add('active');
        match.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Focus main form input when any "Apply Now" CTA is clicked ── */
  document.querySelectorAll('a[href="#enquiry-form"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const firstInput = document.querySelector('#enquiry-form input:not([type="hidden"])');
      setTimeout(() => { if (firstInput) firstInput.focus(); }, 600);
    });
  });

  /* ── Course card "Apply / Enquire" — populate course select & focus ── */
  document.querySelectorAll('.mnf-course-apply').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card       = btn.closest('.mnf-course-card');
      const courseName = card ? card.querySelector('h4')?.textContent?.trim() : '';
      const sel        = document.getElementById('clf-course');
      if (sel && courseName) {
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text.toLowerCase().includes(courseName.toLowerCase())) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
      const target = document.getElementById('courses-form');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          const fi = target.querySelector('input:not([type="hidden"])');
          if (fi) fi.focus();
        }, 600);
      }
    });
  });

  /* ── Stat pills fade-in on hero scroll ── */
  const statPills = document.querySelectorAll('.nf-stat-pill');
  const pillObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.style.opacity = '1', i * 80);
        pillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  statPills.forEach(p => { p.style.opacity = '0'; pillObs.observe(p); });

  /* ── Quick-bar form: route to leads.js or scroll to main form ── */
  const quickForm = document.getElementById('quick-bar-form');
  if (quickForm) {
    quickForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof handleLeadForm === 'function') {
        handleLeadForm(quickForm);
      } else {
        document.getElementById('enquiry-form')
          ?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});
//