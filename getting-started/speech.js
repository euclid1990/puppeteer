const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const DEFAULT_TXT = 'みなさん、はじめまして。わたしは「パペティア」です。宜しくお願いします。'

(async () => {
  // Launch Chrome
  const browser = await puppeteer.launch({
    headless: false, // Speech synth API doesn't work in headless.
    args: [
      '--window-size=0,0', // Launch baby window for fun.
      '--window-position=0,0',
      '--enable-speech-dispatcher' // Needed for Linux?
    ]
  })
  const page = await browser.newPage()

  // Clever way to "communicate with page". Know when speech is done.
  page.on('console', async msg => {
    if (msg.text() === 'SPEECH_DONE') {
      await browser.close()
    }
  })

  // Get txt parameter
  const flagIdx = process.argv.findIndex(item => item === '-t')
  const text = flagIdx === -1 ? DEFAULT_TXT : process.argv.slice(flagIdx + 1).join(' ')

  // Inject global variable
  await page.evaluateOnNewDocument(text => { window.TEXT2SPEECH = text }, text)

  // Load HTML content into memory
  const html = fs.readFileSync(`${path.dirname(__filename)}/speech.html`, { encoding: 'utf-8' })
  // Cause a navigation so the evaluateOnNewDocument kicks in.
  await page.goto(`data:text/html,${html}`)
  // Click button to start speaking
  const button = await page.$('button')
  button.click()
})()
