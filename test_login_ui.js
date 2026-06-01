const { chromium } = require('playwright'); // if available, or puppeteer

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/admin/login');
    
    await page.fill('input[type="email"]', 'admin@texasia.local');
    await page.fill('input[type="password"]', 'ChangeMe123!');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    // Check if we are redirected to /admin/dashboard
    const url = page.url();
    console.log('Final URL:', url);
    
    if (url.includes('/admin/dashboard')) {
      console.log('LOGIN SUCCESSFUL!');
    } else {
      console.log('LOGIN FAILED. Current URL:', url);
      // Wait a bit to see if there's a toast error
      await page.waitForTimeout(1000);
      const toastText = await page.evaluate(() => document.body.innerText);
      if (toastText.includes('Invalid email or password')) {
         console.log('Error toast found on screen.');
      }
    }
    
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
