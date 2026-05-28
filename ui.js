/* ============================================================
   CleanTrack — Componentes de interfaz reusables
   ============================================================
   Funciones disponibles:

   uiEscapar(texto)
     Convierte caracteres peligrosos en entidades HTML para
     evitar XSS. Úsalo SIEMPRE que metas datos de la BD o del
     usuario dentro de innerHTML.
     Ejemplo: div.innerHTML = '<p>' + uiEscapar(emp.nombre) + '</p>';

   uiToast(mensaje, tipo, duracion)
     Muestra un aviso bonito arriba en pantalla que se va solo.
     tipo: "ok" (verde, por defecto), "error" (rojo), "info" (azul).
     Ejemplo: uiToast("Guardado correctamente");
              uiToast("No se pudo guardar", "error");

   uiConfirm(mensaje, opciones)
     Muestra un modal de confirmación bonito. Devuelve una promesa
     que resuelve a true (confirmar) o false (cancelar).
     opciones: { titulo, textoOk, textoCancel, peligro }
     Ejemplo: const ok = await uiConfirm("¿Eliminar a Ana?");
              if (ok) { ...borrar... }
   ============================================================ */
(function () {
  // Evita duplicar si el archivo se carga dos veces por accidente
  if (window.__cleantrackUI) return;
  window.__cleantrackUI = true;

  // ============================================================
  // ESCAPAR HTML (anti-XSS)
  // ============================================================
  // Convierte caracteres especiales en entidades HTML para que el
  // navegador los muestre como texto literal en lugar de interpretarlos
  // como código. Sin esto, un empleado podría ponerse de nombre
  // <script>alert(1)</script> y ejecutar código en el navegador del
  // supervisor cuando viera la lista de empleados.
  window.uiEscapar = function (texto) {
    if (texto === null || texto === undefined) return "";
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  // ============================================================
  // ESTILOS DE LOS TOASTS Y MODALES (se inyectan una sola vez)
  // ============================================================
  var css = ''
    + '.ct-toast-wrap{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none;width:calc(100% - 32px);max-width:420px;}'
    + '.ct-toast{pointer-events:auto;width:100%;display:flex;align-items:flex-start;gap:11px;background:#fff;border-radius:13px;padding:14px 16px;font-family:"Sora",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14.5px;line-height:1.45;color:#1B2733;box-shadow:0 12px 34px rgba(12,68,124,0.18),0 2px 8px rgba(0,0,0,0.08);border-left:4px solid #1D9E75;opacity:0;transform:translateY(-12px);transition:opacity .25s ease,transform .25s ease;}'
    + '.ct-toast.show{opacity:1;transform:translateY(0);}'
    + '.ct-toast.error{border-left-color:#B23B3B;}'
    + '.ct-toast.info{border-left-color:#185FA5;}'
    + '.ct-toast .ct-ic{flex-shrink:0;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;background:#1D9E75;margin-top:1px;}'
    + '.ct-toast.error .ct-ic{background:#B23B3B;}'
    + '.ct-toast.info .ct-ic{background:#185FA5;}'
    + '.ct-toast .ct-msg{flex:1;}'
    + '.ct-overlay{position:fixed;inset:0;z-index:99998;background:rgba(12,40,75,0.45);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .2s ease;}'
    + '.ct-overlay.show{opacity:1;}'
    + '.ct-modal{width:100%;max-width:380px;background:#fff;border-radius:18px;padding:26px 24px 22px;font-family:"Sora",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 24px 60px rgba(12,68,124,0.30);transform:scale(0.94);transition:transform .2s cubic-bezier(0.34,1.56,0.64,1);text-align:center;}'
    + '.ct-overlay.show .ct-modal{transform:scale(1);}'
    + '.ct-modal .ct-mic{width:52px;height:52px;border-radius:14px;background:#FBEAEA;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:24px;}'
    + '.ct-modal h3{font-size:18px;font-weight:700;color:#1B2733;margin:0 0 6px;}'
    + '.ct-modal p{font-size:14.5px;color:#5A6573;margin:0 0 22px;line-height:1.5;}'
    + '.ct-modal .ct-btns{display:flex;gap:10px;}'
    + '.ct-modal button{flex:1;padding:13px;border-radius:11px;font-size:14.5px;font-weight:600;cursor:pointer;font-family:inherit;border:none;transition:transform .08s,box-shadow .15s,background .15s;}'
    + '.ct-modal .ct-cancel{background:#fff;color:#5A6573;border:1.5px solid #E2E0D8;}'
    + '.ct-modal .ct-cancel:hover{background:#F4F3EE;}'
    + '.ct-modal .ct-ok{background:linear-gradient(135deg,#185FA5,#0C447C);color:#fff;box-shadow:0 4px 14px rgba(24,95,165,0.32);}'
    + '.ct-modal .ct-ok:hover{box-shadow:0 6px 20px rgba(24,95,165,0.45);}'
    + '.ct-modal .ct-ok:active,.ct-modal .ct-cancel:active{transform:scale(0.97);}'
    + '.ct-modal.peligro .ct-ok{background:linear-gradient(135deg,#C0494A,#A32D2D);box-shadow:0 4px 14px rgba(163,45,45,0.32);}'
    + '.ct-modal.peligro .ct-mic{background:#FBEAEA;}';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ============================================================
  // CONTENEDOR DE TOASTS
  // ============================================================
  function wrap() {
    var w = document.querySelector(".ct-toast-wrap");
    if (!w) {
      w = document.createElement("div");
      w.className = "ct-toast-wrap";
      document.body.appendChild(w);
    }
    return w;
  }

  // ============================================================
  // TOAST (aviso que se va solo)
  // ============================================================
  window.uiToast = function (mensaje, tipo, duracion) {
    tipo = tipo || "ok";
    duracion = duracion || (tipo === "error" ? 4200 : 2800);
    var icono = tipo === "error" ? "!" : (tipo === "info" ? "i" : "\u2713");

    var t = document.createElement("div");
    t.className = "ct-toast " + tipo;
    var ic = document.createElement("div");
    ic.className = "ct-ic";
    ic.textContent = icono;
    var msg = document.createElement("div");
    msg.className = "ct-msg";
    msg.textContent = mensaje;
    t.appendChild(ic);
    t.appendChild(msg);
    wrap().appendChild(t);

    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, duracion);
  };

  // ============================================================
  // CONFIRM (modal con promesa: devuelve true/false)
  // opciones: { titulo, textoOk, textoCancel, peligro:true/false }
  // ============================================================
  window.uiConfirm = function (mensaje, opciones) {
    opciones = opciones || {};
    var titulo = opciones.titulo || "Confirmar";
    var textoOk = opciones.textoOk || "Confirmar";
    var textoCancel = opciones.textoCancel || "Cancelar";
    var peligro = opciones.peligro !== false; // por defecto true (la mayoría son borrados)
    var icono = opciones.icono || (peligro ? "\u26A0\uFE0F" : "\u2753");

    return new Promise(function (resolve) {
      var overlay = document.createElement("div");
      overlay.className = "ct-overlay";
      var modal = document.createElement("div");
      modal.className = "ct-modal" + (peligro ? " peligro" : "");
      modal.innerHTML =
        '<div class="ct-mic">' + icono + '</div>' +
        '<h3></h3><p></p>' +
        '<div class="ct-btns">' +
          '<button class="ct-cancel"></button>' +
          '<button class="ct-ok"></button>' +
        '</div>';
      modal.querySelector("h3").textContent = titulo;
      modal.querySelector("p").textContent = mensaje;
      modal.querySelector(".ct-cancel").textContent = textoCancel;
      modal.querySelector(".ct-ok").textContent = textoOk;
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      requestAnimationFrame(function () { overlay.classList.add("show"); });

      function cerrar(valor) {
        overlay.classList.remove("show");
        setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 220);
        resolve(valor);
      }
      modal.querySelector(".ct-ok").addEventListener("click", function () { cerrar(true); });
      modal.querySelector(".ct-cancel").addEventListener("click", function () { cerrar(false); });
      overlay.addEventListener("click", function (e) { if (e.target === overlay) cerrar(false); });
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") { document.removeEventListener("keydown", esc); cerrar(false); }
      });
    });
  };
})();
