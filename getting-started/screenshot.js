const puppeteer = require('puppeteer')

(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1024,
    height: 800
  })

  await page.goto('https://google.com')
  await page.screenshot({ path: 'screenshot.png', fullPage: true })

  await page.close()
  await browser.close()
})()
