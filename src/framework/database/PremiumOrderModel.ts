import mongoose, { Document, Model, Schema } from "mongoose";
import Order from "../../entities/oder";

const orderSchema: Schema<Order> = new Schema(
  {
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

const PremiumOrderModel: Model<Order> = mongoose.model("premiumOrder", orderSchema);

export default PremiumOrderModel;
