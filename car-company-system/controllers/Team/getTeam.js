const { Team } = require("../../models/Team");
const { CarType } = require("../../models/CarType");

const getTeams = async (req, res) => {
  try {
    const { name, carType, enabled } = req.query;

    let filter = {
      removed: false
    };

    // 🔹 Filter by team name
    if (name) {
      filter.name = {
        $regex: name,
        $options: "i"
      };
    }

    // 🔹 Filter by enabled
    if (enabled !== undefined) {
      filter.enabled = enabled === "true";
    }

    // 🔹 Filter by carType slug
    if (carType) {
      const type = await CarType.findOne({
        slug: carType.toLowerCase()
      });

      if (!type) {
        return res.status(400).json({
          success: false,
          message: "Invalid carType"
        });
      }

      filter.carTypes = type._id;
    }

    const teams = await Team.find(filter)
      .populate("carTypes", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });

  } catch (error) {
    console.error("Get Teams Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { getTeams };
