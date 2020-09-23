const timeout = 30000

beforeAll(async () => {
  const apiResponse = await page.goto(API_HEATHCHECK_URL, { waitUntil: 'networkidle0' })
  expect([200, 304]).toContain(apiResponse.status())
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' })
})

describe('Test header and title of the page', () => {
  test('Title of the page', async () => {
    await page.waitForSelector('title')
    const title = await page.title()
    expect(title).toBe('Home')
  }, timeout)

  test('Header of the page', async () => {
    const h2 = await page.$eval('h2', e => e.innerText)
    expect(h2).toBe('Hot Topics')
  }, timeout)
})

describe('Test display topics list', () => {
  test('Topics is not empty', async () => {
    const topics = await page.$('#topics')
    expect(topics).not.toBe(null)
  }, timeout)

  test('Topics is empty', async () => {
    await page.setRequestInterception(true)
    page.on('request', request => {
      if (request.url() === `${API_URL}/topics`) {
        request.respond({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ data: [] })
        })
      } else {
        request.continue()
      }
    })
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' })
    const topics = await page.$('#empty-topics')
    expect(topics).not.toBe(null)
  }, timeout)
})
