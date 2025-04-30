const { Application } = require('spectron');
const assert = require('assert');
const path = require('path');

describe('My Electron App', function () {
  this.timeout(5000); // Increase timeout to accommodate Electron startup time

  let app;

  // Before each test, start the Electron app
  beforeEach(async () => {
    app = new Application({
      path: path.join(__dirname, '../node_modules/.bin/electron'), // Path to Electron executable
      args: [path.join(__dirname, '../src')] // Path to your Electron app's main entry file
    });
    await app.start();
  });

  // After each test, stop the Electron app
  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  // Test 1: Check if the app opens a window
  it('should open the window', async () => {
    const windowCount = await app.client.getWindowCount();
    assert.strictEqual(windowCount, 1); // Ensure one window is opened
  });

  // Test 2: Check the title of the window
  it('should have the correct title', async () => {
    const title = await app.client.getTitle();
    assert.strictEqual(title, 'My Electron App'); // Replace with your app's title
  });
});
