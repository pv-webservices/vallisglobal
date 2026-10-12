import type { APIRoute } from 'astro';
export const GET:APIRoute=()=>new Response(import.meta.env.PUBLIC_INDEXABLE==='true'?'User-agent: *\nAllow: /\nSitemap: https://www.vallisglobal.in/sitemap.xml\n':'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain'}});
