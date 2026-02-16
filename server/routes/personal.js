import { Router } from "express";
import { updatePersonal } from "../controllers/personal";
import { checkAuth } from "../utils/checkAuth";

const router = new Router();
// Personal
// http://localhost:3002/api/personal/personal
router.patch('/personal', checkAuth, updatePersonal);

export default router;
