import { Request, Response } from 'express';
import prisma from '../db';
import { AIService } from '../services/ai.service';

export class LearningController {
  // יצירת שיעור חדש באמצעות AI ושמירתו בהיסטוריה
  static async createLesson(req: Request, res: Response): Promise<void> {
    try {
      const { userId, categoryId, subCategoryId, prompt } = req.body;

      // ולידציה בסיסית לקלט
      if (!userId || !categoryId || !subCategoryId || !prompt) {
        res.status(400).json({ error: 'כל השדות (userId, categoryId, subCategoryId, prompt) הם שדות חובה.' });
        return;
      }

      // בדיקה שהמשתמש, הקטגוריה ותת-הקטגוריה אכן קיימים במערכת
      const [user, category, subCategory] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.category.findUnique({ where: { id: categoryId } }),
        prisma.subCategory.findUnique({ where: { id: subCategoryId } })
      ]);

      if (!user || !category || !subCategory) {
        res.status(404).json({ error: 'אחד או יותר מהמזהים (משתמש/קטגוריה) לא נמצאו במערכת.' });
        return;
      }

      // קריאה לשירות ה-AI האמיתי שיצרנו בשלב הקודם
      const aiResponse = await AIService.generateLesson(category.name, subCategory.name, prompt);

      // שמירת הפרומפט והתשובה בבסיס הנתונים
      const savedPrompt = await prisma.prompt.create({
        data: {
          userId,
          categoryId,
          subCategoryId,
          prompt,
          response: aiResponse
        },
        include: { category: true, subCategory: true }
      });

      res.status(201).json(savedPrompt);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'שגיאה בתהליך יצירת השיעור מול ה-AI.' });
    }
  }

  // דשבורד מנהל - שליפת כל המשתמשים יחד עם ההיסטוריה שלהם
  static async getAdminDashboard(_req: Request, res: Response): Promise<void> {
    try {
      const adminData = await prisma.user.findMany({
        include: {
          prompts: {
            include: { category: true, subCategory: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      res.status(200).json(adminData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'שגיאה בשליפת נתוני מנהל המערכת.' });
    }
  }
}