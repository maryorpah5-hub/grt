const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
    console.log('Launching headless browser to bypass Cloudflare...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Set a normal user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    // Go to the site and wait until fully loaded (handles Cloudflare challenge)
    await page.goto('https://faxmove.com/', { waitUntil: 'networkidle2' });
    
    // Scroll through the full page to trigger all lazy-loaded images
    console.log('Scrolling page to load all images...');
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < pageHeight; y += 400) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
        await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 1500)); // Final wait for all lazy images
    
    // Extract image URLs — including lazy-loaded data-src and srcset
    const urls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const allUrls = new Set();
        imgs.forEach(img => {
            if (img.src && !img.src.startsWith('data:')) allUrls.add(img.src);
            if (img.dataset.src) allUrls.add(img.dataset.src);
            if (img.srcset) {
                img.srcset.split(',').forEach(s => {
                    const u = s.trim().split(' ')[0];
                    if (u) allUrls.add(u);
                });
            }
        });
        // Also grab background images from style attributes
        document.querySelectorAll('[style*="url("]').forEach(el => {
            const match = el.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
            if (match && match[1] && !match[1].startsWith('data:')) allUrls.add(match[1]);
        });
        return [...allUrls];
    });
    
    console.log(`Found ${urls.length} images. Downloading...`);
    
    // Get cookies from the authenticated session
    const cookies = await page.cookies();
    const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    
    const outDir = path.join(__dirname, 'src', 'assets', 'faxmove_assets');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    
    // Function to download an image using the browser's cookies
    const downloadImage = (url, filepath) => {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'Cookie': cookieString,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'Referer': 'https://faxmove.com/'
                }
            };
            
            https.get(url, options, (res) => {
                if (res.statusCode === 200) {
                    const file = fs.createWriteStream(filepath);
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                } else if (res.statusCode === 301 || res.statusCode === 302) {
                    // Handle redirects if needed
                    https.get(res.headers.location, options, (redirectRes) => {
                         const file = fs.createWriteStream(filepath);
                         redirectRes.pipe(file);
                         file.on('finish', () => {
                             file.close();
                             resolve();
                         });
                    }).on('error', reject);
                } else {
                    reject(new Error(`Status code: ${res.statusCode}`));
                }
            }).on('error', reject);
        });
    };

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        let filename = url.split('/').pop().split('?')[0];
        if (!filename) filename = `image_${i}.png`;
        
        const filepath = path.join(outDir, filename);
        
        try {
            await downloadImage(url, filepath);
            console.log(`✅ Saved: ${filename}`);
        } catch (e) {
            console.error(`❌ Failed to download ${filename}:`, e.message);
        }
    }
    
    await browser.close();
    console.log(`\nAll done! Images are in ${outDir}`);
})();
