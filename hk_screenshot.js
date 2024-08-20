const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

async function takeScreenshot() {
    let options = new chrome.Options();
    options.addArguments('--headless');  // 브라우저를 헤드리스 모드로 실행

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 화면 크기 설정 (예: 1920x1080)
        await driver.manage().window().setRect({ width: 1024, height: 1000 });

        // 홍콩 기상청 사이트로 URL 변경
        await driver.get('https://www.hko.gov.hk/en/wxinfo/currwx/tc_gis.htm');

        // 필요한 대기 시간 (필요 시 조정)
        await driver.sleep(5000);

        // 전체 페이지 스크린샷 찍기
        let screenshot = await driver.takeScreenshot();
        let screenshotPath = path.join(__dirname, 'hk_screenshot.png');
        require('fs').writeFileSync(screenshotPath, screenshot, 'base64');
        console.log('Screenshot saved as hk_screenshot.png');
    } finally {
        await driver.quit();
    }
}

takeScreenshot();
