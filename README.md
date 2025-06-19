# 📊 Codeforces Student Progress Tracker

An advanced full-stack MERN application to track student performance on [Codeforces](https://codeforces.com), designed for **TLE Eliminators**' assignment.

This tool helps educators manage student profiles, sync CF data, detect inactivity, and analyze contest and problem-solving stats.

---

## 🌐 Live Demo

> Add a video demo link or deployment URL here if available

---

## 📁 Project Structure

```
SPS/
├── backend/
│   ├── models/              # MongoDB models (Student, ContestHistory, SolvedProblem)
│   ├── routes/              # Express routes (students, sync, export, mail)
│   ├── utils/               # Codeforces fetchers, mailer, reminder checker
│   └── cron/                # Automated daily sync with cron
├── frontend/
│   └── src/
│       ├── components/      # UI components (tables, graphs, modals)
│       ├── pages/           # Student profile and home
│       ├── lib/             # Axios + Codeforces fetchers
│       ├── layout/          # Theme provider and header
│       └── App.jsx, main.jsx, etc.
```

---

## ✨ Features

### 🧑 Student Management

- View, search, sort, add, edit, and delete students
- Mark favorites ❤️
- Export data as CSV / JSON
- Display Codeforces profile with name, rating, max rating, handle, etc.

### 📊 Contest History

- Filter by 30, 90, 365 days
- Show rating graph 📈
- List contests with rank & rating changes

### 🔍 Problem Solving Insights

- Filter by 7, 30, 90 days
- Stats: hardest problem, total solved, avg. rating, avg. per day
- 📊 Bar chart by rating bucket
- 🟩 Heatmap of submissions

### 🔄 Codeforces Sync

- Scheduled sync via `node-cron` (default 2AM)
- Manual sync from UI
- Smart re-sync if CF handle is edited
- Display `lastSynced` time

### 📩 Inactivity Detection

- Detect students with no submissions in 7+ days
- Auto-email reminders via Gmail SMTP (using `nodemailer`)
- Track reminder count
- Toggle auto-email per student

### 🌗 UI

- Light/Dark mode toggle
- Responsive design for mobile/tablet
- Real-time updates after sync and delete

---

## ⚙️ Tech Stack

| Tech                    | Role              |
| ----------------------- | ----------------- |
| **MongoDB**             | Database          |
| **Express.js**          | REST API          |
| **React.js (19.x)**     | Frontend          |
| **Node.js**             | Backend runtime   |
| **TailwindCSS**         | Styling           |
| **Recharts + Chart.js** | Graphs            |
| **Lucide + ShadCN**     | UI Components     |
| **Nodemailer**          | Email integration |
| **Node-Cron**           | Daily sync jobs   |

---

## 🛠 Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/bhaviishya98/CodeForces-Tracker.git
cd CodeForces-Tracker
```

### 2. Setup Backend

```bash
cd backend
npm install
```

🔐 Create a `.env` file in `/backend`:

```env
MONGO_URI=mongodb+srv://<your-db>
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password   # Use App Password if using Gmail
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📌 Important Scripts

### Backend

| Script       | Command                      |
| ------------ | ---------------------------- |
| Start server | `npm run dev`                |
| Sync CF data | POST `/api/sync`             |
| Email check  | POST `/api/inactivity-check` |

---

## 🧪 API Endpoints (Backend)

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/students`               | List all students              |
| POST   | `/students`               | Add new student                |
| PUT    | `/students/:id`           | Edit student info              |
| DELETE | `/students/:id`           | Remove student                 |
| POST   | `/sync`                   | Sync Codeforces data           |
| POST   | `/inactivity-check`       | Trigger inactivity email check |
| GET    | `/export?format=csv/json` | Export student data            |

---

## 📸 Screenshots

![Home](image.png)
![Home-WhiteTheme](image-6.png)
![Student-Profile](image-1.png)
![Add-Student](image-7.png)
![Rating-Chart](image-2.png)
![Contest-History](image-3.png)
![Problem-Sats](image-4.png)
![Submission-Heatmap](image-5.png)

---

## 📌 Submission Checklist

- ✅ Student table with filters, search, sort, delete
- ✅ Profile view with contest & problem stats
- ✅ Cron job setup for daily sync
- ✅ Auto inactivity detection & emails
- ✅ Email count tracking and disabling
- ✅ Light/dark mode + mobile responsiveness
- ✅ Clean, modular code structure

---

## 📄 License

MIT License

---

> Created for **TLE Eliminators Assignment** – [www.tle-eliminators.com](https://www.tle-eliminators.com)
