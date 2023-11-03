import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
      required: false,
    },
    bio: {
      type: String,
      default:
        "We don't know much about this user yet, but we are sure they are artistic!",
      required: false,
    },
    followers: {
      type: [],
      default: [],
      required: false,
    },
    following: {
      type: [],
      default: [],
      required: false,
    },
    followersCount: {
      type: Number,
      default: 0,
      required: false,
    },
    followingCount: {
      type: Number,
      default: 0,
      required: false,
    },
    verified: {
      type: Boolean,
      default: false,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "organizer"],
      default: "user",
      required: false,
    },
    likes: {
      type: [String],
      default: [],
      required: false,
    },
  },
  { timestamps: true }
);

// Function to update followersCount and followingCount
UserSchema.pre("save", function (next) {
  this.followersCount = this.followers.length;
  this.followingCount = this.following.length;
  next();
});



export default mongoose.models.User || mongoose.model("User", UserSchema);