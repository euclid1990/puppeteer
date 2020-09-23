const puppeteer = require('puppeteer')
const _ = require('lodash')

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.setViewport({ width: 1024, height: 768 })
  await page.goto('https://codepen.io/Rawnly/full/NYgEYo', { waitUntil: 'networkidle0', timeout: 0 })

  // Move mouse around screen
  const radius = 150
  const centerX = 512
  const centerY = 384
  const steps = 400
  for (const i of _.range(steps)) {
    const x = centerX + radius * Math.cos(2 * Math.PI * i / steps)
    const y = centerY + radius * Math.sin(2 * Math.PI * i / steps)
    await page.mouse.move(x, y)
  }

  await browser.close()
})()
