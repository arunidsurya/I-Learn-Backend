import { IComment, ILink } from "../framework/database/CourseModel";

interface CourseData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer?: string;
  links: ILink[];
  suggestion?: string;
  questions?: IComment[];
}

export default CourseData;
