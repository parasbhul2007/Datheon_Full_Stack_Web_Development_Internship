# Datheon Full Stack Web Development Internship

This repository contains the three projects shown in the supplied assignment video.

## Project 1 — Personal Developer Portfolio

**Folder:** `Task-1-Developer-Portfolio`

Features:

- Semantic portfolio sections: Hero, About, Skills, Projects and Contact
- Responsive mobile-first layout
- Dark/light theme toggle (saved in localStorage)
- Mobile navigation menu
- Project detail dialogs
- Ready for GitHub Pages, Netlify or Vercel static hosting

Before publishing:

1. Open `index.html`.
2. Replace `your.email@example.com` and the LinkedIn URL with your real contact details.
3. Add links to your actual project repositories/demos.
4. Check all personal details and update them if needed.

## Project 2 — Dynamic Task Manager & Productivity Tracker

**Folder:** `Task-2-Task-Manager`

Features:

- Full CRUD: create, read, update and delete
- Categories: Personal, Work and Study
- Due dates and completion checkbox
- All / Active / Completed filters
- Search tasks
- Persistent browser storage using `localStorage`
- Responsive layout

No backend is required by the assignment brief. Tasks are stored in the browser where the app is used.

## Project 3 — Real-Time Weather Forecast & Climate Telemetry

**Folder:** `Task-3-Weather-Forecast`

Features:

- City search for global locations
- Current temperature, conditions and feels-like temperature
- Humidity, wind speed and atmospheric pressure
- Five-day forecast cards
- Dynamic weather background and icons
- Loading indicator, invalid-city and network error handling
- Fetch API, async/await and try/catch

### Configure the OpenWeatherMap API key

1. Create an account at https://openweathermap.org/.
2. Generate an API key from your account.
3. Open `Task-3-Weather-Forecast/script.js`.
4. Replace `YOUR_OPENWEATHERMAP_API_KEY` with your key.
5. Save and run the app using VS Code Live Server.

The free 5-day forecast endpoint is used. Newly created API keys may take some time before they become active.

## Run locally

Each project is independent:

1. Open its folder in VS Code.
2. Install the **Live Server** extension if you do not have it.
3. Right-click `index.html` and choose **Open with Live Server**.

You can also open the HTML file directly for the first two projects. Use Live Server for the weather project to avoid browser-origin issues.

## Suggested GitHub repository

`Full-Stack-Web-Development-Tasks`

Suggested description:
`Three responsive web development projects: developer portfolio, CRUD task manager with localStorage, and real-time weather forecast app using OpenWeatherMap API.`

## Important note about "Full Stack"

The provided video describes frontend/browser projects and third-party API integration. It does not ask for a custom server, authentication system or database. These implementations follow the listed requirements instead of adding unrequested backend complexity.
