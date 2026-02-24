const { Car } = require("../../models/Car");
const { CarType } = require("../../models/CarType");

const getCars = async (req, res) => {
  try {
    const { name, typeSlug, enabled } = req.query;

    let filter = { removed: false };

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (enabled !== undefined) {
      filter.enabled = enabled === "true";
    }

    if (typeSlug) {
      const type = await CarType.findOne({
        slug: typeSlug.toLowerCase()
      });

      if (!type) {
        return res.status(400).json({
          success: false,
          message: "Invalid car type"
        });
      }

      filter.carType = type._id;
    }

    const cars = await Car.find(filter)
      .populate("carType", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });

  } catch (error) {
    console.error("Get Cars Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { getCars };
