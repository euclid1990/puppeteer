const timeout = 30000

beforeAll(async () => {
  const apiResponse = await page.goto(API_HEATHCHECK_URL, { waitUntil: 'networkidle0' })
  expect([200, 304]).toContain(apiResponse.status())
  await page.goto(`${FRONTEND_URL}/signup`, { waitUntil: 'networkidle0' })
})

describe('Test header and title of the page', () => {
  test('Title of the page', async () => {
    await page.waitForSelector('title')
    const title = await page.title()
    expect(title).toBe('Sign Up')
  }, timeout)

  test('Header of the page', async () => {
    const h2 = await page.$eval('h2', e => e.innerText)
    expect(h2).toBe('Sign Up')
  }, timeout)
})

describe('Test submit sign up form', () => {
  test('Sign up successfully', async () => {
    await page.type('input[name=email]', 'admin@example.com')
    await page.type('input[name=password]', 's3cr3t_password')
    await page.click('button[type=submit]')
    await page.waitForSelector('.message')
    const message = await page.$eval('.message', e => e.innerText)
    expect(message).toBe('Sign up successfully')
  }, timeout)

  test('Sign up fail', async () => {
    await page.type('input[name=email]', '')
    await page.type('input[name=password]', '')
    await page.click('button[type=submit]')
    await page.waitForSelector('.error')
    const error = await page.$eval('.error', e => e.innerText)
    expect(error).toBe('Email and password is required')
  }, timeout)
})
