import mongoose, { Document, Model, Schema } from "mongoose";
import PremiumAccount from "../../entities/premiumAccount";

const premiumAccountSchema = new Schema<PremiumAccount>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PremiumAccountModel: Model<PremiumAccount> = mongoose.model(
  "premiumAccount",
  premiumAccountSchema
);

export default PremiumAccountModel;
