interface Admin {
  _id?: string;
  name: string;
  email: string;
  gender: string;
  password: string;
  avtar?: string;
  isVerified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

export default Admin;
