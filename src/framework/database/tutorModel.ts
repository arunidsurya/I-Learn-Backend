require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ITutor extends Document {
  name: string;
  email: string;
  gender: string;
  institute: string;
  qualifiaction: string;
  experience: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const tutorSchema: Schema<ITutor> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    gender: {
      type: String,
    },
    institute: {
      type: String,
    },
    qualifiaction: {
      type: String,
      required: [true, "Please enter your qualification"],
    },
    experience: {
      type: String,
      required: [true, "Please enter your experience"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be atleast 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,   
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

tutorSchema.pre<ITutor>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
tutorSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

//sign refersh token
tutorSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFERSH_TOKEN || "", {
    expiresIn: "3d",
  });
};

//compare password
tutorSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const tutorModel: Model<ITutor> = mongoose.model("Tutor", tutorSchema);

export default tutorModel;
