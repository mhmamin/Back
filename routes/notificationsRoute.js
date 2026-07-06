import express from "express";
import {
  addNotification, // 🌟 تم إضافة استيراد الدالة الجديدة هنا
  getAllNotifications,
  deleteNotification,
  clearAllNotifications,
  markAsRead,
} from "../controllers/notificationsController.js";

const router = express.Router();

router.post("/add", addNotification);

router.get("/list", getAllNotifications);
router.delete("/delete/:id", deleteNotification);
router.delete("/clear", clearAllNotifications);
router.patch("/read/:id", markAsRead);

export default router;
