import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { LearningController } from '../controllers/learning.controller';

const router = Router();

router.post('/users/register', UserController.register); 

router.post('/users/login', UserController.login); 

router.get('/categories', UserController.getCategories); 

router.get('/users/:id/history', UserController.getUserHistory); 

router.post('/prompts', LearningController.createLesson); 


router.get('/admin/history', LearningController.getAdminDashboard); 

export default router;