import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {getTranslations,setRequestLocale} from 'next-intl/server';
import {team} from '@/content/company';

type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {locale}=await params;
  const t=await getTranslations({locale,namespace:'redesign'});
  return {title:t('aboutTitle'),description:t('aboutIntro'),
    alternates:{canonical:`/${locale}/about`,languages:{nl:'/nl/about',en:'/en/about','x-default':'/nl/about'}},
    openGraph:{title:t('aboutTitle'),description:t('aboutIntro'),url:`/${locale}/about`}};
}

export default async function About({params}:Props){
  const {locale}=await params;
  setRequestLocale(locale);
  const t=await getTranslations();
  return <article className="container about-page band">
    <header><p className="eyebrow">{t('nav.about')}</p><h1>{t('redesign.aboutTitle')}</h1><p className="lead">{t('redesign.aboutIntro')}</p></header>
    <section className="role-list"><h2>{t('redesign.people')}</h2>
      {team.map(member=><article key={member.id}><h3>{t(`about.${member.id}.role`)}</h3><p>{t(`redesign.roles.${member.id}`)}</p></article>)}
    </section>
    <aside className="about-note"><h2>{t('redesign.together')}</h2><p>{t('redesign.togetherIntro')}</p>
      <Link className="button" href={`/${locale}#contact`}>{t('hero.primary')} <ArrowUpRight size={18}/></Link>
    </aside>
  </article>;
}
