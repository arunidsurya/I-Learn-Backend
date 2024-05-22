import mongoose, { Document, Model, Schema } from "mongoose";
import Order from "../../entities/oder";

const orderSchema: Schema<Order> = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      // required:true
    },
  },
  { timestamps: true }
); // Use timestamps instead of timeStamp

const OrderModel: Model<Order> = mongoose.model("Order", orderSchema);

export default OrderModel;
