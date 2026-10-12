import type {APIRoute} from 'astro';
import {business,categories,products,productUrl} from '../data/catalogue';
export const GET:APIRoute=()=>{const paths=['/','/about/','/products/','/gallery/','/contact/','/privacy-policies/',...categories.map(c=>`/products/${c.slug}/`),...products.map(productUrl)];return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${business.origin}${p}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});};
