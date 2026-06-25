const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const htmlPath = path.resolve(__dirname, "carousel-io-non-lavoro.html");
  const outDir = path.resolve(__dirname, "carousel-png");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const slides = await page.$$(".slide");
  console.log(`Found ${slides.length} slides`);

  for (let i = 0; i < slides.length; i++) {
    const file = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await slides[i].screenshot({ path: file, omitBackground: false });
    console.log(`✅ ${file}`);
  }

  await browser.close();
  console.log("Done!");
})();
