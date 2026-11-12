import {z} from 'zod';
export const services=['website','webapp','mobile','security','network','maintenance','other'] as const;
export const clean=(s:string)=>s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim();
const headerText=(max:number)=>z.string().trim().min(1,'required').max(max,'tooLong').regex(/^[^\r\n]+$/,'invalid');
export const contactSchema=z.object({
 name:headerText(100),email:z.string().trim().email('email').max(254,'tooLong').regex(/^[^\r\n]+$/,'invalid'),
 company:z.string().trim().max(150,'tooLong'),phone:z.string().trim().max(50,'tooLong'),
 service:z.enum(services,{error:'required'}),message:z.string().trim().min(10,'messageMin').max(2000,'messageMax'),
 consent:z.literal(true,{error:'consent'}),locale:z.enum(['nl','en']),website:z.string().max(500),turnstileToken:z.string().max(4096).optional(),
});
export type ContactInput=z.infer<typeof contactSchema>;
