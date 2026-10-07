"use client";
import React from "react";
import type {TownState} from "./buildings";
import {getTownTier} from "./buildings";

type PropDef={id:string;minPop?:number;minTreasury?:number;minCulture?:number;minSecurity?:number;x:number;y:number;kind:string;label?:string};
const PROP_REGISTRY:PropDef[]=[
 {id:"well",x:47,y:45,kind:"well",minPop:20,label:"共同井戸"},
 {id:"market1",x:42,y:40,kind:"stall",minPop:60,minTreasury:12000},
 {id:"market2",x:52,y:40,kind:"stall",minPop:90,minTreasury:16000},
 {id:"lamp1",x:33,y:49,kind:"streetlamp",minTreasury:15000,minSecurity:55},
 {id:"lamp2",x:62,y:49,kind:"streetlamp",minTreasury:17000,minSecurity:55},
 {id:"flowers",x:48,y:35,kind:"flowerbed",minCulture:52},
 {id:"statue",x:48,y:45,kind:"statue",minCulture:72,minTreasury:26000},
 {id:"cart",x:29,y:54,kind:"cart",minPop:75},
 {id:"notice",x:6,y:43,kind:"notice",minPop:45},
 {id:"fountain",x:48,y:45,kind:"fountain",minCulture:80,minTreasury:32000}
];

function enabled(p:PropDef,t:TownState){
 return (p.minPop??0)<=t.population&&(p.minTreasury??0)<=t.treasury&&(p.minCulture??0)<=t.culture&&(p.minSecurity??0)<=t.security;
}
export function TownScenery({town,night}:{town:TownState;night:boolean}){
 const tier=getTownTier(town.population);
 const dense=town.population>=110,rich=town.treasury>=22000,cultured=town.culture>=65;
 return <>
   <div className={"terrain tier-"+tier+" "+(rich?"terrain-rich ":"")+(cultured?"terrain-cultured":"")}>
     <div className="river-detail"/>
     <div className="road road-main"/>
     <div className="road road-cross"/>
     <div className="road road-north"/>
     <div className="road road-south"/>
     <div className="bridge"><i/><i/><i/><i/></div>
     <div className="plaza"><i/><i/><i/><i/></div>
     <div className="forest forest-left">{Array.from({length:9}).map((_,i)=><span key={i} style={{left:(i%3)*24+(i%2)*7,top:Math.floor(i/3)*38+(i%2)*8}}/>)}</div>
     <div className="forest forest-top">{Array.from({length:7}).map((_,i)=><span key={i} style={{left:i*33,top:(i%3)*13}}/>)}</div>
     <div className="field"><i/><i/><i/><i/><i/><i/></div>
     {tier!=="hamlet"&&<><div className="wall wall-top"/><div className="wall wall-left"/><div className="gatehouse"><b>西門</b><i/><i/></div></>}
     {dense&&<div className="wall wall-bottom"/>}
     {PROP_REGISTRY.filter(p=>enabled(p,town)).map(p=><TownProp key={p.id} p={p} night={night}/>)}
     <AmbientHomes town={town}/>
   </div>
 </>;
}
function TownProp({p,night}:{p:PropDef;night:boolean}){
 return <div className={"town-prop prop-"+p.kind+(night?" prop-night":"")} style={{left:p.x+"%",top:p.y+"%"}}>
  <i/><span>{p.label??""}</span>
 </div>;
}
function AmbientHomes({town}:{town:TownState}){
 const count=Math.max(0,Math.min(8,Math.floor((town.population-30)/15)));
 const spots=[[12,25],[14,79],[28,78],[82,72],[79,18],[66,82],[31,15],[86,43]];
 return <>{spots.slice(0,count).map((s,i)=><div key={i} className={"ambient-home home-"+(i%3)} style={{left:s[0]+"%",top:s[1]+"%"}}><i/><b/><span/></div>)}</>;
}
