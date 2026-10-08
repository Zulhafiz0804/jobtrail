# JobTrail

A job application tracker for job seekers. Add applications, drag them across a kanban board as they progress, get reminders for interviews and follow-ups, and see how your search is going on a dashboard.

**Live demo:** https://jobtrail-mu.vercel.app/

## Features

- **Accounts:** sign up and log in with email and password. Each user only sees their own applications.
- **Kanban board:** Wishlist, Applied, Interview, Offer and Rejected columns. Drag a card to change its status; the change saves automatically.
- **Fast entry:** only company, job title, link and date applied are required.
- **Application details:** salary range, recruiter name and email, CV version, notes, interview date and an interview prep checklist.
- **Reminders:** a banner for interviews in the next 7 days and for applications with no update after 7 days. Cards also show "Interview in 3 days" and "Follow up" chips.
- **Search and filters:** by company, status and date.
- **Dashboard:** applications sent, response rate, interviews, a search funnel (Applied, Replied, Interview, Offer) and applications per day, week or month.
- **Responsive and accessible:** works on phone and desktop, with keyboard drag-and-drop, labelled controls and visible focus states.

## Tech stack

| Area | Tools |
|---|---|
| Front end | React 18, Vite, Tailwind CSS v4 |
| Drag and drop | dnd-kit |
| Charts | Recharts |
| Auth and database | Supabase (Postgres, Auth, Row Level Security) |
| Hosting | Vercel |

## How it works

- `src/main.jsx` checks the Supabase session and shows either the login screen or the app.
- `src/lib/useJobs.js` is the data layer. It loads, creates, updates, moves and deletes jobs in Supabase and converts between database column names (`date_applied`) and app field names (`dateApplied`).
- Data isolation is enforced in the database, not just the UI: a Row Level Security policy limits every query to rows where `user_id = auth.uid()`.
- `src/components/` holds the board, form, reminders, stats and login screen.

## Run it locally

1. Clone the repo and install:
```
   git clone https://github.com/YOUR-USERNAME/jobtrail.git
   cd jobtrail
   npm install
```
2. Create a free project at [supabase.com](https://supabase.com) and run `supabase/schema.sql` in the SQL Editor.
3. Copy `.env.example` to `.env` and fill in your project URL and publishable key (Project Settings, API Keys).
4. Start the app:
```
   npm run dev
```

## Deploy

Import the repo on [Vercel](https://vercel.com), add the two environment variables from `.env.example`, and deploy. Then add your Vercel URL under Supabase, Authentication, URL Configuration.

## Roadmap

- Restyle the add and edit form and login screen to match the board
- Export applications to CSV
- Click a funnel stage to filter the board
- Email reminders for interviews and follow-ups

## License

MIT