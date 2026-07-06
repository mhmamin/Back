import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import notificationsRoute from "./routes/notificationsRoute.js";

const app = express();
const PORT = 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/images", express.static("uploads"));

// تم إضافة / قبل api في كل الأسطر
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notifications", notificationsRoute);

app.get("/", (req, res) => {
  res.send("API working");
});

// الأفضل استدعاء الاتصال بالقاعدة هنا لضمان استقرار السيرفر
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
