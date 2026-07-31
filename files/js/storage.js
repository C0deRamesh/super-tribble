/* =========================================================
   CodeForge — storage.js
   A tiny localStorage-backed "database" layer.
   Keys are namespaced so this app never collides with others
   sharing the same origin.
   ========================================================= */

const DB = (() => {
  const KEYS = {
    users: "codeforge_users",
    session: "codeforge_session",
    messages: "codeforge_messages",
    progress: "codeforge_progress",
  };

  function _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("CodeForge storage read error:", e);
      return fallback;
    }
  }

  function _write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("CodeForge storage write error:", e);
      return false;
    }
  }

  /* ---------------- users ---------------- */
  function getUsers() {
    return _read(KEYS.users, []);
  }

  function findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    return getUsers().find((u) => u.email.toLowerCase() === normalized) || null;
  }

  // Lightweight, deterministic hash so plaintext passwords are never stored.
  // Not cryptographically secure — fine for a client-only demo, not for production.
  function hashPassword(password) {
    let hash = 0;
    const salted = `cf::${password}::forge`;
    for (let i = 0; i < salted.length; i++) {
      hash = (hash << 5) - hash + salted.charCodeAt(i);
      hash |= 0;
    }
    return `h${Math.abs(hash)}_${password.length}`;
  }

  function createUser({ name, email, password }) {
    const users = getUsers();
    const user = {
      id: "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name,
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      joinedAt: new Date().toISOString(),
    };
    users.push(user);
    _write(KEYS.users, users);
    return user;
  }

  function verifyCredentials(email, password) {
    const user = findUserByEmail(email);
    if (!user) return null;
    return user.passwordHash === hashPassword(password) ? user : null;
  }

  /* ---------------- sessions ---------------- */
  function createSession(user) {
    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      token: "sess_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
      loginAt: new Date().toISOString(),
    };
    _write(KEYS.session, session);
    return session;
  }

  function getSession() {
    return _read(KEYS.session, null);
  }

  function clearSession() {
    localStorage.removeItem(KEYS.session);
  }

  /* ---------------- learning progress ---------------- */
  function _progressForUser(userId) {
    const allProgress = _read(KEYS.progress, {});
    return {
      allProgress,
      progress: allProgress[userId] || { activeCourse: null, completedModules: [], shippedProjects: [] },
    };
  }

  function _saveProgress(userId, progress, allProgress) {
    allProgress[userId] = progress;
    _write(KEYS.progress, allProgress);
    return progress;
  }

  function startCourse(courseId) {
    const session = getSession();
    if (!session) return null;
    const { allProgress, progress } = _progressForUser(session.userId);
    progress.activeCourse = courseId;
    return _saveProgress(session.userId, progress, allProgress);
  }

  function completeModule(courseId) {
    const session = getSession();
    if (!session) return null;
    const { allProgress, progress } = _progressForUser(session.userId);
    progress.activeCourse = courseId;
    if (!progress.completedModules.includes(courseId)) progress.completedModules.push(courseId);
    return _saveProgress(session.userId, progress, allProgress);
  }

  function shipProject(projectId) {
    const session = getSession();
    if (!session) return null;
    const { allProgress, progress } = _progressForUser(session.userId);
    if (!progress.shippedProjects.includes(projectId)) progress.shippedProjects.push(projectId);
    return _saveProgress(session.userId, progress, allProgress);
  }

  function getLearningProgress() {
    const session = getSession();
    if (!session) return { activeCourse: null, completedModules: [], shippedProjects: [] };
    return _progressForUser(session.userId).progress;
  }

  /* ---------------- contact messages ---------------- */
  function saveMessage({ name, email, message }) {
    const messages = _read(KEYS.messages, []);
    messages.push({
      id: "m_" + Date.now().toString(36),
      name,
      email,
      message,
      sentAt: new Date().toISOString(),
    });
    _write(KEYS.messages, messages);
  }

  return {
    getUsers,
    findUserByEmail,
    createUser,
    verifyCredentials,
    createSession,
    getSession,
    clearSession,
    startCourse,
    completeModule,
    shipProject,
    getLearningProgress,
    saveMessage,
  };
})();
