// Typical reference values per 100 g edible portion. See SOURCES.md.
const rows=[
['rice','米饭','主食',130,2.7,28.2,.3,150,'碗',1,'白米饭 熟米饭'],
['brownrice','糙米饭','主食',123,2.7,25.6,1,150,'碗',1,'糙米'],
['oats','燕麦片（干）','主食',379,13.2,67.7,6.5,40,'份',1,'燕麦 燕麦片'],
['bread','全麦面包','主食',247,13,41,4.2,35,'片',1,'全麦吐司'],
['noodles','面条（熟）','主食',138,4.5,25,2.1,200,'碗',1,'面条 熟面条'],
['potato','土豆（煮）','主食',87,1.9,20.1,.1,150,'个',1,'土豆 马铃薯'],
['sweetpotato','红薯（熟）','主食',90,2,20.7,.2,150,'个',1,'红薯 烤红薯 地瓜'],
['corn','玉米（熟）','主食',96,3.4,21,1.5,150,'根',1,'玉米'],
['chicken','鸡胸肉（熟）','蛋白质',165,31,0,3.6,150,'份',1,'鸡胸肉 熟鸡胸肉'],
['rawchicken','鸡胸肉（生）','蛋白质',120,22.5,0,2.6,150,'份',1,'生鸡胸肉'],
['beef','牛肉（瘦熟）','蛋白质',217,26.1,0,11.8,150,'份',1,'牛肉 瘦牛肉'],
['salmon','三文鱼（熟）','蛋白质',206,22.1,0,12.4,150,'份',1,'三文鱼'],
['shrimp','虾仁（熟）','蛋白质',99,24,.2,.3,100,'份',1,'虾仁 虾'],
['tuna','金枪鱼（水浸）','蛋白质',116,25.5,0,.8,100,'份',1,'金枪鱼'],
['egg','鸡蛋（水煮）','蛋白质',155,12.6,1.1,10.6,50,'个',1,'鸡蛋 水煮蛋 煮鸡蛋'],
['eggwhite','蛋白（熟）','蛋白质',59,12.3,.8,.2,33,'个',1,'蛋清 蛋白'],
['tofu','豆腐','蛋白质',76,8.1,1.9,4.8,150,'份',1,'嫩豆腐'],
['milk','牛奶（全脂）','乳豆饮品',61,3.2,4.8,3.3,257.5,'杯',1.03,'牛奶 全脂牛奶'],
['skimmilk','脱脂牛奶','乳豆饮品',34,3.4,5,.1,257.5,'杯',1.03,'脱脂奶'],
['yogurt','酸奶（原味）','乳豆饮品',63,5.3,7,1.6,200,'杯',1.03,'酸奶 原味酸奶'],
['soymilk','豆浆（无糖）','乳豆饮品',33,2.9,1.7,1.6,255,'杯',1.02,'豆浆 无糖豆浆'],
['whey','乳清蛋白粉','蛋白质',400,80,8,5,30,'勺',1,'蛋白粉 乳清'],
['broccoli','西兰花（熟）','蔬菜',35,2.4,7.2,.4,150,'份',1,'西兰花'],
['spinach','菠菜（熟）','蔬菜',23,3,3.8,.3,150,'份',1,'菠菜'],
['tomato','番茄','蔬菜',18,.9,3.9,.2,150,'个',1,'西红柿'],
['cucumber','黄瓜','蔬菜',15,.7,3.6,.1,200,'根',1,'青瓜'],
['lettuce','生菜','蔬菜',15,1.4,2.9,.2,100,'份',1,''],
['carrot','胡萝卜','蔬菜',41,.9,9.6,.2,80,'根',1,''],
['banana','香蕉','水果',89,1.1,22.8,.3,118,'根',1,''],
['apple','苹果','水果',52,.3,13.8,.2,180,'个',1,''],
['orange','橙子','水果',47,.9,11.8,.1,130,'个',1,'橙'],
['blueberry','蓝莓','水果',57,.7,14.5,.3,100,'份',1,''],
['avocado','牛油果','水果',160,2,8.5,14.7,100,'半个',1,'鳄梨'],
['almond','杏仁','油脂坚果',579,21.2,21.6,49.9,25,'份',1,'巴旦木'],
['peanut','花生（干）','油脂坚果',567,25.8,16.1,49.2,25,'份',1,'花生'],
['oil','食用油','油脂坚果',884,0,0,100,10,'勺',1,'橄榄油 植物油'],
['peanutbutter','花生酱','油脂坚果',588,25.1,20,50.4,15,'勺',1,''],
['pizza','披萨','复合餐食',266,11,33,10,120,'片',1,'比萨'],
['burger','汉堡','复合餐食',250,12,30,9,180,'个',1,'汉堡包'],
['friedrice','炒饭','复合餐食',180,5,28,5.3,250,'碗',1,'蛋炒饭'],
['dumplings','饺子','复合餐食',220,9,29,7.5,25,'个',1,'水饺'],
['sushi','寿司','复合餐食',150,5,27,2.5,30,'个',1,''],
['salad','蔬菜沙拉（无酱）','蔬菜',25,1.5,4.5,.3,200,'份',1,'蔬菜沙拉 沙拉'],
['fries','薯条','复合餐食',312,3.4,41,15,100,'份',1,'炸薯条'],
['pasta','意大利面（熟无酱）','主食',158,5.8,30.9,.9,200,'份',1,'意大利面 意面'],
['icecream','冰淇淋','零食',207,3.5,24,11,65,'球',1,'冰激凌'],
['chocolate','黑巧克力','零食',598,7.8,45.9,42.6,10,'块',1,'巧克力'],
['coffee','黑咖啡（无糖）','乳豆饮品',1,.1,0,0,250,'杯',1,'黑咖啡 美式咖啡']
];
export const FOODS=rows.map(([id,name,category,kcal,protein,carbs,fat,serving,unit,density,aliases])=>({id,name,category,kcal,protein,carbs,fat,serving,unit,density,aliases:aliases.split(' ').filter(Boolean),source:category==='复合餐食'||id==='whey'?'常见配方参考估算':'常见食材参考值'}));
export const KEYS=['kcal','protein','carbs','fat'];
export const round=(n,d=1)=>Math.round((n+Number.EPSILON)*10**d)/10**d;
export function nutrition(food,grams){
  if(!Number.isFinite(grams)||grams<=0||grams>10000)throw Error('份量须大于 0 且不超过 10000 克');
  return Object.fromEntries(KEYS.map(k=>{if(!Number.isFinite(food[k])||food[k]<0)throw Error('营养数据无效');return[k,round(food[k]*grams/100,3)];}));
}
export function totals(entries){return entries.reduce((a,x)=>{const n=nutrition(x.food,x.grams);for(const k of KEYS)a[k]=round(a[k]+n[k],3);return a;},Object.fromEntries(KEYS.map(k=>[k,0])));}
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function parseMeal(text,foods=FOODS){
  const names=new Map();for(const f of foods)for(const name of [f.name,...f.aliases])names.set(name,f);
  const alt=[...names.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|');
  const num='(?:\\d+(?:\\.\\d+)?)';
  const unit='(?:千克|公斤|毫升|半个|kg|ml|克|g|两|斤|个|根|片|碗|杯|勺|份|球|块)';
  const re=new RegExp(`(${alt})\\s*(${num})\\s*(${unit})?|(${num})\\s*(${unit})\\s*(${alt})`,'gi');
  const items=[],unknown=[];
  for(const segment of text.replace(/和|加上|以及/g,'，').split(/[，,、;；\n+]+/).map(x=>x.trim()).filter(Boolean)){
    let last=0; for(const m of segment.matchAll(re)){
      const before=segment.slice(last,m.index).trim();if(before)unknown.push(before);
      last=m.index+m[0].length;
      // Reject a partial token when an unsupported unit follows its number.
      const next=segment.slice(last);const noUnit=m[1]&&!m[3];
      if(noUnit&&next&&!/^\s*$/.test(next)&&![...names.keys()].some(n=>next.trimStart().startsWith(n))){unknown.push(m[0]+next);last=segment.length;break;}
      const name=m[1]||m[6],food=names.get(name)||[...names].find(([n])=>n.toLowerCase()===name.toLowerCase())?.[1];
      const amount=Number(m[2]||m[4]),u=(m[3]||m[5]||'g').toLowerCase();
      let grams;
      if(['g','克'].includes(u))grams=amount;
      else if(['kg','千克','公斤'].includes(u))grams=amount*1000;
      else if(u==='斤')grams=amount*500;
      else if(u==='两')grams=amount*50;
      else if(['ml','毫升'].includes(u))grams=amount*(food.density||1);
      else if(u===food.unit||u==='份')grams=amount*food.serving;
      else {unknown.push(m[0]);continue;}
      if(!Number.isFinite(grams)||grams<=0||grams>10000){unknown.push(m[0]);continue;}
      items.push({food,grams:round(grams,2),note:`${amount}${u}${noUnit?'（按克）':''}`});
    }
    const rest=segment.slice(last).trim();if(rest)unknown.push(rest);
  }
  return {items,unknown};
}
export const DEFAULT_GOALS={kcal:2000,protein:120,carbs:250,fat:60};
export function validFood(f){return f&&typeof f.id==='string'&&f.id.length<100&&typeof f.name==='string'&&f.name.trim().length>0&&f.name.length<=60&&typeof f.category==='string'&&Array.isArray(f.aliases)&&f.aliases.every(x=>typeof x==='string')&&KEYS.every(k=>Number.isFinite(f[k])&&f[k]>=0&&f[k]<=1000)&&Number.isFinite(f.serving)&&f.serving>0&&f.serving<=10000&&typeof f.unit==='string'&&(f.density===undefined||(Number.isFinite(f.density)&&f.density>0&&f.density<25));}
export function validateBackup(data){
 if(!data||data.version!==1||!Array.isArray(data.entries)||data.entries.length>50000||!Array.isArray(data.customFoods)||data.customFoods.length>1000)throw Error('备份格式无效或数据过多');
 if(!data.customFoods.every(validFood))throw Error('自定义食物数据无效');
 for(const e of data.entries)if(!e||typeof e.id!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!['早餐','午餐','晚餐','加餐'].includes(e.meal)||!validFood(e.food)||!Number.isFinite(e.grams)||e.grams<=0||e.grams>10000)throw Error('饮食记录无效');
 if(!data.goals||!KEYS.every(k=>Number.isFinite(data.goals[k])&&data.goals[k]>0&&data.goals[k]<20000))throw Error('目标数据无效');
 if(!data.water||Array.isArray(data.water)||typeof data.water!=='object'||Object.entries(data.water).some(([k,v])=>!/^\d{4}-\d{2}-\d{2}$/.test(k)||!Number.isFinite(v)||v<0||v>100000))throw Error('饮水记录无效');
 return {version:1,entries:data.entries,customFoods:data.customFoods,water:data.water,goals:data.goals,goalSet:!!data.goalSet};
}
