import mongoose, { Schema } from "mongoose";

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    image: {
      type: String,
      default:
        "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      required: false,
    },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    token: {
      type: String,
      required: "Token is required"

    },
    verified: { type: Boolean, default: false, required: false },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    link: { type: String, required: false },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // in the attendees array, we will store the user's ID as a reference and a code
    attendees: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        code: { type: String, required: true },
      },
    ],
    attendeesCount: {
      type: Number,
      default: 0,
      required: false,
      get: function () {
        return this.attendees.length;
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);