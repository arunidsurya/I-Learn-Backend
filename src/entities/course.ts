import { IReview } from "../framework/database/CourseModel";
import { IChat } from "../framework/database/liveChat";
import CourseData from "./courseData";

interface Course {
  _id:string;
  courseTitle: string;
  instructorName: string;
  instructorId: string;
  category: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  totalVideos?: number;
  thumbnail: string;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: CourseData[];
  classSchedule:{date:string,time:string,description:string,meetingCode:string};
  chat:IChat[] ,
  approved?:boolean;
  ratings?: number;
  purchased?: number;
}

export default Course;
