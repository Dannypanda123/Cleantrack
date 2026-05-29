// ============================================================
// CleanTrack — Sistema de idiomas (español / inglés)
// ------------------------------------------------------------
// - Detecta el idioma del dispositivo (o la preferencia guardada).
// - Permite cambiar manualmente con I18N.toggle().
// - Todas las traducciones viven aquí, en un solo lugar.
// ============================================================
(function () {
  var DICT = {
    es: {
      // Comunes (se repiten en varias pantallas)
      "comun.salir": "Salir",
      "comun.inicio": "← Inicio",
      "comun.verificando": "Verificando sesión...",
      "comun.sin_conexion": "Sin conexión a la base de datos.",

      // Pantalla de inicio
      "inicio.hola": "Hola",
      "inicio.subtitulo": "Centro de control del supervisor",
      "inicio.disponible": "Disponible",
      "inicio.kpi.limpiezas": "Limpiezas hoy",
      "inicio.kpi.incidencias": "Incidencias abiertas",
      "inicio.kpi.empleados": "Empleados activos",
      "inicio.kpi.edificios": "Edificios",
      "inicio.admin": "Admin",
      "inicio.registros.t": "Registros",
      "inicio.registros.d": "Ver áreas limpiadas, fotos y horarios en tiempo real",
      "inicio.empleados.t": "Empleados",
      "inicio.empleados.d": "Agregar, activar o desactivar al personal de limpieza",
      "inicio.edificios.t": "Edificios y áreas",
      "inicio.edificios.d": "Gestionar espacios y generar códigos QR por área",
      "inicio.incidencias.t": "Incidencias",
      "inicio.incidencias.d": "Reportes de insumos faltantes y problemas en cada edificio",
      "inicio.estadisticas.t": "Estadísticas",
      "inicio.estadisticas.d": "Cumplimiento, áreas más atendidas y tendencias",
      "inicio.reportes.t": "Reportes",
      "inicio.reportes.d": "Informe mensual en PDF para presentar al cliente",
      "inicio.soporte.t": "Soporte técnico",
      "inicio.soporte.d": "Contacto y ayuda con el uso de la plataforma",
      "inicio.administracion.t": "Administración",
      "inicio.administracion.d": "Suscripción, equipo y resumen de tu empresa"
    },
    en: {
      "comun.salir": "Log out",
      "comun.inicio": "← Home",
      "comun.verificando": "Checking session...",
      "comun.sin_conexion": "No connection to the database.",

      "inicio.hola": "Hi",
      "inicio.subtitulo": "Supervisor control center",
      "inicio.disponible": "Available",
      "inicio.kpi.limpiezas": "Cleanings today",
      "inicio.kpi.incidencias": "Open issues",
      "inicio.kpi.empleados": "Active employees",
      "inicio.kpi.edificios": "Buildings",
      "inicio.admin": "Admin",
      "inicio.registros.t": "Records",
      "inicio.registros.d": "See cleaned areas, photos and times in real time",
      "inicio.empleados.t": "Employees",
      "inicio.empleados.d": "Add, activate or deactivate cleaning staff",
      "inicio.edificios.t": "Buildings & areas",
      "inicio.edificios.d": "Manage spaces and generate QR codes per area",
      "inicio.incidencias.t": "Issues",
      "inicio.incidencias.d": "Reports of missing supplies and problems in each building",
      "inicio.estadisticas.t": "Statistics",
      "inicio.estadisticas.d": "Compliance, most-attended areas and trends",
      "inicio.reportes.t": "Reports",
      "inicio.reportes.d": "Monthly PDF report to present to your client",
      "inicio.soporte.t": "Support",
      "inicio.soporte.d": "Contact and help using the platform",
      "inicio.administracion.t": "Administration",
      "inicio.administracion.d": "Subscription, team and company summary"
    }
  };

  function detectar() {
    try {
      var guardado = localStorage.getItem("ct_idioma");
      if (guardado === "es" || guardado === "en") return guardado;
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "es").toLowerCase();
    return nav.indexOf("en") === 0 ? "en" : "es";
  }

  var lang = detectar();
  var callbacks = [];

  // Traduce una clave al idioma actual (con respaldo a español y a la propia clave)
  function t(clave) {
    var d = DICT[lang] || DICT.es;
    if (d[clave] != null) return d[clave];
    if (DICT.es[clave] != null) return DICT.es[clave];
    return clave;
  }

  // Rellena en el HTML todos los elementos marcados:
  //   data-i18n="clave"        -> textContent
  //   data-i18n-ph="clave"     -> placeholder
  function aplicar(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    document.documentElement.setAttribute("lang", lang);
    actualizarBotones();
  }

  function actualizarBotones() {
    // El botón muestra el idioma al que se cambiaría
    document.querySelectorAll("[data-i18n-toggle]").forEach(function (b) {
      b.textContent = (lang === "es") ? "EN" : "ES";
    });
  }

  function set(nuevo) {
    if (nuevo !== "es" && nuevo !== "en") return;
    lang = nuevo;
    try { localStorage.setItem("ct_idioma", lang); } catch (e) {}
    aplicar();
    callbacks.forEach(function (fn) { try { fn(lang); } catch (e) {} });
  }

  function toggle() { set(lang === "es" ? "en" : "es"); }

  // Permite que cada pantalla re-dibuje su contenido dinámico al cambiar idioma
  function onChange(fn) { if (typeof fn === "function") callbacks.push(fn); }

  function idioma() { return lang; }

  window.I18N = {
    t: t,
    aplicar: aplicar,
    set: set,
    toggle: toggle,
    onChange: onChange,
    idioma: idioma,
    actualizarBotones: actualizarBotones
  };
})();
