/* =========================================================
   CodeForge — login.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (DB.getSession()) {
    location.replace("dashboard.html");
    return;
  }

  const form = document.querySelector("#login-form");
  if (!form) return;
  const msg = document.querySelector("[data-form-msg]");

  // Friendly banner if redirected here from a protected page
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");
  if (redirect && redirect !== "login.html" && redirect !== "register.html") {
    showFormMsg(msg, "Please log in to continue to " + redirect.replace(".html", "") + ".", "error");
  }

  document.querySelectorAll("[data-toggle-pw]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePw);
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.classList.remove("show");

    const email = form.querySelector("#email");
    const password = form.querySelector("#password");
    [email, password].forEach((f) => setFieldError(f, ""));
    let valid = true;

    if (!isValidEmail(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      valid = false;
    }
    if (!password.value) {
      setFieldError(password, "Enter your password.");
      valid = false;
    }
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in…";

    setTimeout(() => {
      const user = DB.verifyCredentials(email.value.trim(), password.value);
      if (!user) {
        showFormMsg(msg, "Incorrect email or password. New here? Register first.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Log in";
        return;
      }
      DB.createSession(user);
      showFormMsg(msg, "Welcome back! Redirecting…", "success");
      const target = redirect && redirect !== "login.html" && redirect !== "register.html" ? redirect : "dashboard.html";
      setTimeout(() => (location.href = target), 700);
    }, 350);
  });

  function setFieldError(inputEl, message) {
    const fieldEl = inputEl.closest(".field");
    fieldEl.classList.toggle("invalid", Boolean(message));
    const errEl = fieldEl.querySelector(".field-error");
    if (errEl) errEl.textContent = message || "";
  }

  function showFormMsg(el, message, type) {
    el.textContent = message;
    el.className = `form-msg show ${type}`;
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
});
