import {defineRouting} from 'next-intl/routing';
export const routing = defineRouting({locales:['nl','en'],defaultLocale:'nl',localeDetection:true,localeCookie:{name:'NEXT_LOCALE',sameSite:'lax',maxAge:31536000}});
