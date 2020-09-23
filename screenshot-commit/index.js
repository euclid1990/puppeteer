const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const gm = require('./gm')
const BASE_BRANCH = 'master'
const BASE_URL = 'http://localhost:3000'
const BASE_PATH = `${path.dirname(__filename)}/screenshots`

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error, stdout, stderr) => {
    if (error) {
     console.warn(error);
    }
    resolve(stdout? stdout : stderr);
   });
  });
}

async function screenshot (url, file) {
  const fPath = `${BASE_PATH}/${file}.png`
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1024,
    height: 800
  })
  await page.goto(url)
  await page.screenshot({ path: fPath, fullPage: true })
  await page.close()
  await browser.close()
  return fPath
}

async function diffScreenshot (baseBranch, baseUrl, route) {
  // Get current git branch name
  const currentBranch = await execCommand('git rev-parse --abbrev-ref HEAD')
  const newScreenshot = await screenshot(path.join(baseUrl, route), 'new')
  // Checkout base branch to get old screenshot
  const checkout = await exec(`git checkout ${BASE_BRANCH}`)
  await sleep(5000)
  const oldScreenshot = await screenshot(path.join(baseUrl, route), 'old')
  // Return current branch
  await execCommand(`git checkout ${currentBranch}`)
  await sleep(1000)
  // Start create diff image screenshot between old and new version
  const diffScreenshot = `${BASE_PATH}/diff.png`
  const appendScreenshot = `${BASE_PATH}/append.png`
  const animateScreenshot = `${BASE_PATH}/oldnew.gif`
  const options = {
    highlightStyle: 'Tint',
    highlightColor: 'blue',
    file: diffScreenshot
  }
  await gm.compare(oldScreenshot, newScreenshot, options)
  await gm.append([oldScreenshot, newScreenshot, diffScreenshot], appendScreenshot)
  await gm.animate([oldScreenshot, newScreenshot], animateScreenshot)
}

async function commitMsg () {
  const message = fs.readFileSync('.git/COMMIT_EDITMSG', { encoding: 'utf8' })
  const route = /(?<!(http:|https:))(\/[a-zA-Z]?)[^\s\b\n|]*/.exec(message)
  if (route !== null) {
    await diffScreenshot(BASE_BRANCH, BASE_URL, route[0])
  }
}

async function main () {
  /* eslint-disable no-unused-vars */
  const [executor, bin, hook, ...args] = process.argv
  switch (hook) {
    case 'post-commit':
      console.info('Trigger post-commit hook')
      await commitMsg()
      break
    default:
      console.info('This hook have not support yet')
      break
  }
}

main()
