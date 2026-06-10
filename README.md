# 🚀 AI-Driven Learning Platform (Full-Stack Architecture)

פלטפורמת למידה מבוססת בינה מלאכותית המאפשרת למשתמשים ליצור שיעורים מותאמים אישית על פי תחומי עניין ונושאים מוגדרים מראש, תוך אינטגרציה מלאה עם OpenAI API, ניהול היסטוריית למידה, ודשבורד מנהל (Admin) מקיף.

## 🛠️ Tech Stack & Architecture

הפרויקט בנוי בארכיטקטורת Full-Stack מודרנית ומודולרית, המפרידה לחלוטין בין שכבת התצוגה לשכבת הלוגיקה העסקית:

* **Frontend:** React, TypeScript, Vite 5, Axios לניהול קריאות ה-API, ועיצוב רספונסיבי מותאם לכל מסך.
* **Backend:** Node.js, Express.js, TypeScript, ארכיטקטורת Controllers & Services מופרדת (Production-Grade).
* **Database & ORM:** PostgreSQL בשילוב עם Prisma ORM לניהול סכמות, קשרים (1:N, N:M) וביצוע מיגרציות בטוחות.
* **AI Engine:** OpenAI API (GPT-4o/GPT-3.5-turbo) מנוהל באמצעות שיטת Prompt Engineering דינמית.

---

## 📂 Project Structure

```text
├── backend/
│   ├── prisma/             # Database Schemas, Migrations & Seed data
│   ├── src/
│   │   ├── controllers/    # Request handlers & Input validations
│   │   ├── routes/         # API endpoints routing definitions
│   │   └── services/       # Core business logic & OpenAI integrations
│   └── server.ts           # Express Application entrypoint
└── frontend/
    ├── src/
    │   ├── components/     # Modular and reusable UI components
    │   ├── services/       # Centralized API Service layer (Axios)
    │   └── App.tsx         # Application root container and state machine# lesson-generator-app