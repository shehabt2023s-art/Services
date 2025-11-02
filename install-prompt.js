let deferredPrompt;
const showPromptEveryTime = true; // المستخدم يقدر يرفض وبيظهر تاني المره الجايه

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // إنشاء الزر أو الإشعار
  const installDiv = document.createElement("div");
  installDiv.id = "installPrompt";
  installDiv.innerHTML = `
    <div style="
      position: fixed;
      bottom: 15px;
      left: 10px;
      right: 10px;
      background: #1e40af;
      color: white;
      padding: 12px;
      border-radius: 14px;
      text-align: center;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      font-size: 16px;
      z-index: 9999;">
      📱 هل ترغب في تثبيت تطبيق <b>مستقبل الشرقية</b>؟
      <br>
      <button id="installBtn" style="
        margin-top: 10px;
        background: white;
        color: #1e40af;
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        font-weight: bold;">تثبيت</button>
      <button id="closeInstall" style="
        margin-top: 10px;
        background: transparent;
        color: white;
        border: 1px solid white;
        border-radius: 8px;
        padding: 8px 14px;">لاحقًا</button>
    </div>
  `;
  document.body.appendChild(installDiv);

  const installBtn = document.getElementById("installBtn");
  const closeBtn = document.getElementById("closeInstall");

  installBtn.addEventListener("click", async () => {
    installDiv.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
  });

  closeBtn.addEventListener("click", () => {
    installDiv.remove();
    if (!showPromptEveryTime) deferredPrompt = null;
  });
});
