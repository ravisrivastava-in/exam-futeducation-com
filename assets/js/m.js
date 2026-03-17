
(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * old Mobile nav toggle
   */
  // const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  // function mobileNavToogle() {
  //   document.querySelector('body').classList.toggle('mobile-nav-active');
  //   mobileNavToggleBtn.classList.toggle('bi-list');
  //   mobileNavToggleBtn.classList.toggle('bi-x');
  // }
  // mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * old Hide mobile nav on same-page/hash links
   */
  // document.querySelectorAll('#navmenu a').forEach(navmenu => {
  //   navmenu.addEventListener('click', () => {
  //     if (document.querySelector('.mobile-nav-active')) {
  //       mobileNavToogle();
  //     }
  //   });

  // });

  /**
   * Toggle mobile nav dropdowns
   */
  // document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
  //   navmenu.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     this.parentNode.classList.toggle('active');
  //     this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
  //     e.stopImmediatePropagation();
  //   });
  // });

  /**
   * Preloader
   */
  // Uncomment the code below if you want to use a old preloader
  // const preloader = document.querySelector('#preloader');
  // if (preloader) {
  //   window.addEventListener('load', () => {
  //     preloader.remove();
  //   });
  // }
  //new preloader
// const preloader = document.querySelector('#preloader');

// if (preloader) {
//   window.addEventListener('load', () => {

//     // keep loader visible briefly
//     setTimeout(() => {
//       preloader.classList.add('hide');

//       // remove after fade-out
//       setTimeout(() => {
//         preloader.remove();
//       }, 500);

//     }, 600);
//   });
// }

window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  loader.style.opacity = "0";
  setTimeout(() => loader.remove(), 400);
});


  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      if (index === 0) {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}"></li>`;
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

})();

/* ============================================
   AUTO CANONICAL GENERATOR
   For: neet.futeducation.com
============================================ */

(function () {
  try {

    // Skip canonical for admin or login pages
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin') || path.includes('/login')) {
      return;
    }

    let canonicalURL = window.location.origin + window.location.pathname;

    // Remove index.html
    canonicalURL = canonicalURL.replace(/index\.html$/i, '');

    // Remove query parameters
    canonicalURL = canonicalURL.split('?')[0];

    // Remove hash fragments
    canonicalURL = canonicalURL.split('#')[0];

    // Remove trailing slash (except homepage)
    if (canonicalURL !== window.location.origin + '/') {
      canonicalURL = canonicalURL.replace(/\/$/, '');
    }

    // Force homepage to end with slash
    if (canonicalURL === window.location.origin) {
      canonicalURL = window.location.origin + '/';
    }

    // Remove double slashes except protocol
    canonicalURL = canonicalURL.replace(/([^:]\/)\/+/g, "$1");

    // Check if canonical already exists
    let existingCanonical = document.querySelector("link[rel='canonical']");

    if (existingCanonical) {
      existingCanonical.setAttribute("href", canonicalURL);
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonicalURL);
      document.head.appendChild(link);
    }

    console.log("Canonical set to:", canonicalURL);

  } catch (error) {
    console.warn("Canonical generation failed:", error);
  }
})();
/* ============================================
   AUTO CANONICAL GENERATOR ends
   For: neet.futeducation.com
============================================ */
/* ============================================
   AUTO BREADCRUMB JSON-LD GENERATOR
============================================ */

(function generateBreadcrumbSchema() {
  try {

    const pathArray = window.location.pathname
      .replace(/\/$/, '')
      .split('/')
      .filter(segment => segment !== '');

    // Skip homepage
    if (pathArray.length === 0) return;

    const breadcrumbItems = [];

    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": window.location.origin + "/"
    });

    let accumulatedPath = "";
    pathArray.forEach((segment, index) => {
      accumulatedPath += "/" + segment;

      breadcrumbItems.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": segment.replace(/-/g, ' ')
                     .replace(/\b\w/g, l => l.toUpperCase()),
        "item": window.location.origin + accumulatedPath
      });
    });

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    console.log("Breadcrumb schema added");

  } catch (error) {
    console.warn("Breadcrumb schema failed:", error);
  }
})();
/* ============================================
   breadcrumb schema ends
   For: neet.futeducation.com
============================================ */
/* ============================================
   AUTO FAQ SCHEMA GENERATOR
============================================ */

(function generateFAQSchema() {
  try {

    const questions = document.querySelectorAll(".faq-question");
    const answers = document.querySelectorAll(".faq-answer");

    if (questions.length === 0 || answers.length === 0) return;

    const faqItems = [];

    questions.forEach((q, index) => {
      if (answers[index]) {
        faqItems.push({
          "@type": "Question",
          "name": q.innerText.trim(),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answers[index].innerText.trim()
          }
        });
      }
    });

    if (faqItems.length === 0) return;

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    console.log("FAQ schema added");

  } catch (error) {
    console.warn("FAQ schema failed:", error);
  }
})();
/* ============================================
   FAQ schema ends
   For: neet.futeducation.com
============================================ */
/* ============================================
   ORGANIZATION + MEDICAL SERVICE SCHEMA
============================================ */

(function generateOrganizationSchema() {
  try {

    // Only inject once (homepage preferred)
    if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") return;

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Future Education",
      "url": "https://neet.futeducation.com/",
      "logo": "https://neet.futeducation.com/assets/img/logo/log.png",
      "description": "Future Education is a NEET UG 2026 medical admission consultancy providing guidance for MBBS, BDS, Deemed, Private, Government and MBBS Abroad admissions.",
      "sameAs": [
        "https://www.instagram.com/futeducation/",
        "https://www.facebook.com/futureeducationdelhi/"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7303848310",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(orgSchema);
    document.head.appendChild(script);

    console.log("Organization schema injected");

  } catch (error) {
    console.warn("Organization schema failed:", error);
  }
})();
/* ============================================
   ORGANIZATION + MEDICAL SERVICE SCHEMA ends
============================================ */
/* ============================================
   AUTO ARTICLE SCHEMA GENERATOR
============================================ */

(function generateArticleSchema() {
  try {

    const path = window.location.pathname;

    // Detect article-like pages
    const articleFolders = [
      "/news/",
      "/neet-ug-2026/",
      "/ultimate-medical-guide-2026/",
      "/neet-guide/"
    ];

    const isArticle = articleFolders.some(folder => path.includes(folder));
    if (!isArticle) return;

    const title = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const description = descriptionMeta ? descriptionMeta.content : "";

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": "Future Education"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Future Education",
        "logo": {
          "@type": "ImageObject",
          "url": "https://neet.futeducation.com/assets/img/logo/log.png"
        }
      },
      "mainEntityOfPage": window.location.href,
      "datePublished": document.lastModified,
      "dateModified": document.lastModified
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(articleSchema);
    document.head.appendChild(script);

    console.log("Article schema injected");

  } catch (error) {
    console.warn("Article schema failed:", error);
  }
})();
/* ============================================
   AUTO ARTICLE SCHEMA GENERATOR ends
============================================ */
/* ============================================
   AUTO COLLEGE SCHEMA GENERATOR
============================================ */

(function generateCollegeSchema() {
  try {

    if (!window.location.pathname.includes("/colleges/")) return;

    const title = document.title;

    const collegeSchema = {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      "name": title,
      "url": window.location.href,
      "description": document.querySelector('meta[name="description"]')?.content || "",
      "educationalCredentialAwarded": "MBBS Degree",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "India"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(collegeSchema);
    document.head.appendChild(script);

    console.log("College schema injected");

  } catch (e) {
    console.warn("College schema failed:", e);
  }
})();
/* ============================================
   AUTO COLLEGE SCHEMA GENERATOR ends
============================================ */
/* ============================================*/
/* ============================================
   AUTO COURSE SCHEMA GENERATOR
============================================ */

(function generateCourseSchema() {
  try {

    const path = window.location.pathname;

    if (!path.includes("mbbs") && !path.includes("bds") && !path.includes("ayush")) return;

    const courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": document.title,
      "description": document.querySelector('meta[name="description"]')?.content || "",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Future Education",
        "url": "https://neet.futeducation.com/"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(courseSchema);
    document.head.appendChild(script);

    console.log("Course schema injected");

  } catch (e) {
    console.warn("Course schema failed:", e);
  }
})();
/* ============================================
   AUTO COURSE SCHEMA GENERATOR ends
============================================ */
/* ============================================
    AUTO MEDICAL SERVICE SCHEMA GENERATOR ends
============================================ */
(function generateMedicalServiceSchema() {
  try {

    if (!window.location.pathname.includes("/counselling/")) return;

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Future Education NEET Counselling",
      "url": window.location.href,
      "medicalSpecialty": "Medical Education Consultancy",
      "areaServed": "India"
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(serviceSchema);
    document.head.appendChild(script);

    console.log("Medical service schema injected");

  } catch (e) {
    console.warn("Medical service schema failed:", e);
  }
})();
/* ============================================
   AUTO MEDICAL SERVICE SCHEMA GENERATOR ends
============================================ */
/* ============================================
   AUTO REVIEW SCHEMA GENERATOR ends
============================================ */
(function generateReviewSchema() {
  try {

    if (!window.location.pathname.includes("/testimonials")) return;

    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Future Education",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(reviewSchema);
    document.head.appendChild(script);

  } catch (e) {}
})();
/* ============================================
   AUTO REVIEW SCHEMA GENERATOR ends
============================================ */
/* ============================================
   SEO MONITORING CHECKER
============================================ */

(function seoHealthCheck() {
  try {

    const issues = [];

    if (!document.querySelector("meta[name='description']")) {
      issues.push("Missing meta description");
    }

    if (!document.querySelector("h1")) {
      issues.push("Missing H1 tag");
    }

    if (!document.querySelector("link[rel='canonical']")) {
      issues.push("Missing canonical");
    }

    if (issues.length > 0) {
      console.warn("SEO Issues:", issues);
    } else {
      console.log("SEO Health Check Passed");
    }

  } catch (e) {}
})();
/* ============================================
   SEO MONITORING CHECKER ends
============================================ */

/* ============================================
   AUTO GTM NOSCRIPT INJECTOR
============================================ */

(function injectGTMIframe() {
  try {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-NNZG27ZK";
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";

    const noscript = document.createElement("noscript");
    noscript.appendChild(iframe);

    document.body.insertBefore(noscript, document.body.firstChild);
  } catch (e) {
    console.warn("GTM noscript injection failed:", e);
  }
})();
/* ============================================
   AUTO GTM NOSCRIPT INJECTOR ends
============================================ */

//notificaiton 
document.addEventListener("DOMContentLoaded", function () {

  // Check browser support
  if (!("Notification" in window)) {
    return;
  }

  // Ask permission automatically on page load
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }

  // Button click trigger
  const notifyBtn = document.getElementById("enableNotifications");

  if (notifyBtn) {
    notifyBtn.addEventListener("click", function () {

      if (Notification.permission === "granted") {

        new Notification("Future Education", {
          body: "You will now receive NEET UG updates and announcements.",
          icon: "/assets/img/logo/log.png"
        });

      } 
      
      else if (Notification.permission !== "denied") {

        Notification.requestPermission().then(function (permission) {

          if (permission === "granted") {

            new Notification("Future Education", {
              body: "Notifications enabled! Stay updated with NEET UG announcements.",
              icon: "/assets/img/logo/log.png"
            });

          }

        });

      }

    });
  }

});
//notification ends
//IMAGE FALLBACK
(function () {
  "use strict";

  const placeholder = "/assets/img/futeducation.png"; 

  function handleImage(img) {

    img.addEventListener("error", function () {
      img.style.backgroundImage = `url('${placeholder}')`;
      img.style.backgroundSize = "cover";
      img.style.backgroundPosition = "center";
      img.style.backgroundRepeat = "no-repeat";
      img.style.minHeight = "200px"; 
      img.style.objectFit = "cover";
    });

  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img").forEach(handleImage);
  });

})();
//IMAGE FALLBACK