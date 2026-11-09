import {action,BREEDS,dry} from './core.mjs';
// Simulation time advances only while the game is open and visible.
export const DAY_SECONDS=480;
export function touchCow(s,id,tool='hand'){
 const c=s.cows.find(c=>c.id===Number(id));if(!c)return {ok:false,message:'젖소를 찾을 수 없어요.'};
 if(tool==='machine'){
  if(c.machine){c.machine=false;return {ok:true,message:'착유기를 떼었어요.',effect:'기계 회수'};}
  if(!s.up.milker)return {ok:false,message:'건설에서 자동 착유기를 먼저 구입해주세요.'};
  if(c.age<5||!BREEDS[c.breed].yield)return {ok:false,message:'착유 가능한 성체에 장착해주세요.'};
  if(s.cows.filter(x=>x.machine).length>=s.up.milker*2)return {ok:false,message:`현재 ${s.up.milker*2}대까지 장착 가능해요. 착유기를 업그레이드해주세요.`};
  c.machine=true;return {ok:true,message:'자동 착유기 장착 완료',effect:'착유기 장착'};
 }
 if(tool==='pet'){const r=action(s,'pet',{id});return {...r,effect:r.ok?'♥ +3':null};}
 if(tool==='feed'){
  if(!c.colostrum){const r=action(s,'colostrum',{id});return {...r,effect:r.ok?'첫 초유 ♥':null};}
  if(c.fed===s.day)return {ok:false,message:'지금은 배가 불러요.'};
  const r=action(s,'feed',{id});return {...r,effect:r.ok?'냠냠!':null};
 }
 if(tool!=='hand')return {ok:false,message:'사용할 도구를 선택해주세요.'};
 if(c.age<5)return {ok:false,message:'송아지는 먹고 자라요. 쓰다듬어주세요.'};
 if(!BREEDS[c.breed].yield)return {ok:false,message:'육용 소예요. 먹이와 교감으로 키워주세요.'};
 if(dry(c))return {ok:false,message:'출산 준비 중이에요. 다른 소를 돌봐주세요.'};
 if(c.fed!==s.day)return {ok:false,message:'먹이 도구를 선택하고 사료를 먼저 주세요.'};
 if(c.workUntil)return {ok:false,message:'지금 착유 중이에요.'};
 if((c.nextMilk||0)>(s.liveTick||0))return {ok:false,message:'우유가 차고 있어요. 다른 젖소를 돌봐주세요.'};
 c.workUntil=(s.liveTick||0)+2;return {ok:true,message:'착유 시작',effect:'착유 중…'};
}
export function stepLive(s){
 s.liveTick=(s.liveTick||0)+1;const events=[];
 for(const c of s.cows){
  if(s.up.feeder&&s.auto.feeder&&c.fed!==s.day&&c.colostrum&&s.cows.indexOf(c)<6+s.up.feeder*4){const r=action(s,'feed',{id:c.id});if(r.ok)events.push({id:c.id,text:'자동 급여',kind:'feed'});}
  if(c.machine&&s.pail.milk+s.pail.premium>=20+s.up.tool*3&&s.up.tank>=4)action(s,'emptyPail');
  if(c.workUntil&&c.workUntil<=s.liveTick){delete c.workUntil;const r=action(s,'milk',{id:c.id,clean:true,live:true});if(r.ok)events.push({id:c.id,text:`+${r.qty}L`,kind:'milk'});else events.push({id:c.id,text:r.message,kind:'blocked'});}
  if(c.machine&&s.auto.milker&&s.pail.milk+s.pail.premium<20+s.up.tool*3&&!c.workUntil&&c.fed===s.day&&(c.nextMilk||0)<=s.liveTick){touchCow(s,c.id);}
 }
 if(s.up.seller&&s.auto.seller&&s.liveTick%20===0){for(const k of s.auto.products){const reserve=Math.max(s.auto.keep,s.contract.product===k?Math.max(0,Math.min(240,40+s.contract.tier*8)-s.contract.progress):0);const n=Math.max(0,s.inventory[k]-reserve);if(n){const r=action(s,'liveSale',{key:k,qty:n});if(r.ok)events.push({text:r.message,kind:'sale'});}}}
 if(s.liveTick%DAY_SECONDS===0){const r=action(s,'nextDay');events.push({text:`${s.day}일째 · 새 주문 도착`,kind:'day'});}
 return events;
}
