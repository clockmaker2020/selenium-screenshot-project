const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

(async function captureScreenshot() {
    // ChromeOptions 설정: 헤드리스 모드로 실행
    let chrome = require('selenium-webdriver/chrome');
    let options = new chrome.Options();
    options.addArguments('headless');  // 헤드리스 모드
    options.addArguments('disable-gpu');  // GPU 사용 안 함 (헤드리스 모드에서 권장)
    options.addArguments('no-sandbox');  // 샌드박스 비활성화 (CI 환경에서 권장)
    options.addArguments('disable-dev-shm-usage');  // /dev/shm 사용 비활성화 (CI 환경에서 메모리 문제 방지)

    // 브라우저를 시작합니다 (여기서는 Chrome을 사용).
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // 특정 웹페이지로 이동합니다.
        await driver.get('https://www.metoc.navy.mil/jtwc/jtwc.html');
        
        // 페이지가 완전히 로드될 때까지 기다립니다.
        await driver.sleep(5000); // 5초 동안 대기
        
        // 스크린샷을 캡처합니다.
        let screenshot = await driver.takeScreenshot();
        
        // 스크린샷을 파일로 저장합니다.
        fs.writeFileSync('jtwc_screenshot.png', screenshot, 'base64');
        console.log('스크린샷이 성공적으로 저장되었습니다!');
    } catch (error) {
        console.error('오류 발생:', error);
        process.exit(1); // 오류 발생 시 프로세스 종료
    } finally {
        // 브라우저를 닫습니다.
        await driver.quit();
    }
})();
