/* =========================================================
   CodeForge — courses.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll("#filters .chip");
  if (!filters.length) return;

  filters.forEach((chip) => {
    chip.addEventListener("click", () => {
      filters.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      document.querySelectorAll("#course-grid .p-card").forEach((card) => {
        card.style.display = filter === "all" || card.dataset.cat === filter ? "" : "none";
      });
    });
  });
});
