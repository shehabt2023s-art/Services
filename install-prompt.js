/* ===========================================================
   📲 إشعار تثبيت تطبيق مستقبل الشرقية (نسخة الموبايل)
   - يظهر أعلى الشاشة
   - مكتوب بالكامل بالعربية (سؤال + اسم التطبيق)
   - زرين صغيرين: تثبيت / التثبيت لاحقًا
   - يظهر فقط لو التطبيق غير مثبت
=========================================================== */

let deferredPrompt;

// 👇 رسالة توعوية للمتصفحات اللي مش بتدعم beforeinstallprompt (زي Safari)
if (!('BeforeInstallPromptEvent' in window)) {
  const tip = document.createElement('div');
  tip.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;
      background:#1e40af;color:white;padding:10px;
      text-align:center;font-family:'Cairo',sans-serif;
      font-size:14px;z-index:9999;">
      ℹ️ لإضافة التطبيق إلى الشاشة الرئيسية، اضغط على زر <b>المشاركة</b> ثم اختر 
      <b>إضافة إلى الشاشة الرئيسية</b>.
    </div>`;
  document.body.appendChild(tip);
}

// 👇 الحدث الأساسي لتفعيل إشعار التثبيت
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // لو الإشعار موجود مسبقًا، ماينشأش تاني
  if (document.getElementById("installBanner")) return;

  // إنشاء الإشعار بالتصميم الجديد
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
      padding: 8px 10px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.25);
      z-index: 9999;
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      width: 60%;
      max-width: 280px;
      animation: slideDown 0.5s ease;
    ">
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="android-chrome-192x192.png" alt="App Icon" 
             style="width:30px; height:30px; border-radius:6px;">
        <span>هل تريد تثبيت تطبيق <b>مستقبل الشرقية</b>؟</span>
      </div>
      <div style="display:flex;gap:10px;">
        <button id="installBtn" style="
          background:white;
          color:#1e40af;
          border:none;
          border-radius:8px;
          padding:6px 14px;
          font-weight:bold;
          font-size:13px;
        ">تثبيت</button>
        <button id="closeBtn" style="
          background:transparent;
          color:white;
          border:1px solid white;
          border-radius:8px;
          padding:6px 14px;
          font-size:13px;
        ">التثبيت لاحقًا</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  // أزرار التحكم
  const installBtn = document.getElementById("installBtn");
  const closeBtn = document.getElementById("closeBtn");

  // عند الضغط على "تثبيت"
  installBtn.addEventListener("click", async () => {
    banner.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
  });

  // عند الضغط على "التثبيت لاحقًا"
  closeBtn.addEventListener("click", () => {
    banner.remove();
  });
});

// ✨ حركة الظهور من الأعلى
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideDown {
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}`;
document.head.appendChild(style);
