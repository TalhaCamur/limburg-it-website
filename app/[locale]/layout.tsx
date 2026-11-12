import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import {NextIntlClientProvider,hasLocale} from 'next-intl';
import {getTranslations,setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Script from 'next/script';
import {routing} from '@/i18n/routing';
import {company} from '@/content/company';
import {env} from '@/lib/env';
import {Header,Footer} from '@/components/chrome';
import './globals.css';
const geist=Geist({subsets:['latin'],variable:'--font-geist'});
export function generateStaticParams(){return routing.locales.map(locale=>({locale}));}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!hasLocale(routing.locales,locale))return {};const t=await getTranslations({locale,namespace:'meta'});return {metadataBase:new URL(env.NEXT_PUBLIC_SITE_URL),title:{default:`${t('title')} | ${company.name}`,template:`%s | ${company.name}`},description:t('description'),alternates:{canonical:`/${locale}`,languages:{nl:'/nl',en:'/en','x-default':'/nl'}},openGraph:{type:'website',locale:locale==='nl'?'nl_NL':'en_GB',alternateLocale:locale==='nl'?'en_GB':'nl_NL',title:t('title'),description:t('description'),url:`/${locale}`,siteName:company.name}};}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!hasLocale(routing.locales,locale))notFound();setRequestLocale(locale);const t=await getTranslations('common');return <html lang={locale} className={geist.variable}><body><NextIntlClientProvider><a className="skip" href="#main">{t('skip')}</a><Header/><main id="main">{children}</main><Footer/></NextIntlClientProvider>{env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN&&<Script defer data-domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="afterInteractive"/>}</body></html>}
