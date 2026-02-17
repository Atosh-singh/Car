const { Car } = require("../../models/Car");
const { CarType } = require("../../models/CarType");
const slugify = require("slugify");

const createCar = async (req, res) => {
  try {
    const {
      name,
      carType,
      price,
      fuelType,
      transmission,
      seatingCapacity,
      mileage,
      engine,
      showroom,
      image
    } = req.body;

    // 1️⃣ Check carType exists
    const typeExists = await CarType.findById(carType);

    if (!typeExists) {
      return res.status(400).json({
        message: "Invalid car type"
      });
    }

    // 2️⃣ Generate slug
    const slug = slugify(name, { lower: true });

    // 3️⃣ Check duplicate
    const existing = await Car.findOne({ slug });

    if (existing) {
      return res.status(409).json({
        message: "Car already exists"
      });
    }

    const car = await Car.create({
      name,
      slug,
      carType,
      price,
      fuelType,
      transmission,
      seatingCapacity,
      mileage,
      engine,
      showroom,
      image
    });

    res.status(201).json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error("Create Car Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { createCar };
