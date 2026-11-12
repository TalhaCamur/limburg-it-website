import {NextRequest,NextResponse} from 'next/server';
import {randomBytes,randomUUID} from 'node:crypto';
import {Resend} from 'resend';
import {env} from '@/lib/env';
import {allowed} from '@/lib/rate-limit';
import {contactSchema,clean} from '@/lib/validation';
import {company} from '@/content/company';
import en from '@/messages/en.json';
import nl from '@/messages/nl.json';
export const runtime='nodejs';
const reply=(code:string,status:number)=>NextResponse.json({code},{status,headers:{'Cache-Control':'no-store',...(status===429?{'Retry-After':'3600'}:{})}});
export async function POST(req:NextRequest){
 try{
 const origin=req.headers.get('origin');if(!origin||origin!==new URL(env.NEXT_PUBLIC_SITE_URL).origin)return reply('error',403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return reply('error',415);
 // Bound the streamed body before JSON parsing, even without Content-Length.
 const reader=req.body?.getReader();if(!reader)return reply('error',400);let bytes=0;const chunks:Uint8Array[]=[];while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>16384){await reader.cancel();return reply('error',413);}chunks.push(part.value);}let body:unknown;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return reply('error',400);}
 // Vercel overwrites x-vercel-forwarded-for; configure trusted proxy headers before hosting elsewhere.
 const ip=process.env.VERCEL?req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'unknown':'local';
 if(!await allowed(ip))return reply('rateLimit',429);
 const result=contactSchema.safeParse(body);if(!result.success){const errors:Record<string,string>={};for(const issue of result.error.issues){const key=String(issue.path[0]);if(!errors[key])errors[key]=issue.message;}return NextResponse.json({errors},{status:400});}
 const data=result.data;if(data.website)return reply('error',400);
 if(env.CONTACT_ENABLED!=='true')return reply('unavailable',503);
 if(env.NEXT_PUBLIC_TURNSTILE_ENABLED==='true'){
 const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY!,response:data.turnstileToken||'',...(ip!=='local'&&ip!=='unknown'?{remoteip:ip}:{})}),signal:AbortSignal.timeout(10000)});const check=await verification.json();if(!check.success||check.hostname!==new URL(env.NEXT_PUBLIC_SITE_URL).hostname)return reply('verification',400);
 }
 const messages=data.locale==='nl'?nl:en;const t=messages.email;const timestamp=new Date().toISOString();const ticket=`TCK-${timestamp.slice(0,10).replaceAll('-','')}-${randomBytes(4).toString('hex').toUpperCase()}`;
 const name=clean(data.name),email=clean(data.email),service=messages.contact.services[data.service];const client=new Resend(env.RESEND_API_KEY);
 const fields=[[t.reference,ticket],[t.name,name],[t.email,email],[t.company,clean(data.company)||t.empty],[t.phone,clean(data.phone)||t.empty],[t.service,service],[t.locale,data.locale],[t.timestamp,timestamp],[t.message,clean(data.message)]];
 // Plain text prevents HTML injection. Schema forbids CR/LF in header fields.
 const sent=await client.emails.send({from:env.CONTACT_FROM_EMAIL!,to:env.CONTACT_TO_EMAIL!,replyTo:email,subject:`[${t.ticketPrefix} ${ticket}] ${service} - ${name}`,text:fields.map(([k,v])=>`${k}: ${v}`).join('\n\n')},{idempotencyKey:`${ticket}-owner`});
 if(sent.error){console.error('contact_delivery_failed',{requestId:randomUUID(),code:sent.error.name});return reply('error',502);}
 let confirmationDelayed=false;try{const ack=await client.emails.send({from:env.CONTACT_FROM_EMAIL!,to:email,replyTo:env.CONTACT_TO_EMAIL!,subject:`${t.receivedSubject} [${ticket}]`,text:`${t.greeting}\n\n${t.body}\n\n${t.reference}: ${ticket}\n\n${t.signoff}\n${company.name}`},{idempotencyKey:`${ticket}-confirmation`});confirmationDelayed=Boolean(ack.error);}catch{confirmationDelayed=true;}
 return NextResponse.json({ticket,confirmationDelayed},{headers:{'Cache-Control':'no-store'}});
 }catch{console.error('contact_request_failed',{requestId:randomUUID()});return reply('error',503);}
}
