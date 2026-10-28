const { spawn } = require('child_process');
const fs = require('fs');

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\user\\AppData\\Local\\Temp\\chrome_cdp_tmp',
    'http://localhost:3000/'
  ]);

  // wait 2s for chrome to start
  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
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

    // Set mobile device emulation (390 x 844, 2x scale)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    // Wait 1.5s for page animations/layout to settle
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to #countdown
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#countdown')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // Capture Countdown screenshot
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_countdown.png', Buffer.from(shot1.data, 'base64'));

    // Scroll to #couple
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#couple')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_couple.png', Buffer.from(shot2.data, 'base64'));

    // Scroll to #rsvp
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\66cfc089-38ea-4430-8f48-d0da1c139e54\\cdp_rsvp.png', Buffer.from(shot3.data, 'base64'));

    console.log('Screenshots captured successfully!');
    ws.close();
  } finally {
    chrome.kill();
  }
}

capture().catch(console.error);
