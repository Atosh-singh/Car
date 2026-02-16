const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
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
      unique: true, // enough, auto indexed
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    permissions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = { Role };
