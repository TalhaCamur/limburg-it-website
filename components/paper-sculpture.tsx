// A folded-paper fan drawn in perspective, with one ridge and two faces per fold.
export function PaperSculpture() {
  const point=(angle:number,r:number)=>[320+Math.cos(angle)*r,250+Math.sin(angle)*r*.79];
  const folds=Array.from({length:44},(_,i)=>{
    const a=i*Math.PI/22;
    const radius=201+36*Math.sin(a*3+.6)+15*Math.cos(a*2);
    const inner=point(a,46);
    const left=point(a,radius);
    const crest=point(a+.065,radius+13);
    const right=point(a+Math.PI/22,201+36*Math.sin((a+Math.PI/22)*3+.6)+15*Math.cos((a+Math.PI/22)*2));
    const tone=Math.round(62+Math.sin(a-.3)*12);
    return <g key={i}><polygon points={[inner,left,crest].join(' ')} fill={`hsl(22 74% ${tone+11}%)`}/><polygon points={[inner,crest,right,point(a+Math.PI/22,46)].join(' ')} fill={`hsl(19 51% ${tone-12}%)`}/></g>;
  });
  return <svg className="paper-sculpture" viewBox="35 35 570 430" aria-hidden="true"><g transform="rotate(-18 320 250)">{folds}</g></svg>;
}
