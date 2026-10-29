import {FOODS,KEYS,DEFAULT_GOALS,nutrition,parseMeal,totals,round,validateBackup} from './nutrition.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',book:'<path d="M4 4h6q2 0 2 2v15q0-2-2-2H4V4Zm16 0h-6q-2 0-2 2v15q0-2 2-2h6V4Z"/>',grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',leaf:'<path d="M20 3S5 2 4 12q-1 9 8 8c8-1 8-17 8-17ZM5 19 16 8"/>',shield:'<path d="m12 3 8 3v6q0 5-8 9-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 4m0 3v.1"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-12 4h1m4 0h1"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',flame:'<path d="M13 3c2 7 7 7 6 13a7 7 0 0 1-14-1c0-4 3-7 4-8 0 4 2 4 2 4s3-4 2-8Z"/>',edit:'<path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14Z"/>',camera:'<path d="M8 6 10 3h4l2 3h5v14H3V6Z"/><circle cx="12" cy="12" r="4"/>',spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4"/>',utensils:'<path d="M4 3v6q0 3 3 3t3-3V3M7 3v18M20 3q-6 4-6 10h6m0-10v18"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l1 1m14 14 1 1M4 20l1-1M19 5l1-1"/>',droplet:'<path d="M12 2S4 10 4 15a8 8 0 0 0 16 0c0-5-8-13-8-13Z"/>',scale:'<path d="M3 7h18v14H3Z"/><path d="M8 7V4h8v3m-4 3 3 2"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>'};
function svg(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.leaf}</svg>`;}
function fillIcons(root=document){root.querySelectorAll('[data-icon]').forEach(x=>x.innerHTML=svg(x.dataset.icon));}
fillIcons();
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmt=n=>Math.round(n).toLocaleString('zh-CN');
const STORAGE='fitbite.v1';
let state={version:1,entries:[],customFoods:[],goals:{...DEFAULT_GOALS},water:{},goalSet:false},storageError=false;
try{const value=localStorage.getItem(STORAGE);if(value)state=validateBackup(JSON.parse(value));}catch{storageError=true;}
let activeDate=localDate(new Date()),draft=[],view='dashboard',mode='text',category='全部',photoUrl=null,photoBusy=false,importPending=null,toastTimer;
$('#active-date').value=activeDate;
const allFoods=()=>[...FOODS,...state.customFoods];
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200);}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{toast('浏览器未能保存数据，请立即导出备份。');}}
const emoji=f=>({主食:'🍚',蛋白质:'🥚',乳豆饮品:'🥛',蔬菜:'🥦',水果:'🍎',油脂坚果:'🥜',复合餐食:'🍱',零食:'🍫',自定义:'🥣'}[f.category]||'🥣');
function showView(next){view=next;$$('.view').forEach(el=>el.hidden=el.id!==`${next}-view`);$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===next));const names={dashboard:'饮食概览',diary:'饮食日记',foods:'食物资料库'};$('#crumb').textContent=names[next];$('#page-title').innerHTML=next==='dashboard'?'吃得明白，<span>练得更好。</span>':next==='diary'?'认真吃饭，<span>记录每一天。</span>':'好好认识，<span>每一份食物。</span>';$('#page-subtitle').textContent=next==='foods'?'从日常食材开始，建立自己的营养常识。':next==='diary'?'回顾你的餐盘，把好习惯变成日常。':'不用精通营养学，也能看懂自己的一日三餐。';if(next==='foods')renderFoods();window.scrollTo({top:0,behavior:'instant'});}
function focusInput(){showView('dashboard');$('#composer').scrollIntoView({behavior:'smooth',block:'center'});if(mode==='text')$('#meal-text').focus({preventScroll:true});}
function setMode(next){mode=next;$('#text-panel').hidden=next!=='text';$('#photo-panel').hidden=next!=='photo';$$('[data-mode]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.mode===next)));$('#estimate-label').textContent=next==='photo'?'识别照片':'估算营养';}
function render(){
 const entries=state.entries.filter(e=>e.date===activeDate),n=totals(entries),g=state.goals;
 $('#calorie-value').textContent=fmt(n.kcal);$('#calorie-target').textContent=fmt(g.kcal);$('#remaining-value').textContent=fmt(Math.abs(g.kcal-n.kcal));$('#remaining-label').textContent=n.kcal>g.kcal?'超出参考目标':'距离参考目标';$('#goal-tag').textContent=state.goalSet?'我的每日目标':'参考目标 · 可自行调整';$('#energy-tip').textContent=n.kcal>g.kcal?'摄入会有日常波动，用记录了解自己的节奏。':'每一餐的小记录，让进步看得见。';
 $('#energy-ring').style.background=`conic-gradient(${n.kcal>g.kcal?'#dfa06b':'#8db968'} ${Math.min(n.kcal/g.kcal,1)*360}deg,#edf2e9 0deg)`;
 const meta=[['protein','蛋白质','PROTEIN','var(--green)'],['carbs','碳水','CARBS','var(--blue)'],['fat','脂肪','FAT','var(--orange)']];
 $('#macros').innerHTML=meta.map(([key,label,en,color])=>`<div class="macro-row"><div class="macro-label"><span>${label}</span><span>${en}</span><span class="macro-num"><b>${round(n[key])}</b> / ${g[key]} g</span></div><div class="bar" role="meter" aria-label="${label}" aria-valuemin="0" aria-valuemax="${g[key]}" aria-valuenow="${Math.min(n[key],g[key])}" aria-valuetext="已摄入${round(n[key])}克，目标${g[key]}克"><i style="background:${color};width:${Math.min(n[key]/g[key]*100,100)}%"></i></div></div>`).join('');
 $('#meal-count').textContent=entries.length;$('#meal-list').innerHTML=mealList(entries);$('#full-meal-list').innerHTML=mealList(entries);$('#water-value').textContent=fmt(state.water[activeDate]||0);
 $('#water-cups').innerHTML=Array.from({length:8},(_,i)=>`<svg class="${(state.water[activeDate]||0)>=250*(i+1)?'filled':''}" viewBox="0 0 24 28"><path d="m4 3 2 22h12l2-22H4Zm3 4h10l-1 15H8Z"/></svg>`).join('');
}
function mealList(entries){if(!entries.length)return `<div class="empty">${svg('utensils')}<strong>这一页，等你的第一餐。</strong><p>输入食物和份量，确认后会出现在这里。</p><button class="text-button" data-action="focus-input">开始记录 ↗</button></div>`;
 return ['早餐','午餐','晚餐','加餐'].filter(slot=>entries.some(e=>e.meal===slot)).map(slot=>{const list=entries.filter(e=>e.meal===slot);return `<div class="meal-group"><div class="meal-head"><span>${{早餐:'☀️',午餐:'🌤️',晚餐:'🌙',加餐:'🍵'}[slot]}</span><b>${slot}</b><small>${list.length} 项食物</small><strong>${fmt(totals(list).kcal)} kcal</strong></div>${list.map(e=>`<div class="meal-row"><span class="food-emoji">${emoji(e.food)}</span><div class="meal-info"><strong>${esc(e.food.name)}</strong><small>${e.grams} g · 蛋白质 ${round(nutrition(e.food,e.grams).protein)} g · 碳水 ${round(nutrition(e.food,e.grams).carbs)} g</small></div><div class="meal-kcal">${fmt(nutrition(e.food,e.grams).kcal)} <span>kcal</span></div><button class="delete-btn" data-delete="${esc(e.id)}" aria-label="删除${esc(e.food.name)}">×</button></div>`).join('')}</div>`;}).join('');
}
function renderDraft(){
 $('#draft').hidden=!draft.length;$('#draft-items').innerHTML=draft.map((d,i)=>`<div class="draft-row"><div class="draft-name">${esc(d.food.name)}<small>${esc(d.note||'按克重估算')} · ${esc(d.food.source||'用户自定义')}</small></div><input type="number" min="0.1" max="10000" step="0.1" value="${d.grams}" data-grams="${i}" aria-label="${esc(d.food.name)}克重"><span>g</span><b data-draft-energy="${i}">${fmt(nutrition(d.food,d.grams).kcal)} kcal</b><button class="delete-btn" data-remove-draft="${i}" aria-label="移除${esc(d.food.name)}">×</button></div>`).join('');updateDraftTotal();
}
function updateDraftTotal(){const valid=draft.length&&$$('[data-grams]').every(x=>x.checkValidity());$('#save-meal').disabled=!valid;$('#draft-kcal').textContent=valid?fmt(totals(draft).kcal):'—';}
function addFood(food){draft.push({food,grams:food.serving,note:`参考一${food.unit}，请确认实际克重`});renderDraft();showView('dashboard');$('#draft').scrollIntoView({behavior:'smooth',block:'center'});}
function renderFoods(){const foods=allFoods();const q=$('#food-search').value.trim().toLowerCase();const categories=['全部',...new Set(foods.map(f=>f.category))];$('#food-filters').innerHTML=categories.map(c=>`<button class="${category===c?'selected':''}" data-category="${esc(c)}">${esc(c)}</button>`).join('');const filtered=foods.filter(f=>(category==='全部'||f.category===category)&&[f.name,...f.aliases].some(s=>s.toLowerCase().includes(q)));$('#food-library').innerHTML=filtered.length?filtered.map(f=>`<button class="food-tile" data-food="${esc(f.id)}" aria-label="添加${esc(f.name)}"><span class="food-emoji">${emoji(f)}</span><h3>${esc(f.name)}</h3><span class="food-energy">${f.kcal}</span> <small>kcal / 100g</small><p>参考一${esc(f.unit)} ≈ ${f.serving} g</p><div>蛋白质 ${f.protein} · 碳水 ${f.carbs} · 脂肪 ${f.fat} g</div></button>`).join(''):'<div class="empty"><strong>还没有这项食物</strong><p>可以使用右上角「自定义食物」，填写包装营养值。</p></div>';}
function openGoals(){$('#goals-form').reset();KEYS.forEach(k=>$('#goals-form').elements[k].value=state.goals[k]);$('#goals-dialog').showModal();}
document.addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 if(button.dataset.view){showView(button.dataset.view);return;}
 if(button.dataset.mode){setMode(button.dataset.mode);return;}
 if(button.hasAttribute('data-close')){button.closest('dialog').close();return;}
 if(button.dataset.delete){const idx=state.entries.findIndex(x=>x.id===button.dataset.delete);if(idx>=0){const [removed]=state.entries.splice(idx,1);persist();render();showUndo(removed);}return;}
 if(button.dataset.removeDraft!==undefined){draft.splice(Number(button.dataset.removeDraft),1);renderDraft();return;}
 if(button.dataset.category){category=button.dataset.category;renderFoods();return;}
 if(button.dataset.food){const food=allFoods().find(f=>f.id===button.dataset.food);if(food)addFood(food);return;}
 const action=button.dataset.action;
 if(action==='goals')openGoals();
 if(action==='focus-input')focusInput();
 if(action==='help')$('#help-dialog').showModal();
 if(action==='example'){$('#meal-text').value='米饭150克，鸡胸肉200克，西兰花150克';$('#meal-text').focus();toast('已填入示例；点击估算营养后可修改份量。');}
 if(action==='custom-food'){$('#custom-form').reset();$('#custom-dialog').showModal();}
 if(action==='water-plus'||action==='water-minus'){state.water[activeDate]=Math.max(0,Math.min(100000,(state.water[activeDate]||0)+(action==='water-plus'?250:-250)));persist();render();}
 if(action==='export'){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`fitbite-${localDate(new Date())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('备份已导出，请妥善保管。');}
 if(action==='import')$('#import-file').click();
 if(action==='clear-photo')clearPhoto();
});
let lastDeleted=null;
function showUndo(removed){lastDeleted=removed;toast('记录已删除。');const button=document.createElement('button');button.textContent='撤销';button.style.cssText='color:#c0f174;margin-left:12px';button.onclick=()=>{if(lastDeleted){state.entries.push(lastDeleted);lastDeleted=null;persist();render();toast('已恢复记录。');}};$('#toast').append(button);}
$('#active-date').addEventListener('change',()=>{if(!$('#active-date').value)return;activeDate=$('#active-date').value;render();});
$('#food-search').addEventListener('input',renderFoods);
$('#draft-items').addEventListener('input',e=>{const i=e.target.dataset.grams;if(i===undefined)return;const grams=Number(e.target.value);if(e.target.checkValidity()&&grams>0&&grams<=10000){draft[Number(i)].grams=grams;$(`[data-draft-energy="${i}"]`).textContent=`${fmt(nutrition(draft[Number(i)].food,grams).kcal)} kcal`;}updateDraftTotal();});
$('#estimate-button').addEventListener('click',async()=>{
 if(mode==='photo'){await recognizePhoto();return;}
 const text=$('#meal-text').value.trim();if(!text){toast('先写下食物和份量吧，例如：米饭150克。');$('#meal-text').focus();return;}
 const result=parseMeal(text,allFoods());draft=result.items;renderDraft();$('#parse-warnings').hidden=!result.unknown.length;$('#parse-warnings').textContent=result.unknown.length?`未识别或份量无效：${result.unknown.join('、')}。这些内容未计入估算，请检查名称和单位，或到食物库自定义添加。`:'';
 if(!draft.length)toast('没有找到可估算的食物，请检查输入或到食物库添加。');
});
$('#save-meal').addEventListener('click',()=>{updateDraftTotal();if($('#save-meal').disabled)return;state.entries.push(...draft.map(d=>({id:crypto.randomUUID(),date:activeDate,meal:$('#meal-slot').value,food:d.food,grams:d.grams})));persist();draft=[];renderDraft();render();$('#meal-text').value='';$('#parse-warnings').hidden=true;toast('这一餐，记下了。');});
$('#goals-form').addEventListener('submit',e=>{e.preventDefault();state.goals=Object.fromEntries(KEYS.map(k=>[k,Number(e.target.elements[k].value)]));state.goalSet=true;persist();render();$('#goals-dialog').close();toast('营养目标已保存。');});
$('#custom-form').addEventListener('submit',e=>{e.preventDefault();const form=e.target,name=form.elements.name.value.trim();if(!name){toast('请填写有效的食物名称。');return;}if(allFoods().some(f=>[f.name,...f.aliases].includes(name))){toast('食物名称已存在，请换一个更具体的名称。');return;}if(state.customFoods.length>=1000){toast('自定义食物最多1000项。');return;}const food={id:crypto.randomUUID(),name,category:'自定义',aliases:[],serving:100,unit:'份',density:1,source:'用户自定义包装值',...Object.fromEntries(KEYS.map(k=>[k,Number(form.elements[k].value)]))};state.customFoods.push(food);persist();$('#custom-dialog').close();renderFoods();toast('已加入食物库，可在文字记录中直接使用。');});
$('#import-file').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>5*1024*1024)throw Error('备份文件不能超过 5 MB');importPending=validateBackup(JSON.parse(await file.text()));$('#import-description').textContent=`备份包含 ${importPending.entries.length} 条饮食记录、${importPending.customFoods.length} 项自定义食物和 ${Object.keys(importPending.water).length} 天饮水记录。当前浏览器有 ${state.entries.length} 条饮食记录。`;$('#import-dialog').showModal();}catch(error){toast(`无法导入：${error.message}`);}finally{e.target.value='';}});
$('#confirm-import').addEventListener('click',()=>{if(!importPending)return;state=importPending;importPending=null;draft=[];persist();render();renderDraft();renderFoods();$('#import-dialog').close();toast('备份已导入。');});
function clearPhoto(){if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;$('#photo-file').value='';$('#photo-preview').removeAttribute('src');$('#photo-preview-wrap').hidden=true;$('#vision-candidates').replaceChildren();$('#vision-status').hidden=true;}
$('#photo-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;if(photoBusy){toast('正在识别，请稍后再选择照片。');return;}if(file.size>12*1024*1024){toast('请选择小于 12 MB 的照片。');e.target.value='';return;}if(!['image/jpeg','image/png','image/webp'].includes(file.type)){toast('目前支持 JPG、PNG、WebP 照片。');e.target.value='';return;}clearPhoto();try{const bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas');const scale=Math.min(1,1024/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.85));if(!blob)throw Error();photoUrl=URL.createObjectURL(blob);$('#photo-preview').src=photoUrl;$('#photo-preview-wrap').hidden=false;toast('照片已准备好，点击识别照片。');}catch{toast('无法读取这张照片，请更换 JPG 或 PNG 文件。');}});
async function recognizePhoto(){
 if(photoBusy)return;if(!photoUrl){toast('请先选择一张食物照片。');return;}
 photoBusy=true;$('#estimate-button').disabled=true;$('#photo-file').disabled=true;$('#vision-candidates').replaceChildren();$('#vision-status').hidden=false;const url=photoUrl;const progress=msg=>$('#vision-status').textContent=msg;
 try{progress('正在启动本机识别引擎，首次使用需下载模型，请稍候…');const {classify,labelInfo}=await import('./vision.js');const results=await classify(url,progress);progress('已生成候选。请选择符合照片的食物，并手动确认克重。分数仅为模型类别分数。');
  for(const result of results){const info=labelInfo(result.label),button=document.createElement('button');button.className='vision-option';const name=document.createElement('span');name.textContent=`${info.name} · ${round(result.score*100)}%${result.score<.4?'（低置信）':''}`;const sub=document.createElement('small');sub.textContent=info.id?'选择并填写重量 ↗':'搜索或自定义 ↗';button.append(name,sub);button.onclick=()=>{if(info.id){const food=allFoods().find(f=>f.id===info.id);if(food){addFood(food);toast('已添加参考份量，请按实际食物调整克重。');}}else{showView('foods');category='全部';$('#food-search').value=info.name;renderFoods();toast('库中暂无精确条目，可搜索相近食物或按营养表自定义。');}};$('#vision-candidates').append(button);}
 }catch{progress('识别未成功：请检查网络是否能访问模型文件，或换张照片重试。你也可以切换文字记录，继续估算。');}
 finally{photoBusy=false;$('#estimate-button').disabled=false;$('#photo-file').disabled=false;}
}
// Dialogs preserve native focus trapping and Escape behavior.
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}));
render();renderFoods();if(storageError)toast('本地记录无法读取，原数据尚未覆盖。请检查浏览器存储，或导入有效备份。');
