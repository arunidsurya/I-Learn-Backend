import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document{
    title:string;
    message:string;
    status:string;
    userId:string
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default:"unread"
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // Use timestamps instead of timeStamp

const NotificationModel: Model<INotification> = mongoose.model("Notification", notificationSchema);

export default NotificationModel;
