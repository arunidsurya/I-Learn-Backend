import mongoose, { Document, Model, Schema } from "mongoose";
import Category from "../../entities/Categories";

const categorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryModel: Model<Category> = mongoose.model(
  "category",
  categorySchema
);

export default CategoryModel;
