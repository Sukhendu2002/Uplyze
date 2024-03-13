const puppeteer = require("puppeteer");

const performSyntheticMonitoring = async (website) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(website.url, { waitUntil: "networkidle0" });

  const issues = await page.evaluate(() => {
    const issues = [];
    const elements = document.querySelectorAll("img, script, link");

    elements.forEach((element) => {
      if (element.tagName === "IMG") {
        if (!element.complete) {
          issues.push(`Image ${element.src} did not load`);
        }
      } else if (element.tagName === "SCRIPT") {
        if (!element.complete) {
          issues.push(`Script ${element.src} did not load`);
        }
      } else if (element.tagName === "LINK") {
        if (element.rel === "stylesheet" && !element.complete) {
          issues.push(`Stylesheet ${element.href} did not load`);
        }
      }
    });

    return issues;
  });

  await browser.close();
  return issues;
};

module.exports = performSyntheticMonitoring;
