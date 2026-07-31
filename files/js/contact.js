/* =========================================================
   CodeForge — contact.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const msg = document.querySelector("[data-form-msg]");

  // pre-fill from the logged-in session for convenience
  const session = DB.getSession();
  if (session) {
    const nameField = form.querySelector("#c-name");
    const emailField = form.querySelector("#c-email");
    if (nameField && !nameField.value) nameField.value = session.name;
    if (emailField && !emailField.value) emailField.value = session.email;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.classList.remove("show");

    const name = form.querySelector("#c-name");
    const email = form.querySelector("#c-email");
    const message = form.querySelector("#c-message");
    [name, email, message].forEach((f) => setFieldError(f, ""));
    let valid = true;

    if (name.value.trim().length < 2) {
      setFieldError(name, "Enter your name.");
      valid = false;
    }
    if (!isValidEmail(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      valid = false;
    }
    if (message.value.trim().length < 10) {
      setFieldError(message, "Message should be at least 10 characters.");
      valid = false;
    }
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    setTimeout(() => {
      DB.saveMessage({
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
      });
      showFormMsg(msg, "Message sent — we'll get back to you soon!", "success");
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
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
