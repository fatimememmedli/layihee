const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    following: { type: Array, default: [] },
    follower: { type: Array, default: [] },
    blockList: { type: Array, default: [] },
    adminNotif: { type: Array, default: [] },
    report: { type: Boolean, default: false },
    stories: [
      {
        id: { type: String },
        imgSRC: { type: String },
        title: { type: String },
      },
    ],

    notifications: { type: Array, default: [] },
    requests: { type: Array, default: [] },
    saved: { type: Array, default: [] },
    profileImage: { type: String },
    posts: [
      {
        id: { type: String },
        imgSRC: { type: String },
        title: { type: String },
        comments: { type: Array, default: [] },
        likes: { type: Array, default: [] },
      },
    ],
    isPublic: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    bio: { type: String },
    email: { type: String },
  },
  { collection: "users" }
);
const Model = mongoose.model("users", UserSchema);
module.exports = Model;
