/* ===========================================================
   📲 إشعار تثبيت تطبيق مستقبل الشرقية (Install Prompt)
   - يظهر أعلى الشاشة
   - أزرار صغيرة ومناسبة للموبايل
   - أيقونة التطبيق الأصلية
   - يظهر فقط لو المستخدم لم يثبت التطبيق
   - يعرض رسالة بديلة لمتصفحات لا تدعم beforeinstallprompt (زي Safari)
   =========================================================== */

let deferredPrompt; // متغير لتخزين حدث التثبيت

// 👇 تحقق: هل المتصفح لا يدعم beforeinstallprompt؟
if (!('BeforeInstallPromptEvent' in window)) {
  // إنشاء رسالة إرشادية لمتصفحات زي Safari أو Firefox
  const tip = document.createElement('div');
  tip.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;
      background:#1e40af;color:white;padding:8px 12px;
      text-align:center;font-family:'Cairo',sans-serif;
      font-size:13px;z-index:9999;">
      ℹ️ لإضافة التطبيق إلى الشاشة الرئيسية، اضغط على زر <b>المشاركة</b> ثم اختر 
      <b>إضافة إلى الشاشة الرئيسية</b>.
    </div>`;
  document.body.appendChild(tip);
}

// 👇 التقاط الحدث لما يكون المتصفح جاهز لعرض التثبيت
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // منع الإشعار التلقائي
  deferredPrompt = e; // حفظ الحدث علشان نستخدمه لما المستخدم يضغط "تثبيت"

  // لو الإشعار ظاهر فعلاً — متعملوش تاني
  if (document.getElementById("installBanner")) return;

  /* -----------------------------------------------------------
     🔹 إنشاء واجهة الإشعار (Banner)
     - تظهر من أعلى الشاشة
     - تحتوي على أيقونة + نص + زرّين (تثبيت / لاحقًا)
  ------------------------------------------------------------ */
  const banner = document.createElement("div");
  banner.id = "installBanner";
  banner.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e40af;
      color: white;
      padding: 6px 10px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.25);
      z-index: 9999;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      animation: slideDown 0.5s ease;
    ">
      <!-- 🖼️ أيقونة التطبيق -->
      <img src="android-chrome-192x192.png" alt="App Icon" 
           style="width:22px; height:22px; border-radius:5px;">

      <!-- 🧾 نص الرسالة -->
      <span>تثبيت <b>مستقبل الشرقية</b>؟</span>

      <!-- ✅ زر التثبيت -->
      <button id="installBtn" style="
        background:white;
        color:#1e40af;
        border:none;
        border-radius:6px;
        padding:3px 8px;
        font-weight:bold;
        font-size:12px;
      ">تثبيت التطبيق</button>

      <!-- ❌ زر الرفض (لاحقًا) -->
      <button id="closeBtn" style="
        background:transparent;
        color:white;
        border:1px solid white;
        border-radius:6px;
        padding:3px 8px;
        font-size:12px;
      ">لاحقًا</button>
    </div>
  `;
  document.body.appendChild(banner);

  /* -----------------------------------------------------------
     🎯 الأحداث الخاصة بالأزرار
  ------------------------------------------------------------ */

  // عند الضغط على "تثبيت"
  const installBtn = document.getElementById("installBtn");
  installBtn.addEventListener("click", async () => {
    banner.remove(); // إخفاء الإشعار
    deferredPrompt.prompt(); // عرض إشعار التثبيت الرسمي
    const { outcome } = await deferredPrompt.userChoice; // انتظار استجابة المستخدم
    console.log("🟢 نتيجة التثبيت:", outcome);
    deferredPrompt = null; // تنظيف المتغير
  });

  // عند الضغط على "لاحقًا"
  const closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", () => {
    banner.remove(); // إخفاء الإشعار
  });
});

/* -----------------------------------------------------------
   ✨ حركة الظهور (Animation)
   تجعل الإشعار ينزلق من أعلى لأسفل بسلاسة
------------------------------------------------------------ */
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideDown {
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}`;
document.head.appendChild(style);
