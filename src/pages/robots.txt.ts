import type { APIRoute } from 'astro';
import { business } from '../data/catalogue';

// Allow everything (including noindex pages, CSS and JS) so crawlers can read each page's robots meta tag.
// Preview deployments stay out of search through their noindex meta tag and Vercel's preview X-Robots-Tag.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${business.origin}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
