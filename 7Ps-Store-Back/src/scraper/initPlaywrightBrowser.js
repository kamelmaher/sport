const { chromium } = require('playwright-chromium');

const args = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--single-process',
  '--no-zygote',
  '--window-position=0,0',
  '--ignore-certificate-errors',
  '--ignore-certificate-errors-skip-list',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--disable-gpu',
  '--disable-notifications',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-component-extensions-with-background-pages',
  '--disable-extensions',
  '--disable-features=TranslateUI,BlinkGenPropertyTrees',
  '--disable-ipc-flooding-protection',
  '--disable-renderer-backgrounding',
  '--enable-features=NetworkService,NetworkServiceInProcess',
  '--metrics-recording-only',
  '--mute-audio',
];

module.exports.initPlaywrightBrowser = async () => {
  try {
    console.log('Initializing browser in headless mode');
    return await chromium.launch({ 
      headless: true, // Always use headless mode in container environments
      args,
      timeout: Number(process.env.PLAYWRIGHT_TIMEOUT) || 120000 // 2 minute timeout for launch
    });
  } catch (error) {
    console.error('Failed to initialize browser:', error.message);
    throw error;
  }
};
