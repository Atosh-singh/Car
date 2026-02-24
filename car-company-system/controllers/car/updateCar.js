const { Car } = require("../../models/Car");
const { CarType } = require("../../models/CarType");
const slugify = require("slugify");

const updateCar = async (req, res) => {
  try {
    const { name, carType, ...rest } = req.body;

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    if (name) {
      const slug = slugify(name.trim(), { lower: true });

      const exists = await Car.findOne({
        _id: { $ne: car._id },
        slug
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Car with this name already exists"
        });
      }

      car.name = name.trim();
      car.slug = slug;
    }

    if (carType) {
      const type = await CarType.findOne({
        slug: carType.toLowerCase()
      });

      if (!type) {
        return res.status(400).json({
          success: false,
          message: "Invalid car type"
        });
      }

      car.carType = type._id;
    }

    Object.assign(car, rest);

    await car.save();

    res.status(200).json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error("Update Car Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { updateCar };
