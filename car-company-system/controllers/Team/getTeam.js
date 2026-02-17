const { Team } = require("../../models/Team");

const getTeams = async (req, res) => {
  try {
    const { name, carType, enabled } = req.query;

    let filter = {
      removed: false
    };

    if (name) {
      filter.name = {
        $regex: name,
        $options: "i"
      };
    }

    if (carType) {
      filter.carType = {
        $regex: carType,
        $options: "i"
      };
    }

    if (enabled !== undefined) {
      filter.enabled = enabled === "true";
    }

    const teams = await Team.find(filter).sort({ createdAt: -1 });

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
