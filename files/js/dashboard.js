/* =========================================================
   CodeForge — dashboard.js
   Displays the logged-in user's info (auth-guard.js already
   guaranteed a session exists before this runs).
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const session = DB.getSession();
  if (!session) return; // safety net; auth-guard should have redirected already

  const nameSlot = document.querySelector("[data-user-name]");
  const emailSlot = document.querySelector("[data-user-email]");
  const initialSlot = document.querySelector("[data-user-initial]");
  const joinedSlot = document.querySelector("[data-user-joined]");

  if (nameSlot) nameSlot.textContent = session.name;
  if (emailSlot) emailSlot.textContent = session.email;
  if (initialSlot) initialSlot.textContent = session.name.charAt(0).toUpperCase();

  const user = DB.getUsers().find((u) => u.id === session.userId);
  if (joinedSlot && user) {
    const d = new Date(user.joinedAt);
    joinedSlot.textContent = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  const progress = DB.getLearningProgress();
  const courseNames = { html5: "HTML5", css3: "Responsive CSS & Layout", javascript: "Modern JavaScript" };
  const modules = progress.completedModules.length;
  const projects = progress.shippedProjects.length;
  const activeCourse = progress.activeCourse ? courseNames[progress.activeCourse] : null;
  document.querySelector("[data-stat-modules]").textContent = modules;
  document.querySelector("[data-stat-tracks]").textContent = activeCourse ? 1 : 0;
  document.querySelector("[data-stat-projects]").textContent = projects;

  const progressTitle = document.querySelector("[data-progress-title]");
  const progressCopy = document.querySelector("[data-progress-copy]");
  const progressBar = document.querySelector("[data-progress-bar]");
  if (activeCourse) {
    progressTitle.textContent = `${activeCourse} — progress`;
    progressCopy.textContent = `${modules} module${modules === 1 ? "" : "s"} completed in your learning journey.`;
    progressBar.style.width = `${Math.min(100, modules * 25)}%`;
  }

  const activity = document.querySelector("[data-recent-activity]");
  const items = [];
  if (activeCourse) items.push(`Started ${activeCourse}`);
  progress.completedModules.forEach((course) => items.push(`Completed notes for ${courseNames[course] || course}`));
  progress.shippedProjects.forEach((project) => items.push(`Shipped “${project}” project`));
  if (items.length) activity.innerHTML = items.map((item) => `<div class="activity-item"><div class="activity-dot">✓</div><div><b style="font-size:.9rem;">${item}</b><p style="margin:2px 0 0; font-size:.8rem;">Your learning activity</p></div></div>`).join("");
});
