import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import { validateInput } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../validations/auth.schema';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// مسارات التسجيل وتسجيل الدخول مع الفحص والتحقق
if (register && validateInput && registerSchema) {
  router.post('/register', validateInput(registerSchema), register);
}

if (login && validateInput && loginSchema) {
  router.post('/login', validateInput(loginSchema), login);
}

// مسار جلب المستخدم برقم المعرف (مفتوح أو حسب رغبتك)
if (getUserById) {
  router.get('/users/:id', getUserById);
}

// مسار جلب جميع المستخدمين محمي تماماً بواسطة الـ Token
if (getAllUsers && verifyToken) {
  router.get('/users', verifyToken, getAllUsers);
}

export default router;