# 数据、模型与许可说明

## 食物参考数据

`nutrition.js` 的 48 项内置条目为每 100 克可食部分的常见参考近似值。单一食材采用与 USDA 常见条目相近的参考值；本版**不是从 USDA API 自动同步的数据，也尚未逐条绑定 FDC ID 核验**，不得声称为精确品牌检测值。后续应逐条替换为带 FDC ID、食品状态与采样版本的数据。

- USDA FoodData Central：https://fdc.nal.usda.gov/
- 数据类型、能量与查询说明：https://fdc.nal.usda.gov/faq/
- 下载与字段定义：https://fdc.nal.usda.gov/download-datasets/
- API 与公共领域使用说明：https://fdc.nal.usda.gov/api-guide/

炒饭、饺子、汉堡、披萨、寿司等复合餐食采用常见配方近似值；实际用油、馅料、酱汁、品牌会造成显著差异。乳清蛋白粉是 80% 蛋白含量产品的示例，请优先使用实际包装标值建立自定义食物。

常见份量（碗、个、勺等）由本项目设置，仅用于初始估算。如「米饭一碗」设为 150 克熟饭、「鸡蛋一个」设为 50 克可食部分，不能代替称重。液体毫升换克为近似密度，牛奶 1.03 g/mL、豆浆 1.02 g/mL。包装每 100mL 的数据请先按实际包装密度换算为每 100g，或直接根据包装总量自定义后按克记录。

热量按食物原有参考值缩放，未强制用 4/4/9 公式重算，因此因纤维、数据四舍五入等可能与三大营养素换算略有不同。每日默认目标为界面演示参考，可由用户手动设置，不是个性化推荐。

## 照片识别

- 模型：[`AlexKoff88/mobilenet_v2_food101`](https://huggingface.co/AlexKoff88/mobilenet_v2_food101)
- 训练与导出来源：https://github.com/AlexKoff88/mobilenetv2_food101
- 模型卡声明许可：Apache-2.0。采用原始已训练 PyTorch checkpoint，经本项目 `scripts/export-model.py` 以 `eval()` 模式重新导出 ONNX，未重新训练。许可、来源与原 checkpoint 校验和放在 `models/`。上游预导出的 ONNX 文件在本机产生近均匀输出，未通过样图检查，因此未用于最终版本。
- 模型文件 `models/mobilenet_v2_food101.onnx`：约 9.4 MB。
- 推理库：[`onnxruntime-web` 1.22.0](https://github.com/microsoft/onnxruntime/tree/v1.22.0)，MIT 许可。WebAssembly 引擎约 11.2 MB。原始运行文件与许可放在 `vendor/`。
- 官方浏览器运行文档：https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html
- 图像预处理按原项目 `validate_checkpoint.py`：短边缩放到 256 后中心裁剪 224，RGB / 255，ImageNet mean `[0.485, 0.456, 0.406]`、std `[0.229, 0.224, 0.225]`，NCHW 排列。Food-101 类别按标准字母顺序排列；输出 logits 做稳定 softmax 后展示前三候选。

模型与推理文件从本站加载，照片不上传服务器。原先调研的 Swin 模型约 93.3 MB，在实际网络下首次下载耗时较长，未纳入最终版本。

Food-101 面向 101 种常见菜品，覆盖偏西式；本项目不承诺中餐识别率。输出候选为分类提示，不能检测多道菜的所有配料或自动称重。不直接将分类分数解释成营养准确率。仅为少量可以明确对应的类别提供参考数据映射，其余引导用户自行搜索或自定义，避免将不同菜品混为同一营养值。

## 字体与界面

- Google Fonts DM Sans：https://fonts.google.com/specimen/DM+Sans ，SIL Open Font License；通过 Google Fonts 样式请求加载，无法联网时回退系统字体。
- 页面图标、品牌标记与餐盘 CSS 插图由本项目绘制。

## 调研的开源项目

- NutriLens：https://github.com/thejusdutt/nutrilens ，离线饮食记录与多模型端侧识别。
- NutriNutri：https://github.com/riki137/nutrinutri ，跨平台营养记录。

仅调研产品与部署思路，未复制以上项目代码；本项目不是其 fork。新写的应用代码按仓库 MIT 许可提供。
