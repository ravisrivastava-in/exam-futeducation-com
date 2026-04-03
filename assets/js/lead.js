/*!
 * leads.js — FutEducation (v3 – Circular Toast + Red Spinning Border)
 * Features: circular overlay toast, Play Store–style red animated border,
 *           motivational text rotation, optimized submission
 */

(function () {
  "use strict";

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxHwQ8EW7ZpRJxI084iqMlcY9NR5A8E2XzU1M3QuBo3T4KG3qLs7Cx9TVXZtjYBncgkrQ/exec";

  /* ============================================================
     MOTIVATIONAL TEXTS — rotate while submitting
  ============================================================ */

  const MOTIVATIONAL_TEXTS = [
    "We Are Future Education 🚀",
    "Our Goal Is To Guide You For A Better Future 🎯",
    "Your Dream Career Starts Here ✨",
    "Transforming Lives Through Education 📚",
    "One Step Closer To Your Goals 🌟",
    "Building Futures, Shaping Dreams 💡",
    "Education Is The Key To Success 🔑",
    "Your Journey Begins Now 🏆",
  ];

  /* ============================================================
     STYLES — injected once
  ============================================================ */

  function injectStyles() {
    if (document.getElementById("lead-toast-styles")) return;

    const style = document.createElement("style");
    style.id = "lead-toast-styles";
    style.textContent = `
      /* ── Overlay ── */
      .lead-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 99998;
        display: none;
        align-items: center;
        justify-content: center;
        animation: leadFadeIn .25s ease;
      }
      .lead-overlay.active { display: flex; }

      /* ── Outer spinning border ring (Play Store style) ── */
      .lead-toast-ring {
        position: relative;
        width: 300px; height: 300px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: leadScaleIn .4s cubic-bezier(.16,1,.3,1);
      }

      /* The animated red conic-gradient border */
      .lead-toast-ring::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        padding: 4px;
        background: conic-gradient(
          #ff1744 0deg,
          #ff5252 60deg,
          #ff8a80 120deg,
          transparent 180deg,
          transparent 360deg
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        animation: leadSpinBorder 1.2s linear infinite;
        opacity: 1;
        transition: opacity .4s ease;
      }

      /* Hide the spinning border for result states */
      .lead-toast-ring.result::before {
        animation: none;
        opacity: 0;
      }

      /* Static subtle border for result states */
      .lead-toast-ring.result::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 3px solid #e0e0e0;
        transition: border-color .3s ease;
      }
      .lead-toast-ring.result.success-ring::after { border-color: #4caf50; }
      .lead-toast-ring.result.error-ring::after   { border-color: #f44336; }
      .lead-toast-ring.result.dup-ring::after      { border-color: #ff9800; }

      /* ── Circular toast card (inner white circle) ── */
      .lead-toast-card {
        width: 280px; height: 280px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 12px 40px rgba(0,0,0,.18);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;
        z-index: 2;
        padding: 30px;
        overflow: hidden;
      }

      /* ── Icon area ── */
      .lead-toast-icon {
        width: 50px; height: 50px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center; justify-content: center;
        margin-bottom: 10px;
        font-size: 24px;
        flex-shrink: 0;
      }
      .lead-toast-icon.submitting { background: #fce4ec; }
      .lead-toast-icon.success    { background: #e8f5e9; }
      .lead-toast-icon.error      { background: #ffebee; }
      .lead-toast-icon.duplicate  { background: #fff8e1; }

      /* ── Message ── */
      .lead-toast-msg {
        font-size: 13px; font-weight: 600;
        color: #1a1a2e; margin-bottom: 4px;
        line-height: 1.35;
        max-width: 200px;
        word-wrap: break-word;
      }

      /* ── Motivational text ── */
      .lead-toast-motive {
        font-size: 11px; font-weight: 600;
        color: #ff1744;
        margin-top: 8px;
        min-height: 30px;
        max-width: 190px;
        line-height: 1.3;
        transition: opacity .3s ease;
      }

      /* ── Close button ── */
      .lead-toast-close {
        position: absolute;
        top: 12px; left: 50%;
        transform: translateX(-50%);
        background: none; border: none;
        font-size: 18px; color: #bbb; cursor: pointer;
        line-height: 1; z-index: 3;
        width: 28px; height: 28px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      }
      .lead-toast-close:hover { color: #333; background: #f5f5f5; }

      /* ── Animations ── */
      @keyframes leadFadeIn    { from { opacity: 0 } to { opacity: 1 } }
      @keyframes leadScaleIn   { from { opacity: 0; transform: scale(.7) } to { opacity: 1; transform: scale(1) } }
      @keyframes leadSpinBorder { to { transform: rotate(360deg) } }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     TOAST — circular centered overlay with spinning red border
  ============================================================ */

  let _overlay, _ring, _card, _icon, _msg, _motive, _closeBtn;
  let _motiveInterval = null;

  function ensureToast() {
    if (_overlay) return;
    injectStyles();

    _overlay = document.createElement("div");
    _overlay.className = "lead-overlay";
    _overlay.innerHTML = `
      <div class="lead-toast-ring" id="ltRing">
        <div class="lead-toast-card">
          <button class="lead-toast-close" aria-label="Close" style="display:none">&times;</button>
          <div class="lead-toast-icon submitting" id="ltIcon">⏳</div>
          <div class="lead-toast-msg" id="ltMsg"></div>
          <div class="lead-toast-motive" id="ltMotive"></div>
        </div>
      </div>`;
    document.body.appendChild(_overlay);

    _ring     = _overlay.querySelector("#ltRing");
    _card     = _overlay.querySelector(".lead-toast-card");
    _icon     = _overlay.querySelector("#ltIcon");
    _msg      = _overlay.querySelector("#ltMsg");
    _motive   = _overlay.querySelector("#ltMotive");
    _closeBtn = _overlay.querySelector(".lead-toast-close");

    _closeBtn.addEventListener("click", hideToast);
    _overlay.addEventListener("click", (e) => {
      if (e.target === _overlay) hideToast();
    });
  }

  const ICON_MAP = {
    submitting: { icon: "⏳", cls: "submitting" },
    success:    { icon: "✅", cls: "success" },
    error:      { icon: "❌", cls: "error" },
    duplicate:  { icon: "⚠️", cls: "duplicate" },
  };

  const RING_CLS = {
    success:   "success-ring",
    error:     "error-ring",
    duplicate: "dup-ring",
  };

  function showToast(message, type = "success") {
    ensureToast();

    const { icon, cls } = ICON_MAP[type] || ICON_MAP.success;

    _icon.textContent = icon;
    _icon.className = "lead-toast-icon " + cls;
    _msg.textContent = message;

    // Reset ring classes
    _ring.classList.remove("result", "success-ring", "error-ring", "dup-ring");

    if (type === "submitting") {
      // Spinning red border active, motivational text visible
      _motive.style.display = "block";
      _closeBtn.style.display = "none";
      startMotivationalRotation();
    } else {
      // Stop spinning, show static colored border
      stopMotivationalRotation();
      _motive.style.display = "none";
      _closeBtn.style.display = "flex";
      _ring.classList.add("result");
      if (RING_CLS[type]) _ring.classList.add(RING_CLS[type]);
      // Auto-close result toasts after 4s
      setTimeout(hideToast, 4000);
    }

    _overlay.classList.add("active");
  }

  function hideToast() {
    if (!_overlay) return;
    stopMotivationalRotation();
    _overlay.classList.remove("active");
  }

  /* ── Motivational text rotation ── */

  function startMotivationalRotation() {
    let idx = 0;
    _motive.textContent = MOTIVATIONAL_TEXTS[0];
    _motive.style.opacity = "1";

    if (_motiveInterval) clearInterval(_motiveInterval);
    _motiveInterval = setInterval(() => {
      idx = (idx + 1) % MOTIVATIONAL_TEXTS.length;
      _motive.style.opacity = "0";
      setTimeout(() => {
        _motive.textContent = MOTIVATIONAL_TEXTS[idx];
        _motive.style.opacity = "1";
      }, 300);
    }, 2200);
  }

  function stopMotivationalRotation() {
    if (_motiveInterval) {
      clearInterval(_motiveInterval);
      _motiveInterval = null;
    }
  }

  /* ============================================================
     VALIDATION HELPERS
  ============================================================ */

  const REGEX = {
    phone: /^[6-9]\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name:  /^[A-Za-z ]{3,}$/,
  };

  function validate(formData) {
    const phone   = (formData.get("phone")   || "").trim();
    const email   = (formData.get("email")   || "").trim();
    const name    = (formData.get("name")    || "").trim();
    const message = (formData.get("message") || "").trim();
    const country = (formData.get("country") || "").trim();

    // Name is always required
    if (!name || !REGEX.name.test(name))
      return "Name must contain only letters (min 3 characters).";

    // Country is required if the dropdown exists
    if (formData.has("country") && !country)
      return "Please select your location (India or Abroad).";

    if (country === "abroad") {
      // ABROAD: email is mandatory, phone is fully optional
      if (!email)
        return "Email address is required for international students.";
      if (!REGEX.email.test(email))
        return "Enter a valid email address.";
      if (phone && !(/^\+?[\d\s\-()]{7,15}$/).test(phone))
        return "Enter a valid phone number.";
    } else {
      // INDIA: BOTH phone AND email are mandatory
      if (!phone || !REGEX.phone.test(phone))
        return "Enter a valid 10-digit Indian mobile number (starting with 6-9).";
      if (!email)
        return "Email address is required.";
      if (!REGEX.email.test(email))
        return "Enter a valid email address.";
    }

    if (message && message.split(/\s+/).filter(Boolean).length < 3)
      return "Message must contain at least 3 words.";

    return null;
  }

  /* ============================================================
     STATE HELPERS
  ============================================================ */

  function setLoading(submitBtn, on) {
    const preloader = document.getElementById("preloader");
    if (submitBtn) submitBtn.disabled = on;
    if (preloader) preloader.style.display = on ? "flex" : "none";
  }

  /* ============================================================
     FORM HANDLER
  ============================================================ */

  function bindForms() {
    document.querySelectorAll(".lead-form, [data-type='lead']").forEach((form) => {
      if (form.dataset.leadsBound === "true") return;
      form.dataset.leadsBound = "true";

      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector("[type='submit']");
        const formData  = new FormData(form);

        /* ── 1. Validate ── */
        const error = validate(formData);
        if (error) {
          showToast(error, "error");
          return;
        }

        /* ── 2. Show loading + spinning circle overlay ── */
        setLoading(submitBtn, true);
        showToast("Submitting your request...", "submitting");

        /* ── 3. Append metadata ── */
        formData.append("type",   form.dataset.type || "lead");
        formData.append("page",   window.location.href);
        formData.append("source", window.location.hostname);

        /* ── 4. Submit with AbortController timeout ── */
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!response.ok) throw new Error("Server error " + response.status);

          const result = await response.json();

          // Brief pause so the spinning feels intentional
          await new Promise((r) => setTimeout(r, 350));

          if (result.success) {
            showToast(result.message || "Submitted successfully! We'll reach out soon. ✅", "success");
            form.reset();
          } else if (result.type === "duplicate") {
            showToast(result.message || "This number is already registered with us.", "duplicate");
          } else {
            showToast(result.message || "Submission failed. Please try again.", "error");
          }
        } catch (err) {
          clearTimeout(timeout);
          console.warn("Lead form error:", err);

          const msg = err.name === "AbortError"
            ? "Request timed out. Please check your connection."
            : "Server not responding. Please try again.";
          showToast(msg, "error");
        } finally {
          setLoading(submitBtn, false);
        }
      });
    });
  }

  // Bind immediately
  bindForms();

  // Expose for dynamically injected forms
  window.initLeadForms = bindForms;
})();

// /*!
//  * leads.js — FutEducation (Optimized)
//  * Fixes: toast timing, preloader flash, validation flow, DOMContentLoaded race
//  */

// (function () {
//   "use strict";

//   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5wFdXZvuufVDFNhN4KHIzcNMMgY5rx20syB--9cc2vg84uRAp97MOa0nkfbeoxZk62w/exec";

//   /* ============================================================
//      TOAST — self-injected so it works regardless of fetch timing
//   ============================================================ */

//   const TOAST_CLASSES = {
//     success:    "bg-success",
//     error:      "bg-danger",
//     duplicate:  "bg-warning",
//     submitting: "bg-info",
//   };

//   function ensureToast() {
//     if (document.getElementById("liveToast")) return; // already exists

//     const container = document.createElement("div");
//     container.style.cssText = "position:fixed;top:20px;right:20px;z-index:99999;min-width:280px;max-width:360px;";
//     container.innerHTML = `
//       <div id="liveToast" class="toast align-items-center text-white border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
//         <div class="d-flex">
//           <div class="toast-body fw-semibold" id="toastMessage" style="font-size:14px;padding:14px 16px;"></div>
//           <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//         </div>
//       </div>`;
//     document.body.appendChild(container);
//   }

//   function showToast(message, type = "success") {
//     ensureToast();

//     const toastEl      = document.getElementById("liveToast");
//     const toastMessage = document.getElementById("toastMessage");

//     // Swap color class
//     toastEl.classList.remove(...Object.values(TOAST_CLASSES));
//     toastEl.classList.add(TOAST_CLASSES[type] || TOAST_CLASSES.success);

//     toastMessage.innerText = message;

//     // Force-hide any existing instance first so back-to-back toasts always show
//     const instance = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 });
//     instance.hide();
//     requestAnimationFrame(() => instance.show());
//   }

//   /* ============================================================
//      VALIDATION HELPERS
//   ============================================================ */

//   const REGEX = {
//     phone: /^[6-9]\d{9}$/,
//     email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     name:  /^[A-Za-z ]{3,}$/,
//   };

//   // Returns error string or null if valid
//   function validate(formData) {
//     const phone   = (formData.get("phone")   || "").trim();
//     const email   = (formData.get("email")   || "").trim();
//     const name    = (formData.get("name")    || "").trim();
//     const message = (formData.get("message") || "").trim();

//     if (!phone || !REGEX.phone.test(phone))
//       return "Enter a valid 10-digit Indian mobile number.";

//     if (email && !REGEX.email.test(email))
//       return "Enter a valid email address.";

//     if (name && !REGEX.name.test(name))
//       return "Name must contain only letters (min 3 characters).";

//     if (message && message.split(/\s+/).filter(Boolean).length < 3)
//       return "Message must contain at least 3 words.";

//     return null;
//   }

//   /* ============================================================
//      STATE HELPERS
//   ============================================================ */

//   function setLoading(submitBtn, on) {
//     const preloader = document.getElementById("preloader");
//     if (submitBtn) submitBtn.disabled = on;
//     if (preloader) preloader.style.display = on ? "flex" : "none";
//   }

//   /* ============================================================
//      FORM HANDLER — bound immediately, no DOMContentLoaded needed
//      (leads.js loads after DOM is parsed, elements already exist)
//   ============================================================ */

//   function bindForms() {
//     document.querySelectorAll(".lead-form, [data-type='lead']").forEach((form) => {

//       // Prevent double-binding on dynamic re-injects
//       if (form.dataset.leadsBound === "true") return;
//       form.dataset.leadsBound = "true";

//       form.addEventListener("submit", async function (e) {
//         e.preventDefault();

//         const submitBtn = form.querySelector("[type='submit']");
//         const formData  = new FormData(form);

//         /* ── 1. Validate first, before any loading state ── */
//         const error = validate(formData);
//         if (error) {
//           showToast(error, "error");
//           return; // Nothing disabled, nothing to reset
//         }

//         /* ── 2. Show loading THEN submitting toast ── */
//         setLoading(submitBtn, true);
//         showToast("Submitting your request...", "submitting");

//         /* ── 3. Append metadata ── */
//         formData.append("type",   form.dataset.type || "lead");
//         formData.append("page",   window.location.href);
//         formData.append("source", window.location.hostname);

//         /* ── 4. Submit ── */
//         try {
//           const response = await fetch(SCRIPT_URL, {
//             method: "POST",
//             body: formData,
//           });

//           if (!response.ok) throw new Error("Server error " + response.status);

//           const result = await response.json();

//           if (result.success) {
//             showToast(result.message || "Submitted successfully ✅", "success");
//             form.reset();
//           } else if (result.type === "duplicate") {
//             showToast(result.message || "This number is already submitted.", "duplicate");
//           } else {
//             showToast(result.message || "Submission failed. Please try again.", "error");
//           }

//         } catch (err) {
//           console.warn("Lead form error:", err);
//           showToast("Server not responding. Please try again.", "error");
//         } finally {
//           /* ── 5. Always re-enable, even if fetch throws ── */
//           setLoading(submitBtn, false);
//         }

//       });
//     });
//   }

//   // Bind immediately — DOM is ready when leads.js executes
//   bindForms();

//   // Also expose for pages that inject forms dynamically (e.g. via fetch)
//   window.initLeadForms = bindForms;

// })();