let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // لو الإشعار موجود فعلاً، ميتكررش
  if (document.getElementById("installBanner")) return;

  // إنشاء الإشعار في أعلى الصفحة
  const banner = document.createElement("div");
  banner.id = "installBanner";
  banner.innerHTML = `
    <div style="
      position: fixed;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e40af;
      color: white;
      padding: 10px 14px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      z-index: 9999;
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      animation: slideDown 0.5s ease;
    ">
      <img src="android-chrome-192x192.png" alt="App Icon" style="width:28px; height:28px; border-radius:6px;">
      <span>تثبيت تطبيق <b>مستقبل الشرقية</b>؟</span>
      <button id="installBtn" style="
        background: white;
        color: #1e40af;
        border: none;
        border-radius: 6px;
        padding: 4px 10px;
        font-weight: bold;
        font-size: 12px;
      ">تثبيت</button>
      <button id="closeBtn" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 12px;
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

  closeBtn.addEventListener("click", () => {
    banner.remove();
  });
});

// حركة بسيطة عند الظهور
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideDown {
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}`;
document.head.appendChild(style);
