interface User {
  _id?: string;
  name: string;
  email: string;
  gender: string;
  password: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
  courses: string[];
  courseProgress:{courseId:string,sectionId:string[]}[];
  premiumAccount: boolean;
  premiumCourses: number;
  comparePassword: (password: string) => Promise<boolean>;
}

export default User;
