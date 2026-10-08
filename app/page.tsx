"use client";
import {useEffect,useState} from "react";
import {BuildingRenderer,INITIAL_BUILDINGS,derivedTownState,getTownTier} from "./buildings";
import {TownScenery} from "./townscape";
import {nextPosition} from "./movement";
type P={id:number;name:string;job:string;x:number;y:number;gold:number;mood:string;trait:string;voice:string;relation:string;line:string;skin:string;hair:string;cloth:string;accent:string;icon:string;routeIndex?:number;moving?:boolean;dir?:string};
const base:P[]=[
{id:0,name:"ガンツ",job:"鍛冶屋",x:27,y:38,gold:420,mood:"上機嫌",trait:"短気・職人気質",voice:"ぶっきらぼう",relation:"ミラとは幼なじみ",line:"勇者が来たな。今日は一本売れるかもな。",skin:"#d9a06f",hair:"#34251d",cloth:"#5f3d2d",accent:"#d57a31",icon:"⚒"},
{id:1,name:"ミラ",job:"薬屋",x:62,y:31,gold:310,mood:"忙しい",trait:"商売上手・情報通",voice:"早口で現実的",relation:"ガンツの値付けに口を出す",line:"ポーションは鮮度が命。値切るなら昨日来て。",skin:"#e4b38a",hair:"#5b2e51",cloth:"#6b4c7a",accent:"#8bd3c7",icon:"✦"},
{id:2,name:"ロッタ",job:"宿屋",x:42,y:64,gold:580,mood:"穏やか",trait:"面倒見が良い",voice:"おっとり",relation:"町の相談役",line:"旅人さん、疲れた顔してるよ。先に休みな。",skin:"#e7b990",hair:"#8b5b3f",cloth:"#6f5848",accent:"#e7cf82",icon:"⌂"},
{id:3,name:"エルン",job:"パン屋",x:73,y:61,gold:190,mood:"眠い",trait:"のんびり・食いしん坊",voice:"ゆるい",relation:"ノアに試作品を配る",line:"焼きたて、あと三分。たぶん。",skin:"#e1ad78",hair:"#b79052",cloth:"#d7c098",accent:"#b56b3f",icon:"◒"},
{id:4,name:"ノア",job:"旅人",x:18,y:66,gold:125,mood:"好奇心",trait:"好奇心旺盛・噂好き",voice:"軽快",relation:"ゼフと情報交換",line:"北の森、昨日より静かすぎるんだよね。",skin:"#c98765",hair:"#25313a",cloth:"#456a73",accent:"#e6b76d",icon:"◇"},
{id:5,name:"レオ",job:"勇者",x:9,y:48,gold:860,mood:"探索中",trait:"まっすぐ・少し天然",voice:"熱血",relation:"ユナとカイを信頼",line:"まず装備だ！話はそれからだ！",skin:"#e7b68d",hair:"#a4612d",cloth:"#425c83",accent:"#e0b54f",icon:"⚔"},
{id:6,name:"ユナ",job:"僧侶",x:12,y:52,gold:440,mood:"探索中",trait:"優しい・時々毒舌",voice:"丁寧",relation:"レオの暴走を止める",line:"レオ、それ昨日も言ってましたよ。",skin:"#efc2a4",hair:"#d9d2c4",cloth:"#ddd7ca",accent:"#a8c9d8",icon:"✚"},
{id:7,name:"カイ",job:"魔法使い",x:15,y:48,gold:510,mood:"観察中",trait:"理屈っぽい・分析好き",voice:"冷静",relation:"クラウを警戒",line:"その価格、需給に対して妙に高いな。",skin:"#c99572",hair:"#17191d",cloth:"#2b314d",accent:"#8a77c8",icon:"✧"},
{id:8,name:"ゼフ",job:"吟遊詩人",x:51,y:29,gold:270,mood:"ご機嫌",trait:"目立ちたがり・人たらし",voice:"芝居がかった口調",relation:"ノアの噂を歌にする",line:"今夜の広場、空けておいてくれ。面白い歌がある。",skin:"#d9a578",hair:"#6a2f24",cloth:"#7c3656",accent:"#e3b756",icon:"♪"},
{id:9,name:"クラウ",job:"税務官",x:56,y:70,gold:340,mood:"監査中",trait:"無所属・寡黙",voice:"事務的",relation:"町長にも忖度しない",line:"帳簿を。雑談はその後です。",skin:"#c8946f",hair:"#2d2c2b",cloth:"#34383f",accent:"#b9bcbf",icon:"§"}
];
const events=[
"ガンツ、鉄の剣を18G値下げ。ミラが『まだ高い』と一言。",
"レオ一行、西門から入場。ガンツの店へ直行。",
"ロッタ、宿の残室を2部屋に変更。",
"ノア、『北の森で鳥の声が消えた』と広場で話す。",
"ゼフ、今夜の広場ライブを突然告知。",
"クラウ、パン屋エルンの帳簿を確認中。",
"ユナ、レオの衝動買いを止める。",
"カイ、薬価の急上昇を不審に思っている。"
];
export default function Home(){
 const [tick,setTick]=useState(18432),[people,setPeople]=useState(base),[feed,setFeed]=useState(events.slice(0,5)),[sel,setSel]=useState<P|null>(null),[focus,setFocus]=useState<number|null>(null);
 useEffect(()=>{const t=setInterval(()=>{setTick(v=>v+1);setPeople(ps=>ps.map(p=>{const m=nextPosition(p.id,p.x,p.y,p.routeIndex??0,p.id>=5&&p.id<=7?.95:.72);return {...p,x:m.x,y:m.y,routeIndex:m.index,moving:m.moving,dir:m.dir}}));if(Math.random()>.62)setFeed(f=>[events[Math.floor(Math.random()*events.length)],...f].slice(0,6))},500);return()=>clearInterval(t)},[]);
 const hour=Math.floor((tick/30)%24),day=Math.floor(tick/720)+1,night=hour<6||hour>18;
 const town=derivedTownState(tick),gdp=town.treasury,townTier=getTownTier(town.population);
 return <main className={night?"night":""}>
 <header><div><b>REAL NPC</b><span> LIVING WORLD / ALPHA</span></div><div className="live">● LIVE　DAY {day}　{String(hour).padStart(2,"0")}:{String((tick*2)%60).padStart(2,"0")}</div></header>
 <section className="stats"><div><small>人口</small><strong>{town.population}</strong><em>人</em></div><div><small>町財政</small><strong>{gdp.toLocaleString()}</strong><em>G</em></div><div><small>都市段階</small><strong>{townTier}</strong></div><div><small>注目人物</small><strong>{focus===null?"ガンツ":base[focus].name}</strong></div></section>
 <section className="world"><div className="map"><TownScenery town={town} night={night}/>
 {INITIAL_BUILDINGS.map(b=><BuildingRenderer key={b.id} building={b} town={town}/>)}
 {people.map(p=><button key={p.id} className={"person "+(focus===p.id?"focused ":"")+(p.moving?"walking ":"")+(p.dir==="left"?"face-left":"face-right")} style={{left:p.x+"%",top:p.y+"%"}} onClick={()=>{setSel(p);setFocus(p.id)}}>
 <Sprite p={p}/><label>{p.name}<small>{p.job}</small></label>{[0,5,8,9].includes(p.id)&&<span className="bubble">{p.line}</span>}</button>)}
 <div className="trees">♣　♠　♣　　　　　♠<br/>　　♣　　　　　　　　　♣</div></div>
 <aside><h2>町のいま</h2><div className="townpulse"><span>繁栄 <b>{town.prosperity}</b></span><span>文化 <b>{town.culture}</b></span><span>治安 <b>{town.security}</b></span></div>{feed.map((e,i)=><div className="event" key={i}><time>{i?(i*3+1)+"分前":"たった今"}</time><p>{e}</p></div>)}<h2>CHARACTER WATCH</h2><div className="watch">{base.slice(0,5).map(p=><button key={p.id} onClick={()=>{setSel(p);setFocus(p.id)}}><Sprite p={p}/><span>{p.name}<small>{p.mood}</small></span></button>)}</div></aside></section>
 {sel&&<div className="card" onClick={()=>setSel(null)}><Sprite p={sel} big/><div className="bio"><small>{sel.job}</small><h3>{sel.name}</h3><div className="tags"><span>{sel.trait}</span><span>{sel.mood}</span></div><p><b>所持金</b> {sel.gold}G</p><p><b>関係</b> {sel.relation}</p><q>{sel.line}</q></div><button>×</button></div>}
 <footer>WORLD TICK #{tick.toLocaleString()}　•　この町はあなたが見ていない間も生き続けます</footer></main>
}
function Sprite({p,big=false}:{p:P,big?:boolean}){return <span className={"sprite "+(big?"big":"")} style={{"--skin":p.skin,"--hair":p.hair,"--cloth":p.cloth,"--accent":p.accent} as React.CSSProperties}><i className="hair"/><i className="face"><u/><u/></i><i className="body"/><i className="mark">{p.icon}</i></span>}