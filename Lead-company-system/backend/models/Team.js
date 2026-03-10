const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    removed: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },

    name: {
      type: String,
      required: true,
      trim: true
    },

    carTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarType"
      }
    ],

    // 🔥 Round Robin Pointer
    lastAssignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }

  },
  { timestamps: true }
);
const Team = mongoose.model("Team", teamSchema);

module.exports = { Team };
