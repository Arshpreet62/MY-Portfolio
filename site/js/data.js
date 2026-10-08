/* The two long lists on the page: the drawing register (every repository)
   and the schedule of materials. main.js renders both into index.html;
   everything else on the page is written directly in index.html.
   Revisions are commit counts and dates are last pushes, read from each
   repository on 2026-09-29; Postmen and Harbour Ride on 2026-10-08. */
window.PORTFOLIO = {
  // Every repository, for the drawing register. `no` is the order the
  // repository was created on GitHub (1 = first). `kind: 'build'` rows show by
  // default; 'practice' rows appear with "Show practice repositories".
  // `live` adds a link to the running site; `sheet` links to a sheet above.
  register: [
    { no: 28, repo: 'PlateMate', title: 'PlateMate', note: 'Meal-pass counter for a buffet. Offline PWA with QR passes.', stack: 'React, Mantine, Dexie, Vitest', rev: 17, date: '2026-09-21', kind: 'build', sheet: 'A-102' },
    { no: 27, repo: 'odin-recipes', title: 'Odin Recipes', note: 'Recipe pages, revisiting HTML with The Odin Project.', stack: 'HTML', rev: 4, date: '2026-09-15', kind: 'practice' },
    { no: 26, repo: 'git_test', title: 'Git test', note: 'First commits for The Odin Project Git lesson.', stack: 'Git', rev: 3, date: '2026-09-14', kind: 'practice' },
    { no: 25, repo: 'todo-vanilla', title: 'Todo, vanilla', note: 'To-do app with All, Active and Done filters in plain JavaScript.', stack: 'JavaScript', rev: 1, date: '2026-09-11', kind: 'practice' },
    { no: 24, repo: 'taxi_app', title: 'Harbour Ride', note: 'Sydney taxi bookings on a taximeter: signed fare quotes, route map, emails.', stack: 'Next.js, MapLibre, OSRM, Resend', rev: 11, date: '2026-10-08', kind: 'build', live: 'https://taxi-app-gamma-inky.vercel.app/', sheet: 'A-103' },
    { no: 23, repo: 'FullStackOpen-certification', title: 'Full Stack Open', note: 'Coursework from the University of Helsinki course.', stack: 'JavaScript, React, Node', rev: 16, date: '2026-05-03', kind: 'build' },
    { no: 22, repo: 'MY-Portfolio', title: 'Portfolio, 2026 edition one', note: 'Previous portfolio with a MongoDB visitor counter and mailer.', stack: 'Next.js, TypeScript, MongoDB', rev: 14, date: '2026-04-18', kind: 'build' },
    { no: 19, repo: 'Postmen', title: 'Postmen', note: 'API client: postmarked responses, an outbox and usage stats.', stack: 'Next.js, MongoDB, JWT, Playwright', rev: 35, date: '2026-10-08', kind: 'build', live: 'https://postmen.vercel.app/', sheet: 'A-101' },
    { no: 20, repo: 'ZapMail', title: 'ZapMail', note: 'Email app with GitHub and Google sign-in through NextAuth.', stack: 'Next.js, NextAuth, Tailwind', rev: 8, date: '2026-02-13', kind: 'build' },
    { no: 21, repo: '24hr-Story-Feature', title: '24-hour stories', note: 'Story uploads kept in the browser as base64 images.', stack: 'React, TypeScript, Vite', rev: 8, date: '2025-11-25', kind: 'build' },
    { no: 18, repo: 'postman-clone', title: 'Postman clone', note: 'First MERN version of Postmen: Express API, React client.', stack: 'Express, MongoDB, React', rev: 4, date: '2025-08-09', kind: 'build' },
    { no: 16, repo: 'Spotify', title: 'Spotify player clone', note: 'Web player dashboard with sidebar, grid and scroll behaviour.', stack: 'React, TypeScript, Motion', rev: 4, date: '2025-06-15', kind: 'build' },
    { no: 12, repo: 'Whatapp', title: 'WhatsApp clone', note: 'Chat UI backed by an Express API that generates conversations.', stack: 'React, Express, Faker', rev: 8, date: '2025-06-15', kind: 'build' },
    { no: 17, repo: 'instagram', title: 'Instagram clone', note: 'Feed with infinite scroll from an Express API.', stack: 'React, Express, Faker', rev: 8, date: '2025-06-15', kind: 'build' },
    { no: 9, repo: 'chatApp', title: 'Self-chat', note: 'Chat layout practice: CSS Grid bubbles and long-text wrapping.', stack: 'HTML, CSS, JavaScript', rev: 16, date: '2025-06-15', kind: 'practice', live: 'https://arshpreet62.github.io/chatApp/' },
    { no: 10, repo: 'components', title: 'Components', note: 'Buttons, dropdowns, steps and switches with variants.', stack: 'HTML, CSS, JavaScript', rev: 12, date: '2025-06-15', kind: 'practice' },
    { no: 11, repo: 'google-clone', title: 'Google homepage clone', note: 'Responsive copy of the Google homepage.', stack: 'HTML, CSS, JavaScript', rev: 3, date: '2025-06-15', kind: 'practice', live: 'https://arshpreet62.github.io/google-clone/' },
    { no: 15, repo: 'DailyGoals', title: 'Daily Goals', note: 'Goal tracker with a small Express API.', stack: 'React, Express, Tailwind', rev: 16, date: '2025-06-13', kind: 'build', live: 'https://daily-goals-seven.vercel.app/' },
    { no: 14, repo: 'Cssgenerator', title: 'CSS Generator', note: 'Style a button, input or paragraph and copy the CSS.', stack: 'React, TypeScript, Motion', rev: 5, date: '2025-06-12', kind: 'build', live: 'https://cssgenerator-two.vercel.app/' },
    { no: 13, repo: 'TYPESPEED-Tester', title: 'TypeSpeed Tester', note: 'Typing test with WPM, accuracy and an on-screen keyboard.', stack: 'React, Motion', rev: 6, date: '2025-06-09', kind: 'build', live: 'https://typespeed-tester.vercel.app/' },
    { no: 8, repo: 'cart-js', title: 'Kart', note: 'Product showcase and cart in plain JavaScript.', stack: 'JavaScript', rev: 2, date: '2025-01-22', kind: 'practice' },
    { no: 7, repo: 'todo-list', title: 'Todo list', note: 'First to-do list in plain JavaScript.', stack: 'JavaScript', rev: 2, date: '2025-01-22', kind: 'practice' },
    { no: 6, repo: 'hover-open', title: 'Hover open', note: 'Sneaker card with a hover reveal.', stack: 'CSS', rev: 2, date: '2025-01-17', kind: 'practice' },
    { no: 4, repo: 'cards', title: 'Cards', note: 'Card layout exercise.', stack: 'CSS', rev: 2, date: '2025-01-03', kind: 'practice' },
    { no: 5, repo: 'men', title: 'Product preview', note: 'Product preview card.', stack: 'CSS', rev: 2, date: '2025-01-03', kind: 'practice' },
    { no: 2, repo: 'pot', title: 'Harvest Vase', note: 'Product card for a ceramic vase.', stack: 'CSS', rev: 7, date: '2025-01-03', kind: 'practice' },
    { no: 3, repo: 'flowers', title: 'Flowers', note: 'Product card with a rating.', stack: 'CSS', rev: 2, date: '2024-12-29', kind: 'practice' },
    { no: 1, repo: 't-shirt', title: 'T-shirt', note: 'Product details card with sizes and colours.', stack: 'CSS', rev: 2, date: '2024-12-27', kind: 'practice' },
  ],

  // Schedule of materials: each material and the projects that use it.
  materials: [
    { group: 'Interface', name: 'React', used: ['Postmen', 'PlateMate', 'Harbour Ride', 'TypeSpeed Tester', 'CSS Generator', 'Daily Goals', 'WhatsApp clone', 'Instagram clone'] },
    { group: 'Interface', name: 'Next.js', used: ['Postmen', 'Harbour Ride', 'ZapMail', 'Portfolio'] },
    { group: 'Interface', name: 'TypeScript', used: ['Postmen', 'Harbour Ride', 'ZapMail', 'CSS Generator', '24-hour stories', 'Spotify player clone'] },
    { group: 'Interface', name: 'Tailwind CSS, Mantine, Radix UI', used: ['Postmen', 'PlateMate', 'most clones'] },
    { group: 'Interface', name: 'Motion', used: ['TypeSpeed Tester', 'CSS Generator', 'Spotify player clone'] },
    { group: 'Server', name: 'Node.js and Express', used: ['Postman clone', 'Daily Goals', 'WhatsApp clone', 'Instagram clone'] },
    { group: 'Server', name: 'Next.js route handlers', used: ['Postmen', 'Harbour Ride', 'Portfolio'] },
    { group: 'Server', name: 'JWT, bcrypt, Google OAuth, NextAuth', used: ['Postmen', 'Postman clone', 'ZapMail'] },
    { group: 'Server', name: 'Nodemailer, Resend', used: ['Harbour Ride', 'Portfolio'] },
    { group: 'Data', name: 'MongoDB and Mongoose', used: ['Postmen', 'Postman clone', 'Portfolio'] },
    { group: 'Data', name: 'IndexedDB with Dexie', used: ['PlateMate'] },
    { group: 'Data', name: 'MapLibre, OSRM, Photon', used: ['Harbour Ride'] },
    { group: 'Proof', name: 'Playwright', used: ['Postmen'] },
    { group: 'Proof', name: 'Vitest', used: ['PlateMate'] },
    { group: 'Proof', name: 'Vercel, Render, GitHub Pages', used: ['Postmen', 'Harbour Ride', 'Daily Goals', 'TypeSpeed Tester', 'Google homepage clone'] },
  ],
};
