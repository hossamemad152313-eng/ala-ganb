# بناء APK وإصدار Release

## 1) نسخة تجريبية (Debug) + موقع الويب
`.github/workflows/android.yml` يشغّل الاختبارات (`npm test`) ثم يبني APK debug وينشر الموقع على GitHub Pages.
- **توقيع ثابت (مهم لتحديث التطبيق فوق القديم دون فقدان البيانات):** أنشئ مفتاح debug مرة واحدة على جهازك (لا ترفعه للمستودع):
  `keytool -genkeypair -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"`
  ثم حوّله: `base64 -w0 debug.keystore` وضع الناتج في Secret باسم `DEBUG_KEYSTORE_BASE64` (Settings → Secrets and variables → Actions).
  بدون هذا السر يُبنى APK بمفتاح عشوائي جديد ويظهر تحذير في السجل.

## 2) نسخة Release موقّعة
`.github/workflows/android-release.yml` (يدوي: Run workflow). الأسرار المطلوبة:
| Secret | المعنى |
|---|---|
| `RELEASE_KEYSTORE_BASE64` | ملف الـ keystore بصيغة base64 |
| `RELEASE_STORE_PASSWORD` | كلمة سر الـ keystore |
| `RELEASE_KEY_ALIAS` | اسم المفتاح |
| `RELEASE_KEY_PASSWORD` | كلمة سر المفتاح |
إنشاء مفتاح الإصدار: `keytool -genkeypair -v -keystore release.keystore -alias alaganb -keyalg RSA -keysize 2048 -validity 10000` — **احتفظ بنسخة احتياطية آمنة خارج GitHub؛ ضياعه يمنع تحديث التطبيق على Google Play.**
لا تُكتب كلمات السر في أي ملف: `android-config/signing.gradle` يقرؤها من متغيرات البيئة فقط، و`.gitignore` يمنع `*.keystore` و`*.jks`.

## 3) Target SDK
بحثت: Google Play يشترط Android 16 (API 36) للتطبيقات الجديدة والتحديثات من 2026-08-31. Capacitor 6 (المستخدم في المسار الأول) يستهدف أقل من ذلك، لذلك مسار Release يحاول ترقية Capacitor وضبط `compileSdk/targetSdk` على 36.
**هذا المسار لم يُنفَّذ ولم أتحقق من نجاحه** (يحتاج بيئة Android/GitHub Actions). افحص السجل قبل النشر، واختبر على جهاز Android 16 (سلوك زر الرجوع التنبؤي وتغييرات العرض بجانب الحواف).

## 4) الاختبارات المحلية
`npm test` يشغّل: منطق الحفظ والإشارات والضرر والمهام، فحص ثبات الملفات (كل موديل في قائمة التحميل موجود وكل مكتبة موجودة وJSON سليم)، واختبار دخان يشغّل `__boot` و20 فريمًا بمحاكاة THREE (لا يقيس الأداء ولا يرسم).

## 5) ما يجب اختباره على جهاز حقيقي
FPS وDraw Calls (أدوات المطور)، الظلال والبلوم، حساس الإمالة، الأصوات والكلام العربي في WebView، حجم الذاكرة، تحديث التطبيق فوق القديم مع بقاء الحفظ.
