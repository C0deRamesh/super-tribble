/* =========================================================
   CodeForge — auth-guard.js
   Include this in the <head>, right after storage.js, on every
   page that requires login. Runs synchronously before the page
   paints so unauthorized users never see protected content.
   ========================================================= */

(function () {
  const session = DB.getSession();
  if (!session) {
    const redirectTo = encodeURIComponent(location.pathname.split("/").pop() || "index.html");
    location.replace("login.html?redirect=" + redirectTo);
  }
})();
