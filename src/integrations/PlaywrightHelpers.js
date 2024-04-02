import * as path from "path";

export default {
  async uploadToScale() {
    // Launch the browser
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Open JIRA
    await page.goto(
      "https://zubairidrisaweda.atlassian.net/projects/KAN?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testPlayer/testExecution/KAN-E1"
    );

    // Click on 'Sign in' button
    await page.locator('[aria-label="Sign in"]').first().click();

    // Fill in the input
    await page
      .locator('input[name="username"]')
      .fill("zubairidrisaweda@gmail.com");

    // Click submit
    await page.locator("#login-submit").click();

    // Type password
    await page.locator('input[name="password"]').fill("ethene20");

    // Click login
    await page.locator("#login-submit").click();

    // the page takes so long to load
    setTimeout(async () => {
      await takeScreenshot({ page });
    }, 120000);

    // Start waiting for file chooser before clicking. Note no await.
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByText("select files").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "screenshot_4.png"));
  },
};
