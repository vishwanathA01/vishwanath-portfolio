# V13 — Advanced Admin Login Fixed

This version fixes the V9 admin compile/runtime blockers: the Experience/Education component names now match, and the compact-layout setting receives its state correctly. The admin login/session implementation is retained.

# Vishwanath Thakur Portfolio V9 — Advanced Admin Command Center

## Advanced, workable admin features
- Protected admin login/logout
- Anime/futuristic responsive admin UI
- Collapsible sidebar
- Global notification center for unread messages
- Command palette with Cmd/Ctrl + K
- Save All workspace action
- Project CRUD: create, edit, search, feature/unfeature, status, GitHub/demo links, delete
- Profile links: GitHub, LinkedIn, Instagram, email, WhatsApp with live preview
- Skills manager with proficiency sliders
- Experience CRUD
- Education CRUD
- Certificates CRUD
- Resume PDF selection + filename management
- Contact inbox with mark-read, reply and clear controls
- Analytics overview
- Live public GitHub username lookup/sync
- Local portfolio copilot
- SEO editor + search preview
- Site settings
- Security preferences
- Admin activity/audit trail
- JSON export/import backup and restore
- Compact workspace preference
- Browser persistence via localStorage
- Responsive tablet/mobile layout

## Run
```bash
npm install
rm -rf .next
npm run check
npm run dev
```
Open `http://localhost:3000/login`.

Admin login credentials are intentionally **not displayed on the public login page**. Use the credentials configured in your environment (or the local development fallback configured in `app/api/login/route.ts`).

Admin:
`http://localhost:3000/admin`

## Advanced controls
- Press `Cmd + K` on macOS or `Ctrl + K` on Windows/Linux for the command palette.
- Use Overview → Backup & restore to export/import CMS data as JSON.
- Use Overview → Recent admin activity to see recent admin actions.
- Use the bell in the top bar for message notifications.

## Data model
This starter uses browser localStorage for CMS data so every admin control works without a database. Public profile/project data can share the same browser storage.

## Production hardening
For production, move CMS data to a database, use server-side role-based authentication, secure object storage for uploads, server-side validation, CSRF protection and server-side secrets.


## Admin login
The login page does not display demo/default credentials. The requested local admin credentials are configured in `app/api/login/route.ts`.
