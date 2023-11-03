import mongoose, { Schema } from "mongoose";

const PostSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    authorID: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "art",
        "music",
        "hybrid",
        "theatre",
        "literature",
        "science",
        "sports",
        "other",
      ],
      default: "other",
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [String],
      default: [],
      required: false,
    },
    comments: [
      {
        userId: String,
        content: String,
        username: String,
        timestamp: String,
        userImg: String,
        url: String,
        name: String,
      },
    ],
    userImg: {
      type: String,
      required: false,
      default:
        "https://alumni.engineering.utoronto.ca/files/2022/05/Avatar-Placeholder-400x400-1.jpg",
    },
    url: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);