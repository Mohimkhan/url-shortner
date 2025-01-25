import mongoose from "mongoose";

// schema
const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      require: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      require: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    tempUserId: {
      type: String,
      unique: true,
      default: null,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("url", urlSchema);

export default Url;
