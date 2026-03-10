const { Car } = require("../../models/Car");
const { CarType } = require("../../models/CarType");
const slugify = require("slugify");

const createCar = async (req, res) => {
  try {
    const {
      name,
      carType, // slug expected
      price,
      fuelType,
      transmission,
      seatingCapacity,
      mileage,
      engine,
      showroom,
      image
    } = req.body;

    if (!name || !carType || !price || !fuelType || !transmission) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const type = await CarType.findOne({
      slug: carType.toLowerCase(),
      enabled: true
    });

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Invalid car type"
      });
    }

    const slug = slugify(name.trim(), { lower: true });

    const existing = await Car.findOne({ slug });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Car already exists"
      });
    }

    const car = await Car.create({
      name: name.trim(),
      slug,
      carType: type._id,
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
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { createCar };
