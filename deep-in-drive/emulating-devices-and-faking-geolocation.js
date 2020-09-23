const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true })
  const page = await browser.newPage()

  // Emulates an iPhone X
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')
  await page.setViewport({ width: 375, height: 812 })

  // Changes to the Vietnam Ho Chi Minh location
  await page.setGeolocation({ latitude: 10.7758439, longitude: 106.7017555 })
  /* Use following source code in Browser console to get current location lat/long
  navigator.geolocation.getCurrentPosition(function({coords}) {
    console.log(coords.latitude, coords.longitude);
  });
  */

  await page.goto('https://www.maps.ie/coordinates.html')

  await page.waitForTimeout(60000)

  await browser.close()
})()
