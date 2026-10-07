"use client";
import React from "react";

export type TownState={
  population:number;
  treasury:number;
  prosperity:number;
  culture:number;
  security:number;
};

export type BuildingCategory="shop"|"service"|"culture"|"government"|"housing"|"industry"|"special";

export type BuildingTypeDef={
  id:string;
  name:string;
  category:BuildingCategory;
  roof:string;
  wall:string;
  sign:boolean;
  baseProps:string[];
  accent:string;
  symbol:string;
  growth:{population?:boolean;treasury?:boolean;culture?:boolean;security?:boolean};
};

export type BuildingState={
  id:string;
  typeId:string;
  name:string;
  x:number;
  y:number;
  level:number;
  wealth:number;
  popularity:number;
  condition:number;
  ownerId?:number;
};

export const BUILDING_TYPES:Record<string,BuildingTypeDef>={
  blacksmith:{id:"blacksmith",name:"鍛冶屋",category:"industry",roof:"ember",wall:"timber",sign:true,baseProps:["chimney","anvil","crate"],accent:"#c9642d",symbol:"⚒",growth:{population:true,treasury:true}},
  apothecary:{id:"apothecary",name:"薬屋",category:"shop",roof:"moss",wall:"plaster",sign:true,baseProps:["herb","bottle","crate"],accent:"#78b79d",symbol:"✦",growth:{population:true,treasury:true,culture:true}},
  inn:{id:"inn",name:"宿屋",category:"service",roof:"wine",wall:"timber",sign:true,baseProps:["lantern","barrel","bench"],accent:"#d3a85c",symbol:"⌂",growth:{population:true,treasury:true,security:true}},
  bakery:{id:"bakery",name:"パン屋",category:"shop",roof:"wheat",wall:"plaster",sign:true,baseProps:["wheat","basket","crate"],accent:"#c98b50",symbol:"◒",growth:{population:true,treasury:true}},
  stage:{id:"stage",name:"広場ステージ",category:"culture",roof:"festival",wall:"timber",sign:false,baseProps:["banner","music","flowers"],accent:"#a978c4",symbol:"♪",growth:{culture:true,treasury:true}},
  taxOffice:{id:"taxOffice",name:"税務署",category:"government",roof:"slate",wall:"stone",sign:true,baseProps:["ledger","lamp"],accent:"#aeb5ba",symbol:"§",growth:{population:true,treasury:true}},
  house:{id:"house",name:"住宅",category:"housing",roof:"clay",wall:"timber",sign:false,baseProps:["fence","laundry"],accent:"#b77b57",symbol:"⌂",growth:{population:true}},
};

export const INITIAL_BUILDINGS:BuildingState[]=[
  {id:"b1",typeId:"blacksmith",name:"鉄火の鍛冶屋",x:22,y:24,level:2,wealth:530,popularity:78,condition:92,ownerId:0},
  {id:"b2",typeId:"apothecary",name:"月灯り薬店",x:62,y:21,level:2,wealth:420,popularity:69,condition:96,ownerId:1},
  {id:"b3",typeId:"inn",name:"旅籠ロッタ",x:37,y:58,level:3,wealth:710,popularity:84,condition:88,ownerId:2},
  {id:"b4",typeId:"bakery",name:"麦のパン屋",x:70,y:61,level:1,wealth:220,popularity:55,condition:90,ownerId:3},
  {id:"b5",typeId:"stage",name:"中央広場",x:46,y:29,level:1,wealth:120,popularity:72,condition:85,ownerId:8},
  {id:"b6",typeId:"taxOffice",name:"王国徴税所",x:57,y:73,level:1,wealth:260,popularity:22,condition:98,ownerId:9},
  {id:"h1",typeId:"house",name:"北通りの家",x:18,y:74,level:1,wealth:130,popularity:30,condition:86},
  {id:"h2",typeId:"house",name:"川辺の家",x:76,y:31,level:1,wealth:160,popularity:34,condition:91},
];

export function getTownTier(population:number){
  if(population<30)return "hamlet";
  if(population<80)return "village";
  if(population<150)return "town";
  return "city";
}

function visual(building:BuildingState,town:TownState,def:BuildingTypeDef){
  const economy=Math.min(1,town.treasury/30000);
  const density=Math.min(1,town.population/180);
  const local=Math.min(1,building.wealth/900);
  const score=(economy*.35)+(density*.2)+(local*.3)+(building.level/5*.15);
  const tier=score>.72?3:score>.38?2:1;
  const size=tier===3?"l":tier===2?"m":"s";
  const lit=town.security>55||def.category==="service";
  const decorated=town.culture>55||building.popularity>70;
  return {tier,size,lit,decorated};
}

export function BuildingRenderer({building,town}:{building:BuildingState;town:TownState}){
  const def=BUILDING_TYPES[building.typeId]??BUILDING_TYPES.house;
  const v=visual(building,town,def);
  const props=[...def.baseProps,...(v.decorated?["decor"]:[]),...(v.tier===3?["premium"]:[])];
  return <div className={"bld bld-"+def.category+" bld-"+v.size+" roof-"+def.roof+" wall-"+def.wall} style={{left:building.x+"%",top:building.y+"%","--b-accent":def.accent} as React.CSSProperties}>
    <div className="bld-shell">
      <div className="bld-roof"><i/><i/><i/></div>
      <div className="bld-floor upper"><span className="window"/><span className="window"/></div>
      <div className="bld-floor lower"><span className="door"/><span className="window"/></div>
      {def.roof==="ember"&&<span className="chimney">░</span>}
      {v.lit&&<span className="lamp left">•</span>}
      {v.lit&&v.tier>1&&<span className="lamp right">•</span>}
      <span className="bld-symbol">{def.symbol}</span>
      {def.sign&&<span className="shop-sign">{def.name}</span>}
      <div className="props">{props.slice(0,5).map((p,i)=><i key={p+i} className={"prop prop-"+p}/>)}</div>
    </div>
    <span className="bld-name">{building.name}<small> Lv.{building.level} / 外観{v.tier}</small></span>
  </div>;
}

export function derivedTownState(tick:number):TownState{
  const cycle=Math.sin(tick/90);
  const population=97+Math.floor(Math.sin(tick/120)*7);
  const treasury=18420+Math.floor(tick%1600)+Math.floor(cycle*900);
  return {population,treasury,prosperity:61+Math.floor(cycle*8),culture:58+Math.floor(Math.sin(tick/150)*12),security:72+Math.floor(Math.sin(tick/210)*7)};
}
