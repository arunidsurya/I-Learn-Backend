"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = exports.linkSchema = exports.reviewSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.reviewSchema = new mongoose_1.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object]
}, { timestamps: true });
exports.linkSchema = new mongoose_1.Schema({
    title: String,
    url: String,
});
const questionReplySchema = new mongoose_1.Schema({
    user: Object,
    answer: String,
}, { timestamps: true });
exports.commentSchema = new mongoose_1.Schema({
    user: Object,
    question: String,
    questionReplies: [questionReplySchema],
}, { timestamps: true });
const courseSchema = new mongoose_1.Schema({
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
    reviews: [exports.reviewSchema],
    courseData: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "courseData" }],
    classSchedule: {
        type: {
            date: String,
            time: String,
            description: String,
            meetingCode: String,
        },
        default: {},
    },
    chat: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "chat" }],
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
}, { timestamps: true });
const CourseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = CourseModel;
questionReplySchema.pre("save", function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
