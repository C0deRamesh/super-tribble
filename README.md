# CodeForge

 CodeForge is a project-first learning portal: a static site where each course module ends with something shipped — a script, an app, or a page learners can point to and say "I built that."

 ## Features

 - **Course catalog** — Python Fundamentals, Data Structures and Algorithms, Full-Stack Fundamentals, and Mobile Basics with React Native (`courses.html`).
- **Reference notes** — quick-reference pages for HTML5, CSS3, and JavaScript ES6+ (`html5-notes.html`, `css3-notes.html`, `javascript-notes.html`).
- **Accounts** — registration and login with a lightweight client-side "database" (`register.html`, `login.html`).
- **Dashboard** — signed-in learners track active courses, completed modules, and shipped projects (`dashboard.html`).
- **Project gallery** — a showcase of shippable projects learners can mark as completed (`gallery.html`).
- **Contact page** — a simple contact form (`contact.html`).

 ## Tech stack

 This is a static, dependency-free site — no build step, framework, or backend:

 - Plain HTML pages at the project root
- `css/` — stylesheets (variables, base styles, shared components, sidebar)
- `js/` — page behavior and a `localStorage`-backed data layer (`storage.js`) that handles users, sessions, and learning progress

 Because storage is `localStorage`-based, accounts and progress are per-browser and not shared across devices — this is a front-end demo rather than a production auth system.

 ## Getting started

 No installation or build step is required. Serve the folder with any static file server and open `index.html`, for example:

 ```bash
npx serve .
```

 or open `index.html` directly in a browser.

 ## Project structure

 ```
├── index.html            Landing page
├── courses.html          Course catalog
├── dashboard.html         Learner dashboard (requires login)
├── gallery.html           Project gallery (requires login)
├── login.html / register.html
├── about.html / contact.html
├── html5-notes.html / css3-notes.html / javascript-notes.html
├── css/                   Stylesheets
└── js/                    Client-side logic (auth, storage, progress)
