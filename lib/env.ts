import {z} from 'zod';
const optional = <T extends z.ZodType>(schema:T) => z.preprocess(v=>v===''?undefined:v,schema.optional());
const schema=z.object({
 NEXT_PUBLIC_SITE_URL:z.url().default('http://localhost:3000'),
 RESEND_API_KEY:optional(z.string().startsWith('re_')),
 CONTACT_TO_EMAIL:optional(z.email()),CONTACT_FROM_EMAIL:optional(z.email()),
 UPSTASH_REDIS_REST_URL:optional(z.url()),UPSTASH_REDIS_REST_TOKEN:optional(z.string().min(1)),
 NEXT_PUBLIC_TURNSTILE_ENABLED:z.enum(['true','false']).default('false'),
 NEXT_PUBLIC_TURNSTILE_SITE_KEY:optional(z.string().min(1)),TURNSTILE_SECRET_KEY:optional(z.string().min(1)),
 NEXT_PUBLIC_PLAUSIBLE_DOMAIN:optional(z.string().regex(/^[a-z0-9.-]+$/i)),
 CONTACT_ENABLED:z.enum(['true','false']).default('false'),
}).superRefine((e,ctx)=>{
 if(e.CONTACT_ENABLED==='true') for(const key of ['RESEND_API_KEY','CONTACT_TO_EMAIL','CONTACT_FROM_EMAIL'] as const) if(!e[key])ctx.addIssue({code:'custom',path:[key],message:'Required when CONTACT_ENABLED=true'});
 if(e.NEXT_PUBLIC_TURNSTILE_ENABLED==='true')for(const key of ['NEXT_PUBLIC_TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY'] as const)if(!e[key])ctx.addIssue({code:'custom',path:[key],message:'Required when Turnstile is enabled'});
 if(Boolean(e.UPSTASH_REDIS_REST_URL)!==Boolean(e.UPSTASH_REDIS_REST_TOKEN))ctx.addIssue({code:'custom',message:'Both Upstash settings are required'});
});
export const env=schema.parse(process.env);
