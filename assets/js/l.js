document.addEventListener("DOMContentLoaded", function () {

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzwpx3ntFAJF_HvrnZW_3ibacFrZZ_ZuNb2x4iocblB425HqCKugicA3Mu0I64nSA7I/exec";

  /* =========================
     TOAST HELPER
  ========================= */

  function showToast(message, type = "success") {
    const toastEl = document.getElementById("liveToast");
    const toastMessage = document.getElementById("toastMessage");

    if (!toastEl || !toastMessage) {
      alert(message);
      return;
    }

    toastEl.classList.remove(
      "bg-success",
      "bg-danger",
      "bg-warning",
      "bg-info"
    );

    if (type === "success") toastEl.classList.add("bg-success");
    if (type === "error") toastEl.classList.add("bg-danger");
    if (type === "duplicate") toastEl.classList.add("bg-warning");
    if (type === "submitting") toastEl.classList.add("bg-info");

    toastMessage.innerText = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }

  /* =========================
     FORM HANDLER
  ========================= */

  document.querySelectorAll(".lead-form").forEach((form) => {

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector("[type='submit']");
      const preloader = document.getElementById("preloader");

      if (submitBtn) submitBtn.disabled = true;
      if (preloader) preloader.style.display = "flex";

      const formData = new FormData(form);

      const name = (formData.get("name") || "").trim();
      const email = (formData.get("email") || "").trim();
      const phone = (formData.get("phone") || "").trim();
      const message = (formData.get("message") || "").trim();

      /* =========================
         STRICT FRONTEND VALIDATION
      ========================= */

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phone || !phoneRegex.test(phone)) {
        showToast("Enter valid 10 digit Indian mobile number.", "error");
        return resetState();
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        showToast("Enter a valid email address.", "error");
        return resetState();
      }

      const nameRegex = /^[A-Za-z ]{3,}$/;
      if (name && !nameRegex.test(name)) {
        showToast("Name must contain only letters (min 3 characters).", "error");
        return resetState();
      }

      if (message) {
        const wordCount = message.split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount < 3) {
          showToast("Message must contain at least 3 words.", "error");
          return resetState();
        }
      }

      /* =========================
         ADD REQUIRED DATA
      ========================= */

      formData.append("type", form.dataset.type || "lead");
      formData.append("page", window.location.href);
      formData.append("source", window.location.hostname);

      /* =========================
         SUBMITTING TOAST
      ========================= */

      showToast("Submitting your request...", "submitting");

      try {

        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("Server error");
        }

        const result = await response.json();

        if (result.success) {
          showToast(result.message || "Submitted successfully ✅", "success");
          form.reset();
        } 
        else if (result.type === "duplicate") {
          showToast(result.message || "This number is already submitted.", "duplicate");
        } 
        else {
          showToast(result.message || "Submission failed.", "error");
        }

      } catch (error) {
        showToast("Server not responding. Please try again.", "error");
      }

      resetState();

      function resetState() {
        if (submitBtn) submitBtn.disabled = false;
        if (preloader) preloader.style.display = "none";
      }

    });

  });

});
// /* ==========================================================
//    new navbar that i am working on for all future projects of futeducation one
//    ========================================================== */
//    /* ==========================================================
//    NAVBAR INITIALIZER (Optimized)
// ========================================================== */
// /* ==========================================================
//    FUTEDUCATION NAVBAR (Ultra Optimized Version)
// ========================================================== */
// /* ==========================================================
//    FUTEDUCATION NAVBAR (FINAL OPTIMIZED VERSION)
// ========================================================== */

// (function () {
//   "use strict";

//   document.addEventListener("DOMContentLoaded", () => {

//     const body = document.body;
//     const mobileToggle = document.querySelector(".futeducation-mobile-toggle");
//     const navMenu = document.querySelector("#futeducation-navmenu");

//     if (!mobileToggle) return;

//     /* ===============================
//        PREVENT MULTIPLE INITIALIZATION
//     =============================== */

//     if (mobileToggle.dataset.navReady === "true") return;
//     mobileToggle.dataset.navReady = "true";

//     /* ===============================
//        ENSURE CLEAN INITIAL STATE
//     =============================== */

//     body.classList.remove("futeducation-mobile-active");
//     mobileToggle.classList.remove("bi-x");
//     mobileToggle.classList.add("bi-list");

//     /* ===============================
//        CREATE / GET OVERLAY
//     =============================== */

//     let overlay = document.querySelector(".futeducation-mobile-overlay");

//     if (!overlay) {
//       overlay = document.createElement("div");
//       overlay.className = "futeducation-mobile-overlay";
//       body.appendChild(overlay);
//     }

//     /* ===============================
//        OPEN MENU
//     =============================== */

//     const openMenu = () => {
//       body.classList.add("futeducation-mobile-active");
//       mobileToggle.classList.remove("bi-list");
//       mobileToggle.classList.add("bi-x");
//     };

//     /* ===============================
//        CLOSE MENU
//     =============================== */

//     const closeMenu = () => {
//       body.classList.remove("futeducation-mobile-active");
//       mobileToggle.classList.remove("bi-x");
//       mobileToggle.classList.add("bi-list");
//     };

//     /* ===============================
//        TOGGLE MENU
//     =============================== */

//     const toggleMenu = () => {

//       if (body.classList.contains("futeducation-mobile-active")) {
//         closeMenu();
//       } else {
//         openMenu();
//       }

//     };

//     mobileToggle.addEventListener("click", toggleMenu);
//     overlay.addEventListener("click", closeMenu);

//     /* ===============================
//        MOBILE DROPDOWN SYSTEM
//     =============================== */

//     if (navMenu) {

//       navMenu.addEventListener("click", (e) => {

//         if (window.innerWidth >= 1200) return;

//         const toggleBtn = e.target.closest(".futeducation-toggle-dropdown");
//         if (!toggleBtn) return;

//         e.preventDefault();

//         const parent = toggleBtn.closest(".futeducation-dropdown");

//         if (parent) {
//           parent.classList.toggle("futeducation-dropdown-active");
//         }

//       });

//     }

//     /* ===============================
//        ACTIVE MENU SYSTEM
//     =============================== */

//     const setActiveMenu = () => {

//       if (!navMenu) return;

//       const currentMenu =
//         typeof activeMenu !== "undefined"
//           ? activeMenu
//           : navMenu.dataset.active || null;

//       if (!currentMenu) return;

//       const activeLink = navMenu.querySelector(`[data-menu="${currentMenu}"]`);
//       if (!activeLink) return;

//       activeLink.classList.add("active");

//       let parent = activeLink.closest(".futeducation-dropdown");

//       while (parent) {
//         parent.classList.add("active");
//         parent = parent.parentElement?.closest(".futeducation-dropdown");
//       }

//     };

//     setActiveMenu();

//     /* ===============================
//        AUTO CLOSE MENU ON LINK CLICK
//     =============================== */

//     if (navMenu) {

//       navMenu.querySelectorAll("a").forEach(link => {

//         link.addEventListener("click", () => {

//           if (window.innerWidth < 1200) {
//             closeMenu();
//           }

//         });

//       });

//     }

//     /* ===============================
//        RESIZE OPTIMIZATION (DEBOUNCE)
//     =============================== */

//     let resizeTimer;

//     window.addEventListener("resize", () => {

//       clearTimeout(resizeTimer);

//       resizeTimer = setTimeout(() => {

//         if (window.innerWidth >= 1200) {
//           closeMenu();
//         }

//       }, 150);

//     });

//   });

// })();

// function initNavbar(currentActiveMenu = typeof activeMenu !== "undefined" ? activeMenu : null) {
//   const mobileNavToggle = document.querySelector('.futeducation-mobile-toggle');
//   const navMenu = document.querySelector('#futeducation-navmenu') || document.querySelector('.futeducation-navmenu');
  
//   // Early return if there's no toggle button on the page
//   if (!mobileNavToggle) return;

//   // 1. Efficient Overlay Handling
//   let overlay = document.querySelector('.futeducation-mobile-overlay');
//   if (!overlay) {
//     overlay = document.createElement('div');
//     overlay.className = 'futeducation-mobile-overlay'; // className is slightly faster than classList
//     document.body.appendChild(overlay); // Use document.body directly
//   }

//   // 2. Mobile Menu Toggle
//   const toggleMobileMenu = () => {
//     document.body.classList.toggle('futeducation-mobile-active');
//     mobileNavToggle.classList.toggle('bi-list');
//     mobileNavToggle.classList.toggle('bi-x');
//   };

//   mobileNavToggle.addEventListener('click', toggleMobileMenu);
//   overlay.addEventListener('click', toggleMobileMenu);

//   /* ======================
//      DROPDOWN MOBILE (Event Delegation)
//   ====================== */
//   if (navMenu) {
//     // Attach ONE listener to the parent instead of looping through all toggles
//     navMenu.addEventListener('click', (e) => {
//       // Only run dropdown logic on smaller screens
//       if (window.innerWidth >= 1200) return;

//       const toggleBtn = e.target.closest('.futeducation-toggle-dropdown');
      
//       // If the clicked element wasn't a dropdown toggle, do nothing
//       if (!toggleBtn) return;

//       e.preventDefault();

//       const parentLi = toggleBtn.closest('li.futeducation-dropdown');
//       if (parentLi) {
//         parentLi.classList.toggle('futeducation-dropdown-active');
//       }
//     });
//   }

//   /* ======================================
//      MANUAL ACTIVE MENU SYSTEM
//   ====================================== */
//   if (currentActiveMenu) {
//     const activeLink = document.querySelector(
//       `#futeducation-navmenu [data-menu="${currentActiveMenu}"]`
//     );

//     if (activeLink) {
//       activeLink.classList.add("active");

//       // Open parent dropdowns with safety checks
//       let parent = activeLink.closest(".futeducation-dropdown");
//       while (parent) {
//         parent.classList.add("active");
//         // Optional chaining (?.) prevents crashes if parentElement is null
//         parent = parent.parentElement?.closest(".futeducation-dropdown");
//       }
//     }
//   }
// }
   /* ==========================================================
   NAVBAR INITIALIZER
========================================================== */

// function initNavbar(){

//   const mobileNavToggle = document.querySelector('.futeducation-mobile-toggle');
//   const body = document.querySelector('body');

//   if(!mobileNavToggle) return;

//   let overlay = document.querySelector('.futeducation-mobile-overlay');

//   if(!overlay){
//     overlay = document.createElement('div');
//     overlay.classList.add('futeducation-mobile-overlay');
//     body.appendChild(overlay);
//   }

//   function toggleMobileMenu(){

//     body.classList.toggle('futeducation-mobile-active');

//     mobileNavToggle.classList.toggle('bi-list');
//     mobileNavToggle.classList.toggle('bi-x');

//   }

//   mobileNavToggle.addEventListener('click', toggleMobileMenu);

//   overlay.addEventListener('click', toggleMobileMenu);


//   /* ======================
//      DROPDOWN MOBILE
//   ====================== */

//   const dropdownToggles = document.querySelectorAll(
//     '.futeducation-navmenu .futeducation-toggle-dropdown'
//   );

//   dropdownToggles.forEach(toggle => {

//     toggle.addEventListener('click', function(e){

//       if(window.innerWidth < 1200){

//         e.preventDefault();

//         const parentLi = this.closest('li.futeducation-dropdown');

//         if(parentLi){
//           parentLi.classList.toggle('futeducation-dropdown-active');
//         }

//       }

//     });

//   });
//   /* ======================================
//    MANUAL ACTIVE MENU SYSTEM
// ====================================== */

// if(typeof activeMenu !== "undefined"){

//   const activeLink = document.querySelector(
//     '#futeducation-navmenu [data-menu="'+activeMenu+'"]'
//   );

//   if(activeLink){

//     activeLink.classList.add("active");

//     /* open parent dropdowns */

//     let parent = activeLink.closest(".futeducation-dropdown");

//     while(parent){
//       parent.classList.add("active");
//       parent = parent.parentElement.closest(".futeducation-dropdown");
//     }

//   }

// }

// }
// // ==========================================
// // NEET Sarthi Widget - V4 (Advanced AI & Persisted State) this one
// // ==========================================

// (function () {
//     "use strict";

//     // ==========================================
//     // State & Memory Management
//     // ==========================================
//     let userInteracted = false;
//     let isProcessing = false;

//     const userContext = {
//         score: null,
//         budgetLakhs: null,
//         category: "General",
//         lastTopicOffered: null,
//         hasSeenAssessment: false
//     };

//     // Pre-compiled Regex for faster execution
//     const REGEX = {
//         score: /\b([1-6]?[0-9]{2}|7[0-1][0-9]|720)\b/,
//         budgetLakh: /\b(\d{1,3})\s*(lakh|lakhs|l|lac|lacs)\b/i,
//         budgetCr: /\b(\d{1,2})\s*(cr|crore|crores)\b/i,
//         categoryOBC: /\bobc\b/i,
//         categorySCST: /\b(sc|st)\b/i,
//         categoryGen: /\b(gen|general|ur)\b/i
//     };

//     // ==========================================
//     // AI KNOWLEDGE BASE (1000+ Query Engine)
//     // ==========================================
    
//     // Keyword dictionaries for intent matching
//     const KEYWORDS = {
//         yes: ["yes", "yeah", "yep", "sure", "please", "ok", "show me", "give me"],
//         identity: ["who are you", "your name", "what are you", "human or bot"],
//         abroad: ["abroad", "russia", "georgia", "kazakhstan", "foreign", "international", "outside india", "kyrgyzstan", "uzbekistan"],
//         ayush: ["ayush", "bams", "bhms", "bums", "ayurveda", "homeopathy", "unani"],
//         bds: ["bds", "dental", "dentist", "teeth", "tooth"],
//         private_colleges: ["private", "pvt", "state private"],
//         deemed_colleges: ["deemed", "deemed university", "management quota", "nri quota"],
//         govt_colleges: ["gov", "govt", "government", "aiims", "jipmer", "gmc", "state govt"],
//         ask_assessment: ["chances", "assessment", "my score", "what can i get", "predict", "cut off", "cutoff", "safe score"],
//         greetings: ["hi", "hello", "hey", "start", "good morning", "good evening", "help"],
//         loan: ["loan", "education loan", "finance", "funding", "bank"],
        
//         // Admission FAQs (Simulating 1000+ Queries)
//         documents: ["document", "documents", "certificate", "certificates", "required to carry", "domicile", "income certificate"],
//         counseling: ["mcc", "counseling", "counselling", "registration", "choice filling", "allotment", "state counseling"],
//         security_deposit: ["deposit", "security fee", "refundable", "forfeit", "token amount"],
//         bond: ["bond", "penalty", "service bond", "rural service", "discontinuation"],
//         nri: ["nri", "sponsor", "oci", "pio", "foreign national"]
//     };

//     const FAQ_RESPONSES = {
//         documents: "📁 **Required Documents for NEET Counseling:**\n1. NEET Admit Card & Scorecard\n2. 10th & 12th Marksheets/Certificates\n3. ID Proof (Aadhar/PAN/Passport)\n4. Passport Size Photos\n5. Category/Domicile Certificate (If applicable)\n6. Provisional Allotment Letter.",
//         counseling: "🏛️ **Counseling Process:**\n• **All India Quota (15%):** Conducted by MCC for Govt/Deemed/Central Universities.\n• **State Quota (85%):** Conducted by respective State Authorities.\nProcesses include: Registration -> Security Deposit -> Choice Filling -> Seat Allotment -> Reporting.",
//         security_deposit: "💰 **Security Deposits (MCC):**\n• Govt / AIIMS / Central: ₹10,000 (UR), ₹5,000 (Reserved)\n• Deemed Universities: ₹2,00,000 (For all categories)\n*Note: This is generally refundable if no seat is allotted or if you join the allotted seat.*",
//         bond: "📜 **Service Bonds:**\nMany State Government colleges have a mandatory rural service bond ranging from 1 to 5 years. Breaking the bond incurs a penalty ranging from ₹5 Lakhs to ₹30 Lakhs depending on the state. Deemed universities generally do NOT have service bonds.",
//         nri: "✈️ **NRI Quota:**\nDeemed universities and some state private colleges reserve 15% seats for NRIs. You need valid NRI sponsorship documents, Embassy certificates, and fees are generally paid in USD ($30,000 - $60,000 per year)."
//     };

//     // College Database structured for quick retrieval
//     const COLLEGES_DB = {
//         govt: "🏥 **Top Government Medical Colleges:**\n1. AIIMS, New Delhi\n2. JIPMER, Puducherry\n3. CMC Vellore (Govt Quota)\n4. VMMC & Safdarjung, Delhi\n5. King George's Medical University (KGMU), Lucknow\n6. Seth GS Medical College, Mumbai\n7. BJ Medical College, Pune\n8. Madras Medical College, Chennai",
//         private: "🏢 **Top Private Medical Colleges (State-wise):**\n1. St. John's Medical College, Bangalore\n2. MS Ramaiah Medical College, Bangalore\n3. Christian Medical College (CMC), Ludhiana\n4. KPC Medical College, Kolkata\n5. Sharda University, Greater Noida\n*Fees typically range from ₹10 Lakhs to ₹20 Lakhs per annum depending on the state.*",
//         deemed: "🏛️ **Top Deemed Medical Universities:**\n1. KMC (Kasturba Medical College), Manipal & Mangalore\n2. Symbiosis Medical College for Women, Pune\n3. Dr. D.Y. Patil Medical College, Pune & Navi Mumbai\n4. Sri Ramachandra Institute (SRIHER), Chennai\n5. Amrita Institute of Medical Sciences, Kochi\n6. Kalinga Institute (KIMS), Bhubaneswar\n*Fees generally range from ₹15 Lakhs to ₹25 Lakhs per annum.*"
//     };

//     // DOM Element Cache
//     const DOM = {};

//     // ==========================================
//     // Initialization & Event Listeners
//     // ==========================================
//     document.addEventListener("DOMContentLoaded", function () {
//         // Cache DOM elements
//         DOM.sideMenu = document.getElementById("sideMenu");
//         DOM.toggleBtn = document.getElementById("toggleBtn");
//         DOM.chatBtn = document.getElementById("chatBtn");
//         DOM.formBtn = document.getElementById("formBtn");
//         DOM.closeModalBtn = document.getElementById("closeModalBtn");
//         DOM.closeChatBtn = document.getElementById("closeChatBtn");
//         DOM.modal = document.getElementById("contactModal");
//         DOM.chatModal = document.getElementById("chatModal");
//         DOM.leadForm = document.getElementById("leadForm");
//         DOM.chatInput = document.getElementById("chatInput");
//         DOM.sendBtn = document.getElementById("sendBtn");
//         DOM.chatBody = document.getElementById("chatBody");
//         DOM.typingIndicator = document.getElementById("typingIndicator");

//         initUIEvents();
//     });

//     function initUIEvents() {
//         // --- Side Menu Persisted Toggle Logic ---
//         if (DOM.sideMenu && DOM.toggleBtn) {
//             const savedState = localStorage.getItem("futeducation-menu-state");

//             // Check saved state to maintain it across page refreshes
//             if (savedState === "closed") {
//                 DOM.sideMenu.classList.add("futeducation-hidden");
//             } else {
//                 // If no state or open state, ensure it opens after 1 second
//                 setTimeout(() => {
//                     DOM.sideMenu.classList.remove("futeducation-hidden");
//                     localStorage.setItem("futeducation-menu-state", "open");
//                 }, 1000);
//             }

//             // Click event for toggle button
//             DOM.toggleBtn.addEventListener("click", () => {
//                 DOM.sideMenu.classList.toggle("futeducation-hidden");
//                 // Save the new state
//                 const isHidden = DOM.sideMenu.classList.contains("futeducation-hidden");
//                 localStorage.setItem("futeducation-menu-state", isHidden ? "closed" : "open");
//             });
//         }

//         // --- Modals & Chat Toggles ---
//         if (DOM.chatBtn) {
//             DOM.chatBtn.addEventListener("click", () => {
//                 userInteracted = true;
//                 DOM.chatModal.classList.toggle("futeducation-active");
//                 if (DOM.modal) DOM.modal.style.display = "none";
//             });
//         }

//         if (DOM.formBtn) {
//             DOM.formBtn.addEventListener("click", () => {
//                 userInteracted = true;
//                 DOM.modal.style.display = "flex";
//                 if (DOM.chatModal) DOM.chatModal.classList.remove("futeducation-active");
//             });
//         }

//         if (DOM.closeModalBtn) {
//             DOM.closeModalBtn.addEventListener("click", () => {
//                 DOM.modal.style.display = "none";
//             });
//         }

//         if (DOM.closeChatBtn) {
//             DOM.closeChatBtn.addEventListener("click", () => {
//                 DOM.chatModal.classList.remove("futeducation-active");
//             });
//         }

//         // --- Click Outside to Close Logic ---
//         document.addEventListener('click', function(event) {
//             if (DOM.chatModal && DOM.chatModal.classList.contains('futeducation-active')) {
//                 if (!DOM.chatModal.contains(event.target) && DOM.chatBtn && !DOM.chatBtn.contains(event.target)) {
//                     DOM.chatModal.classList.remove('futeducation-active');
//                 }
//             }
//             if (DOM.modal && event.target === DOM.modal) {
//                 DOM.modal.style.display = 'none';
//             }
//         });

//         // --- Auto Popup Logic ---
//         setTimeout(() => {
//             if (!userInteracted && DOM.modal && DOM.modal.style.display !== "flex" && DOM.chatModal && !DOM.chatModal.classList.contains("futeducation-active")) {
//                 DOM.modal.style.display = "flex";
//             }
//         }, 20000);

//         if (DOM.leadForm) {
//             DOM.leadForm.addEventListener("submit", (e) => {
//                 setTimeout(() => {
//                     DOM.modal.style.display = "none";
//                     DOM.leadForm.reset();
//                 }, 1000);
//             });
//         }

//         // --- Chat Input Logic ---
//         if (DOM.chatInput) {
//             DOM.chatInput.addEventListener("keypress", (e) => {
//                 if (e.key === "Enter" && !isProcessing) {
//                     e.preventDefault();
//                     sendMessage();
//                 }
//             });
//         }

//         if (DOM.sendBtn) {
//             DOM.sendBtn.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 if (!isProcessing) sendMessage();
//             });
//         }
//     }

//     // ==========================================
//     // Messaging Logic
//     // ==========================================
//     function sendMessage() {
//         if (!DOM.chatInput || !DOM.chatBody) return;

//         const message = DOM.chatInput.value.trim();
//         if (!message) return;

//         isProcessing = true;
//         addChatBubble(message, "user");
//         DOM.chatInput.value = "";

//         if (DOM.typingIndicator) {
//             DOM.typingIndicator.style.display = "block";
//             DOM.chatBody.scrollTop = DOM.chatBody.scrollHeight;
//         }

//         // Simulate AI thinking delay
//         const delay = Math.min(600 + (message.length * 10) + Math.random() * 400, 1500);

//         setTimeout(() => {
//             if (DOM.typingIndicator) {
//                 DOM.typingIndicator.style.display = "none";
//             }
            
//             const reply = processAndGenerateResponse(message.toLowerCase());
//             addChatBubble(reply, "bot");
//             isProcessing = false;
//         }, delay);
//     }

//     function addChatBubble(text, sender) {
//         if (!DOM.chatBody) return;

//         const bubble = document.createElement("div");
//         bubble.className = "futeducation-chat-bubble futeducation-" + sender;

//         // Securely parse simple markdown-like syntax
//         bubble.innerHTML = text
//             .replace(/\n/g, "<br>")
//             .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//             .replace(/\*(.*?)\*/g, "<em>$1</em>");

//         DOM.chatBody.appendChild(bubble);
//         DOM.chatBody.scrollTop = DOM.chatBody.scrollHeight;
//     }

//     // ==========================================
//     // NLP & Context Extraction
//     // ==========================================
//     function extractContextAndIntent(message) {
//         // 1. Memory Updates (Score, Budget, Category)
//         const scoreMatch = message.match(REGEX.score);
//         if (scoreMatch) {
//             const newScore = parseInt(scoreMatch[0], 10);
//             if (newScore !== userContext.score) {
//                 userContext.hasSeenAssessment = false; 
//             }
//             userContext.score = newScore;
//         }

//         const budgetLakhMatch = message.match(REGEX.budgetLakh);
//         if (budgetLakhMatch) userContext.budgetLakhs = parseInt(budgetLakhMatch[1], 10);
        
//         const budgetCrMatch = message.match(REGEX.budgetCr);
//         if (budgetCrMatch) userContext.budgetLakhs = parseInt(budgetCrMatch[1], 10) * 100;

//         if (REGEX.categoryOBC.test(message)) userContext.category = "OBC";
//         if (REGEX.categorySCST.test(message)) userContext.category = "SC/ST";
//         if (REGEX.categoryGen.test(message)) userContext.category = "General";

//         // 2. Intent Matching Loop
//         for (const [intent, words] of Object.entries(KEYWORDS)) {
//             if (contains(message, words)) return intent;
//         }

//         return "general";
//     }

//     // ==========================================
//     // Dynamic Response Generator Engine
//     // ==========================================
//     function processAndGenerateResponse(message) {
//         const currentIntent = extractContextAndIntent(message);

//         // Core Identity & Greetings
//         if (currentIntent === "identity") {
//             return "I am **NEET Sarthi**, an AI admission assistant built by Future Education. I am trained on 1000+ admission scenarios, college databases, and NMC guidelines.\n\nHow can I help you today?";
//         }

//         if (currentIntent === "greetings") {
//             return "Hello 👋 I'm NEET Sarthi from Future Education.\n\nYou can ask me about **Colleges (Govt/Deemed/Private)**, **Cutoffs**, **Counseling FAQs**, or **MBBS Abroad**.\n\nTo check your specific eligibility, please tell me your expected **NEET score** and approximate **budget**.";
//         }

//         // Dedicated Abroad Route (Hardcoded phone number as requested)
//         if (currentIntent === "abroad") {
//             return "🌍 **MBBS Abroad Admissions:**\n\nWe provide direct admission guidance for top NMC-approved medical universities abroad (such as in Russia, Georgia, Kazakhstan, etc.).\n\n📞 **For immediate and personalized assistance for Abroad admissions, please call our expert counselors directly at +917303848310**";
//         }

//         if (currentIntent === "loan") {
//             return "🏦 We assist students in securing **Education Loans** for medical admissions across India and Abroad.\n\nFor immediate financial assistance, please call our team at **+91 73038 48310**.";
//         }

//         // College Databases
//         if (currentIntent === "govt_colleges") return COLLEGES_DB.govt;
//         if (currentIntent === "private_colleges") return COLLEGES_DB.private;
//         if (currentIntent === "deemed_colleges") return COLLEGES_DB.deemed;

//         // Frequently Asked Questions (The 1000+ Queries Engine)
//         if (currentIntent === "documents") return FAQ_RESPONSES.documents;
//         if (currentIntent === "counseling") return FAQ_RESPONSES.counseling;
//         if (currentIntent === "security_deposit") return FAQ_RESPONSES.security_deposit;
//         if (currentIntent === "bond") return FAQ_RESPONSES.bond;
//         if (currentIntent === "nri") return FAQ_RESPONSES.nri;

//         // State-Aware "YES" Response Handling
//         if (currentIntent === "yes" && userContext.lastTopicOffered) {
//             let reply = "";
//             if (userContext.lastTopicOffered === "ayush_list") {
//                 reply = "**Top AYUSH Options (BAMS / BHMS):**\n• DY Patil Ayurveda College, Pune\n• Bharati Vidyapeeth, Pune\n• SDM College Hassan\n• Patanjali Ayurvigyan Haridwar";
//             } 
//             userContext.lastTopicOffered = null; 
//             return reply;
//         }

//         // AYUSH
//         if (currentIntent === "ayush") {
//             userContext.lastTopicOffered = "ayush_list";
//             let reply = "**AYUSH Courses (BAMS, BHMS, BUMS):**\nHighly recognized alternative medical careers.";
//             if (userContext.score) reply += "\n\nWith a score of **" + userContext.score + "**, you have strong chances in private AYUSH colleges.";
//             return reply + "\n\nWould you like a list of top colleges? Reply **YES**.";
//         }
        
//         // BDS
//         if (currentIntent === "bds") {
//             return "**BDS (Dental) Admissions:**\nBDS is a great option if you miss out on MBBS. \n• Govt BDS Cutoff: Generally 580+ (Gen)\n• Private BDS Fees: ₹2 Lakhs to ₹5 Lakhs per year.\n\nMany Deemed Universities also offer exceptional dental programs. Let me know your score to evaluate chances.";
//         }

//         // Score Assessment Engine
//         if (userContext.score && (!userContext.hasSeenAssessment || currentIntent === "ask_assessment")) {
//             return generateScoreBasedAssessment();
//         }

//         // Fallback Logic
//         if (userContext.score && !userContext.budgetLakhs) {
//              return "I've noted your score of **" + userContext.score + "**. To give you a realistic college prediction across Govt, Deemed, and Private sectors, what is your approximate **budget**?";
//         }

//         return "I can assist you with Govt/Deemed/Private colleges, Counseling FAQs (bonds, fees, documents), or MBBS Abroad.\n\nPlease tell me your **NEET score**, **budget**, or ask a specific question!";
//     }

//     function generateScoreBasedAssessment() {
//         userContext.hasSeenAssessment = true;
//         const s = userContext.score;
//         const b = userContext.budgetLakhs;
//         const c = userContext.category;

//         let response = "📊 **Prediction for " + s + " marks (" + c + ")**\n\n";

//         if (s >= 620) {
//             response += "🌟 **Government MBBS:** Excellent chances. You are in a highly competitive bracket for State and All India Quota.\n\n*Type 'govt' to see top colleges.*";
//         } else if (s >= 500) {
//             response += "⚖️ **Government Seats:** Borderline (depends heavily on state domicile).\n🏢 **Private/Deemed:** Very strong chances for top universities.\n\n*Type 'deemed' or 'private' to see lists.*";
//         } else if (s >= 250) {
//             response += "🏛️ **Govt MBBS:** Unlikely.\n💡 **Recommendation:** We highly recommend exploring **Deemed Universities** in India or considering **MBBS Abroad** for a better ROI.\n\n*Type 'abroad' or 'deemed' to explore.*";
//         } else if (s >= 130) {
//             response += "🛫 **Options:** Only management/NRI quota in Private/Deemed universities or **MBBS Abroad** options are possible at this score.\n\n*Type 'abroad' or call +917303848310.*";
//         } else {
//             response += "⚠️ Your score is currently below the general qualification threshold. Please wait for official NTA cutoff declarations.";
//         }

//         if (b) {
//             response += "\n\n💰 **Budget noted:** ₹" + formatBudget(b);
//         }

//         return response;
//     }

//     // ==========================================
//     // Utility Helpers
//     // ==========================================
//     function contains(text, keywordsArray) {
//         return keywordsArray.some(keyword => text.includes(keyword));
//     }

//     function formatBudget(lakhs) {
//         if (lakhs >= 100) {
//             let cr = lakhs / 100;
//             return (cr % 1 === 0 ? cr : cr.toFixed(2)) + " Cr";
//         }
//         return lakhs + " Lakhs";
//     }

// })();

//
//navigation bar srats here
// document.addEventListener('DOMContentLoaded', () => {
//   const mobileNavToggle = document.querySelector('.futeducation-mobile-toggle');
//   const body = document.querySelector('body');

//   const overlay = document.createElement('div');
//   overlay.classList.add('futeducation-mobile-overlay');
//   body.appendChild(overlay);

//   function toggleMobileMenu() {
//     body.classList.toggle('futeducation-mobile-active');
//     mobileNavToggle.classList.toggle('bi-list');
//     mobileNavToggle.classList.toggle('bi-x');
//   }

//   if (mobileNavToggle) {
//     mobileNavToggle.addEventListener('click', toggleMobileMenu);
//   }

//   overlay.addEventListener('click', toggleMobileMenu);

//   const dropdownToggles = document.querySelectorAll('.futeducation-navmenu .futeducation-toggle-dropdown');

//   dropdownToggles.forEach(toggle => {
//     toggle.addEventListener('click', function (e) {
//       if (window.innerWidth < 1200) {
//         e.preventDefault();
//         const parentLi = this.closest('li.futeducation-dropdown');
//         parentLi.classList.toggle('futeducation-dropdown-active');
//       }
//     });
//   });
// });
//navigation bar ends here
/* ==========================================================
   new navbar ends
   ========================================================== */
// const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw40oExZvgwp4bpuP2HJM3Z6juhNfdVWbiBGgxA3835NbiER91kdC_KlC72uXSe_yEG/exec";

// /* =========================
//    TOAST HELPER
// ========================= */

// function showToast(message, type = "success") {
//   const toastEl = document.getElementById("liveToast");
//   const toastMessage = document.getElementById("toastMessage");

//   if (!toastEl || !toastMessage) {
//     alert(message);
//     return;
//   }

//   toastEl.classList.remove("bg-success", "bg-danger", "bg-warning");

//   if (type === "success") toastEl.classList.add("bg-success");
//   if (type === "error") toastEl.classList.add("bg-danger");
//   if (type === "duplicate") toastEl.classList.add("bg-warning");

//   toastMessage.innerText = message;

//   const toast = new bootstrap.Toast(toastEl);
//   toast.show();

//   scrollToForm();
// }

// /* =========================
//    FORM HANDLING (CORS SAFE)
// ========================= */

// document.querySelectorAll(".lead-form").forEach(form => {

//   form.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const submitBtn = form.querySelector("button[type='submit']");
//     const preloader = document.getElementById("preloader");

//     if (submitBtn) submitBtn.disabled = true;
//     if (preloader) preloader.style.display = "flex";

//     const formData = new FormData(form);

//     const name = (formData.get("name") || "").trim();
//     const email = (formData.get("email") || "").trim();
//     const phone = (formData.get("phone") || "").trim();
//     const score = (formData.get("score") || "").trim();
//     const course = (formData.get("course") || "").trim();
//     const state = (formData.get("state") || "").trim();
//     const country = (formData.get("country") || "").trim();
//     const loan_amount = (formData.get("loan_amount") || "").trim();
//     const message = (formData.get("message") || "").trim();

//     /* =========================
//        VALIDATIONS
//     ========================= */

//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!phone || !phoneRegex.test(phone)) {
//       showToast("Enter valid 10 digit Indian mobile number.", "error");
//       return resetState();
//     }

//     const emailRegex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
//     if (email && !emailRegex.test(email)) {
//       showToast("Enter a valid email address.", "error");
//       return resetState();
//     }

//     const nameRegex = /^[A-Za-z]{3,}(?: [A-Za-z]+)*$/;
//     if (name && !nameRegex.test(name)) {
//       showToast("Name must contain only letters.", "error");
//       return resetState();
//     }

//     if (message) {
//       const wordCount = message.split(/\s+/).filter(w => w.length > 0).length;
//       if (wordCount < 3) {
//         showToast("Message must contain at least 3 words.", "error");
//         return resetState();
//       }
//     }

//     /* =========================
//        ADD EXTRA DATA
//     ========================= */

//     formData.append("type", form.dataset.type || "lead");
//     formData.append("page", window.location.href);
//     formData.append("source", document.referrer || "direct");

//     /* =========================
//        SEND DATA (NO-CORS)
//     ========================= */

//     try {

//       await fetch(SCRIPT_URL, {
//         method: "POST",
//         body: formData,
//         mode: "no-cors"   // 🔥 prevents CORS error
//       });

//       // If request reached server without network crash
//       showToast("Submitted successfully ✅", "success");
//       form.reset();

//     } catch (error) {
//       showToast("Network error. Please check your connection.", "error");
//     }

//     resetState();

//     function resetState() {
//       if (submitBtn) submitBtn.disabled = false;
//       if (preloader) preloader.style.display = "none";
//     }

//   });

// });

// /* =========================
//    SCROLL HELPER
// ========================= */

// function scrollToForm() {
//   const form = document.querySelector(".lead-form");
//   if (form) {
//     form.scrollIntoView({ behavior: "smooth", block: "center" });
//   }
// }
