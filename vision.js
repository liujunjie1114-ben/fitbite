// Loaded only after an explicit photo recognition request. No photo upload.
import {centerCrop,normalizePixels,topClasses} from './vision-core.js';
let classifierPromise;
export const MODEL='AlexKoff88/mobilenet_v2_food101';
export async function classify(imageUrl,onProgress=()=>{}){
 if(!classifierPromise){classifierPromise=(async()=>{
  const ort=await import('./vendor/ort.wasm.min.mjs');
  ort.env.wasm.numThreads=1;ort.env.wasm.wasmPaths=new URL('./vendor/',import.meta.url).href;ort.env.wasm.proxy=true;
  const response=await fetch(new URL('./models/mobilenet_v2_food101.onnx',import.meta.url),{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('模型加载失败');
  const reader=response.body.getReader(),chunks=[];let loaded=0;const total=Number(response.headers.get('content-length'))||9385782;
  while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);loaded+=value.length;onProgress(`正在加载轻量模型：${Math.min(100,Math.round(loaded/total*100))}% · 约 9.4 MB`);}
  const bytes=new Uint8Array(loaded);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  onProgress('正在初始化本机推理引擎…');const session=await ort.InferenceSession.create(bytes,{executionProviders:['wasm']});return {ort,session};
 })().catch(error=>{classifierPromise=null;throw error;});}
 const {ort,session}=await classifierPromise;onProgress('正在本机分析照片，请稍候…');
 const image=new Image();image.src=imageUrl;await image.decode();const canvas=document.createElement('canvas');canvas.width=224;canvas.height=224;const ctx=canvas.getContext('2d',{willReadFrequently:true}),crop=centerCrop(image.naturalWidth,image.naturalHeight);ctx.drawImage(image,crop.x,crop.y,crop.size,crop.size,0,0,224,224);
 const input=new ort.Tensor('float32',normalizePixels(ctx.getImageData(0,0,224,224).data),[1,3,224,224]);const output=await session.run({[session.inputNames[0]]:input});const result=topClasses(output[session.outputNames[0]].data,Object.keys(labels).sort());input.dispose();Object.values(output).forEach(x=>x.dispose());return result;
}
const labels={
 apple_pie:'苹果派',baby_back_ribs:'烤排骨',baklava:'果仁蜜饼',beef_carpaccio:'生牛肉薄片',beef_tartare:'鞑靼牛肉',beet_salad:'甜菜沙拉',beignets:'法式炸面团',bibimbap:'韩式拌饭',bread_pudding:'面包布丁',breakfast_burrito:'早餐卷饼',bruschetta:'意式烤面包',caesar_salad:'凯撒沙拉',cannoli:'意式奶油卷',caprese_salad:'番茄芝士沙拉',carrot_cake:'胡萝卜蛋糕',ceviche:'酸橘汁腌鱼',cheesecake:'芝士蛋糕',cheese_plate:'奶酪拼盘',chicken_curry:'咖喱鸡',chicken_quesadilla:'鸡肉芝士薄饼',chicken_wings:'鸡翅',chocolate_cake:'巧克力蛋糕',chocolate_mousse:'巧克力慕斯',churros:'吉事果',clam_chowder:'蛤蜊浓汤',club_sandwich:'总汇三明治',crab_cakes:'蟹肉饼',creme_brulee:'焦糖布丁',croque_madame:'法式煎蛋三明治',cup_cakes:'纸杯蛋糕',deviled_eggs:'酿鸡蛋',donuts:'甜甜圈',dumplings:'饺子',edamame:'毛豆',eggs_benedict:'班尼迪克蛋',escargots:'法式蜗牛',falafel:'炸鹰嘴豆丸',filet_mignon:'菲力牛排',fish_and_chips:'炸鱼薯条',foie_gras:'鹅肝',french_fries:'薯条',french_onion_soup:'法式洋葱汤',french_toast:'法式吐司',fried_calamari:'炸鱿鱼',fried_rice:'炒饭',frozen_yogurt:'冷冻酸奶',garlic_bread:'蒜香面包',gnocchi:'意式土豆团',greek_salad:'希腊沙拉',grilled_cheese_sandwich:'烤芝士三明治',grilled_salmon:'三文鱼（熟）',guacamole:'牛油果酱',gyoza:'日式煎饺',hamburger:'汉堡',hot_and_sour_soup:'酸辣汤',hot_dog:'热狗',huevos_rancheros:'墨西哥煎蛋',hummus:'鹰嘴豆泥',ice_cream:'冰淇淋',lasagna:'千层面',lobster_bisque:'龙虾浓汤',lobster_roll_sandwich:'龙虾三明治',macaroni_and_cheese:'芝士通心粉',macarons:'马卡龙',miso_soup:'味噌汤',mussels:'贻贝',nachos:'墨西哥玉米片',omelette:'煎蛋卷',onion_rings:'洋葱圈',oysters:'生蚝',pad_thai:'泰式炒河粉',paella:'西班牙海鲜饭',pancakes:'松饼',panna_cotta:'意式奶冻',peking_duck:'北京烤鸭',pho:'越南河粉',pizza:'披萨',pork_chop:'猪排',poutine:'肉汁芝士薯条',prime_rib:'烤肋眼牛肉',pulled_pork_sandwich:'手撕猪肉三明治',ramen:'拉面',ravioli:'意式饺子',red_velvet_cake:'红丝绒蛋糕',risotto:'意式烩饭',samosa:'咖喱角',sashimi:'刺身',scallops:'扇贝',seaweed_salad:'海藻沙拉',shrimp_and_grits:'虾与玉米粥',spaghetti_bolognese:'肉酱意大利面',spaghetti_carbonara:'奶油培根意大利面',spring_rolls:'春卷',steak:'牛排',strawberry_shortcake:'草莓蛋糕',sushi:'寿司',tacos:'墨西哥卷饼',takoyaki:'章鱼烧',tiramisu:'提拉米苏',tuna_tartare:'金枪鱼塔塔',waffles:'华夫饼'
};
const matches={dumplings:'dumplings',french_fries:'fries',fried_rice:'friedrice',grilled_salmon:'salmon',hamburger:'burger',ice_cream:'icecream',pizza:'pizza',sushi:'sushi'};
export function labelInfo(label){const key=label.toLowerCase().trim().replaceAll(' ','_');return {name:labels[key]||label.replaceAll('_',' '),id:matches[key]||null};}
