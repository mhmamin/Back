import notificationModel from "../models/notificationsModel.js";
import orderModel from "../models/orderModels.js";

// جلب جميع الإشعارات
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error("❌ خطأ في جلب الإشعارات:", err);
    res.status(500).json({ success: false, message: "خطأ في السيرفر" });
  }
};

// حذف إشعار محدد
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.findByIdAndDelete(id);
    res.json({ success: true, message: "تم حذف الإشعار" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "فشل في الحذف" });
  }
};

// حذف جميع الإشعارات
export const clearAllNotifications = async (req, res) => {
  try {
    await notificationModel.deleteMany({});
    res.json({ success: true, message: "تم حذف كل الإشعارات" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "فشل في الحذف الكلي" });
  }
};

// تحديث الإشعار كمقروء
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true, message: "تم تحديث الإشعار كمقروء" });
  } catch (err) {
    res.status(500).json({ success: false, message: "فشل في التحديث" });
  }
};

// دالة إنشاء إشعار عند وجود طلب جديد (تُستدعى داخلياً عند إنشاء طلب)
export const createNotificationForOrder = async (orderData) => {
  try {
    const { userId, _id } = orderData;
    await notificationModel.create({
      message: `🛒 تم إنشاء طلب جديد برقم ${_id}`,
      orderId: _id,
      user: userId || "مستخدم مجهول",
    });
  } catch (err) {
    console.error("❌ فشل في إنشاء إشعار الطلب:", err);
  }
};

// 🌟 الدالة الجديدة لاستقبال رسائل Contact Us وإضافتها كإشعار للـ Admin 🌟
export const addNotification = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "جميع الحقول مطلوبة" });
    }

    const newNotification = await notificationModel.create({
      message: `✉️ رسالة جديدة من: ${name} (${email}) - النص: ${message}`,
      isRead: false,
    });

    res.status(201).json({ success: true, data: newNotification });
  } catch (err) {
    console.error("❌ خطأ في إضافة الإشعار:", err);
    res
      .status(500)
      .json({ success: false, message: "خطأ في السيرفر أثناء الإرسال" });
  }
};
