# EduBroadcast — Content Broadcasting System

A role-based frontend for educational content management built with **React.js** and **Tailwind CSS**.
## Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start

# 3. Open in browser
http://localhost:3000
```

## 🔑 Demo Accounts

| Role       | Email                  | Password  |
|------------|------------------------|-----------|
| Teacher    | teacher@demo.com       | demo123   |
| Teacher 2  | teacher2@demo.com      | demo123   |
| Principal  | principal@demo.com     | demo123   |

## 📄 Pages

| Route                    | Description                              | Auth Required |
|--------------------------|------------------------------------------|---------------|
| `/login`                 | Login page                               | No            |
| `/teacher`               | Teacher dashboard                        | Teacher       |
| `/teacher/upload`        | Upload new content                       | Teacher       |
| `/teacher/content`       | View all my content + status             | Teacher       |
| `/principal`             | Principal dashboard                      | Principal     |
| `/principal/approvals`   | Review & approve/reject pending content  | Principal     |
| `/principal/content`     | All content with search & filters        | Principal     |
| `/live/:teacherId`       | Public live broadcast page               | No            |

## 🏗 Tech Stack

- **React 18** — UI library
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **React Hook Form** — Form handling & validation
- **Axios** — HTTP client (with auth interceptor)
- **react-hot-toast** — Toast notifications
- **date-fns** — Date utilities

## 🔌 Connecting a Real Backend

1. Set your API base URL in `.env`:
   ```
   REACT_APP_API_URL=https://your-api.com/v1
   ```

2. Replace mock logic in `src/services/` with real `apiClient` calls.
   The component code **does not change** — only the service internals.

## 📁 Project Structure

```
src/
├── context/         # AuthContext (global auth state)
├── services/        # All API calls (auth, content, approval)
├── hooks/           # useAsync (loading/error/data abstraction)
├── utils/           # helpers + mock data
├── components/
│   ├── ui/          # Reusable UI components
│   └── layout/      # Sidebar, PageLayout, ProtectedRoute
└── pages/
    ├── teacher/     # Dashboard, Upload, MyContent
    ├── principal/   # Dashboard, Approvals, AllContent
    ├── LoginPage.js
    └── LivePage.js  # Public /live/:teacherId
```

See `Frontend-notes.txt` for complete architecture documentation.

## 🏗 Build for Production

```bash
npm run build
```
