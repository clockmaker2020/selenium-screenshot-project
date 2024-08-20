const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

async function takeScreenshot() {
    let options = new chrome.Options();
    options.addArguments('--headless');  // 브라우저를 헤드리스 모드로 실행
    options.addArguments('--disable-gpu'); // GPU 사용 비활성화
    options.addArguments('--no-sandbox'); // 샌드박스 모드 비활성화 (Linux 환경에서 필요한 경우)
    
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 화면 크기 설정 (예: 1920x1080)
        await driver.manage().window().setRect({ width: 1920, height: 1080 });

        // 필리핀 기상청 사이트로 URL 변경
        await driver.get('https://www.pagasa.dost.gov.ph/');

        // 필요한 대기 시간 (필요 시 조정)
        await driver.sleep(5000);

        // 스크린샷 저장
        let screenshotPath = path.join(__dirname, 'ph_screenshot.png');
        await driver.takeScreenshot().then(
            function(image, err) {
                require('fs').writeFile(screenshotPath, image, 'base64', function(err) {
                    if (err) console.log(err);
                });
            }
        );
        console.log('Screenshot saved as ph_screenshot.png');
    } finally {
        await driver.quit();
    }
}

takeScreenshot();
