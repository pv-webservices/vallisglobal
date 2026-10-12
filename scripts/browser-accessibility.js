async (page) => {
  const base = "http://127.0.0.1:4322";
  const routes = [
    "/",
    "/about/",
    "/products/",
    "/gallery/",
    "/contact/",
    "/privacy-policies/",
    "/products/hotel-digital-locks/",
    "/products/hotel-digital-locks/vacs-12/",
    "/products/shaft-doors/",
  ];
  const results = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + route);
    await page.addScriptTag({ path: "node_modules/axe-core/axe.min.js" });
    results.push({
      route,
      width: 1440,
      ...(await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag21a", "wcag22aa"] },
        });
        return {
          violations: result.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        };
      })),
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/");
  await page.locator(".menu-toggle").click();
  await page.addScriptTag({ path: "node_modules/axe-core/axe.min.js" });
  results.push({
    route: "mobile menu",
    width: 390,
    ...(await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag21a", "wcag22aa"] },
      });
      return {
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      };
    })),
  });
  return {
    results,
    status: results.some((r) => r.violations.length) ? "FAIL" : "PASS",
  };
}