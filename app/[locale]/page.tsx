import Link from 'next/link';
import {ArrowDown, ArrowUpRight, Plus} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ContactForm} from '@/components/contact-form';
import {PaperSculpture} from '@/components/paper-sculpture';
import {WorkSelector} from '@/components/work-selector';
import {projects} from '@/content/company';

export default async function Home({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;
  setRequestLocale(locale);
  const t=await getTranslations();
  const services=['web','maintenance','mobile','security','network'] as const;
  return <>
    <section className="agency-opening"><div className="container editorial-opening">
      <div className="opening-copy">
        <p className="eyebrow">{t('redesign.location')}</p>
        <h1>{t('redesign.headline')} <em>{t('redesign.headlineEnd')}</em></h1>
        <p className="lead">{t('redesign.intro')}</p>
        <div className="actions"><a className="button" href="#contact">{t('hero.primary')}<ArrowUpRight size={18}/></a>
          <a className="text-link" href="#services">{t('nav.services')} <ArrowDown size={16}/></a></div>
      </div>
      <PaperSculpture/></div>
    </section>
    <section id="work" className="portfolio band"><div className="container">
      <div className="section-title"><h2>{t('redesign.work')}</h2><p>{t('redesign.workIntro')}</p></div>
      <WorkSelector label={t('redesign.selectWork')} items={projects.map(({id})=>({
        id, title:t(`work.${id}.title`), category:t(`redesign.categories.${id}`),
        description:t(`work.${id}.description`), approach:t(`redesign.approach.${id}`)
      }))}/>
    </div></section>
    <section id="services" className="container service-list band">
      <div className="section-title"><h2>{t('nav.services')}</h2><p>{t('redesign.servicesIntro')}</p></div>
      {services.map((id,i)=><details key={id} open={i===0}><summary>{t(`services.${id}.title`)}<Plus size={21}/></summary>
        <div className="service-detail"><p>{t(`services.${id}.description`)} {i>=2?t('services.partner'):''}</p>
          <a className="text-link" href="#contact">{t('services.cta')} <ArrowUpRight size={16}/></a></div>
      </details>)}
    </section>
    <section id="process" className="process band"><div className="container">
      <h2>{t('redesign.process')}</h2>
      <ol>{(t.raw('process.steps') as {title:string;description:string}[]).map(step=><li key={step.title}><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      <Link className="text-link" href={`/${locale}/about`}>{t('redesign.teamLink')} <ArrowUpRight size={16}/></Link>
    </div></section>
    <section id="contact" className="container band"><div className="contact-wrap">
      <div><h2>{t('redesign.contactTitle')}</h2><p>{t('redesign.contactIntro')}</p></div><ContactForm/>
    </div></section>
  </>;
}
