const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const outDir = path.join(__dirname, 'src', 'assets', 'faxmove_assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Download helper that follows redirects
function downloadFile(url, filepath, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Referer': 'https://faxmove.com/',
                ...extraHeaders
            }
        };
        const req = lib.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadFile(res.headers.location, filepath, extraHeaders).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
            file.on('error', reject);
        });
        req.on('error', reject);
    });
}

// Upgrade a WordPress CDN URL to its highest resolution
function upgradeWpUrl(url) {
    try {
        const u = new URL(url);
        // Remove dimension-limiting params and request full size
        u.searchParams.delete('fit');
        u.searchParams.delete('resize');
        u.searchParams.delete('w');
        u.searchParams.delete('h');
        u.searchParams.set('w', '1800');
        u.searchParams.set('ssl', '1');
        return u.toString();
    } catch {
        return url;
    }
}

(async () => {
    console.log('Launching headless browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    console.log('Loading faxmove.com...');
    await page.goto('https://faxmove.com/', { waitUntil: 'networkidle2', timeout: 60000 });

    // Scroll the whole page to trigger lazy loading
    console.log('Scrolling to load all lazy images...');
    let lastHeight = 0;
    while (true) {
        const scrollHeight = await page.evaluate(() => {
            window.scrollBy(0, 500);
            return document.body.scrollHeight;
        });
        await new Promise(r => setTimeout(r, 300));
        if (scrollHeight === lastHeight) break;
        lastHeight = scrollHeight;
    }
    await new Promise(r => setTimeout(r, 2000));

    // Extract ALL unique image/video URLs from the fully-scrolled page
    const rawUrls = await page.evaluate(() => {
        const found = new Set();
        document.querySelectorAll('img').forEach(img => {
            [img.src, img.dataset.src, img.dataset.lazySrc].forEach(u => u && !u.startsWith('data:') && found.add(u));
            // Pick only the LARGEST entry from srcset
            if (img.srcset) {
                const entries = img.srcset.split(',').map(s => {
                    const [url, w] = s.trim().split(/\s+/);
                    return { url, w: parseInt(w) || 0 };
                });
                entries.sort((a, b) => b.w - a.w);
                if (entries[0]?.url) found.add(entries[0].url);
            }
        });
        document.querySelectorAll('video, source').forEach(el => {
            if (el.src && !el.src.startsWith('data:')) found.add(el.src);
        });
        document.querySelectorAll('[data-background]').forEach(el => found.add(el.dataset.background));
        document.querySelectorAll('[style]').forEach(el => {
            const bg = el.style.backgroundImage;
            const m = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
            if (m?.[1] && !m[1].startsWith('data:')) found.add(m[1]);
        });
        return [...found].filter(Boolean);
    });

    const cookies = await page.cookies();
    const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    await browser.close();

    // Deduplicate by filename (keep first occurrence)
    const seenNames = new Set();
    const toDownload = [];
    for (const rawUrl of rawUrls) {
        // Upgrade WordPress CDN URLs to full resolution
        const url = rawUrl.includes('wp.com') || rawUrl.includes('wp-content') ? upgradeWpUrl(rawUrl) : rawUrl;
        let filename = url.split('/').pop().split('?')[0];
        if (!filename || filename === '') filename = `image_${toDownload.length}.bin`;
        if (seenNames.has(filename)) continue;
        seenNames.add(filename);
        toDownload.push({ url, filename });
    }

    console.log(`\nFound ${toDownload.length} unique media files. Downloading...\n`);
    let success = 0;
    for (const { url, filename } of toDownload) {
        const filepath = path.join(outDir, filename);
        try {
            await downloadFile(url, filepath, { Cookie: cookieString });
            const size = fs.statSync(filepath).size;
            if (size < 100) {
                fs.unlinkSync(filepath);
                console.log(`⚠️  Skipped (too small): ${filename}`);
            } else {
                success++;
                console.log(`✅ Saved: ${filename} (${(size/1024).toFixed(1)} KB)`);
            }
        } catch (e) {
            console.error(`❌ Failed: ${filename} — ${e.message}`);
        }
    }

    console.log(`\nDone! ${success} real images saved to ${outDir}`);
})();
