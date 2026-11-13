'use client';

import {useState} from 'react';
import {ArrowDownRight} from 'lucide-react';
import {ProjectPreview} from './project-preview';

type Project = {id:'studio'|'commerce'|'platform'; title:string; category:string; description:string; approach:string};

export function WorkSelector({items, label}:{items:Project[]; label:string}) {
  const [index,setIndex]=useState(0);
  const project=items[index];
  return <div className="work-selector">
    <div className="work-choices" role="group" aria-label={label}>
      {items.map((item,i)=><button type="button" key={item.id} aria-pressed={index===i} aria-controls="project-view" onClick={()=>setIndex(i)}>
        <small>{item.category}</small><span>{item.title}<ArrowDownRight size={22} aria-hidden="true"/></span>
      </button>)}
    </div>
    <div id="project-view" className="project-view" aria-live="polite">
      <ProjectPreview subject={project.id}/>
      <div className="project-story"><h3>{project.title}</h3><p>{project.description}</p><p>{project.approach}</p></div>
    </div>
  </div>;
}
