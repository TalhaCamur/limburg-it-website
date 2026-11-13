import type {MetadataRoute} from 'next';
import {env} from '@/lib/env';
export default function sitemap():MetadataRoute.Sitemap{return ['','/about','/privacy','/terms'].flatMap(path=>['nl','en'].map(locale=>({url:`${env.NEXT_PUBLIC_SITE_URL}/${locale}${path}`,alternates:{languages:{nl:`${env.NEXT_PUBLIC_SITE_URL}/nl${path}`,en:`${env.NEXT_PUBLIC_SITE_URL}/en${path}`}}})));}
