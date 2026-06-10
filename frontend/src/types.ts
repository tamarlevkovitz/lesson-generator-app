export interface SubCategory { id: number; name: string; }
export interface Category { id: number; name: string; subCategories: SubCategory[]; }
export interface LessonHistory {
  id: number; prompt: string; response: string; createdAt: string;
  category: { name: string }; subCategory: { name: string };
}
export interface AdminUser {
  id: number; name: string; username: string; prompts: LessonHistory[];
}