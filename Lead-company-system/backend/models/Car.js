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
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    // 🔥 Reference to CarType model
    carType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarType",
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric"],
      required: true
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true
    },

    seatingCapacity: {
      type: Number
    },

    mileage: {
      type: String
    },

    engine: {
      type: String
    },

    showroom: {
      type: String
    },

    image: {
      type: String
    }

  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

module.exports = { Car };
