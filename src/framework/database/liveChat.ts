import mongoose, { Document, Model, Schema } from "mongoose";

export interface IChat extends Document {
  userId: string;
  userName: string;
  message: string;
}

const chatSchema = new Schema<IChat>(
  {
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const cappedSizeInBytes = 1000000; // Example capped size of 1MB
chatSchema.set("capped", { size: cappedSizeInBytes, max: 1000 });

const ChatModel: Model<IChat> = mongoose.model("chat", chatSchema);

export default ChatModel;
