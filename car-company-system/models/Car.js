const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
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
      required: true
    },

    type: {
      type: String
    },

    price: Number,
    fuelType: String,
    transmission: String
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

module.exports = { Car };
