const { CarType } = require("../../models/CarType");

const deleteCarType = async (req, res) => {
  try {
    await CarType.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "CarType permanently deleted"
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { deleteCarType };
