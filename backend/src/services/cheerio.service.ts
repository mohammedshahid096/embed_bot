import { SitemapLoader } from "@langchain/community/document_loaders/web/sitemap";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import type { CheerioAPI } from "cheerio";

export class CheerioWebsiteUrls {
  baseUrl: string;
  sitemapUrl: string;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.baseUrl = baseUrl;
    this.sitemapUrl = `${baseUrl}/sitemap.xml`;
  }

  private getSiteMapUrls = async () => {
    try {
      const sitemapLoader = new SitemapLoader(this.sitemapUrl);
      const docs = await sitemapLoader.load();
      if (docs.length > 0) {
        return docs.map((doc) => doc.metadata.source);
      }
    } catch (error) {
      console.warn("No sitemap found, falling back to crawl");
      return [];
    }
  };

  private crawlTheWebsiteUrls = async () => {
    try {
      const crawlLoader = new RecursiveUrlLoader(this.baseUrl, {
        // maxDepth: 4,
        extractor: (html) => html,
      });

      const docs = await crawlLoader.load();
      return docs.map((doc) => doc.metadata.source);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  private cleanWebsiteUrls = (urls: string[]): string[] => {
    try {
      const collectedWebUrls = new Set<string>();

      urls.forEach((url) => {
        let currentUrl = url;
        if (currentUrl.endsWith("/")) {
          currentUrl = currentUrl.slice(0, -1);
        }
        collectedWebUrls.add(currentUrl);
      });

      return [...collectedWebUrls];
    } catch (error) {
      return [];
    }
  };

  async getWebsiteUrls(): Promise<{ urls: string[]; count: number } | null> {
    try {
      const collectedWebUrls = new Set<string>();

      const siteMapUrls = await this.getSiteMapUrls();
      if (siteMapUrls && siteMapUrls?.length > 0) {
        siteMapUrls.map((url) => collectedWebUrls.add(url));
      }

      const crawlUrls = await this.crawlTheWebsiteUrls();

      if (crawlUrls && crawlUrls?.length > 0) {
        crawlUrls.map((url) => collectedWebUrls.add(url));
      }

      const cleanedUrls = this.cleanWebsiteUrls([...collectedWebUrls]);

      return {
        urls: cleanedUrls,
        count: cleanedUrls?.length,
      };
    } catch (error) {
      console.warn("No sitemap found, falling back to crawl");
      return null;
    }
  }
}

export class CheerioWebsiteScrapping {
  url: string;

  constructor({ url }: { url: string }) {
    this.url = url;
  }

  private cleanContentFunction = (content: string) => {
    return content
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  getPageContent = async () => {
    try {
      const loader = new CheerioWebBaseLoader(this.url, {
        selector: "body",
      });

      const $ = await loader.scrape();
      $(
        "script, style, noscript, svg, nav, footer, header, meta,iframe",
      ).remove();
      $("*").removeAttr("style").removeAttr("class");
      let cleanContent = $.text();
      cleanContent = this.cleanContentFunction(cleanContent);

      return cleanContent;
    } catch (error) {
      console.log(error);
      return "";
    }
  };
}
