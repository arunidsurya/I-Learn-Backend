import mongoose, { Model, Schema } from "mongoose";
import CourseData from "../../entities/courseData";
import { commentSchema, linkSchema } from "./CourseModel";


const courseDataSchema = new Schema<CourseData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const CourseDataModel: Model<CourseData> = mongoose.model(
  "courseData",
  courseDataSchema
);

export default CourseDataModel;
