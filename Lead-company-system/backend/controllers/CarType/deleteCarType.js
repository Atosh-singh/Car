const { CarType } = require("../../models/CarType");
const { Car } = require("../../models/Car");
const { Team } = require("../../models/Team");

const deleteCarType = async (req, res) => {
  try {
    const id = req.params.id;

    const carType = await CarType.findById(id);

    if (!carType) {
      return res.status(404).json({
        success: false,
        message: "CarType not found"
      });
    }

    // 🔥 Check if used in Car
    const usedInCar = await Car.findOne({ carType: id });

    if (usedInCar) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete. CarType is assigned to Cars."
      });
    }

    // 🔥 Check if used in Team
    const usedInTeam = await Team.findOne({
      carTypes: id
    });

    if (usedInTeam) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete. CarType is assigned to Teams."
      });
    }

    await CarType.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "CarType permanently deleted"
    });

  } catch (error) {
    console.error("Delete CarType Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { deleteCarType };
