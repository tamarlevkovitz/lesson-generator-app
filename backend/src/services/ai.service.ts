import OpenAI from 'openai';

// אתחול ה-Client של OpenAI באמצעות המפתח שנמצא בקובץ ה-.env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  /**
   * שליחת הפרומפט, הקטגוריה ותת-הקטגוריה ל-OpenAI וקבלת שיעור אמיתי ומותאם אישית
   */
  static async generateLesson(categoryName: string, subCategoryName: string, userPrompt: string): Promise<string> {
    try {
      // יצירת קריאה ל-Chat Completion
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // מודל מצוין, מהיר וחסכוני לפרויקטים
        messages: [
          {
            role: 'system',
            content: `You are an expert AI tutor on an educational platform. 
            The user wants to learn about a topic under the category "${categoryName}" and sub-category "${subCategoryName}".
            Generate a well-structured, clear, and comprehensive lesson based on their request. 
            Keep your response informative, clean, and professional.`
          },
          {
            role: 'user',
            content: `Teach me about: ${userPrompt}`
          }
        ],
        temperature: 0.7,
      });

      // חילוץ הטקסט שהתקבל מהמודל
      const aiReply = response.choices[0]?.message?.content;

      if (!aiReply) {
        throw new Error('התקבלה תשובה ריקה מה-AI');
      }

      return aiReply;
    } catch (error) {
      console.error('שגיאה בתקשורת עם OpenAI API:', error);
      throw new Error('נכשלה יצירת השיעור באמצעות ה-AI. אנא נסה שנית מאוחר יותר.');
    }
  }
}