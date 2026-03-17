/* ==========================================
FUTEDUCATION AUTO SKELETON SYSTEM
Optimized for large SEO websites
neet.futeducation.com
========================================== */

(function(){

"use strict";

/* elements to skeletonize */

const targets = `
h1,h2,h3,h4,h5,h6,
p,
img,
.card,
.course-card,
.service-card,
.futeducation-feature-card,
.client-logo,
.table,
.testimonials .card
`;

/* elements to ignore */

const ignoreAreas = [
"#hero-carousel",
"#navbar",
"#footer"
];

/* check if inside ignored area */

function isIgnored(el){

return ignoreAreas.some(selector =>
el.closest(selector)
);

}

/* create skeleton */

function buildSkeleton(){

document.querySelectorAll(targets).forEach(el => {

if(isIgnored(el)) return;

/* IMAGE */

if(el.tagName === "IMG"){

const height = el.offsetHeight || 200;

const box = document.createElement("div");

box.className = "auto-skeleton auto-skeleton-img";

box.style.height = height + "px";

el.dataset.original = "img";

el.parentNode.insertBefore(box, el);

el.classList.add("skeleton-hide");

}

/* TEXT */

else if(["H1","H2","H3","H4","H5","H6","P"].includes(el.tagName)){

const box = document.createElement("div");

box.className = "auto-skeleton auto-skeleton-text";

box.style.width = (Math.random()*40+60)+"%";

el.dataset.original = "text";

el.parentNode.insertBefore(box, el);

el.classList.add("skeleton-hide");

}

/* CARDS / BLOCKS */

else{

el.classList.add("auto-skeleton");

}

});

}

/* remove skeleton */

function removeSkeleton(){

document.querySelectorAll(".auto-skeleton").forEach(el=>{

el.classList.remove("auto-skeleton");

});

document.querySelectorAll(".skeleton-hide").forEach(el=>{

el.classList.remove("skeleton-hide");

el.classList.add("skeleton-loaded");

});

/* remove generated skeleton blocks */

document.querySelectorAll(".auto-skeleton-text, .auto-skeleton-img").forEach(el=>{

if(!el.dataset.original){

el.remove();

}

});

}

/* init */

document.addEventListener("DOMContentLoaded",buildSkeleton);

window.addEventListener("load",removeSkeleton);

})();