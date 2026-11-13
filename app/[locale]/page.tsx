import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/components/contact-form';
import { ProjectPreview } from '@/components/project-preview';
import { WorkSelector } from '@/components/work-selector';
import { projects } from '@/content/company';

type HomeProps = {
  params: Promise<{ locale: string }>;
};

type ProcessStep = {
  title: string;
  description: string;
};

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const services = ['web', 'maintenance', 'mobile', 'security', 'network'] as const;
  const steps = t.raw('process.steps') as ProcessStep[];

  const portfolioItems = projects.map(({ id }) => ({
    id,
    title: t(`work.${id}.title`),
    category: t(`redesign.categories.${id}`),
    description: t(`work.${id}.description`),
    approach: t(`redesign.approach.${id}`),
  }));

  return (
      <>
        <section className="agency-opening">
          <div className="container editorial-opening">
            <div className="opening-copy">
              <p className="eyebrow">{t('redesign.location')}</p>

              <h1>
                {t('redesign.headline')} <em>{t('redesign.headlineEnd')}</em>
              </h1>

              <p className="lead">{t('redesign.intro')}</p>

              <div className="actions">
                <a className="button" href="#contact">
                  {t('hero.primary')}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>

                <a className="text-link" href="#services">
                  {t('nav.services')}
                  <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

            <a className="hero-project" href="#work" aria-label={t('nav.work')}>
              <ProjectPreview subject="studio" hero />

              <span className="hero-project-link" aria-hidden="true">
              {t('nav.work')}
                <ArrowDown size={16} />
            </span>
            </a>
          </div>
        </section>

        <section id="work" className="portfolio band">
          <div className="container">
            <div className="section-title">
              <h2>{t('redesign.work')}</h2>
              <p>{t('redesign.workIntro')}</p>
            </div>

            <WorkSelector label={t('redesign.selectWork')} items={portfolioItems} />
          </div>
        </section>

        <section id="services" className="container service-list band">
          <div className="section-title">
            <h2>{t('nav.services')}</h2>
            <p>{t('redesign.servicesIntro')}</p>
          </div>

          {services.map((id, index) => (
              <details key={id} open={index === 0}>
                <summary>
                  {t(`services.${id}.title`)}
                  <Plus size={21} aria-hidden="true" />
                </summary>

                <div className="service-detail">
                  <p>
                    {t(`services.${id}.description`)}
                    {index >= 2 && <> {t('services.partner')}</>}
                  </p>

                  <a className="text-link" href="#contact">
                    {t('services.cta')}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </details>
          ))}
        </section>

        <section id="process" className="process band">
          <div className="container">
            <h2>{t('redesign.process')}</h2>

            <ol>
              {steps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
              ))}
            </ol>

            <Link className="text-link" href={`/${locale}/about`}>
              {t('redesign.teamLink')}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section id="contact" className="container band">
          <div className="contact-wrap">
            <div>
              <h2>{t('redesign.contactTitle')}</h2>
              <p>{t('redesign.contactIntro')}</p>
            </div>

            <ContactForm />
          </div>
        </section>
      </>
  );
}