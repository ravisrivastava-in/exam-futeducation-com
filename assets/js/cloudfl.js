/* ==========================================================
   START OF EXTERNAL BLOG JS
   ========================================================== */

var allPosts = [];
var filteredPosts = [];
var postsPerPage = 4;
var currentPage = 1;

function loadBlogPosts(json){
    allPosts = json.feed.entry || [];
    filteredPosts = allPosts;
    renderCategories();
    renderRecentPosts();
    renderPage(1);
}

function extractFirstImage(content){
    var imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : "assets/img/blog/blog-1.png";
}

function getSlug() {
    const path = window.location.pathname.split("/")[2];
    if (path) return path;
    const params = new URLSearchParams(window.location.search);
    return params.get("post");
}

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

        container.innerHTML += `
        <div class="col-lg-12">
          <a href="/blog/${slug}" onclick="loadPost('${slug}', event)"><article>
            <div class="post-img">
              <img src="${image}" alt="${title}" class="img-fluid" loading="lazy">
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

function toggleMobileCategories(button) {
    var hiddenItems = document.querySelectorAll('.mobile-hidden');
    var isExpanded = button.innerHTML.includes("See Less");

    hiddenItems.forEach(item => {
        if (isExpanded) {
            item.classList.add('d-none');
        } else {
            item.classList.remove('d-none');
        }
    });

    if (isExpanded) {
        button.innerHTML = 'See More <i class="bi bi-chevron-down"></i>';
    } else {
        button.innerHTML = 'See Less <i class="bi bi-chevron-up"></i>';
    }
}

function toggleDesktopCategories(button) {
    var hiddenItems = document.querySelectorAll('.desktop-hidden');
    var isExpanded = button.innerHTML.includes("See Less");

    hiddenItems.forEach(item => {
        if (isExpanded) {
            item.classList.add('d-none');
        } else {
            item.classList.remove('d-none');
        }
    });

    if (isExpanded) {
        button.innerHTML = 'See More <i class="bi bi-chevron-down"></i>';
    } else {
        button.innerHTML = 'See Less <i class="bi bi-chevron-up"></i>';
    }
}

function toggleCategories(btn) {
    var hiddenItems = document.querySelectorAll('.hidden-category');
    hiddenItems.forEach(item => {
        item.classList.toggle('d-none');
    });
    
    if (btn.innerText.includes('See More')) {
        btn.innerHTML = 'See Less <i class="bi bi-chevron-up"></i>';
    } else {
        btn.innerHTML = 'See More <i class="bi bi-chevron-down"></i>';
    }
}

function renderRecentPosts(){
    var list = document.getElementById("dynamic-recent-posts");
    list.innerHTML = "";
    var recent = allPosts.slice(0, 5);
    
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
            <h4><a href="/blog/${slug}" onclick="loadPost('${slug}', event)">${title}</a></h4>
            <time datetime="${post.published.$t}">${date}</time>
          </div>
        </div>`;
    });
}

function filterCategory(cat){
    filteredPosts = allPosts.filter(p => p.category && p.category.some(c => c.term === cat));
    renderPage(1);
}

const searchInput = document.getElementById("searchInput");

if (searchInput && typeof allPosts !== "undefined") {
  searchInput.addEventListener("keyup", function () {
    const q = this.value.toLowerCase();
    filteredPosts = allPosts.filter(p => p.title.$t.toLowerCase().includes(q));
    renderPage(1);
  });
}

function loadPost(slug, e){
    if(e) e.preventDefault();
    
    var floatBackBtn = document.getElementById('back-to-posts-float');
    if(floatBackBtn) floatBackBtn.classList.add('active');
    
    var post = allPosts.find(p => {
        var l = p.link.find(link => link.rel === "alternate");
        return l && l.href.includes(slug);
    });
    
    if(!post) return;

    history.pushState({}, "", `/blog/${slug}`);

    var container = document.getElementById("dynamic-blog-posts");
    
    var title = post.title.$t;
    var content = post.content.$t;
    var cleanText = content.replace(/<[^>]+>/g,"");
    var description = cleanText.substring(0,160);
    var image = extractFirstImage(content);
    var date = new Date(post.published.$t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    var author = post.author && post.author[0] ? post.author[0].name.$t : "Admin";
    var url = "https://neet.futeducation.com/blog/" + slug;

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
                ${content}
            </div>
        </article>
    </div>`;
    
    document.getElementById('blog-pagination').style.display = 'none';

    document.title = title + " | Future Education";
    let metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute("content", description);
    let canonical = document.querySelector("link[rel=canonical]");
    if(canonical) canonical.setAttribute("href", url);

    let faqs = [];
    let matches = content.match(/<strong>(.*?)<\/strong>/g);
    if(matches){
        matches.forEach(q => {
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
    let schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "image": image,
        "author": {"@type": "Person", "name": "Admin"},
        "publisher": {"@type": "Organization", "name": "Future Education"},
        "mainEntityOfPage": url,
        "description": description,
        "mainEntity": faqs
    };
    let old = document.getElementById("schema-json");
    if(old) old.remove();
    let script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "schema-json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener("popstate", function() {
    const slug = getSlug();
    if (slug) {
        loadPost(slug);
    } else {
        document.title = "Blog - Future Education";
        renderPage(currentPage);
    }
});

/* ==========================================================
   END OF EXTERNAL BLOG JS
   ========================================================== */