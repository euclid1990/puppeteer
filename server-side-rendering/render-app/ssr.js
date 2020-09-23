const puppeteer = require('puppeteer')

// In-memory cache of rendered pages. Note: this will be cleared whenever the server process stops.
const RENDER_CACHE = new Map()

async function ssr (url) {
  if (RENDER_CACHE.has(url)) {
    // return { html: RENDER_CACHE.get(url), ttRenderMs: 0 }
  }

  const start = Date.now()

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Intercept network requests.
  await page.setRequestInterception(true)

  page.on('request', req => {
    // Don't load Google Analytics lib requests so pageviews aren't 2x.
    const blocklist = ['www.google-analytics.com', '/gtag/js', 'ga.js', 'analytics.js']
    if (blocklist.find(regex => req.url().match(regex))) {
      return req.abort()
    }
    // Ignore requests for resources that don't produce DOM
    // (images, stylesheets, media).
    const allowlist = ['document', 'script', 'xhr', 'fetch', 'other']
    if (!allowlist.includes(req.resourceType())) {
      return req.abort()
    }
    // Pass through all other requests.
    req.continue()
  })

  try {
    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.waitForSelector('#topics, #empty-topics, #topic, #about, #signup', { timeout: 0 }) // ensure #topics exists in the DOM.
    console.log('Found wrapper element')
  } catch (err) {
    console.error(err)
    throw new Error('page.goto/waitForSelector timed out.')
  }

  // Change content of element
  // await page.$eval('#about h2', element => element.innerText = 'About');

  // Wait N miliseconds before continuing to the next line
  // await page.waitFor(100000);

  // Inject global variable to make initial data state
  const initialData = await page.evaluate(() => window.INITIAL_DATA)

  // Inject javascript inside <head> tag
  await page.addScriptTag({ content: `window.PRE_RENDERED = true; window.INITIAL_DATA = ${JSON.stringify(initialData)}` })

  const html = await page.content() // serialized HTML of page DOM.

  await page.close()
  await browser.close()

  const ttRenderMs = Date.now() - start
  console.info(`Headless rendered page in: ${url} ${ttRenderMs}ms`)

  RENDER_CACHE.set(url, html) // cache rendered page.

  return { html, ttRenderMs }
}

module.exports = ssr
