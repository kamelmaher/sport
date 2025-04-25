module.exports.initPlaywrightPage = async (browser) => {
    const page = await browser.newPage();
    await blockPageRequests(page);
    return page;
  };
  
  async function blockPageRequests(page) {
    const RESOURCE_EXCLUSIONS = ['image', 'media', 'font', 'other'];
  
    await page.route('**/*', (route) => {
      RESOURCE_EXCLUSIONS.includes(route.request().resourceType()) || 
      route.request().url().startsWith('https://googleads.') 
        ? route.abort()
        : route.continue();
    });
  }