const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function takeScreenshotOfMaple() {
    let options = new chrome.Options();
    options.addArguments('--headless');  // 브라우저를 헤드리스 모드로 실행
    options.addArguments('--disable-gpu'); // GPU 사용 비활성화

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 한국 기상청 단풍 진행 상황 이미지로 이동
        await driver.get('https://www.weather.go.kr/w/resources/image/photo/img_flower_map_01.gif');

        // 단풍 이미지를 찾음
        let imageElement = await driver.findElement(By.css('img[src="/w/resources/image/photo/img_flower_map_01.gif"]'));

        // 이미지 요소의 위치와 크기를 가져옴
        let rect = await imageElement.getRect();

        // 전체 페이지 스크린샷을 찍음
        let screenshot = await driver.takeScreenshot();

        // 스크린샷을 저장할 경로 설정
        let screenshotPath = path.join(__dirname, 'maple_screenshot.png');

        // 스크린샷에서 이미지 부분만 잘라 저장
        let canvas = createCanvas(rect.width, rect.height);
        let ctx = canvas.getContext('2d');

        // 전체 스크린샷을 캔버스에 로드
        let img = await loadImage('data:image/png;base64,' + screenshot);
        ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);

        // 잘라낸 이미지를 파일로 저장
        fs.writeFileSync(screenshotPath, canvas.toBuffer('image/png'));
        console.log('Screenshot of the maple image saved as maple_screenshot.png');
    } finally {
        await driver.quit();
    }
}

takeScreenshotOfMaple();
