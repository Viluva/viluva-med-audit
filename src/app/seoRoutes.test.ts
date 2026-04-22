import robots from "./robots";
import sitemap from "./sitemap";

describe("SEO routes", () => {
  it("exposes an indexable robots policy", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://www.viluva.app/sitemap.xml",
      host: "https://www.viluva.app",
    });
  });

  it("includes all investment calculator routes in the sitemap", () => {
    const routes = sitemap().map((entry) => entry.url);

    expect(routes).toContain("https://www.viluva.app/investment-calculators");
    expect(routes).toContain("https://www.viluva.app/sip-calculator");
    expect(routes).toContain("https://www.viluva.app/lumpsum-calculator");
    expect(routes).toContain("https://www.viluva.app/sip-lumpsum-calculator");
    expect(routes).toContain("https://www.viluva.app/swp-calculator");
  });
});
