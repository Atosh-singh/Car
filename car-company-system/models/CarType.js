const mongoose = require("mongoose");

const carTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    enabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const CarType = mongoose.model("CarType", carTypeSchema);

module.exports = { CarType };
