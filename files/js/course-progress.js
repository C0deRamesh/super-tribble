document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("[data-complete-course]");
  if (!button || typeof DB === "undefined") return;
  const courseId = button.dataset.completeCourse;
  DB.startCourse(courseId);

  button.addEventListener("click", () => {
    DB.completeModule(courseId);
    button.textContent = "Notes completed ✓";
    button.disabled = true;
  });
});
