const { Team } = require("../../models/Team");

const createTeam = async (req, res) => {
  try {
    const { name, carType } = req.body;

    if (!name || !carType) {
      return res.status(400).json({
        success: false,
        message: "Name and carType are required"
      });
    }

    const existing = await Team.findOne({
      name: name.trim(),
      removed: false
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Team already exists"
      });
    }

    const team = await Team.create({
      name: name.trim(),
      carType: carType.trim()
    });

    res.status(201).json({
      success: true,
      data: team
    });

  } catch (error) {
    console.error("Create Team Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { createTeam };
