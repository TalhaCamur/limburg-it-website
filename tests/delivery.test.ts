import test from 'node:test';
import assert from 'node:assert/strict';
process.env.CONTACT_ENABLED='true';
process.env.RESEND_API_KEY='re_test_placeholder';
process.env.CONTACT_FROM_EMAIL='website@example.com';
process.env.CONTACT_TO_EMAIL='owner@example.com';
process.env.NEXT_PUBLIC_SITE_URL='http://localhost:3000';
test('delivers bilingual tickets, sets Reply-To, and distinguishes confirmation failure',async()=>{
 const {POST}=await import('../app/api/contact/route');const {NextRequest}=await import('next/server');
 const original=globalThis.fetch;const calls:Record<string,any>[]=[];let failAt=-1;
 globalThis.fetch=async(_url,init)=>{const payload=JSON.parse(String(init?.body));calls.push(payload);return new Response(JSON.stringify(calls.length===failAt?{name:'validation_error',message:'mock error'}:{id:'mock-id'}),{status:calls.length===failAt?422:200,headers:{'Content-Type':'application/json'}});};
 const submit=(locale:string)=>POST(new NextRequest('http://localhost:3000/api/contact',{method:'POST',headers:{origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({name:'Ada',email:'ada@example.com',company:'Studio',phone:'123',service:'website',message:'<script>test</script> Build a website.',consent:true,locale,website:''})}));
 try{
 const response=await submit('nl');assert.equal(response.status,200);const data=await response.json();assert.match(data.ticket,/^TCK-\d{8}-[0-9A-F]{8}$/);assert.equal(calls.length,2);assert.equal(calls[0].reply_to,'ada@example.com');assert.ok(calls[0].text.includes('Taal bezoeker: nl'));assert.ok(calls[0].text.includes('Ontvangen op (UTC)'));assert.ok(calls[1].text.includes('Bedankt voor uw bericht.'));assert.ok(calls[1].text.includes(data.ticket));assert.equal(calls[0].html,undefined);
 failAt=4;const delayed=await submit('en');assert.equal(delayed.status,200);assert.equal((await delayed.json()).confirmationDelayed,true);assert.ok(calls[3].text.includes('Thank you for getting in touch.'));
 failAt=5;const failed=await submit('en');assert.equal(failed.status,502);assert.equal(calls.length,5);
 }finally{globalThis.fetch=original;}
});
