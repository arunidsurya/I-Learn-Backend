import { JwtPayload } from "jsonwebtoken";
import User from "../../entities/userEntity";
import Admin from "../../entities/adminEntity";
import Tutor from "../../entities/tutorEntity";

interface IjwtToken {
  SignJwt(user: User): Promise<string>;
  refreshToken(user: User): Promise<string>;
  SignTutorJwt(tutor: Tutor): Promise<string>;
  AdminSignJwt(admin: Admin): Promise<string | null>;
  VerifyJwt(token: string): Promise<JwtPayload | null>;
  otpGenerateJwt(user: User, activationCode: string): Promise<string>;
  otpVerifyJwt(
    activationToken: string,
    activationCode: string
  ): Promise<{ user: User; activationCode: string } | null>;
}
export default IjwtToken;
