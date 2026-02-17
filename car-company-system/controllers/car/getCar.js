const { Car } = require("../../models/Car");

const getCars = async (req, res) => {
  try {
    const { name, typeSlug } = req.query;

    let filter = { removed: false };

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const cars = await Car.find(filter)
      .populate("carType", "name slug")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cars.length,
      data: cars
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { getCars };
