const { CarType } = require("../../models/CarType");

const getCarTypes = async (req, res) => {
  try {
    const types = await CarType.find({ enabled: true });

    res.json({
      success: true,
      count: types.length,
      data: types
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getCarTypes };
