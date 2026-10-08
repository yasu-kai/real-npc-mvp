export type Point={x:number;y:number};
export const NODES:Record<string,Point>={
 westGate:{x:8,y:51},mainWest:{x:22,y:52},plazaW:{x:39,y:52},plaza:{x:48,y:47},plazaN:{x:48,y:35},plazaS:{x:48,y:62},mainEast:{x:68,y:52},eastBridge:{x:84,y:52},
 blacksmith:{x:24,y:34},apothecary:{x:61,y:29},inn:{x:38,y:64},bakery:{x:69,y:63},tax:{x:57,y:71},stage:{x:48,y:31},northRoad:{x:31,y:27},southRoad:{x:67,y:67}
};
export const ROUTES:Record<number,string[]>={
 0:["blacksmith","northRoad","plazaN","plaza","mainWest","blacksmith"],
 1:["apothecary","plazaN","plaza","mainEast","apothecary"],
 2:["inn","plazaS","plaza","mainWest","inn"],
 3:["bakery","southRoad","plazaS","plaza","mainEast","bakery"],
 4:["southRoad","plazaS","plaza","plazaN","northRoad","mainWest","southRoad"],
 5:["westGate","mainWest","plazaW","plaza","blacksmith","plaza","inn","plazaW","mainWest","westGate"],
 6:["westGate","mainWest","plazaW","plaza","apothecary","plaza","inn","plazaW","mainWest","westGate"],
 7:["westGate","mainWest","plazaW","plaza","stage","plaza","inn","plazaW","mainWest","westGate"],
 8:["stage","plazaN","plaza","mainEast","plaza","stage"],
 9:["tax","southRoad","plazaS","plaza","bakery","plaza","tax"]
};
export function nextPosition(id:number,x:number,y:number,index:number,speed=.85){
 const route=ROUTES[id]??["plaza"];
 const key=route[index%route.length];
 const t=NODES[key]??NODES.plaza;
 const dx=t.x-x,dy=t.y-y,d=Math.hypot(dx,dy);
 if(d<1.15){const ni=(index+1)%route.length;const nt=NODES[route[ni]]??t;return {x,y,index:ni,target:route[ni],moving:false,dir:nt.x>=x?"right":"left"}}
 const step=Math.min(speed,d);
 return {x:x+dx/d*step,y:y+dy/d*step,index,target:key,moving:true,dir:dx>=0?"right":"left"};
}
