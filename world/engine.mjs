import fs from "node:fs";import path from "node:path";
const file=process.env.WORLD_STATE||path.join(process.cwd(),"world","state.json");
const seed={tick:1,day:1,gold:18420,population:97,heroVisits:0,lastEvent:"町が生まれた",updatedAt:new Date().toISOString()};
function load(){try{return JSON.parse(fs.readFileSync(file,"utf8"))}catch{return seed}}
function save(s){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(s,null,2))}
const events=["鍛冶屋が鉄を仕入れた","薬屋でポーションが売れた","旅人が中央広場に到着","勇者一行が西門を通過","宿屋に予約が入った","パン屋が焼き上がった"];
function tick(){const s=load();s.tick++;s.day=Math.floor(s.tick/1440)+1;s.gold+=Math.floor(Math.random()*15)-3;if(Math.random()>.94){s.heroVisits++;s.lastEvent=events[Math.floor(Math.random()*events.length)]}s.updatedAt=new Date().toISOString();save(s);console.log(JSON.stringify(s))}
tick();