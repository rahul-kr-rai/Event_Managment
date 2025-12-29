# 🚀 Event Management

A production-oriented README for a full-stack college event management application (React + Vite frontend, Express + MongoDB backend). This document focuses on secure configuration, deployment, observability, and operational best practices.

---

## 🧩 About

An event management platform supporting user auth, event CRUD with image uploads, individual & team registrations, payment integration (Razorpay), admin management, notifications, and password reset emails.

## ✨ Key Features

- Authentication (JWT)
- Event creation, editing, deletion, image uploads
- Registrations (individual & team) with payment flow
- Admin dashboard for managing users & registrations
- Email reset, notifications, file uploads

## 🛠️ Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- File uploads: multer
- Payments: Razorpay

## 📁 Repo Layout (important files)

- Backend: [backend/server.js](backend/server.js#L1)
	- Models: [backend/models/Event.js](backend/models/Event.js#L1)
	- Routes (examples): [backend/routes/events.js](backend/routes/events.js#L1)
- Frontend: [frontend/src](frontend/src#L1)
	- API helper: [frontend/src/api.js](frontend/src/api.js#L1)
	- App entry: [frontend/src/main.jsx](frontend/src/main.jsx#L1)
- Static/uploads: `/uploads` (served by backend)

---

## ⚙️ Environment & Secrets

Always store sensitive values in environment variables (never commit secrets). Example variables used by this project:

- `MONGO_URI` — MongoDB connection string
- `PORT` — backend port (default: 5000)
- `SECRET_KEY` — JWT signing secret
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` — for sending emails
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

Recommended: create `backend/.env` locally and add `backend/.env` to `.gitignore`.

Example (do NOT commit):

```
MONGO_URI=mongodb://127.0.0.1:27017/eventhub
PORT=5000
SECRET_KEY=super_secret_replace_me
EMAIL_USER=youremail@example.com
EMAIL_PASS=app-password
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=secret
```

---

## 🧪 Testing & Quality

- Add unit + integration tests for backend routes and frontend components.
- Use `eslint`/`prettier` and CI checks on PRs.
- Run `npm run lint` in the frontend and add a CI step to fail on lint errors.

Suggested test commands:

```bash
cd backend
npm install --only=dev
# add tests and run them (e.g. using jest/mocha)

cd frontend
npm install
npm run lint
npm run build
```

---

## 🛡️ Security Notes (must-do)

- Remove hard-coded credentials from `backend/server.js` and replace them with env vars.
- Use HTTPS and secure cookies (if any). Use short-lived tokens for sensitive actions.
- Validate webhooks and payment callbacks using HMAC signatures.

---

## 🚀 Quick Dev Run

Start backend (dev):

```bash
cd backend
npm install
npm run dev
```

Start frontend (dev):

```bash
cd frontend
npm install
npm run dev
```

Default backend API base: [frontend/src/api.js](frontend/src/api.js#L1) (`http://localhost:5000`).

---

## 📌 Next recommended tasks (I can do these for you)

- Create `backend/.env.example` with safe placeholders
- Add `Dockerfile` + `docker-compose.yml` for local dev
- Add a `GitHub Actions` CI workflow that runs lint/tests and builds images
- Add healthcheck endpoints and basic Prometheus metrics

Reply with which artifact you want next and I’ll scaffold it.