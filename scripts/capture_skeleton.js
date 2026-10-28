const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--user-data-dir=C:\\Users\\user\\AppData\\Local\\Temp\\chrome_cdp_skel',
    'http://localhost:3000/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('No page tab found');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((res) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            res(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // Mobile device viewport (390 x 844 iPhone 14 / modern smartphone)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    // Navigate cleanly to http://localhost:3000/
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    // First snap right away to catch skeleton loading
    await new Promise(r => setTimeout(r, 600));

    const shotSkel = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_skeleton.png', Buffer.from(shotSkel.data, 'base64'));
    console.log('Skeleton captured!');

    // Wait 2.5 seconds for skeleton timer (850ms) + fade transition to complete
    await new Promise(r => setTimeout(r, 2500));
    
    // Check what is currently in DOM
    const evalResult = await send('Runtime.evaluate', {
      expression: `({
        hasSkeleton: !!document.querySelector('.wedding-skeleton-screen'),
        hasCover: !!document.querySelector('.invitation-cover-screen'),
        hasOpenBtn: !!document.querySelector('.cover-open-btn'),
      })`,
      returnByValue: true
    });
    console.log('DOM state after wait:', evalResult.result?.value);

    const shotCover = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_cover.png', Buffer.from(shotCover.data, 'base64'));

    // Click OPEN INVITATION button to reveal the wedding invitation
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('.cover-open-btn')?.click();
      `
    });

    // Wait for cover exit animation and hero reveal
    await new Promise(r => setTimeout(r, 1500));

    const shotHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_mobile_hero.png', Buffer.from(shotHero.data, 'base64'));

    // Scroll smoothly to countdown section
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#countdown')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 700));
    const shotCountdown = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_mobile_countdown.png', Buffer.from(shotCountdown.data, 'base64'));

    // Scroll smoothly to couple section
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#couple')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 700));
    const shotCouple = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_mobile_couple.png', Buffer.from(shotCouple.data, 'base64'));

    // Scroll smoothly to details section
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#details')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 700));
    const shotDetails = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_mobile_details.png', Buffer.from(shotDetails.data, 'base64'));

    // Scroll smoothly to location section
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#location')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 700));
    const shotLoc = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_mobile_location.png', Buffer.from(shotLoc.data, 'base64'));

    // Scroll smoothly to rsvp section
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 700));
    const shotRsvp = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_mobile_rsvp.png', Buffer.from(shotRsvp.data, 'base64'));

    console.log('Mobile screenshots captured successfully!');
    ws.close();
  } finally {
    chrome.kill();
  }
}

capture().catch(console.error);
