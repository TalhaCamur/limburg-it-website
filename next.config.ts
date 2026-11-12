import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import {env} from './lib/env';
const dev=process.env.NODE_ENV!=='production';
const csp=["default-src 'self'",`script-src 'self' 'unsafe-inline' ${dev?"'unsafe-eval'":''} https://challenges.cloudflare.com https://plausible.io`,"style-src 'self' 'unsafe-inline'","img-src 'self' data:","font-src 'self'","connect-src 'self' https://challenges.cloudflare.com https://plausible.io", "frame-src https://challenges.cloudflare.com","object-src 'none'","base-uri 'self'","form-action 'self'","frame-ancestors 'none'",...(dev?[]:['upgrade-insecure-requests'])].join('; ');
const config:NextConfig={poweredByHeader:false,async headers(){return [{source:'/:path*',headers:[{key:'Content-Security-Policy',value:csp},{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},...(!dev?[{key:'Strict-Transport-Security',value:'max-age=31536000; includeSubDomains'}]:[])]}]}};
void env;
export default createNextIntlPlugin('./i18n/request.ts')(config);
