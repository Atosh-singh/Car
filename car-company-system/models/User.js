const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false
    },

    enabled: {
      type: Boolean,
      default: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true, // login lookup
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    }
  },
  { timestamps: true }
);

// Important: compound index for active login queries
userSchema.index({ email: 1, removed: 1 });

const User = mongoose.model("User", userSchema);

module.exports = { User };
