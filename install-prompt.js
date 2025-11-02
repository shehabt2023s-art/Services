let deferredPrompt;

// 👇 لو المتصفح مش بيدعم beforeinstallprompt (زي Safari)
if (!('BeforeInstallPromptEvent' in window)) {
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

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // لو الإشعار موجود مسبقًا ميتكررش
  if (document.getElementById("installBanner")) return;

  // ✅ إنشاء الإشعار الصغير في الأعلى
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
      font-size: 10px;
      animation: slideDown 0.5s ease;
    ">
      <img src="android-chrome-192x192.png" alt="App Icon" 
           style="width:22px; height:22px; border-radius:5px;">
      <span>تثبيت <b>مستقبل الشرقية</b>؟</span>
      <button id="installBtn" style="
        background:white;
        color:#1e40af;
        border:none;
        border-radius:6px;
        padding:3px 8px;
        font-weight:bold;
        font-size:12px;
      ">تثبيت</button>
      <button id="closeBtn" style="
        background:transparent;
        color:white;
        border:1px solid white;
        border-radius:6px;
        padding:3px 8px;
        font-size:10px;
      ">×</button>
    </div>
  `;
  document.body.appendChild(banner);

  const installBtn = document.getElementById("installBtn");
  const closeBtn = document.getElementById("closeBtn");

  installBtn.addEventListener("click", async () => {
    banner.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
  });

  closeBtn.addEventListener("click", () => banner.remove());
});

// حركة الظهور من فوق
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideDown {
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}`;
document.head.appendChild(style);
