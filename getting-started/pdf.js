const puppeteer = require('puppeteer')

(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1024,
    height: 800
  })

  await page.goto(
    'https://golang.org/doc/tutorial/getting-started',
    { waitUntil: 'networkidle0', timeout: 0 }
  )
  await page.pdf({ path: 'print.pdf', format: 'A4' })

  await page.close()
  await browser.close()
})()
