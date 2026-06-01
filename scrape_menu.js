const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function scrapeMenu() {
  try {
    const res = await fetch('https://texasia.com/');
    const html = await res.text();
    const $ = cheerio.load(html);

    const categories = [];

    // The products menu item usually has a dropdown class
    // We'll look for menu items that have 'PRODUCTS' text
    const productsMenu = $('li').filter((i, el) => {
      return $(el).children('a').text().toUpperCase().includes('PRODUCTS');
    });

    if (productsMenu.length > 0) {
      // Find the sub-menu items (ul > li)
      productsMenu.find('ul.sub-menu > li').each((i, el) => {
        const catName = $(el).children('a').text().trim();
        const catUrl = $(el).children('a').attr('href');
        
        const subCats = [];
        $(el).find('ul.sub-menu > li').each((j, subEl) => {
          subCats.push({
            name: $(subEl).children('a').text().trim(),
            url: $(subEl).children('a').attr('href')
          });
        });

        categories.push({
          name: catName,
          url: catUrl,
          subCategories: subCats
        });
      });
    }

    console.log(JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error('Error scraping:', error);
  }
}

scrapeMenu();
