/* ==========================================================
   START OF EXTERNAL BLOG JS
   ========================================================== */

var allPosts = [];
var filteredPosts = [];
var postsPerPage = 4; // Display 4 posts per page to match the design grid
var currentPage = 1;

function loadBlogPosts(json){
    allPosts = json.feed.entry || [];
    filteredPosts = allPosts;
    renderCategories();
    renderRecentPosts();
    renderPage(1);
}

// Fallback Image handling for Speed Optimization
function extractFirstImage(content){
    var imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : "assets/img/blog/blog-1.png"; // Set your default fallback image here
}

function renderPage(page){
    // Hide floating back button
    var floatBackBtn = document.getElementById('back-to-posts-float');
    if(floatBackBtn) floatBackBtn.classList.remove('active');

    currentPage = page;
    var container = document.getElementById("dynamic-blog-posts");
    container.innerHTML = "";
    
    var start = (page - 1) * postsPerPage;
    var end = start + postsPerPage;
    var posts = filteredPosts.slice(start, end);
    
    if (posts.length === 0) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
    }

    posts.forEach(post => {
        var title = post.title.$t;
        var linkObj = post.link.find(l => l.rel === "alternate");
        var link = linkObj ? linkObj.href : "#";
        var slug = link.split("/").pop();
        var date = new Date(post.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        var author = post.author && post.author[0] ? post.author[0].name.$t : "Admin";
        var content = post.content.$t;
        var summary = content.replace(/<[^>]+>/g,"").substring(0,250);
        var image = extractFirstImage(content);

        // Added loading="lazy" for speed optimization
        container.innerHTML += `
        <div class="col-lg-12">
          <a href="${link}" onclick="loadPost('${slug}', event)"><article>
            <div class="post-img">
              <img src="${image}" alt="${title}" class="img-fluid" loading="lazy">
            </div>
            <h2 class="title">
              <a href="${link}" onclick="loadPost('${slug}', event)">${title}</a>
            </h2>
            <div class="meta-top">
              <ul>
                <li class="d-flex align-items-center"><i class="bi bi-person"></i> <a href="#">${author}</a></li>
                <li class="d-flex align-items-center"><i class="bi bi-clock"></i> <a href="#"><time datetime="${post.published.$t}">${date}</time></a></li>
              </ul>
            </div>
            <div class="content">
              <p>${summary}...</p>
              <div class="read-more">
                <a href="${link}" onclick="loadPost('${slug}', event)">Read More</a>
              </div>
            </div>
          </article></a>
        </div>`;
    });

    renderPagination();
    document.getElementById('blog-pagination').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination(){
    var totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    var pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    
    if(totalPages <= 1) return;

    // Previous button
    pagination.innerHTML += `<li><a href="#" onclick="if(currentPage > 1) renderPage(currentPage - 1); return false;"><i class="bi bi-chevron-left"></i></a></li>`;
    
    // Page numbers
    for(var i=1; i<=totalPages; i++){
        // Limit shown pages to avoid overflowing
        if(i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
           pagination.innerHTML += `<li><a href="#" class="${i===currentPage ? 'active' : ''}" onclick="renderPage(${i}); return false;">${i}</a></li>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
           pagination.innerHTML += `<li>...</li>`;
        }
    }

    // Next button
    pagination.innerHTML += `<li><a href="#" onclick="if(currentPage < ${totalPages}) renderPage(currentPage + 1); return false;"><i class="bi bi-chevron-right"></i></a></li>`;
}

// function renderCategories(){
//     var categories = {};
//     allPosts.forEach(p=>{
//         if(p.category){
//             p.category.forEach(c=>{
//                 categories[c.term] = (categories[c.term] || 0) + 1;
//             });
//         }
//     });
    
//     var list = document.getElementById("dynamic-categories");
//     list.innerHTML = "";
    
//     var catNames = Object.keys(categories);
    
//     catNames.forEach((cat, index) => {
//         // If it's the 6th category or beyond, add Bootstrap classes to hide it on mobile (d-none) but keep it on desktop (d-lg-block)
//         var hiddenClass = index >= 5 ? 'hidden-category d-none d-lg-block' : '';
        
//         list.innerHTML += `<li class="${hiddenClass}"><a href="#" onclick="filterCategory('${cat}'); return false;">${cat} <span>(${categories[cat]})</span></a></li>`;
//     });

//     // Add the "See More" button ONLY for mobile devices if there are more than 5 categories
//     if(catNames.length > 5){
//         list.innerHTML += `
//         <li class="d-lg-none mt-3 text-center" style="list-style: none;">
//             <button class="btn btn-sm btn-outline-primary w-100" onclick="toggleCategories(this); return false;">See More <i class="bi bi-chevron-down"></i></button>
//         </li>`;
//     }
// }
function renderCategories(){
    var categories = {};
    allPosts.forEach(p=>{
        if(p.category){
            p.category.forEach(c=>{
                categories[c.term] = (categories[c.term] || 0) + 1;
            });
        }
    });
    
    var list = document.getElementById("dynamic-categories");
    list.innerHTML = "";
    
    var catNames = Object.keys(categories);
    
    catNames.forEach((cat, index) => {
        var hiddenClass = '';
        
        if (index >= 58) {
            // 51st category onwards: Hidden on BOTH mobile and desktop
            // Uses 'desktop-hidden' for the desktop button to target
            // Uses 'mobile-hidden' for the mobile button to target
            hiddenClass = 'd-none mobile-hidden desktop-hidden';
        } else if (index >= 6) {
            // 7th to 50th category: Hidden on mobile, visible on desktop
            hiddenClass = 'd-none d-lg-block mobile-hidden';
        }
        
        list.innerHTML += `<li class="${hiddenClass}"><a href="#" onclick="filterCategory('${cat}'); return false;">${cat} <span>(${categories[cat]})</span></a></li>`;
    });

    // Add the "See More" button ONLY for mobile devices if there are more than 6 categories
    if(catNames.length > 6){
        list.innerHTML += `
        <li class="d-lg-none mt-3 text-center" style="list-style: none;">
            <button class="btn btn-sm btn-outline-primary w-100" onclick="toggleMobileCategories(this); return false;">See More <i class="bi bi-chevron-down"></i></button>
        </li>`;
    }

    // Add the "See More" button ONLY for desktop devices if there are more than 50 categories
    if(catNames.length > 50){
        list.innerHTML += `
        <li class="d-none d-lg-block mt-3 text-center" style="list-style: none;">
            <button class="btn btn-sm btn-outline-primary w-100" onclick="toggleDesktopCategories(this); return false;">See More <i class="bi bi-chevron-down"></i></button>
        </li>`;
    }
}

// --- TOGGLE FUNCTIONS ---

// Function for Mobile Button
function toggleMobileCategories(button) {
    var hiddenItems = document.querySelectorAll('.mobile-hidden');
    var isExpanded = button.innerHTML.includes("See Less");

    hiddenItems.forEach(item => {
        if (isExpanded) {
            item.classList.add('d-none'); // Hide them again
        } else {
            item.classList.remove('d-none'); // Show them
        }
    });

    if (isExpanded) {
        button.innerHTML = 'See More <i class="bi bi-chevron-down"></i>';
    } else {
        button.innerHTML = 'See Less <i class="bi bi-chevron-up"></i>';
    }
}

// Function for Desktop Button
function toggleDesktopCategories(button) {
    var hiddenItems = document.querySelectorAll('.desktop-hidden');
    var isExpanded = button.innerHTML.includes("See Less");

    hiddenItems.forEach(item => {
        if (isExpanded) {
            item.classList.add('d-none'); // Hide them again
        } else {
            item.classList.remove('d-none'); // Show them
        }
    });

    if (isExpanded) {
        button.innerHTML = 'See More <i class="bi bi-chevron-down"></i>';
    } else {
        button.innerHTML = 'See Less <i class="bi bi-chevron-up"></i>';
    }
}


// Function to handle the button click
function toggleCategories(btn) {
    var hiddenItems = document.querySelectorAll('.hidden-category');
    hiddenItems.forEach(item => {
        // Toggle the visibility on mobile by removing/adding the 'd-none' class
        item.classList.toggle('d-none');
    });
    
    // Swap text and icon based on state
    if (btn.innerText.includes('See More')) {
        btn.innerHTML = 'See Less <i class="bi bi-chevron-up"></i>';
    } else {
        btn.innerHTML = 'See More <i class="bi bi-chevron-down"></i>';
    }
}

function renderRecentPosts(){
    var list = document.getElementById("dynamic-recent-posts");
    list.innerHTML = "";
    var recent = allPosts.slice(0, 5); // Grab last 5 posts
    
    recent.forEach(post => {
        var title = post.title.$t;
        var linkObj = post.link.find(l => l.rel === "alternate");
        var link = linkObj ? linkObj.href : "#";
        var slug = link.split("/").pop();
        var date = new Date(post.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        var image = extractFirstImage(post.content.$t);

        list.innerHTML += `
        <div class="post-item">
          <img src="${image}" alt="" class="flex-shrink-0" loading="lazy">
          <div>
            <h4><a href="${link}" onclick="loadPost('${slug}', event)">${title}</a></h4>
            <time datetime="${post.published.$t}">${date}</time>
          </div>
        </div>`;
    });
}

function filterCategory(cat){
    filteredPosts = allPosts.filter(p => p.category && p.category.some(c => c.term === cat));
    renderPage(1);
}

// Search Box Logic
const searchInput = document.getElementById("searchInput");

if (searchInput && typeof allPosts !== "undefined") {
  searchInput.addEventListener("keyup", function () {
    const q = this.value.toLowerCase();
    filteredPosts = allPosts.filter(p => p.title.$t.toLowerCase().includes(q));
    renderPage(1);
  });
}

// Single Page Application (SPA) loading for full posts
function loadPost(slug, e){
    if(e) e.preventDefault();
    
    // Show floating back button
    var floatBackBtn = document.getElementById('back-to-posts-float');
    if(floatBackBtn) floatBackBtn.classList.add('active');
    
    var post = allPosts.find(p => {
        var l = p.link.find(link => link.rel === "alternate");
        return l && l.href.includes(slug);
    });
    
    if(!post) return;

    history.pushState(null, null, "?post=" + slug);
    var container = document.getElementById("dynamic-blog-posts");
    
    var title = post.title.$t;
    var date = new Date(post.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    var author = post.author && post.author[0] ? post.author[0].name.$t : "Admin";

    container.innerHTML = `
    <div class="col-12">
        <article class="single-view-article">
            <div class="d-flex mb-4">
               <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" onclick="renderPage(currentPage); return false;">
                 <i class="bi bi-arrow-left me-1"></i> Back to Posts
               </button>
            </div>
            <h2 class="title fw-bold text-dark mb-3" style="font-size: 28px;">${title}</h2>
            <div class="meta-top mb-4 pb-3 border-bottom">
              <ul class="d-flex flex-wrap gap-4 list-unstyled text-muted small mb-0">
                <li><i class="bi bi-person text-primary me-1"></i> ${author}</li>
                <li><i class="bi bi-clock text-primary me-1"></i> <time datetime="${post.published.$t}">${date}</time></li>
              </ul>
            </div>
            <div class="content text-dark">
                ${post.content.$t}
            </div>
        </article>
    </div>`;
    
    document.getElementById('blog-pagination').style.display = 'none';
    document.title = title + " | Future Education";
    
    var canonical = document.querySelector("link[rel=canonical]");
    if(canonical) canonical.setAttribute("href", "https://neet.futeducation.com/blog/" + slug);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle back button for SPA routing
window.addEventListener("popstate", function() {
    var params = new URLSearchParams(window.location.search);
    var postSlug = params.get("post");
    if (postSlug) {
        loadPost(postSlug);
    } else {
        document.title = "Blog - Future Education";
        renderPage(currentPage);
    }
});

/* ==========================================================
   END OF EXTERNAL BLOG JS
   ========================================================== */ 