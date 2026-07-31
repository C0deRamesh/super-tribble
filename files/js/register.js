/* =========================================================
   CodeForge — register.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // already logged in? skip straight to dashboard
  if (DB.getSession()) {
    location.replace("dashboard.html");
    return;
  }

  const form = document.querySelector("#register-form");
  if (!form) return;
  const msg = document.querySelector("[data-form-msg]");
  const pwInput = form.querySelector("#password");
  const strengthBar = form.querySelector("[data-pw-strength]");

  pwInput.addEventListener("input", () => {
    const v = pwInput.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const pct = (score / 4) * 100;
    strengthBar.style.width = pct + "%";
    strengthBar.style.background =
      score <= 1 ? "var(--danger)" : score === 2 ? "#e0a53d" : "var(--success)";
  });

  document.querySelectorAll("[data-toggle-pw]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePw);
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.classList.remove("show");

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const password = form.querySelector("#password");
    const confirm = form.querySelector("#confirm");

    [name, email, password, confirm].forEach((f) => setFieldError(f, ""));
    let valid = true;

    if (name.value.trim().length < 2) {
      setFieldError(name, "Enter your full name.");
      valid = false;
    }
    if (!isValidEmail(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      valid = false;
    }
    if (password.value.length < 8) {
      setFieldError(password, "Password must be at least 8 characters.");
      valid = false;
    }
    if (confirm.value !== password.value) {
      setFieldError(confirm, "Passwords don't match.");
      valid = false;
    }
    if (DB.findUserByEmail(email.value.trim())) {
      setFieldError(email, "An account with this email already exists.");
      valid = false;
    }
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account…";

    setTimeout(() => {
      const user = DB.createUser({
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
      });
      showFormMsg(msg, "Account created! Redirecting to login…", "success");
      setTimeout(() => (location.href = "login.html"), 1000);
    }, 400);
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
