import {createHash} from 'node:crypto';
import {Redis} from '@upstash/redis';
import {Ratelimit} from '@upstash/ratelimit';
import {env} from './env';
const globalStore=globalThis as typeof globalThis & {contactLimits?:Map<string,{count:number;expires:number}>};
const store=globalStore.contactLimits??=new Map();
const remote=env.UPSTASH_REDIS_REST_URL&&env.UPSTASH_REDIS_REST_TOKEN?new Ratelimit({redis:new Redis({url:env.UPSTASH_REDIS_REST_URL,token:env.UPSTASH_REDIS_REST_TOKEN}),limiter:Ratelimit.slidingWindow(5,'1 h'),prefix:'contact',analytics:false}):null;
export async function allowed(ip:string){const key=createHash('sha256').update(ip).digest('hex');if(remote)return (await remote.limit(key)).success;const now=Date.now();for(const [key,value]of store)if(value.expires<=now)store.delete(key);const value=store.get(key);if(value&&value.count>=5)return false;if(value)value.count++;else{if(store.size>=10000)return false;store.set(key,{count:1,expires:now+3600000});}return true;}
