import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // ייבוא ספריית ההצפנה

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; // רמת חוזק ההצפנה

export const UserController = {
  // 1. הרשמת משתמש חדש עם סיסמה מוצפנת
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password, name } = req.body;
      
      if (!username || !password || !name) {
        res.status(400).json({ error: 'נא למלא את כל השדות (שם, שם משתמש וסיסמה)' });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        res.status(400).json({ error: 'שם המשתמש כבר קיים במערכת' });
        return;
      }

      // הצפנת הסיסמה לפני השמירה בדאטה-בייס
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await prisma.user.create({
        data: { 
          username, 
          password: hashedPassword, // שמירת הסיסמה המוצפנת
          name 
        }
      });

      res.status(201).json({ id: user.id, name: user.name, username: user.username });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'שגיאה בתהליך ההרשמה' });
    }
  },

  // 2. התחברות משתמש קיים עם בדיקת סיסמה מוצפנת
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'נא להזין שם משתמש וסיסמה' });
        return;
      }

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
        return;
      }

      // השוואת הסיסמה שהוזנה מול הסיסמה המוצפנת שבדאטה-בייס
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
        return;
      }

      res.status(200).json({ id: user.id, name: user.name, username: user.username });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'שגיאה בתהליך ההתחברות' });
    }
  },

  // 3. שליפת קטגוריות
  getCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await prisma.category.findMany({
        include: { subCategories: true }
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'שגיאה בטעינת קטגוריות' });
    }
  },

  // 4. היסטוריית משתמש
  getUserHistory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const history = await prisma.prompt.findMany({
        where: { userId: Number(id) },
        include: { category: true, subCategory: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'שגיאה בטעינת ההיסטוריה' });
    }
  }
};