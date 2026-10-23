# Chathura & Gimasha — Wedding Invitation

Full-stack Next.js TypeScript wedding invitation with unique guest links, RSVP, wishes, admin management, and Excel export. Includes the provided MP4 hero video.

## Run locally

1. Install Node.js 20+.
2. `npm install`
3. Copy `.env.example` to `.env.local` and set `ADMIN_EMAIL`, a strong `ADMIN_PASSWORD`, and a random `SESSION_SECRET` of at least 32 characters.
4. `npm run dev`
5. Open `http://localhost:3000` and `http://localhost:3000/admin`.

## Guest workflow

Log in at `/admin`, create a guest and choose invited seats, then click the copy icon. Share the generated `/invite/<unique-token>` URL privately. Guests can accept or decline, choose their attending count, and send up to five wishes. Admin sees all responses and can export accepted guests as `.xlsx`.

## Deployment

This project uses local SQLite (`data/wedding.db`). Deploy to a Node.js server/VPS with persistent storage; **do not deploy to ephemeral/serverless storage** without replacing SQLite with a hosted database. Back up `data/wedding.db` regularly. Set `NEXT_PUBLIC_SITE_URL` if desired, though generated links use the browser's current origin. HTTPS is required in production. The admin credentials are environment variables; change them before sharing the site.

## Notes

The supplied Google Maps shortlink resolves to **The Deer Park Hotel, Girithale**. The original design screenshot labels the venue as Colombo; the website uses Girithale based on the actual map link. The supplied video is in `public/hero.mp4`. The couple portrait circles currently use tasteful monogram placeholders because separate individual portraits were not provided. RSVP and wishes require a unique guest link, not the public homepage.
