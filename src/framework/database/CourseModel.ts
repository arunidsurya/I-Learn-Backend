import mongoose, { Document, Model, Schema } from "mongoose";
import Course from "../../entities/course";
import User from "../../entities/userEntity";

export interface IComment extends Document {
  user: object;
  question: string;
  questionReplies: IQuestionReply[];
}

export interface IQuestionReply extends Document {
  user: object;
  answer: string;
  createdAt: Date;
}


export interface IReview extends Document {
  user: User;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}

export interface ILink extends Document {
  title: string;
  url: string;
}

export const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies:[Object]
},{timestamps:true});

export const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const questionReplySchema = new Schema<IQuestionReply>(
  {
    user: Object,
    answer: String,
  },
  { timestamps: true }
); 
export const commentSchema = new Schema<IComment>(
  {
    user: Object,
    question: String,
    questionReplies: [questionReplySchema],
  },
  { timestamps: true }
);

const courseSchema = new Schema<Course>(
  {
    courseTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructorId: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    totalVideos: {
      type: Number,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [{ type: Schema.Types.ObjectId, ref: "courseData" }],
    classSchedule: {
      type: {
        date: String,
        time: String,
        description: String,
        meetingCode: String,
      },
      default: {},
    },
    chat: [{ type: Schema.Types.ObjectId, ref: "chat" }],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CourseModel: Model<Course> = mongoose.model("Course", courseSchema);

export default CourseModel;




questionReplySchema.pre<IQuestionReply>("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});