# سجل التغييرات (مرحلة التحسين الأولى)
النسخة الأصلية محفوظة بالكامل في `ala-ganb-backup-original.zip`.
## ملفات تغيّرت
`www/index.html` · `www/sw.js` · `.github/workflows/android.yml` · `ANDROID-WORKFLOW.yml.txt` · `package.json` · `.gitignore`
## ملفات أُضيفت
`www/logic.js` · `tests/logic.test.js` · `tests/static-check.js` · `tests/smoke.js` · `docs/ANDROID-BUILD.md` · `docs/MODELS.md` · `android-config/signing.gradle` · `.github/workflows/android-release.yml` · `CHANGES.md`
## لم يُحذف/يُنقل أي موديل أو مكتبة أو صوت أو نظام.

## إصلاح تفتّت الموديلات (أكتوبر ١٤)
- السبب: `toNonIndexed()` في three r128 بيقرا المصفوفة الخام ومبيفكّش الـInterleaved attributes (stride 20/24 في micro وubld وustor وumkt وucafe وuhs/ubus...) فالمثلثات بتتفتّت بعد `mergeStatic`. الحل: دالة `flatGeo` بتقرا بـgetX/getY/getZ (index.html، وبتتستخدم كمان في loadP).
- السما: الغروب والليل بقوا بيتبنوا من صورة السما نفسها (تلوين) بدل تدرّج لونى مسطّح.

## Model swap (bus, characters, humps)
- All old vehicle / building / prop / character models removed; only `town` and `upyr` stay as world geometry.
- Player + all traffic = the supplied bus (`micro.glb`, scale 0.75, front = -z after a 180° turn).
- Pedestrians = 4 supplied Mixamo-rigged characters (`pm1`,`pm2`,`pms`,`pfb`); `pm2` re-coloured (its materials were untextured black).
- Cockpit view: real bus body with its painted-black glass discarded in the shader (see-through), old micro-bus cab decorations hidden.
- Speed humps placed on the main road (`hump.glb`) with a small bounce on the camera.
- Boot list is now 8 models (ALLN=8); tier 4 loader removed.

## كابينات + واجهات من صور (أكتوبر ١٥)
- كابينة القيادة الداخلية بقت صورة (HiAce/توكتوك/مرسيدس) بزجاج شفاف وعدادات لايف، فاستُغني عن مجسّم الباص الداخلي (أخف).
- واجهات المباني: ١٠ واجهات + جامع من الأطلس، مع تكرار مقلوب لضبط مقياس الشبابيك، وحد أدنى لارتفاع المبنى بقى ١٠.
- لافتات محلات (١٢) معلّقة على المباني. الأسفلت القديم فضل لأن قطع الأطلس صغيرة (~٧٠-١٤٠px).
- `textures/shop_ground.jpg` (شريط محلات) محفوظ للاستخدام لاحقًا، غير مربوط.

## تابلوهات جديدة (أكتوبر ١٥ - v5)
- ٤ صور تابلوه جديدة (1584×672): HiAce (micro)، مرسيدس (bus/truck)، توكتوك (tuk)، وعربية ملاكي (car → taxi/sedan). الأخضر اتفرّغ بالكروما كي مع إزالة بقايا الأخضر على الحواف (WebP بشفافية).
- `cockpit.json`: إحداثيات العدادات اتقاست من جديد بنظام بكسلات الصورة (w=1584,h=672) + `occ` = مضلعات الطارة اللي بتقصّ العداد اللايف عشان ما يطلعش فوق الطارة.
- CSS `#cpk`: نسبة العرض للارتفاع 1584/672 (كان 2:1)، وعرض = max(100vw, 235.7vh)، والإزاحة لتحت ٨٪ بدل ١٣٪. كانفاس `#cpg` بقى 1584×672.
- `cpType`: taxi/sedan بقوا بياخدوا تابلوه "car" بدل HiAce.

## تعديل أكتوبر ١٥ (v6): أسفلت أوضح + تكرار مباني/يفط/مساجد
- التابلوه اتنزّل لتحت (`translate` من ٨٪ لـ ٢٧٪) وزاوية كاميرا الكابينة بقت أنزل شوية (-.03 → -.075) عشان الأسفلت يبان.
- واجهات الصور على ٩٠٪ من المباني بدل ٧٠٪.
- المسجد بقى كل ~١٧ مبنى (كان مبنى واحد من ٩٧)، وعليه قبة خضرا + مئذنتين.
- يفط المحلات: ٣ على الواجهة الرئيسية + ٢ على الواجهة التانية لكل مبنى (كان ١ بس وعلى ٦٠٪ من المباني).
- قباب صغيرة على أسطح ~١٤٪ من المباني التانية.

## إصلاح التحميل اللي واقف (أكتوبر ١٧)
- السبب: `KRN` و`KBN` (قوايم موديلات الشوارع والمباني) كانوا متعرفين جوه `window.__boot`، وسكريبت التحميل بينادي عليهم قبل ما `__boot` يشتغل → `ReferenceError: KRN is not defined` فالتحميل يقف واللعبة متفتحش.
- الحل: القايمتين اتعرّفوا كمان على `window` في السكريبت اللي قبل `__boot`.
- تنضيف: اتشال `ANDROID-WORKFLOW.yml.txt` و`README-APK.txt` (الـworkflow موجود فعلًا في `.github/workflows`) و`sky_b.jpg` (مش مستخدمة)، وتغيير مكان سجل التغييرات من `www/` للجذر عشان ميتنشرش مع اللعبة. إضافة `.gitignore`.
