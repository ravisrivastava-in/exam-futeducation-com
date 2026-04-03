  const fs = require('fs');
  const path = require('path');
  const { SitemapStream, streamToPromise } = require('sitemap');

  const hostname = 'https://neet.futeducation.com';

  /* ===============================
    GLOBAL CONFIGURATION
  ================================ */

  // Folders to completely ignore
  const excludedFolders = [
    'admin',
    'login',
    'node_modules',
    '.git',
    'functions',
    '.vscode'
  ];

  // Files containing these words will be excluded
  const excludedKeywords = [
  '404',
  'starter',
  'copy',
  'test',
  'dashboard',
  'header',
  'crm',
  'footer'
  ];

  /* ===============================
    STORAGE ARRAYS FOR REPORT
  ================================ */

  let includedFiles = [];
  let excludedFiles = [];
  let allHtmlFiles = [];

  /* ===============================
    PRIORITY BASED ON DEPTH
  ================================ */

  function calculatePriority(url) {
    if (url === '/') return 1.0;

    const depth = url.split('/').filter(Boolean).length;

    if (depth === 1) return 0.95;
    if (depth === 2) return 0.9;
    if (depth === 3) return 0.85;
    if (depth === 4) return 0.8;

    return 0.75;
  }

  /* ===============================
    CHANGEFREQ BASED ON DEPTH
  ================================ */

  function calculateChangeFreq(depth) {
    if (depth <= 1) return 'weekly';
    if (depth === 2) return 'weekly';
    if (depth === 3) return 'monthly';
    return 'monthly';
  }

  /* ===============================
    DIRECTORY SCANNER
  ================================ */

  function scanDirectory(dirPath, level = 0) {
    let urls = [];
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      const relativePath = path.relative(process.cwd(), fullPath);

      if (fs.statSync(fullPath).isDirectory()) {

        if (!excludedFolders.includes(file)) {

          const indent = '  '.repeat(level);
          console.log(`${indent}// ${file} starts`);

          urls = urls.concat(scanDirectory(fullPath, level + 1));

          console.log(`${indent}// ${file} ends`);
        }

      } else if (file.endsWith('.html')) {

        allHtmlFiles.push(relativePath);

        if (!excludedKeywords.some(word => file.toLowerCase().includes(word))) {

          let url = '/' + relativePath
            .replace(/\\/g, '/')
            .replace('.html', '')
            .replace('index', '');

          const depth = url.split('/').filter(Boolean).length;

          const indent = '  '.repeat(level);
          console.log(`${indent}// ${file.replace('.html','')}`);

          includedFiles.push(relativePath);

          urls.push({
            url,
            lastmod: fs.statSync(fullPath).mtime.toISOString(),
            priority: calculatePriority(url),
            changefreq: calculateChangeFreq(depth)
          });

        } else {
          excludedFiles.push(relativePath);
        }
      }
    });

    return urls;
  }

  /* ===============================
    MAIN GENERATOR
  ================================ */

  (async () => {
    try {
      console.log('\n🚀 Scanning Project Structure...\n');

      const sitemap = new SitemapStream({ hostname });

      const urls = scanDirectory('./');

      urls.forEach(entry => sitemap.write(entry));

      sitemap.end();

      const sitemapOutput = await streamToPromise(sitemap);
      fs.writeFileSync('./sitemap.xml', sitemapOutput.toString());

      /* ===============================
        GENERATE VERIFICATION REPORT
      ================================= */

      const report = `
  ==============================
  SITEMAP VERIFICATION REPORT
  ==============================

  TOTAL HTML FILES FOUND: ${allHtmlFiles.length}
  INCLUDED IN SITEMAP: ${includedFiles.length}
  EXCLUDED FILES: ${excludedFiles.length}

  ------------------------------
  INCLUDED FILES
  ------------------------------
  ${includedFiles.join('\n')}

  ------------------------------
  EXCLUDED FILES
  ------------------------------
  ${excludedFiles.join('\n')}
  `;

      fs.writeFileSync('./sitemap-report.txt', report);

      console.log('\n📊 Verification Report Created → sitemap-report.txt');
      console.log('✅ SITEMAP GENERATED SUCCESSFULLY!\n');

    } catch (err) {
      console.error('❌ ERROR:', err);
    }
  })();