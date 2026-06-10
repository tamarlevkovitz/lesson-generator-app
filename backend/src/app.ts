import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes';

// טעינת משתני הסביבה מקובץ ה-.env [cite: 54]
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Middleware - תמיכה בקבלת מידע בפורמט JSON וחיבור מאובטח לפרונטאנד (CORS)
app.use(cors());
app.use(express.json());

// חיבור נתיבי ה-API המרכזיים של המערכת
app.use('/api', router);

// נתיב בדיקה בסיסי כדי לוודא שהשרת באוויר
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'השרת פועל בהצלחה!' });
});

// הפעלת האזנה של השרת לפורט המבוקש
app.listen(PORT, () => {
  console.log(`Server is running smoothly on http://localhost:${PORT}`);
});

export default app;