import {getTranslations} from 'next-intl/server';
export default async function NotFound(){const t=await getTranslations();return <div className="legal container"><h1>{t('notFound.title')}</h1><p>{t('notFound.body')}</p><a className="button" href="/">{t('common.home')}</a></div>}
