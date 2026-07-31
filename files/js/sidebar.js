/* =========================================================
   CodeForge — sidebar.js
   Mobile open/close, active-link highlighting, user card,
   logout. Assumes a valid session (auth-guard already ran).
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector("[data-sidebar]");
  const overlay = document.querySelector("[data-sidebar-overlay]");
  const menuBtn = document.querySelector("[data-menu-btn]");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }

  if (menuBtn) menuBtn.addEventListener("click", openSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);
  document.querySelectorAll(".sidebar-link").forEach((link) =>
    link.addEventListener("click", closeSidebar)
  );

  // active link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    if (link.getAttribute("href") === path) link.classList.add("active");
  });

  // user card + logout
  const session = DB.getSession();
  const userSlot = document.querySelector("[data-sidebar-user]");
  if (userSlot && session) {
    userSlot.innerHTML = `
      <div class="sidebar-user-card">
        <div class="avatar">${escapeHtml(session.name.charAt(0).toUpperCase())}</div>
        <div class="who">
          <b>${escapeHtml(session.name)}</b>
          <span>${escapeHtml(session.email)}</span>
        </div>
      </div>
      <button class="logout-btn" data-logout-btn>
        <svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Log out
      </button>
    `;
    const logoutBtn = userSlot.querySelector("[data-logout-btn]");
    logoutBtn.addEventListener("click", () => {
      DB.clearSession();
      location.href = "login.html";
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
