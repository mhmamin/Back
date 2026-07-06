import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
  user: { type: String, default: "" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const notificationsModel =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);

export default notificationsModel;
