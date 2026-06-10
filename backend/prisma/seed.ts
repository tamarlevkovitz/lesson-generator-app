import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ניקוי נתונים ישנים כדי למנוע כפילויות בהרצות חוזרות
  await prisma.prompt.deleteMany({});
  await prisma.subCategory.deleteMany({});
  await prisma.category.deleteMany({});

  // יצירת קטגוריית Science עם תת-קטגוריה Space (כפי שמופיע בדוגמה של המטלה)
  await prisma.category.create({
    data: {
      name: 'Science',
      subCategories: {
        create: [
          { name: 'Space' },
          { name: 'Physics' },
          { name: 'Biology' }
        ]
      }
    }
  });

  // יצירת קטגוריה נוספת לטובת הגיוון
  await prisma.category.create({
    data: {
      name: 'Technology',
      subCategories: {
        create: [
          { name: 'Web Development' },
          { name: 'Artificial Intelligence' }
        ]
      }
    }
  });

  console.log('הנתונים הראשוניים (Seed) הוזרקו בהצלחה!');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });