'use client';
import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useLocale,useTranslations} from 'next-intl';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {company} from '@/content/company';

export function Language() {
  const locale=useLocale();
  const path=usePathname();
  const t=useTranslations('common');
  return <nav className="languages" aria-label={t('language')}>
    {['nl','en'].map(l=><Link key={l} href={path.replace(/^\/(nl|en)/,`/${l}`)} hrefLang={l}
      aria-current={locale===l?'page':undefined}
      onClick={()=>{document.cookie=`NEXT_LOCALE=${l}; Path=/; Max-Age=31536000; SameSite=Lax`;}}>
      {l.toUpperCase()}</Link>)}
  </nav>;
}

function Wordmark(){
  return <span className="wordmark"><svg width="29" height="32" viewBox="0 0 29 32" aria-hidden="true">
    <path d="M2 3h7v17h12v7H2z" fill="currentColor"/><path d="M13 3h7v10h7v5H13z" fill="currentColor"/>
  </svg>{company.name}</span>;
}

export function Header(){
  const [open,setOpen]=useState(false);
  const locale=useLocale();
  const t=useTranslations();
  const path=usePathname().replace(/\/$/,'');
  const close=()=>setOpen(false);
  const links=['services','work','about'].map(id=>{
    const href=id==='about'?`/${locale}/about`:`/${locale}#${id}`;
    return <Link key={id} href={href} aria-current={href===path?'page':undefined} onClick={close}>{t(`nav.${id}`)}</Link>;
  });
  return <header className="site-head" onKeyDown={e=>{if(e.key==='Escape')close();}}>
    <div className="container nav-row">
      <Link onClick={close} href={`/${locale}`} aria-label={t('common.home')}><Wordmark/></Link>
      <nav className="desktop-links">{links}</nav>
      <Language/>
      <Link className="button header-cta" href={`/${locale}#contact`}>{t('nav.contact')}<ArrowUpRight size={16}/></Link>
      <button className="menu-button" aria-controls="mobile-menu" aria-expanded={open}
        aria-label={t(open?'common.close':'common.menu')} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div>
    {open&&<nav className="mobile-links" id="mobile-menu">{links}<Link onClick={close} href={`/${locale}#contact`}>{t('nav.contact')}</Link></nav>}
  </header>;
}

export function Footer(){
  const locale=useLocale();
  const t=useTranslations();
  return <footer className="site-footer"><div className="container">
    <div className="foot-main"><Wordmark/><nav>
      <Link href={`/${locale}/about`}>{t('nav.about')}</Link>
      <Link href={`/${locale}/privacy`}>{t('footer.privacy')}</Link>
      <Link href={`/${locale}/terms`}>{t('footer.terms')}</Link>
    </nav></div>
    <div className="foot-meta"><div>© {new Date().getFullYear()} {company.name}
      {company.email.includes('@')&&<> · <a href={`mailto:${company.email}`}>{company.email}</a></>}
      {!company.kvk.startsWith('[')&&<> · {t('footer.kvk')} {company.kvk}</>}
      {!company.vat.startsWith('[')&&<> · {t('footer.vat')} {company.vat}</>}
    </div><Language/></div>
  </div></footer>;
}
