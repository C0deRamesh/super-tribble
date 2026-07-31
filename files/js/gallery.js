document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-ship-project]").forEach((button) => {
    const project = button.dataset.shipProject;
    if (DB.getLearningProgress().shippedProjects.includes(project)) {
      button.textContent = "Shipped ✓";
      button.disabled = true;
    }
    button.addEventListener("click", () => {
      DB.shipProject(project);
      button.textContent = "Shipped ✓";
      button.disabled = true;
    });
  });
});
