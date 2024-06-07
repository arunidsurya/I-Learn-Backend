interface Admin {
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
  comparePassword: (password: string) => Promise<boolean>;
}

export default Admin;
