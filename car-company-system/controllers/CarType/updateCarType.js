const { CarType } = require("../../models/CarType");

const updateCarType = async (req, res) => {
  try {
    const type = await CarType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: type
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updateCarType };
