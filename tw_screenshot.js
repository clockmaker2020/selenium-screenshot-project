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
        // 타임아웃 설정
        await driver.manage().setTimeouts({ 
            implicit: 10000, // 요소를 찾을 때 최대 대기 시간 (10초)
            pageLoad: 60000,  // 페이지 로드 최대 대기 시간 (60초)
            script: 30000     // 스크립트 실행 최대 대기 시간 (30초)
        });

        // 화면 크기 설정 (예: 1024x768)
        await driver.manage().window().setRect({ width: 1024, height: 768 });

        // 대만 기상청 사이트로 이동
        await driver.get('https://www.cwa.gov.tw/V8/E/P/Typhoon/TY_NEWS.html');

        // 필요한 대기 시간 (필요 시 조정)
        await driver.sleep(5000);

        // 스크린샷 저장
        let screenshotPath = path.join(__dirname, 'tw_screenshot.png');  // 대만 스크린샷 파일 이름
        await driver.takeScreenshot().then(
            function(image, err) {
                require('fs').writeFile(screenshotPath, image, 'base64', function(err) {
                    if (err) console.log(err);
                });
            }
        );
        console.log('Screenshot saved as tw_screenshot.png');
    } finally {
        await driver.quit();
    }
}

takeScreenshot();
