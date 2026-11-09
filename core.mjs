export const VERSION=1;
export const BREEDS={
 holstein:{name:'홀스타인',emoji:'🐄',color:'#333b35',price:1400,yield:15,feed:3,quality:1,beef:700,desc:'풍부한 착유량 · 큰 목장의 든든한 주역'},
 jersey:{name:'저지',emoji:'🐂',color:'#c08949',price:1800,yield:10,feed:2,quality:3,beef:850,desc:'진한 우유 · 프리미엄 유제품에 특화'},
 meadow:{name:'초원 교잡종',emoji:'🐄',color:'#c5b58c',price:900,yield:9,feed:1,quality:1,beef:450,desc:'적은 사료로 알뜰하게 · 초보 목장 추천'},
 simmental:{name:'시멘탈',emoji:'🐂',color:'#a35c41',price:2400,yield:12,feed:3,quality:2,beef:1200,desc:'착유와 출하를 함께 고려하는 균형형'},
 angus:{name:'앵거스',emoji:'🐂',color:'#44342b',price:2000,yield:0,feed:2,quality:0,beef:1400,desc:'육용 특화 · 잘 키울수록 높은 출하 가치'}
};
export const PRODUCTS={milk:{name:'우유',icon:'🥛',price:12},premium:{name:'고급 우유',icon:'✨',price:20},yogurt:{name:'요거트',icon:'🍶',price:65},cheese:{name:'치즈',icon:'🧀',price:110},butter:{name:'버터',icon:'🧈',price:150}};
export const RECIPES={yogurt:{name:'요거트',milk:3,cost:5,level:1},cheese:{name:'치즈',milk:4,cost:8,level:2},butter:{name:'버터',milk:5,cost:12,level:3}};
export const UPGRADES={
 land:{name:'목장 확장',icon:'🌳',base:650,max:8,desc:'젖소 자리 +3 · 번식 공간도 함께 확보'},
 tool:{name:'착유 도구',icon:'🪣',base:300,max:5,desc:'단계마다 착유량 +10%'},
 tank:{name:'우유통 확장',icon:'🥛',base:450,max:8,desc:'우유·고급 우유 보관량 +100L'},
 bag:{name:'가방 확장',icon:'🎒',base:350,max:8,desc:'사료와 가공품 보관량 +60'},
 cooler:{name:'냉각 탱크',icon:'❄️',base:950,max:3,desc:'등급 판정 +1 · 고급 우유 생산에 도움'},
 dairy:{name:'유제품 공방',icon:'🧀',base:700,max:3,desc:'요거트 → 치즈 → 버터 레시피 해금'},
 nursery:{name:'송아지 보육실',icon:'🍼',base:800,max:3,desc:'번식 해금 · 2/3단계에서 성장 25/50% 가속'},
 milker:{name:'자동 착유기',icon:'⚙️',base:2800,max:1,desc:'하루 시작에 급여된 젖소를 자동 착유'},
 feeder:{name:'자동 급여기',icon:'🌾',base:1800,max:1,desc:'하루 시작에 보유 사료로 자동 급여'},
 research:{name:'목장 연구소',icon:'🔬',base:5000,max:20,desc:'장기 성장 · 단계마다 생산 +1%, 판매가 +2%'},
 seller:{name:'자동판매 설비',icon:'🚚',base:9000,max:1,desc:'후반 설비 · 보유량·최저가·품목 설정 판매'}
};
const names=['보리','우유','초코','구름','모카','솜이','쿠키','밤비','라떼','단비'];
export function newCow(id,breed,day=1,calf=false){return {id,breed,name:names[(id-1)%names.length],age:calf?0:8,level:1,bond:0,growth:0,pregnancy:0,parent:null,trait:1+(id%3)*.03,fed:0,milked:0,pet:0,colostrum:!calf,star:false,born:day};}
export function fresh(){return {version:VERSION,name:'우리 목장',day:1,coins:350,xp:0,feed:24,inventory:{milk:0,premium:0,yogurt:0,cheese:0,butter:0},up:{land:0,tool:0,tank:0,bag:0,cooler:0,dairy:0,nursery:0,milker:0,feeder:0,seller:0,research:0},cows:[newCow(1,'holstein'),newCow(2,'meadow')],nextId:3,ordersDone:[],auto:{milker:true,feeder:true,seller:false,keep:30,min:10,products:['milk']},contract:{tier:0,progress:0,product:'milk'},stats:{sold:0,milk:0,births:0,orders:0,crafted:0,jobs:0,days:1},album:[],claimed:[],ration:'balanced',log:[],tutorial:0};}
export function level(s){return 1+Math.floor(Math.sqrt(s.xp/80));}
export function capacity(s){return {cows:4+s.up.land*3,tank:120+s.up.tank*100,bag:80+s.up.bag*60};}
export function bagUsed(s){return s.feed+s.inventory.yogurt+s.inventory.cheese+s.inventory.butter;}
export function milkUsed(s){return s.inventory.milk+s.inventory.premium;}
export function cost(s,key){return Math.round(UPGRADES[key].base*Math.pow(key==='research'?1.32:1.7,s.up[key]));}
export function price(s,key){return Math.round(PRODUCTS[key].price*(1+((s.day*7)%9-4)*.025)*(1+(s.up.research||0)*.02));}
export function dry(c){return c.pregnancy>0&&c.pregnancy<=2;}
export function stage(c){return c.age<2?'송아지':c.age<5?'육성우':dry(c)?'건유기':c.pregnancy?'임신 중':'성체';}
export function feedCost(s,c){return c.age<5?1:BREEDS[c.breed].feed+(s.ration==='rich'?1:0);}
export function yieldMilk(s,c){return Math.max(0,Math.round(BREEDS[c.breed].yield*(1+.01*(s.up.research||0)+.10*s.up.tool+.08*(c.level-1)+c.bond*.005)*c.trait*(s.ration==='rich'?1.15:1)));}
function fail(message){return {ok:false,message};}
function ok(message,extra={}){return {ok:true,message,...extra};}
function record(s,msg){s.log.unshift({day:s.day,text:msg});s.log=s.log.slice(0,50);}
function spend(s,n){if(s.coins<n)return false;s.coins-=n;return true;}
function cow(s,id){return s.cows.find(c=>c.id===Number(id));}
export function orders(s){const pool=[['milk',18,330,'동네 빵집'],['yogurt',4,360,'숲속 카페'],['premium',12,360,'파티시에'],['cheese',3,440,'마을 레스토랑'],['milk',30,570,'학교 급식'],['butter',3,600,'주말 베이커리']];let choices=pool.filter(o=>o[0]==='milk'||o[0]==='premium'||s.up.dairy>=RECIPES[o[0]].level);return Array.from({length:3},(_,i)=>{const p=choices[(s.day+i)%choices.length];return {id:`${s.day}-${i}`,product:p[0],qty:p[1]+Math.min(60,Math.floor(s.day/10)*2),reward:Math.round((p[1]+Math.min(60,Math.floor(s.day/10)*2))*PRODUCTS[p[0]].price*1.4),customer:p[3]};});}
export const ACHIEVEMENTS=[{id:'milk100',title:'첫 우유 배달',desc:'우유 100L 생산',field:'milk',target:100,reward:250},{id:'orders10',title:'마을의 단골 목장',desc:'주문 10건 납품',field:'orders',target:10,reward:800},{id:'births3',title:'작은 발자국',desc:'송아지 3마리 탄생',field:'births',target:3,reward:900},{id:'crafted50',title:'우리 동네 치즈 장인',desc:'유제품 50개 생산',field:'crafted',target:50,reward:1200},{id:'sold20000',title:'목장의 자립',desc:'누적 판매 수익 20,000',field:'sold',target:20000,reward:2000},{id:'days50',title:'오래오래 함께',desc:'게임 속 50일 진행',field:'days',target:50,reward:2500}];
export function action(s,type,p={}){
 let c=p.id?cow(s,p.id):null;
 if(['feed','pet','milk','breed','train','ship','star','rename','colostrum'].includes(type)&&!c)return fail('젖소를 찾을 수 없어요.');
 switch(type){
 case 'name':s.name=String(p.name||'우리 목장').trim().slice(0,16)||'우리 목장';return ok('목장 이름을 바꿨어요.');
 case 'rename':c.name=String(p.name||c.name).trim().slice(0,12)||c.name;return ok('이름을 바꿨어요.');
 case 'star':c.star=!c.star;return ok(c.star?'소중한 소로 보호했어요.':'보호를 해제했어요.');
 case 'ration':if(!['balanced','rich'].includes(p.value))return fail('없는 배합이에요.');s.ration=p.value;return ok('급여 배합을 바꿨어요. 다음 급여부터 적용돼요.');
 case 'feed':{if(c.fed===s.day)return fail('오늘 먹이를 먹었어요.');if(c.age===0&&!c.colostrum)return fail('갓 태어난 송아지에게 먼저 초유를 주세요.');let n=feedCost(s,c);if(s.feed<n)return fail('사료가 부족해요. 풀 베기나 사료 구매를 해보세요.');s.feed-=n;c.fed=s.day;c.ration=s.ration;s.xp+=3;return ok(`${c.name}에게 먹이를 줬어요.`);}
 case 'colostrum':if(c.colostrum||c.age>0)return fail('이미 첫 돌봄을 마쳤어요.');c.colostrum=true;s.xp+=8;return ok('따뜻한 초유와 첫 돌봄을 마쳤어요.');
 case 'pet':if(c.pet===s.day)return fail('오늘 충분히 교감했어요.');c.pet=s.day;c.bond=Math.min(100,c.bond+3);s.xp+=2;return ok(`${c.name}의 친밀도 +3 ♥`);
 case 'milk':{if(c.age<5)return fail('성체가 되면 착유할 수 있어요.');if(!BREEDS[c.breed].yield)return fail('육용 품종이에요. 성장시켜 출하할 수 있어요.');if(dry(c))return fail('출산을 준비하는 건유기예요. 다른 소를 돌봐주세요.');if(c.fed!==s.day)return fail('먹이를 먼저 주세요.');if(c.milked===s.day)return fail('오늘 착유를 마쳤어요. 다음 날에도 만나요.');let qty=yieldMilk({...s,ration:c.ration||'balanced'},c);if(milkUsed(s)+qty>capacity(s).tank)return fail('우유통 공간이 부족해요. 판매·가공하거나 확장해주세요.');const quality=BREEDS[c.breed].quality+s.up.cooler+(p.clean?1:0)+(c.ration==='rich'?1:0);const key=quality>=4?'premium':'milk';s.inventory[key]+=qty;c.milked=s.day;s.stats.milk+=qty;s.xp+=qty;return ok(`${c.name} · ${PRODUCTS[key].name} ${qty}L를 담았어요.`,{qty,key});}
 case 'buyFeed':{let n=Number(p.qty);if(![10,30,60].includes(n))return fail('수량을 확인해주세요.');if(bagUsed(s)+n>capacity(s).bag)return fail('가방 공간이 부족해요.');if(!spend(s,n*3))return fail('골드가 부족해요. 풀 베기로 사료를 모을 수 있어요.');s.feed+=n;return ok(`사료 ${n}개 구입 완료`);}
 case 'forage':if(bagUsed(s)+3>capacity(s).bag)return fail('가방이 가득 찼어요.');s.feed+=3;s.xp+=1;return ok('신선한 풀을 모았어요. 사료 +3');
 case 'job':{const score=Math.max(0,Math.min(1,Number(p.score)||0));const reward=8+Math.round(score*17);s.coins+=reward;s.xp+=2;s.stats.jobs++;return ok(`마을 일손 돕기 완료! +${reward} 골드`);}
 case 'buyCow':{if(!BREEDS[p.breed])return fail('없는 품종이에요.');const reserved=s.cows.filter(c=>c.pregnancy>0).length;if(s.cows.length+reserved>=capacity(s).cows)return fail('출산 예약 자리를 포함해 축사가 가득 찼어요. 목장을 확장해주세요.');if(!spend(s,BREEDS[p.breed].price))return fail('골드가 부족해요.');const nc=newCow(s.nextId++,p.breed,s.day);s.cows.push(nc);s.xp+=15;record(s,`${nc.name} (${BREEDS[p.breed].name}) 입양`);return ok(`${nc.name}가 우리 목장에 왔어요!`);}
 case 'train':{if(c.level>=10)return fail('최고 육성 단계예요.');if(c.age<5)return fail('성체가 되면 전문 육성을 시작할 수 있어요.');const n=120*c.level*c.level;if(!spend(s,n))return fail('육성 비용이 부족해요.');c.level++;s.xp+=10;return ok(`${c.name} 육성 Lv.${c.level} · 생산과 출하 가치가 높아졌어요.`);}
 case 'breed':{if(!s.up.nursery)return fail('송아지 보육실을 먼저 마련해주세요.');if(c.age<5||c.pregnancy)return fail('번식 가능한 성체를 선택해주세요.');if(s.cows.length+s.cows.filter(x=>x.pregnancy>0).length>=capacity(s).cows)return fail('송아지를 위한 빈자리가 필요해요.');if(!spend(s,150))return fail('번식 비용 150 골드가 필요해요.');c.pregnancy=5;record(s,`${c.name}의 임신 · 5일 후 출산 예정`);return ok('새 가족을 기다려요! 마지막 2일은 건유기예요.');}
 case 'ship':{if(c.star)return fail('보호 중인 소예요. 먼저 보호를 해제해주세요.');if(c.pregnancy||c.age<5)return fail('임신 중이거나 어린 소는 출하할 수 없어요.');const value=shipValue(c);s.coins+=value;s.stats.sold+=value;s.album.unshift({name:c.name,breed:c.breed,event:'출하',day:s.day});s.cows=s.cows.filter(x=>x.id!==c.id);record(s,`${c.name} 출하 · ${value} 골드`);return ok(`출하 완료 · +${value} 골드`);}
 case 'upgrade':{const u=UPGRADES[p.key];if(!u)return fail('없는 시설이에요.');if(s.up[p.key]>=u.max)return fail('최고 단계예요.');if(!spend(s,cost(s,p.key)))return fail('골드가 부족해요.');s.up[p.key]++;s.xp+=30;record(s,`${u.name} ${s.up[p.key]}단계`);return ok(`${u.name} 업그레이드 완료!`);}
 case 'contract':{const o=contract(s),n=Math.min(s.inventory[o.product],o.qty-s.contract.progress);if(n<=0)return fail('보낼 상품이 없어요.');s.inventory[o.product]-=n;s.contract.progress+=n;if(s.contract.progress>=o.qty){s.coins+=o.reward;s.stats.sold+=o.reward;s.stats.orders++;s.xp+=80;s.contract.tier++;s.contract.progress=0;delete s.contract.product;s.contract.product=contract(s).product;record(s,`장기 계약 ${s.contract.tier}건 완료`);return ok(`장기 계약 완료! +${o.reward}G`);}return ok(`${n}개를 보냈어요. 나누어 납품할 수 있어요.`);}
 case 'craft':{const r=RECIPES[p.key],n=Number(p.qty||1);if(!r||![1,5].includes(n))return fail('레시피를 확인해주세요.');if(s.up.dairy<r.level)return fail('공방을 업그레이드하면 만들 수 있어요.');let source=p.source==='premium'?'premium':'milk',output=n*(source==='premium'?2:1);if(bagUsed(s)+output>capacity(s).bag)return fail('가방 공간이 부족해요.');if(s.inventory[source]<r.milk*n)return fail(`${PRODUCTS[source].name}가 부족해요.`);if(!spend(s,r.cost*n))return fail('가공 비용이 부족해요.');s.inventory[source]-=r.milk*n;s.inventory[p.key]+=output;s.stats.crafted+=output;s.xp+=8*n;return ok(`${r.name} ${output}개 완성!`);}
 case 'sell':{if(!PRODUCTS[p.key])return fail('상품을 확인해주세요.');const n=p.qty==='all'?s.inventory[p.key]:Math.floor(Number(p.qty));if(!Number.isFinite(n)||n<=0||n>s.inventory[p.key])return fail('판매할 수량이 부족해요.');const value=n*price(s,p.key);s.inventory[p.key]-=n;s.coins+=value;s.stats.sold+=value;s.xp+=Math.ceil(n/3);return ok(`${PRODUCTS[p.key].name} ${n}개 판매 · +${value} 골드`);}
 case 'order':{const o=orders(s).find(x=>x.id===p.id);if(!o||s.ordersDone.includes(o.id))return fail('이미 완료한 주문이에요.');if(s.inventory[o.product]<o.qty)return fail('납품할 상품이 부족해요.');s.inventory[o.product]-=o.qty;s.coins+=o.reward;s.stats.sold+=o.reward;s.stats.orders++;s.ordersDone.push(o.id);s.xp+=30;return ok(`${o.customer} 납품 완료! +${o.reward} 골드`);}
 case 'auto':{if(!['milker','feeder','seller'].includes(p.key)||!s.up[p.key])return fail('먼저 자동화 설비를 구입해주세요.');s.auto[p.key]=!!p.value;return ok('자동화 설정을 저장했어요.');}
 case 'saleConfig':{s.auto.keep=Math.max(0,Math.min(10000,Math.floor(Number(p.keep)||0)));s.auto.min=Math.max(0,Math.min(10000,Math.floor(Number(p.min)||0)));s.auto.products=Array.isArray(p.products)?p.products.filter(k=>PRODUCTS[k]):['milk'];return ok('자동판매 규칙을 저장했어요.');}
 case 'claim':{const a=ACHIEVEMENTS.find(x=>x.id===p.id);if(!a||s.claimed.includes(a.id)||s.stats[a.field]<a.target)return fail('아직 달성하지 못했어요.');s.claimed.push(a.id);s.coins+=a.reward;return ok(`${a.title} · 보상 ${a.reward} 골드!`);}
 case 'nextDay':return nextDay(s);
 default:return fail('지원하지 않는 작업이에요.');
 }
}
export function contract(s){const tier=s.contract?.tier||0,products=['milk','premium',...(s.up.dairy>=1?['yogurt']:[]),...(s.up.dairy>=2?['cheese']:[]),...(s.up.dairy>=3?['butter']:[])],product=s.contract?.product||products[tier%products.length],qty=Math.min(240,40+tier*8);return {product,qty,reward:Math.round(qty*PRODUCTS[product].price*1.55),tier};}
export function shipValue(c){return Math.round(BREEDS[c.breed].beef*(1+c.growth*.08+(c.level-1)*.15+c.bond*.003)*c.trait);}
export function nextDay(s){const events=[],babies=[];let fed=0,milk=0,sold=0;for(const c of s.cows){if(c.fed===s.day){if(c.age<5)c.age+=1+Math.max(0,s.up.nursery-1)*.25;else c.growth=Math.min(20,c.growth+1);}if(c.pregnancy){c.pregnancy--;if(c.pregnancy===0){const nc=newCow(s.nextId++,c.breed,s.day+1,true);nc.parent=c.name;nc.trait=Math.min(1.25,c.trait+.02);babies.push(nc);s.stats.births++;events.push(`${c.name}의 송아지 ${nc.name} 탄생!`);s.album.unshift({name:nc.name,breed:nc.breed,event:`${c.name}의 송아지`,day:s.day+1});}}}s.cows.push(...babies);s.day++;s.stats.days=s.day;s.ordersDone=[];s.xp+=10;
 for(const c of s.cows){if(s.up.feeder&&s.auto.feeder){const r=action(s,'feed',{id:c.id});if(r.ok)fed++;}if(s.up.milker&&s.auto.milker){const r=action(s,'milk',{id:c.id,clean:true});if(r.ok)milk+=r.qty;}}
 if(s.up.seller&&s.auto.seller){for(const k of s.auto.products){const reserved=orders(s).filter(o=>o.product===k).reduce((n,o)=>n+o.qty,0);const n=Math.max(0,s.inventory[k]-Math.max(s.auto.keep,reserved));if(n&&price(s,k)>=s.auto.min){const before=s.coins;action(s,'sell',{key:k,qty:n});sold+=s.coins-before;}}}
 if(fed)events.push(`자동 급여 ${fed}마리`);if(milk)events.push(`자동 착유 ${milk}L`);if(sold)events.push(`자동판매 ${sold} 골드`);events.forEach(e=>record(s,e));s.album=s.album.slice(0,200);return ok(`${s.day}일째의 아침이에요.`,{events});
}
export function validateSave(x){
 if(!x||x.version!==VERSION)throw Error('지원하지 않는 저장 버전이에요.');
 x=structuredClone(x);if(x.up&&x.up.research===undefined)x.up.research=0;if(!x.contract)x.contract={tier:0,progress:0,product:'milk'};if(!x.contract.product)x.contract.product=contract(x).product;
 const number=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max;
 if(!Number.isInteger(x.day)||x.day<1||!number(x.coins)||!number(x.xp)||!number(x.feed)||typeof x.name!=='string'||x.name.length>16)throw Error('목장 정보가 올바르지 않아요.');
 for(const k of Object.keys(PRODUCTS))if(!number(x.inventory?.[k]))throw Error('재고가 올바르지 않아요.');
 for(const [k,u]of Object.entries(UPGRADES))if(!Number.isInteger(x.up?.[k])||x.up[k]<0||x.up[k]>u.max)throw Error('시설 정보가 올바르지 않아요.');
 if(!Array.isArray(x.cows)||x.cows.length>28||!Number.isInteger(x.nextId)||x.nextId<1)throw Error('젖소 정보가 올바르지 않아요.');
 const ids=new Set();for(const c of x.cows){if(!BREEDS[c.breed]||!Number.isInteger(c.id)||c.id<1||c.id>=x.nextId||ids.has(c.id)||typeof c.name!=='string'||c.name.length>12)throw Error('젖소 정보가 올바르지 않아요.');ids.add(c.id);for(const k of ['age','level','bond','growth','pregnancy','trait','fed','milked','pet','born'])if(!number(c[k],1e8))throw Error('젖소 수치가 올바르지 않아요.');if(c.level<1||c.level>10||c.pregnancy>5||c.bond>100||c.trait>1.25)throw Error('젖소 성장 정보가 올바르지 않아요.');}
 if(!x.auto||!Array.isArray(x.auto.products)||x.auto.products.some(k=>!PRODUCTS[k])||!number(x.auto.keep,10000)||!number(x.auto.min,10000))throw Error('자동화 설정이 올바르지 않아요.');
 for(const k of ['milker','feeder','seller'])if(typeof x.auto[k]!=='boolean')throw Error('자동화 설정이 올바르지 않아요.');
 if(!PRODUCTS[x.contract.product])throw Error('계약 상품이 올바르지 않아요.');
 if(!Number.isInteger(x.contract.tier)||x.contract.tier<0||!Number.isInteger(x.contract.progress)||x.contract.progress<0||x.contract.progress>240)throw Error('계약 정보가 올바르지 않아요.');
 if(!['balanced','rich'].includes(x.ration))throw Error('급여 설정이 올바르지 않아요.');
 for(const k of ['sold','milk','births','orders','crafted','jobs','days'])if(!number(x.stats?.[k]))throw Error('기록이 올바르지 않아요.');
 for(const k of ['album','log','ordersDone','claimed'])if(!Array.isArray(x[k])||x[k].length>1000)throw Error('기록이 너무 크거나 올바르지 않아요.');
 if(x.cows.length+x.cows.filter(c=>c.pregnancy>0).length>capacity(x).cows||bagUsed(x)>capacity(x).bag||milkUsed(x)>capacity(x).tank)throw Error('보관·사육 한도가 맞지 않아요.');
 for(const e of x.album)if(!number(e.day)||typeof e.name!=='string'||typeof e.event!=='string'||!BREEDS[e.breed])throw Error('앨범이 올바르지 않아요.');
 for(const e of x.log)if(!number(e.day)||typeof e.text!=='string')throw Error('일지가 올바르지 않아요.');
 return x;
}
