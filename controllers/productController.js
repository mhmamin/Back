import productModels from "../models/productModels.js";
import fs from "fs";

const addProduct = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const product = new productModels({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await product.save();
    res.json({ success: true, message: "Product Added" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModels.find({});
    res.json({ success: true, data: products });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await productModels.findById(req.body.id);
    fs.unlink(`uploads/${product.image}`, () => {});
    await productModels.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export { addProduct, listProducts, removeProduct };
