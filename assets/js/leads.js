/*!
 * leads.js — FutEducation (Optimized)
 * Fixes: toast timing, preloader flash, validation flow, DOMContentLoaded race
 */

(function () {
  "use strict";

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0C7wXxqWm3Asn704kiGuiCDZwrSZ_ntZAlH89AJzudlseAZSciMXqnZMuxMm66nKG/exec";

  /* ============================================================
     TOAST — self-injected so it works regardless of fetch timing
  ============================================================ */

  const TOAST_CLASSES = {
    success:    "bg-success",
    error:      "bg-danger",
    duplicate:  "bg-warning",
    submitting: "bg-info",
  };

  function ensureToast() {
    if (document.getElementById("liveToast")) return; // already exists

    const container = document.createElement("div");
    container.style.cssText = "position:fixed;top:20px;right:20px;z-index:99999;min-width:280px;max-width:360px;";
    container.innerHTML = `
      <div id="liveToast" class="toast align-items-center text-white border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body fw-semibold" id="toastMessage" style="font-size:14px;padding:14px 16px;"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    document.body.appendChild(container);
  }

  function showToast(message, type = "success") {
    ensureToast();

    const toastEl      = document.getElementById("liveToast");
    const toastMessage = document.getElementById("toastMessage");

    // Swap color class
    toastEl.classList.remove(...Object.values(TOAST_CLASSES));
    toastEl.classList.add(TOAST_CLASSES[type] || TOAST_CLASSES.success);

    toastMessage.innerText = message;

    // Force-hide any existing instance first so back-to-back toasts always show
    const instance = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 });
    instance.hide();
    requestAnimationFrame(() => instance.show());
  }

  /* ============================================================
     VALIDATION HELPERS
  ============================================================ */

  const REGEX = {
    phone: /^[6-9]\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name:  /^[A-Za-z ]{3,}$/,
  };

  // Returns error string or null if valid
  function validate(formData) {
    const phone   = (formData.get("phone")   || "").trim();
    const email   = (formData.get("email")   || "").trim();
    const name    = (formData.get("name")    || "").trim();
    const message = (formData.get("message") || "").trim();

    if (!phone || !REGEX.phone.test(phone))
      return "Enter a valid 10-digit Indian mobile number.";

    if (email && !REGEX.email.test(email))
      return "Enter a valid email address.";

    if (name && !REGEX.name.test(name))
      return "Name must contain only letters (min 3 characters).";

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
     FORM HANDLER — bound immediately, no DOMContentLoaded needed
     (leads.js loads after DOM is parsed, elements already exist)
  ============================================================ */

  function bindForms() {
    document.querySelectorAll(".lead-form, [data-type='lead']").forEach((form) => {

      // Prevent double-binding on dynamic re-injects
      if (form.dataset.leadsBound === "true") return;
      form.dataset.leadsBound = "true";

      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector("[type='submit']");
        const formData  = new FormData(form);

        /* ── 1. Validate first, before any loading state ── */
        const error = validate(formData);
        if (error) {
          showToast(error, "error");
          return; // Nothing disabled, nothing to reset
        }

        /* ── 2. Show loading THEN submitting toast ── */
        setLoading(submitBtn, true);
        showToast("Submitting your request...", "submitting");

        /* ── 3. Append metadata ── */
        formData.append("type",   form.dataset.type || "lead");
        formData.append("page",   window.location.href);
        formData.append("source", window.location.hostname);

        /* ── 4. Submit ── */
        try {
          const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Server error " + response.status);

          const result = await response.json();

          if (result.success) {
            showToast(result.message || "Submitted successfully ✅", "success");
            form.reset();
          } else if (result.type === "duplicate") {
            showToast(result.message || "This number is already submitted.", "duplicate");
          } else {
            showToast(result.message || "Submission failed. Please try again.", "error");
          }

        } catch (err) {
          console.warn("Lead form error:", err);
          showToast("Server not responding. Please try again.", "error");
        } finally {
          /* ── 5. Always re-enable, even if fetch throws ── */
          setLoading(submitBtn, false);
        }

      });
    });
  }

  // Bind immediately — DOM is ready when leads.js executes
  bindForms();

  // Also expose for pages that inject forms dynamically (e.g. via fetch)
  window.initLeadForms = bindForms;

})();