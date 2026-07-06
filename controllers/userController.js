import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User dose'nt exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// 1. جلب جميع المستخدمين
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  }
};

// 2. حذف مستخدم
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "المستخدم غير موجود" });
    }

    res.json({ success: true, message: "تم حذف المستخدم بنجاح" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// 3. ترقية مستخدم إلى أدمن
export const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "المستخدم غير موجود" });
    }

    res.json({
      success: true,
      message: "تم ترقية المستخدم إلى مدير بنجاح",
      data: updatedUser,
    });
  } catch (error) {
    console.error("خطأ في ترقية المستخدم:", error);
    res.status(500).json({ success: false, message: "خطأ في السيرفر" });
  }
};

// 4. تنزيل رتبة الأدمن إلى مستخدم عادي
export const demoteToUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // التحقق إذا كان المستخدم أصلاً ليس أدمن
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "المستخدم ليس أدمن" });
    }

    user.role = "user";
    await user.save();

    res.json({
      success: true,
      message: "تم إعادة المستخدم إلى مستخدم عادي بنجاح",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export { loginUser, registerUser };
