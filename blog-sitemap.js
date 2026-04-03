const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');

const hostname = 'https://neet.futeducation.com';

async function generateBlogSitemap() {
  try {
    console.log("🚀 Fetching Blogger Posts...");

    let startIndex = 1;
    let allPosts = [];

    // Blogger API max 500 per request → loop
    while (true) {
      const url = `https://blog.futeducation.com/feeds/posts/default?alt=json&start-index=${startIndex}&max-results=500`;
      const response = await fetch(url);
      const data = await response.json();

      const posts = data.feed.entry;
      if (!posts) break;

      allPosts = allPosts.concat(posts);

      if (posts.length < 500) break;
      startIndex += 500;
    }

    console.log(`📄 Total Blogger Posts Found: ${allPosts.length}`);

    const sitemap = new SitemapStream({ hostname });

    allPosts.forEach(post => {
      const link = post.link.find(l => l.rel === "alternate").href;
      const slug = link.split('/').pop();
      const updated = post.updated.$t;

      sitemap.write({
        url: `/blog/${slug}`,
        lastmod: updated,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    sitemap.end();

    const sitemapOutput = await streamToPromise(sitemap);
    fs.writeFileSync('./blog-sitemap.xml', sitemapOutput.toString());

    console.log("✅ Blog Sitemap Generated → blog-sitemap.xml");

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

generateBlogSitemap();