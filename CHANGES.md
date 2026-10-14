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
