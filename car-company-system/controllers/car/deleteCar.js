const { Car } = require("../../models/Car");

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found"
      });
    }

    res.json({
      success: true,
      message: "Car permanently deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { deleteCar };
