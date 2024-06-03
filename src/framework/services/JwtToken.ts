import Jwt, { JwtPayload, Secret } from "jsonwebtoken";
import IjwtToken from "../../usecase/interface/IjwtToken";
import User from "../../entities/userEntity";
import Admin from "../../entities/adminEntity";
import Tutor from "../../entities/tutorEntity";

class JwtTokenService implements IjwtToken {
  async SignJwt(user: User): Promise<string> {
    const token = Jwt.sign(
      {
        user,
      },
      process.env.ACTIVATION_SECRET as Secret,
      {
        expiresIn: "5m",
      }
    );

    return token;
  }
  async refreshToken(user: User): Promise<string> {
    const token = Jwt.sign(
      {
        user,
      },
      process.env.REFRESH_TOKEN as Secret,
      {
        expiresIn: "1d",
      }
    );
    return token;
  }
  async SignTutorJwt(tutor: Tutor): Promise<string> {
    const token = Jwt.sign(
      {
        tutor,
      },
      process.env.ACTIVATION_SECRET as Secret,
      {
        expiresIn: "1d",
      }
    );

    return token;
  }
  async AdminSignJwt(admin: Admin): Promise<string | null> {
    try {
      const token = Jwt.sign(
        {
          admin,
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
          expiresIn: "1d",
        }
      );

      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async VerifyJwt(token: string): Promise<JwtPayload | null> {
    const jwtToken = process.env.JWt_SECRET_KEY as string;
    const verified = Jwt.verify(token, jwtToken) as JwtPayload;
    return verified;
  }
  async otpGenerateJwt(user: User, activationCode: string): Promise<string> {
    const token = Jwt.sign(
      {
        user,
        activationCode,
      },
      process.env.ACTIVATION_SECRET as Secret,
      {
        expiresIn: "5m",
      }
    );

    return token;
  }
  async otpVerifyJwt(
    activationToken: string,
    activationCode: string
  ): Promise<{ user: User; activationCode: string } | null> {
    // console.log("Activation Token:", activationToken);
    // console.log("Activation Code:", activationCode);
    try {
      const decodedToken = Jwt.verify(
        activationToken,
        process.env.ACTIVATION_SECRET as string
      ) as { user: User; activationCode: string };

      // Validate if the decoded token matches the provided activation code
      if (decodedToken.activationCode === activationCode) {
        return decodedToken;
      } else {
        // If activation code doesn't match, return null
        return null;
      }
    } catch (error) {
      // If verification fails, return null
      console.log(error);
      return null;
    }
  }
}

export default JwtTokenService;
