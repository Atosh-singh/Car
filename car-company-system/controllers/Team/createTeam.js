const { Team } = require("../../models/Team");
const { CarType } = require("../../models/CarType");

const createTeam = async (req, res) => {
  try {
    const { name, carTypes } = req.body;

    // 1️⃣ Basic validation
    if (!name || !Array.isArray(carTypes) || carTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name and carTypes are required"
      });
    }

    // 2️⃣ Validate CarType ObjectIds
    const validCarTypes = await CarType.find({
      _id: { $in: carTypes },
      enabled: true
    });

    if (validCarTypes.length !== carTypes.length) {
      return res.status(400).json({
        success: false,
        message: "One or more carTypes are invalid"
      });
    }

    // 3️⃣ Prevent duplicate team name
    const existingTeam = await Team.findOne({
      name: name.trim(),
      removed: false
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team already exists"
      });
    }

    // 4️⃣ Create team
    const team = await Team.create({
      name: name.trim(),
      carTypes
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