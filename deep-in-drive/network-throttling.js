/*
  - These values are probably average values for each type of connection
  - / 8 operations are because network speed is commonly measured in bits/s, while DevTools expects the throughputs in bytes/s!
*/
const NETWORK_PRESETS = {
  GPRS: {
    offline: false,
    downloadThroughput: 50 * 1024 / 8,
    uploadThroughput: 20 * 1024 / 8,
    latency: 500
  },
  Regular2G: {
    offline: false,
    downloadThroughput: 250 * 1024 / 8,
    uploadThroughput: 50 * 1024 / 8,
    latency: 300
  },
  Good2G: {
    offline: false,
    downloadThroughput: 450 * 1024 / 8,
    uploadThroughput: 150 * 1024 / 8,
    latency: 150
  },
  Regular3G: {
    offline: false,
    downloadThroughput: 750 * 1024 / 8,
    uploadThroughput: 250 * 1024 / 8,
    latency: 100
  },
  Good3G: {
    offline: false,
    downloadThroughput: 1.5 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
    latency: 40
  },
  Regular4G: {
    offline: false,
    downloadThroughput: 4 * 1024 * 1024 / 8,
    uploadThroughput: 3 * 1024 * 1024 / 8,
    latency: 20
  },
  DSL: {
    offline: false,
    downloadThroughput: 2 * 1024 * 1024 / 8,
    uploadThroughput: 1 * 1024 * 1024 / 8,
    latency: 5
  },
  WiFi: {
    offline: false,
    downloadThroughput: 30 * 1024 * 1024 / 8,
    uploadThroughput: 15 * 1024 * 1024 / 8,
    latency: 2
  }
}

const puppeteer = require('puppeteer')

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Setup custom network speed
  const network = 'WiFi'
  if (network && NETWORK_PRESETS[network]) {
    const client = await page.target().createCDPSession()
    await client.send('Network.emulateNetworkConditions', NETWORK_PRESETS[network])
  }

  await page.setViewport({ width: 1280, height: 768 })
  await page.goto('https://www.speedtest.net/', { waitUntil: 'networkidle0', timeout: 0 })

  await page.waitForSelector('title')
  await page.click('a.test-mode-multi')
  await page.waitForFunction(() => document.querySelector('.result-container-meta .result-item-id .result-data').innerText.length !== 0, { timeout: 0 })
  await page.waitForTimeout(10000)

  await browser.close()
})()
