import {useTranslations} from 'next-intl';

type Subject = 'studio' | 'commerce' | 'platform';

// Original editorial illustration for the fictional architecture portfolio.
function HillsideHouse() {
  return <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="640" height="360" fill="#e9d6b3"/>
    <circle cx="465" cy="82" r="41" fill="#f6eacb"/>
    <path fill="#b3b899" d="M0 144Q114 91 207 128T420 115T640 102V360H0Z"/>
    <path fill="#889a87" d="M0 176Q114 125 224 163T447 153T640 126V360H0Z"/>
    <path fill="#687e70" d="M0 191Q189 167 295 199T640 168V360H0Z"/>
    <path fill="#b08e6e" d="M0 248L428 181 640 235V360H0Z"/>
    <path fill="#cfb593" d="M0 309L415 220 640 247V360H0Z"/>
    <path fill="#d9c4a3" d="M77 164L310 127 310 232 77 273Z"/>
    <path fill="#a08269" d="M310 127L413 162 413 248 310 232Z"/>
    <path fill="#f2deba" d="M60 160L306 117 425 158 405 164 309 137 60 179Z"/>
    <path fill="#395451" d="M99 187L269 158 269 224 99 254Z"/>
    <path fill="#617770" d="M99 187L269 158 269 172 99 227Z"/>
    {[128,165,204,241].map(x=><path key={x} d={`M${x} ${184-(x-99)*.17}v65`} stroke="#d7c3a0" strokeWidth="4"/>)}
    <path fill="#e9caa6" d="M293 190L470 161 470 244 293 277Z"/>
    <path fill="#a98165" d="M470 161L546 187 546 263 470 244Z"/>
    <path fill="#f4dfbb" d="M280 186L466 152 554 184 540 190 467 169 280 201Z"/>
    <path fill="#45605b" d="M319 210L448 186 448 239 319 262Z"/>
    <path fill="#3f5750" d="M489 189L525 200 525 245 489 235Z"/>
    {[344,378,410].map(x=><path key={x} d={`M${x} ${207-(x-319)*.18}v53`} stroke="#ceb793" strokeWidth="3"/>)}
    <path fill="#e9d6b6" d="M271 277L470 242 554 264 352 304Z"/>
    <path fill="#9a846b" d="M352 304L554 264V271L352 312Z"/>
    <path fill="#5e7461" d="M0 283Q84 261 149 284T263 293L0 360Z"/>
    <path fill="#71836b" d="M403 360Q456 319 526 305T640 279V360Z"/>
    {[18,39,577,603].map((x,i)=><g key={x} transform={`translate(${x} ${i%2?12:-12})`}><path d="M0 248V139" stroke="#5d6553" strokeWidth="4"/><path fill={i%2?'#52675a':'#3b5750'} d="M-17 214Q-15 160 0 120Q16 152 17 203Q9 220-17 214Z"/></g>)}
  </svg>;
}

function Pottery() {
  return <svg viewBox="0 0 640 360" aria-hidden="true">
    <rect width="640" height="360" fill="#e3c5ad"/>
    <path d="M0 305L640 225V360H0Z" fill="#cfa589"/>
    <ellipse cx="310" cy="282" rx="157" ry="17" fill="#b78a72"/>
    <path fill="#a85537" d="M194 100h65v35c0 27 41 41 41 86 0 47-28 62-75 62s-77-15-77-60c0-44 46-65 46-91z"/>
    <ellipse cx="226" cy="100" rx="33" ry="7" fill="#753d2c"/>
    <path fill="#efe1c3" d="M332 149h59v20c0 21 33 36 33 72 0 31-20 43-64 43s-64-12-64-44c0-33 36-55 36-73z"/>
    <ellipse cx="362" cy="149" rx="30" ry="6" fill="#ae967e"/>
    <path fill="#425d55" d="M427 239h84c0 28-13 42-42 42s-42-14-42-42z"/>
  </svg>;
}

function Schedule() {
  return <div className="schedule-art" aria-hidden="true">{Array.from({length:20},(_,i)=>
    <i key={i} className={[1,4,7,13,16].includes(i)?'booked':''}/>)}</div>;
}

export function ProjectPreview({subject='studio',hero=false}:{subject?:Subject;hero?:boolean}) {
  const t=useTranslations('redesign');
  const art=subject==='studio'?<HillsideHouse/>:subject==='commerce'?<Pottery/>:<Schedule/>;
  return <figure className={`showcase ${subject} ${hero?'hero-showcase':''}`}>
    <div className="browser-frame" aria-hidden="true">
      <div className="browser-bar"><i/><i/><i/></div>
      <div className="sample-head"><b>{t(`samples.${subject}.brand`)}</b><span>☰</span></div>
      <div className="sample-cover">{art}</div>
      <div className="sample-caption">{t(`samples.${subject}.line`)} <span>↗</span></div>
    </div>
    {hero&&<div className="phone-frame" aria-hidden="true"><div className="phone-notch"/><b>{t('samples.studio.brand')}</b><div className="phone-image"><HillsideHouse/></div><em>{t('samples.studio.line')}</em></div>}
    <figcaption>{t(`samples.${subject}.caption`)}</figcaption>
  </figure>;
}
