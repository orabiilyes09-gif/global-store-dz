GLOBAL STORE DZ — تجهيز أولي لـ Meta Messenger Webhook

ماذا يضيف هذا الإصدار؟
- Netlify Function على المسار /.netlify/functions/messenger-webhook
- يدعم تحقق Meta عبر GET باستخدام META_VERIFY_TOKEN.
- يستقبل POST من Meta ويرد EVENT_RECEIVED.
- يتحقق من توقيع Meta إذا تم ضبط META_APP_SECRET.

مهم: هذا لا يرسل طلبات المتجر تلقائياً إلى صندوق Messenger. الـ Webhook يستقبل أحداث Meta فقط؛ إرسال إشعار لصاحب الصفحة يحتاج قناة إرسال مسموح بها ومستلم/PSID وصلاحيات Meta مناسبة. لا تضع Page Access Token في JavaScript العام.

طريقة النشر:
1) ارفع المشروع عبر Git متصل بـ Netlify أو Netlify CLI/Deploy يدعم Functions؛ مجرد رفع index.html وscript.js لن ينشر الوظيفة.
2) في Netlify > Project navigation > Environment variables أضف META_VERIFY_TOKEN بقيمة سرية (أو استعمل VERIFY_TOKEN الموجود عندك؛ الكود يقبل الاسمين) تختارها أنت، مثلاً سلسلة طويلة عشوائية. لا تشاركها في الدردشة.
3) أعد النشر (Deploy).
4) رابط Callback URL هو: https://jolly-travesseiro-3f17a4.netlify.app/.netlify/functions/messenger-webhook
5) في Meta، أدخل نفس قيمة META_VERIFY_TOKEN في Verify Token، ثم اضغط Verify and Save.
6) بعد ذلك فقط، أضف META_APP_SECRET في Netlify كمتغير بيئة لحماية POST، ثم أعد النشر.

لا تستخدم تاريخاً أو رقماً سهلاً كـ Verify Token. لا ترسل لي أي أسرار أو Access Tokens.
