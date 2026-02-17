const { Car } = require("../../models/Car");

const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({
        message: "Car not found"
      });
    }

    res.json({
      success: true,
      data: car
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { updateCar };
