const { CarType } = require("../../models/CarType");

const getCarTypes = async (req, res) => {
  try {
    const types = await CarType.find({ enabled: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: types.length,
      data: types
    });

  } catch (error) {
    console.error("Get CarTypes Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { getCarTypes };
