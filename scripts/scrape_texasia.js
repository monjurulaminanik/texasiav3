const { chromium } = require('playwright');
const fs = require('fs');

async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to Texasia...");
  await page.goto('https://texasia.com/', { waitUntil: 'domcontentloaded' });

  // Get the first menu item containing 'PRODUCTS'
  const categories = await page.evaluate(() => {
    // The main menu is usually within a specific header nav
    const productMenu = Array.from(document.querySelectorAll('li')).find(li => 
      li.querySelector('a') && li.querySelector('a').innerText.toUpperCase().trim() === 'PRODUCTS'
    );
    
    if (!productMenu) return [];
    
    const results = [];
    // Only grab immediate children to avoid nesting issues
    const mainCats = productMenu.querySelectorAll(':scope > ul.sub-menu > li');
    
    mainCats.forEach(cat => {
      const catAnchor = cat.querySelector(':scope > a');
      if (!catAnchor) return;
      
      const subCats = [];
      const subCatEls = cat.querySelectorAll(':scope > ul.sub-menu > li');
      subCatEls.forEach(sub => {
        const subAnchor = sub.querySelector('a');
        if (subAnchor) {
          subCats.push({
            name: subAnchor.innerText.trim(),
            url: subAnchor.href
          });
        }
      });
      
      results.push({
        name: catAnchor.innerText.trim(),
        url: catAnchor.href,
        subCategories: subCats
      });
    });
    
    return results;
  });

  console.log(`Found ${categories.length} main categories.`);
  
  // Scrape products for each category/subcategory
  for (const cat of categories) {
    if (cat.subCategories.length > 0) {
      for (const subCat of cat.subCategories) {
        console.log(`Scraping products for subcategory: ${subCat.name} (${subCat.url}) ...`);
        try {
          await page.goto(subCat.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          
          const products = await page.evaluate(() => {
            const productEls = Array.from(document.querySelectorAll('.product, .type-product, .portfolio-item')).slice(0, 5);
            return productEls.map(el => {
              const titleEl = el.querySelector('.woocommerce-loop-product__title, h2, h3, .portfolio-title');
              const imgEl = el.querySelector('img');
              const linkEl = el.querySelector('a');
              return {
                name: titleEl ? titleEl.innerText.trim() : 'Unnamed Product',
                image: imgEl ? (imgEl.getAttribute('data-src') || imgEl.src) : '',
                url: linkEl ? linkEl.href : ''
              };
            });
          });
          subCat.products = products;
        } catch (e) {
          console.log(`Failed to scrape ${subCat.url}: ${e.message}`);
          subCat.products = [];
        }
      }
    } else {
      console.log(`Scraping products for category: ${cat.name} (${cat.url}) ...`);
      try {
        await page.goto(cat.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        const products = await page.evaluate(() => {
          const productEls = Array.from(document.querySelectorAll('.product, .type-product, .portfolio-item')).slice(0, 5);
          return productEls.map(el => {
            const titleEl = el.querySelector('.woocommerce-loop-product__title, h2, h3, .portfolio-title');
            const imgEl = el.querySelector('img');
            const linkEl = el.querySelector('a');
            return {
              name: titleEl ? titleEl.innerText.trim() : 'Unnamed Product',
              image: imgEl ? (imgEl.getAttribute('data-src') || imgEl.src) : '',
              url: linkEl ? linkEl.href : ''
            };
          });
        });
        cat.products = products;
      } catch (e) {
        console.log(`Failed to scrape ${cat.url}: ${e.message}`);
        cat.products = [];
      }
    }
  }

  fs.writeFileSync('scraped_data.json', JSON.stringify(categories, null, 2));
  console.log("Scraping completed. Data saved to scraped_data.json");
  await browser.close();
}

scrape();
