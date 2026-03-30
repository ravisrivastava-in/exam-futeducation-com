/* ==========================================================
   START OF EXTERNAL BLOG JS — SEO OPTIMIZED
   ========================================================== */

var allPosts = [];
var filteredPosts = [];
var postsPerPage = 4;
var currentPage = 1;
var pendingSlug = null;

// ================= GET SLUG =================
function getSlug() {
    var path = window.location.pathname.split("/blog/")[1];
    if (path) return path;

    var params = new URLSearchParams(window.location.search);
    return params.get("post");
}

// ================= LOAD BLOG =================
function loadBlogPosts(json){
    allPosts = json.feed.entry || [];
    filteredPosts = allPosts;
    renderCategories();
    renderRecentPosts();

    var slug = pendingSlug || getSlug();
    pendingSlug = null;

    if (slug) {
        loadPost(slug);
    } else {
        renderPage(1);
    }
}

// ================= HELPERS =================
function extractFirstImage(content){
    if(!content) return "assets/img/blog/blog-1.png";
    var imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
    if(imgMatch && imgMatch[1] && imgMatch[1].trim() !== "" && imgMatch[1] !== "#"){
        var src = imgMatch[1];
        if(src.startsWith("//")) src = "https:" + src;
        return src;
    }
    return "assets/img/blog/blog-1.png";
}

// ================= LIST VIEW =================
function renderPage(page){
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

    posts.forEach(function(post) {
        var title = post.title.$t;
        var linkObj = post.link.find(function(l){ return l.rel === "alternate"; });
        var link = linkObj ? linkObj.href : "#";
        var slug = link.split("/").pop();
        var date = new Date(post.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        var author = post.author && post.author[0] ? post.author[0].name.$t : "Admin";
        var content = post.content.$t;
        var summary = content.replace(/<[^>]+>/g,"").substring(0,250);
        var image = extractFirstImage(content);

        container.innerHTML += `
        <div class="col-lg-12">
          <a href="/blog/${slug}" onclick="loadPost('${slug}', event)"><article>
            <div class="post-img">
              <img src="${image}" alt="${title}" class="img-fluid" loading="lazy" onerror="this.onerror=null;this.src='assets/img/blog/blog-1.png';">
            </div>
            <h2 class="title">
              <a href="/blog/${slug}" onclick="loadPost('${slug}', event)">${title}</a>
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
                <a href="/blog/${slug}" onclick="loadPost('${slug}', event)">Read More</a>
              </div>
            </div>
          </article></a>
        </div>`;
    });

    renderPagination();
    document.getElementById('blog-pagination').style.display = 'block';

    document.title = "Blog - Future Education";
    var canonical = document.querySelector("link[rel=canonical]");
    if(canonical) canonical.setAttribute("href", "https://neet.futeducation.com/blog");
    var metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute("content", "Latest NEET UG 2026 updates, MBBS admission news, counselling guidance and preparation strategies.");

    var oldSchema = document.getElementById("schema-json");
    if(oldSchema) oldSchema.remove();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= PAGINATION =================
function renderPagination(){
    var totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    var pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if(totalPages <= 1) return;

    pagination.innerHTML += `<li><a href="#" onclick="if(currentPage > 1) renderPage(currentPage - 1); return false;"><i class="bi bi-chevron-left"></i></a></li>`;

    for(var i=1; i<=totalPages; i++){
        if(i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
           pagination.innerHTML += `<li><a href="#" class="${i===currentPage ? 'active' : ''}" onclick="renderPage(${i}); return false;">${i}</a></li>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
           pagination.innerHTML += `<li>...</li>`;
        }
    }

    pagination.innerHTML += `<li><a href="#" onclick="if(currentPage < ${totalPages}) renderPage(currentPage + 1); return false;"><i class="bi bi-chevron-right"></i></a></li>`;
}

// ================= CATEGORIES =================
function renderCategories(){
    var categories = {};
    allPosts.forEach(function(p){
        if(p.category){
            p.category.forEach(function(c){
                categories[c.term] = (categories[c.term] || 0) + 1;
            });
        }
    });

    var list = document.getElementById("dynamic-categories");
    list.innerHTML = "";

    var catNames = Object.keys(categories);

    catNames.forEach(function(cat, index) {
        var hiddenClass = '';

        if (index >= 58) {
            hiddenClass = 'd-none mobile-hidden desktop-hidden';
        } else if (index >= 6) {
            hiddenClass = 'd-none d-lg-block mobile-hidden';
        }

        list.innerHTML += `<li class="${hiddenClass}"><a href="#" onclick="filterCategory('${cat}'); return false;">${cat} <span>(${categories[cat]})</span></a></li>`;
    });

    if(catNames.length > 6){
        list.innerHTML += `
        <li class="d-lg-none mt-3 text-center" style="list-style: none;">
            <button class="btn btn-sm btn-outline-primary w-100" onclick="toggleMobileCategories(this); return false;">See More <i class="bi bi-chevron-down"></i></button>
        </li>`;
    }

    if(catNames.length > 50){
        list.innerHTML += `
        <li class="d-none d-lg-block mt-3 text-center" style="list-style: none;">
            <button class="btn btn-sm btn-outline-primary w-100" onclick="toggleDesktopCategories(this); return false;">See More <i class="bi bi-chevron-down"></i></button>
        </li>`;
    }
}

// ================= TOGGLE FUNCTIONS =================
function toggleMobileCategories(button) {
    var hiddenItems = document.querySelectorAll('.mobile-hidden');
    var isExpanded = button.innerHTML.includes("See Less");

    hiddenItems.forEach(function(item) {
        if (isExpanded) {
            item.classList.add('d-none');
        } else {
            item.classList.remove('d-none');
        }
    });

    button.innerHTML = isExpanded
        ? 'See More <i class="bi bi-chevron-down"></i>'
        : 'See Less <i class="bi bi-chevron-up"></i>';
}

function toggleDesktopCategories(button) {
    var hiddenItems = document.querySelectorAll('.desktop-hidden');
    var isExpanded = button.innerHTML.includes("See Less");

    hiddenItems.forEach(function(item) {
        if (isExpanded) {
            item.classList.add('d-none');
        } else {
            item.classList.remove('d-none');
        }
    });

    button.innerHTML = isExpanded
        ? 'See More <i class="bi bi-chevron-down"></i>'
        : 'See Less <i class="bi bi-chevron-up"></i>';
}

function toggleCategories(btn) {
    var hiddenItems = document.querySelectorAll('.hidden-category');
    hiddenItems.forEach(function(item) {
        item.classList.toggle('d-none');
    });

    if (btn.innerText.includes('See More')) {
        btn.innerHTML = 'See Less <i class="bi bi-chevron-up"></i>';
    } else {
        btn.innerHTML = 'See More <i class="bi bi-chevron-down"></i>';
    }
}

// ================= RECENT POSTS =================
function renderRecentPosts(){
    var list = document.getElementById("dynamic-recent-posts");
    list.innerHTML = "";
    var recent = allPosts.slice(0, 5);

    recent.forEach(function(post) {
        var title = post.title.$t;
        var linkObj = post.link.find(function(l){ return l.rel === "alternate"; });
        var link = linkObj ? linkObj.href : "#";
        var slug = link.split("/").pop();
        var date = new Date(post.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        var image = extractFirstImage(post.content.$t);

        list.innerHTML += `
        <div class="post-item">
          <img src="${image}" alt="" class="flex-shrink-0" loading="lazy" onerror="this.onerror=null;this.src='assets/img/blog/blog-1.png';">
          <div>
            <h4><a href="/blog/${slug}" onclick="loadPost('${slug}', event)">${title}</a></h4>
            <time datetime="${post.published.$t}">${date}</time>
          </div>
        </div>`;
    });
}

// ================= FILTER & SEARCH =================
function filterCategory(cat){
    filteredPosts = allPosts.filter(function(p) {
        return p.category && p.category.some(function(c){ return c.term === cat; });
    });
    renderPage(1);
}

var searchInput = document.getElementById("searchInput");
if (searchInput && typeof allPosts !== "undefined") {
    searchInput.addEventListener("keyup", function () {
        var q = this.value.toLowerCase();
        filteredPosts = allPosts.filter(function(p) {
            return p.title.$t.toLowerCase().includes(q);
        });
        renderPage(1);
    });
}

// ================= SINGLE POST VIEW =================
function loadPost(slug, e){
    if(e) e.preventDefault();

    var floatBackBtn = document.getElementById('back-to-posts-float');
    if(floatBackBtn) floatBackBtn.classList.add('active');

    var post = allPosts.find(function(p) {
        var l = p.link.find(function(link){ return link.rel === "alternate"; });
        return l && l.href.includes(slug);
    });

    if(!post){
        if(allPosts.length === 0){
            pendingSlug = slug;
        }
        return;
    }

    history.pushState({page: "post", slug: slug}, "", "/blog/" + slug);

    var container = document.getElementById("dynamic-blog-posts");

    var title = post.title.$t;
    var content = post.content.$t;
    var date = new Date(post.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    var author = post.author && post.author[0] ? post.author[0].name.$t : "Admin";
    var image = extractFirstImage(content);
    var url = "https://neet.futeducation.com/blog/" + slug;

    var cleanText = content.replace(/<[^>]+>/g,"");
    var description = cleanText.substring(0, 160);

    container.innerHTML = `
    <div class="col-12">
        <article class="single-view-article">
            <div class="d-flex mb-4">
               <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" onclick="goBackToBlog(); return false;">
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
                ${content}
            </div>
        </article>
    </div>`;

    document.getElementById('blog-pagination').style.display = 'none';

    document.title = title + " | Future Education";

    var metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute("content", description);

    var canonical = document.querySelector("link[rel=canonical]");
    if(canonical) canonical.setAttribute("href", url);

    var faqs = [];
    var matches = content.match(/<strong>(.*?)<\/strong>/g);
    if(matches){
        matches.forEach(function(q){
            faqs.push({
                "@type": "Question",
                "name": q.replace(/<[^>]+>/g,""),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Refer article content"
                }
            });
        });
    }

    var schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "image": image,
        "datePublished": post.published.$t,
        "dateModified": post.updated ? post.updated.$t : post.published.$t,
        "author": {"@type": "Person", "name": author},
        "publisher": {"@type": "Organization", "name": "Future Education"},
        "mainEntityOfPage": url,
        "description": description
    };

    if(faqs.length > 0){
        schema["mainEntity"] = faqs;
    }

    var oldSchema = document.getElementById("schema-json");
    if(oldSchema) oldSchema.remove();
    var schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "schema-json";
    schemaScript.textContent = JSON.stringify(schema);
    document.head.appendChild(schemaScript);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= BACK TO BLOG =================
function goBackToBlog(){
    history.pushState({page: "list"}, "", "/blog/");
    renderPage(currentPage);
}

// ================= BACK BUTTON SUPPORT =================
window.addEventListener("popstate", function(e) {
    if(e.state && e.state.page === "post" && e.state.slug){
        loadPost(e.state.slug);
        return;
    }

    if(e.state && e.state.page === "list"){
        renderPage(currentPage);
        return;
    }

    var slug = getSlug();
    if (slug) {
        loadPost(slug);
    } else {
        document.title = "Blog - Future Education";
        renderPage(currentPage);
    }
});

/* ==========================================================
   END OF EXTERNAL BLOG JS — SEO OPTIMIZED
   ========================================================== */