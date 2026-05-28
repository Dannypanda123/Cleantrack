/* ============================================================
   CleanTrack — Configuración global
   Credenciales y cliente de Supabase (una sola vez para toda la app)
   ============================================================ */
(function () {
  if (window.__cleantrackConfig) return;
  window.__cleantrackConfig = true;

  window.SUPABASE_URL = "https://saoirivninhucrkhckaj.supabase.co";
  window.SUPABASE_ANON_KEY = "sb_publishable_DeKuX1LvrvruEXzfPvumnw_g5N1Jw4k";

  try {
    if (typeof supabase === "undefined") {
      console.error("CleanTrack: Supabase no está cargado. Revisa que el script de jsdelivr esté ANTES de config.js");
      window.db = null;
      return;
    }
    const { createClient } = supabase;
    window.db = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("CleanTrack: No se pudo crear el cliente Supabase:", e);
    window.db = null;
  }
})();
